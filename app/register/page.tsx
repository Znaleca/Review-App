"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
    FaBolt,
    FaEnvelope,
    FaLock,
    FaUser,
    FaEye,
    FaEyeSlash,
    FaCheckCircle,
} from "react-icons/fa";

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Password strength
    const strength = (() => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    })();

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthColor = [
        "",
        "bg-red-500",
        "bg-amber-400",
        "bg-yellow-400",
        "bg-emerald-500",
    ][strength];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setSuccess(true);
        setLoading(false);
    }

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-3xl" />
                </div>
                <div className="relative text-center max-w-sm">
                    <FaCheckCircle className="text-emerald-500 w-14 h-14 mx-auto mb-5" />
                    <h2 className="text-slate-900 font-black text-2xl mb-2">Check your inbox!</h2>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                        We sent a confirmation link to{" "}
                        <span className="text-emerald-600 font-bold">{email}</span>.<br />
                        Click it to activate your account as an <span className="text-slate-700 font-bold">Audience</span> member.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-900 text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                        Go to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-sm py-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <FaBolt className="text-yellow-500 w-5 h-5" />
                        <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                            Blitz Critics
                        </span>
                    </Link>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Create your account</p>

                    {/* Role badge */}
                    <div className="inline-flex items-center gap-1.5 mt-3 bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        You&apos;ll join as an <strong className="ml-0.5">Audience</strong> member
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-3xl p-8 sm:p-10 transition-all duration-300">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 font-medium text-sm px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* Full Name */}
                        <div>
                            <label className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wide">
                                Full Name
                            </label>
                            <div className="relative group">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-yellow-500 transition-colors" />
                                <input
                                    id="register-name"
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wide">
                                Email
                            </label>
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-yellow-500 transition-colors" />
                                <input
                                    id="register-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wide">
                                Password
                            </label>
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-yellow-500 transition-colors" />
                                <input
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:bg-white rounded-2xl py-3.5 pl-11 pr-11 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors bg-white/50 backdrop-blur-sm p-1 rounded-full"
                                >
                                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Strength meter */}
                            {password.length > 0 && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map((s) => (
                                            <div
                                                key={s}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= strength ? strengthColor : "bg-slate-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Password strength:{" "}
                                        <span className={`font-bold ${strength <= 1 ? "text-red-500" : strength === 2 ? "text-amber-500" : strength === 3 ? "text-yellow-600" : "text-emerald-500"}`}>
                                            {strengthLabel}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            id="register-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-extrabold py-4 rounded-2xl transition-all duration-300 text-sm mt-4 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4 text-slate-900" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating account…
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>
                </div>

                {/* Roles info */}
                <div className="mt-6 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-md shadow-slate-200/30">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">User Roles explained</p>
                    <div className="space-y-3">
                        {[
                            { role: "Audience", desc: "Browse & explore reviews", color: "text-emerald-700", dot: "bg-emerald-500", active: true },
                            { role: "Critics", desc: "Write & publish reviews", color: "text-amber-600", dot: "bg-yellow-500", active: false },
                            { role: "Admin", desc: "Manage the platform", color: "text-violet-700", dot: "bg-violet-500", active: false },
                        ].map(({ role, desc, color, dot, active }) => (
                            <div key={role} className={`flex items-center justify-between ${active ? "opacity-100" : "opacity-50 grayscale"}`}>
                                <div className="flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${dot} inline-block`} />
                                    <span className={`text-xs font-bold ${color}`}>{role}</span>
                                    {active && <span className="text-[10px] bg-emerald-100 border border-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold shadow-sm">You</span>}
                                </div>
                                <span className="text-slate-500 font-medium text-xs">{desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-sm mt-6 font-medium">
                    Already have an account?{" "}
                    <Link href="/login" className="text-amber-600 hover:text-amber-500 font-bold transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
