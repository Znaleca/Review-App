import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FaUserCircle, FaShieldAlt, FaFeatherAlt, FaUsers } from "react-icons/fa";

export default async function AdminAccountsPage() {
    const supabase = await createClient();

    // 1. Verify user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        redirect("/login");
    }

    // 2. Verify admin role
    const { data: currentProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

    if (!currentProfile || currentProfile.role !== "admin") {
        redirect("/");
    }

    // 3. Fetch all profiles
    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, created_at")
        .order("created_at", { ascending: false });

    return (
        <div className="p-6 sm:p-10 text-slate-900">
            <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-3xl p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black mb-2 tracking-tight">Manage Accounts</h1>
                        <p className="text-slate-500 font-medium">View and manage user roles (Admin, Critics, Audience).</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100/50 border border-slate-200/50 rounded-2xl px-4 py-2">
                        <FaUsers className="text-slate-400 w-5 h-5" />
                        <span className="text-xl font-bold text-slate-900">{profiles?.length || 0}</span>
                        <span className="text-sm font-medium text-slate-500">Total Users</span>
                    </div>
                </div>

                {error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl font-medium shadow-sm border border-red-100">
                        Error loading profiles. Ensure you have added the Admin RLS policy in Supabase.
                    </div>
                ) : !profiles || profiles.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 font-bold border border-slate-200 border-dashed rounded-2xl bg-white/50">
                        No users found.
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {profiles.map((profile) => (
                                    <tr key={profile.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm shadow-amber-500/30">
                                                    {(profile.full_name || "User").substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="font-bold text-slate-900">
                                                    {profile.full_name || "Unknown User"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {profile.role === "admin" && (
                                                <span className="inline-flex items-center gap-1.5 bg-violet-100 border border-violet-200 text-violet-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                                    <FaShieldAlt className="w-3 h-3 text-violet-500" />
                                                    Admin
                                                </span>
                                            )}
                                            {profile.role === "critics" && (
                                                <span className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                                    <FaFeatherAlt className="w-3 h-3 text-amber-500" />
                                                    Critics
                                                </span>
                                            )}
                                            {profile.role === "audience" && (
                                                <span className="inline-flex items-center gap-1.5 bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                                    <FaUserCircle className="w-3 h-3 text-emerald-500" />
                                                    Audience
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-medium">
                                            {new Date(profile.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
