import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBolt, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { Category, CATEGORY_ICON_COMPONENTS } from "../app/page";

interface HeaderProps {
    categories: Category[];
    activeCategory: Category;
    setActiveCategory: (category: Category) => void;
}

export default function Header({ categories, activeCategory, setActiveCategory }: HeaderProps) {
    const supabase = createClient();

    const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setLoading(false);
                return;
            }

            // Fetch role from profiles
            const { data: profile } = await supabase
                .from("profiles")
                .select("full_name, role")
                .eq("id", session.user.id)
                .single();

            setUser({
                id: session.user.id,
                name: profile?.full_name || session.user.user_metadata.full_name || "User",
                role: profile?.role || "audience",
            });
            setLoading(false);
        }

        fetchUser();

        // Listen for auth changes (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_OUT") {
                setUser(null);
            } else if (event === "SIGNED_IN") {
                fetchUser();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function handleSignOut() {
        await supabase.auth.signOut();
        setUser(null);
    }

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-sm shadow-slate-200/50 transition-all duration-300">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2.5 group cursor-pointer">
                    <FaBolt className="text-yellow-500 w-4 h-4 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
                    <span className="text-xl font-black tracking-tight bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
                        Blitz Critics
                    </span>
                    <span className="text-slate-400 font-medium text-xs ml-1 hidden sm:inline-block border-l border-slate-200 pl-3">
                        Reviews for everything that matters
                    </span>
                </div>

                {/* Nav & Auth */}
                <div className="flex items-center gap-6">
                    <nav className="flex items-center gap-1.5 p-1 bg-slate-100/50 rounded-full border border-slate-200/50 hidden md:flex">
                        {categories.map((cat) => {
                            const Icon = CATEGORY_ICON_COMPONENTS[cat];
                            return (
                                <button
                                    key={cat}
                                    id={`nav-${cat.toLowerCase()}`}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${activeCategory === cat
                                        ? "bg-white text-slate-900 shadow-sm shadow-slate-200/50 border border-slate-200/50"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent"
                                        }`}
                                >
                                    <Icon className={activeCategory === cat ? "text-yellow-500 w-3.5 h-3.5" : "w-3.5 h-3.5"} />
                                    <span className="hidden sm:inline-block">{cat}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Mobile Navigation (Icon only, simplified for this snippet to fit) */}
                    <nav className="flex items-center gap-1 md:hidden">
                        {categories.map((cat) => {
                            const Icon = CATEGORY_ICON_COMPONENTS[cat];
                            return (
                                <button
                                    key={`mobile-nav-${cat.toLowerCase()}`}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`p-2 rounded-full transition-all duration-200 ${activeCategory === cat
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                </button>
                            );
                        })}
                    </nav>

                    {/* Auth Section */}
                    <div className="flex items-center border-l border-slate-200/80 pl-6 space-x-4">
                        {loading ? (
                            <div className="w-24 h-8 bg-slate-100 animate-pulse rounded-full" />
                        ) : user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col text-right hidden sm:flex">
                                    <span className="text-sm font-extrabold text-slate-900 leading-tight tracking-tight">{user.name}</span>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest ${user.role === 'admin' ? 'text-violet-600' :
                                        user.role === 'critics' ? 'text-amber-600' : 'text-emerald-600'
                                        }`}>
                                        {user.role}
                                    </span>
                                </div>
                                {user.role === 'admin' && (
                                    <Link
                                        href="/admin/dashboard"
                                        className="bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                                    >
                                        Admin Console
                                    </Link>
                                )}
                                <button
                                    onClick={handleSignOut}
                                    className="text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 bg-white transition-all p-2 rounded-full hover:bg-red-50 shadow-sm"
                                    title="Sign Out"
                                >
                                    <FaSignOutAlt className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 text-sm font-bold px-5 py-2 rounded-full transition-all shadow-sm shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5"
                            >
                                <FaUserCircle className="w-4 h-4" /> Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
