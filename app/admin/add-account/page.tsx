"use client";

import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaShieldAlt, FaFeatherAlt, FaUserCircle } from "react-icons/fa";
import { createAccountAction } from "@/app/actions/actions";

export default function AddAccountPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const form = e.currentTarget;
        const formData = new FormData(form);

        const result = await createAccountAction(formData);

        if (result.error) {
            setMessage({ type: "error", text: result.error });
        } else {
            setMessage({ type: "success", text: "Account created successfully!" });
            form.reset();
        }

        setLoading(false);
    }

    return (
        <div className="p-6 sm:p-10 text-slate-900">
            <div className="max-w-3xl bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-3xl p-8 sm:p-10">
                <h1 className="text-3xl font-black mb-2 tracking-tight">Add Account</h1>
                <p className="text-slate-500 mb-8 font-medium">Manually create a new user and assign their role.</p>

                {message && (
                    <div className={`mb-6 p-4 rounded-2xl font-bold text-sm border shadow-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wide">
                                Full Name
                            </label>
                            <div className="relative group">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-yellow-500 transition-colors" />
                                <input
                                    name="fullName"
                                    type="text"
                                    required
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
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="user@example.com"
                                    className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="sm:col-span-2">
                            <label className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wide">
                                Password
                            </label>
                            <div className="relative group">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-yellow-500 transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all shadow-sm"
                                />
                            </div>
                            <p className="text-slate-400 text-xs mt-2 font-medium">Must be at least 6 characters.</p>
                        </div>

                        {/* Role Selection */}
                        <div className="sm:col-span-2">
                            <label className="block text-slate-500 text-xs font-bold mb-3 uppercase tracking-wide">
                                Assign Role
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Audience */}
                                <label className="relative flex flex-col items-center justify-center p-4 cursor-pointer rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50 has-[:checked]:ring-4 has-[:checked]:ring-emerald-500/10">
                                    <input type="radio" name="role" value="audience" className="sr-only" defaultChecked />
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaUserCircle className="text-emerald-500 w-4 h-4" />
                                        <span className="font-bold text-slate-900">Audience</span>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium text-center">Can read and manage their own profile</span>
                                </label>

                                {/* Critics */}
                                <label className="relative flex flex-col items-center justify-center p-4 cursor-pointer rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 transition-all has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50/50 has-[:checked]:ring-4 has-[:checked]:ring-amber-500/10">
                                    <input type="radio" name="role" value="critics" className="sr-only" />
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaFeatherAlt className="text-amber-500 w-4 h-4" />
                                        <span className="font-bold text-slate-900">Critics</span>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium text-center">Can write and publish new reviews</span>
                                </label>

                                {/* Admin */}
                                <label className="relative flex flex-col items-center justify-center p-4 cursor-pointer rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 transition-all has-[:checked]:border-violet-500 has-[:checked]:bg-violet-50/50 has-[:checked]:ring-4 has-[:checked]:ring-violet-500/10">
                                    <input type="radio" name="role" value="admin" className="sr-only" />
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaShieldAlt className="text-violet-500 w-4 h-4" />
                                        <span className="font-bold text-slate-900">Admin</span>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium text-center">Full platform and user management access</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-8 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-extrabold py-3.5 rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin w-4 h-4 text-slate-900" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Creating User...
                            </>
                        ) : (
                            "Create User Account"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
