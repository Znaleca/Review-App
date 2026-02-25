"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { FaBolt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push("/");
        router.refresh();
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <FaBolt className="text-yellow-500 w-5 h-5" />
                        <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                            Blitz Critics
                        </span>
                    </Link>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Sign in to your account</p>
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

                        {/* Email */}
                        <div>
                            <label className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wide">
                                Email
                            </label>
                            <div className="relative group">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-yellow-500 transition-colors" />
                                <input
                                    id="login-email"
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
                                    id="login-password"
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
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit"
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
                                    Signing in…
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-sm mt-6 font-medium">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-amber-600 hover:text-amber-500 font-bold transition-colors">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
