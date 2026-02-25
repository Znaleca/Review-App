"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartLine, FaUsers, FaUserPlus, FaFileMedical, FaBolt, FaArrowLeft } from "react-icons/fa";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const links = [
        { href: "/admin/dashboard", label: "Dashboard", icon: FaChartLine },
        { href: "/admin/accounts", label: "Accounts", icon: FaUsers },
        { href: "/admin/add-account", label: "Add Account", icon: FaUserPlus },
        { href: "/admin/create-content", label: "Create Content", icon: FaFileMedical },
    ];

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0 hidden md:flex justify-between">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <FaBolt className="text-violet-600 w-4 h-4" />
                        <span className="font-bold text-slate-900 tracking-wide">Admin Console</span>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                        ? "bg-violet-50 text-violet-700 border border-violet-200 shadow-sm"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                                        }`}
                                >
                                    <Icon className={isActive ? "text-violet-600" : "text-slate-400"} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-6 border-t border-slate-200 mt-auto">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent transition-all w-full"
                    >
                        <FaArrowLeft className="text-slate-400" />
                        Back to App
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
