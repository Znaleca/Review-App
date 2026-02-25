export default function AdminDashboardPage() {
    return (
        <div className="p-10 text-slate-900">
            <div className="max-w-6xl mx-auto border border-slate-200 bg-white shadow-sm rounded-2xl p-8">
                <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                    <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-lg text-sm uppercase tracking-widest font-bold">Admin</span>
                    Dashboard
                </h1>
                <p className="text-slate-500 mb-8 font-medium">Welcome to the Blitz Critics Admin Console</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-6">
                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wide mb-1">Total Users</h3>
                        <p className="text-3xl font-black text-slate-900">0</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-xl p-6">
                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wide mb-1">Pending Reviews</h3>
                        <p className="text-3xl font-black text-amber-500">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
