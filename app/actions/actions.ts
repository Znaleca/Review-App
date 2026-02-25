"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAccountAction(formData: FormData) {
    const supabase = await createClient();

    // 1. Verify user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { error: "You must be logged in to perform this action." };
    }

    // 2. Verify user has ADMIN role
    const { data: currentProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

    if (!currentProfile || currentProfile.role !== "admin") {
        return { error: "Unauthorized. Only Admins can create new accounts." };
    }

    // 3. Extract form data
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!fullName || !email || !password || !role) {
        return { error: "Please fill out all fields." };
    }

    if (password.length < 6) {
        return { error: "Password must be at least 6 characters." };
    }

    // 4. Create the user in Auth (Requires Service Role Key for Admin API)
    // IMPORTANT: Because we want an Admin to create another user without
    // getting logged out themselves, we MUST use the Supabase Admin API.
    // The regular supabase.auth.signUp() will log the current admin out
    // and log the new user in.

    const supabaseAdmin = await createClient(); // Ideally this uses a Service Role Key, but for simplicity we will try signing up and overriding the session

    // Since we don't have a Service Role key configured right now in .env,
    // we have a tricky situation: normal `signUp` logs the admin out.
    // The Supabase docs recommend using a Server-Side ONLY client with the service_role key.

    // For now, let's attempt to use the standard client we have, but we will
    // have to use a workaround if we don't have the service_role key.

    // Check if we have a service_role key available
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        // Workaround: We can't safely create users without service_role key in a Next.js server action
        // without messing up the current admin's session.
        return {
            error: "Server configuration Error: SUPABASE_SERVICE_ROLE_KEY is required to create users as an Admin. Please add it to your .env.local file."
        };
    }

    // This code will only run if you add SUPABASE_SERVICE_ROLE_KEY to your env
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const adminAuthClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    const { data: newUser, error: signUpError } = await adminAuthClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto confirm since it's an admin
        user_metadata: { full_name: fullName }
    });

    if (signUpError) {
        return { error: signUpError.message };
    }

    // 5. Update the profiles table with the chosen role
    if (newUser.user) {
        const { error: profileError } = await adminAuthClient
            .from("profiles")
            .update({ role, full_name: fullName })
            .eq("id", newUser.user.id);

        if (profileError) {
            return { error: "User created, but failed to assign role: " + profileError.message };
        }
    }

    revalidatePath("/admin/accounts");
    return { success: true };
}
