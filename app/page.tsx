"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "All" | "Movies" | "Shows" | "Games";

interface Review {
  id: number;
  title: string;
  category: "Movies" | "Shows" | "Games";
  rating: number; // out of 10
  year: number;
  genre: string;
  reviewer: string;
  avatar: string;
  summary: string;
  image: string; // gradient identifier
  featured?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const REVIEWS: Review[] = [
  {
    id: 1,
    title: "Dune: Part Two",
    category: "Movies",
    rating: 9.2,
    year: 2024,
    genre: "Sci-Fi / Epic",
    reviewer: "Alex Rivera",
    avatar: "AR",
    summary:
      "A visually breathtaking continuation that deepens the mythology of Arrakis. Villeneuve delivers an operatic masterpiece that rewards patient viewers with extraordinary world-building.",
    image: "movie1",
    featured: true,
  },
  {
    id: 2,
    title: "The Last of Us",
    category: "Shows",
    rating: 9.4,
    year: 2023,
    genre: "Drama / Horror",
    reviewer: "Sam Chen",
    avatar: "SC",
    summary:
      "Emotionally devastating and masterfully crafted, this adaptation transcends the source material. Pedro Pascal and Bella Ramsey deliver career-defining performances.",
    image: "show1",
    featured: true,
  },
  {
    id: 3,
    title: "Elden Ring",
    category: "Games",
    rating: 9.8,
    year: 2022,
    genre: "Action RPG",
    reviewer: "Jordan Lee",
    avatar: "JL",
    summary:
      "FromSoftware's magnum opus. An open world teeming with secrets, lore, and punishing-yet-fair combat. The collaboration with George R.R. Martin elevates an already exceptional title.",
    image: "game1",
    featured: true,
  },
  {
    id: 4,
    title: "Oppenheimer",
    category: "Movies",
    rating: 9.0,
    year: 2023,
    genre: "Historical Drama",
    reviewer: "Maya Torres",
    avatar: "MT",
    summary:
      "Nolan's most mature work yet. A haunting portrait of brilliance and moral consequence, anchored by Cillian Murphy's transformative performance.",
    image: "movie2",
  },
  {
    id: 5,
    title: "Shogun",
    category: "Shows",
    rating: 9.1,
    year: 2024,
    genre: "Historical Drama",
    reviewer: "Kenji Mori",
    avatar: "KM",
    summary:
      "A sumptuous recreation of feudal Japan with impeccable production design. Every episode feels like a prestige film. The best TV show of 2024.",
    image: "show2",
  },
  {
    id: 6,
    title: "Baldur's Gate 3",
    category: "Games",
    rating: 9.6,
    year: 2023,
    genre: "RPG",
    reviewer: "Casey Park",
    avatar: "CP",
    summary:
      "Larian Studios has redefined what an RPG can be. Staggering depth, genuine player agency, and hundreds of hours of content that never feels padded.",
    image: "game2",
  },
  {
    id: 7,
    title: "Poor Things",
    category: "Movies",
    rating: 8.7,
    year: 2023,
    genre: "Dark Comedy / Fantasy",
    reviewer: "Alex Rivera",
    avatar: "AR",
    summary:
      "Yorgos Lanthimos crafts a fever dream of Victorian surrealism. Emma Stone is an absolute force of nature in what may be the most daring performance of the decade.",
    image: "movie3",
  },
  {
    id: 8,
    title: "Fallout",
    category: "Shows",
    rating: 8.9,
    year: 2024,
    genre: "Sci-Fi / Post-Apocalyptic",
    reviewer: "Jordan Lee",
    avatar: "JL",
    summary:
      "Against all odds, Amazon nailed it. Sharp writing, a perfect tonal balance between bleakness and dark humor, and a world that feels authentically Fallout.",
    image: "show3",
  },
  {
    id: 9,
    title: "Celeste",
    category: "Games",
    rating: 9.3,
    year: 2018,
    genre: "Platformer",
    reviewer: "Sam Chen",
    avatar: "SC",
    summary:
      "A flawless fusion of tight mechanical gameplay and profound emotional storytelling. Celeste tackles mental health with more nuance than most films.",
    image: "game3",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CARD_GRADIENTS: Record<string, string> = {
  movie1: "from-amber-900 via-orange-800 to-amber-950",
  movie2: "from-slate-800 via-gray-700 to-slate-950",
  movie3: "from-pink-900 via-fuchsia-800 to-rose-950",
  show1: "from-emerald-900 via-teal-800 to-emerald-950",
  show2: "from-red-900 via-rose-800 to-red-950",
  show3: "from-yellow-900 via-amber-700 to-yellow-950",
  game1: "from-violet-900 via-purple-800 to-violet-950",
  game2: "from-blue-900 via-indigo-800 to-blue-950",
  game3: "from-cyan-900 via-sky-800 to-cyan-950",
};

const CATEGORY_ICONS: Record<Category, string> = {
  All: "✦",
  Movies: "🎬",
  Shows: "📺",
  Games: "🎮",
};

const CATEGORY_COLORS: Record<string, string> = {
  Movies: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Shows: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Games: "bg-violet-500/20 text-violet-300 border-violet-500/30",
};

function StarRating({ rating }: { rating: number }) {
  const stars = Math.round(rating / 2); // convert to /5
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= stars ? "text-amber-400" : "text-white/20"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 cursor-pointer">
      {/* Gradient banner */}
      <div className={`h-28 bg-gradient-to-br ${CARD_GRADIENTS[review.image]} relative`}>
        <div className="absolute inset-0 bg-black/30" />
        {/* Score badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm border border-white/20 rounded-xl px-2.5 py-1">
          <span className="text-white font-bold text-sm">{review.rating}</span>
          <span className="text-white/50 text-xs">/10</span>
        </div>
        {/* Category tag */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[review.category]}`}>
            {CATEGORY_ICONS[review.category as Category]} {review.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-white font-bold text-base leading-tight group-hover:text-amber-300 transition-colors">
            {review.title}
          </h3>
          <p className="text-white/40 text-xs mt-0.5">
            {review.year} · {review.genre}
          </p>
        </div>

        <StarRating rating={review.rating} />

        <p className="text-white/60 text-xs leading-relaxed mt-3 line-clamp-3">
          {review.summary}
        </p>

        {/* Reviewer */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/8">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            {review.avatar}
          </div>
          <span className="text-white/40 text-xs">{review.reviewer}</span>
        </div>
      </div>
    </article>
  );
}

// ─── Featured Hero Card ───────────────────────────────────────────────────────

function FeaturedCard({ review }: { review: Review }) {
  return (
    <article className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${CARD_GRADIENTS[review.image]} h-full min-h-[220px] cursor-pointer group`}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Category + year */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[review.category]}`}>
          {CATEGORY_ICONS[review.category as Category]} {review.category}
        </span>
        <span className="text-white/50 text-xs">{review.year}</span>
      </div>

      {/* Score */}
      <div className="absolute top-4 right-4 flex flex-col items-end">
        <div className="text-3xl font-black text-white leading-none">{review.rating}</div>
        <div className="text-white/50 text-xs">/10</div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-black text-xl leading-tight group-hover:text-amber-300 transition-colors">
          {review.title}
        </h3>
        <p className="text-white/50 text-xs mt-0.5 mb-2">{review.genre}</p>
        <StarRating rating={review.rating} />
        <p className="text-white/70 text-xs leading-relaxed mt-2 line-clamp-2">
          {review.summary}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-[9px] font-bold">
            {review.avatar}
          </div>
          <span className="text-white/40 text-xs">{review.reviewer}</span>
        </div>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const categories: Category[] = ["All", "Movies", "Shows", "Games"];

  const featured = REVIEWS.filter((r) => r.featured);
  const filtered =
    activeCategory === "All"
      ? REVIEWS.filter((r) => !r.featured)
      : REVIEWS.filter((r) => r.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-white">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0c0c0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Blitz Critics
            </span>
            <span className="text-white/20 text-xs ml-1">Reviews for everything that matters</span>
          </div>
          <nav className="flex items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`nav-${cat.toLowerCase()}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat
                  ? "bg-amber-500 text-black"
                  : "text-white/50 hover:text-white hover:bg-white/8"
                  }`}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* ── Hero section (featured) ── */}
        {activeCategory === "All" && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                ✦ Featured Reviews
              </h2>
              <span className="text-white/30 text-xs">{featured.length} picks</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featured.map((r) => (
                <FeaturedCard key={r.id} review={r} />
              ))}
            </div>
          </section>
        )}

        {/* ── Section header ── */}
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
              {activeCategory === "All"
                ? "✦ More Reviews"
                : `${CATEGORY_ICONS[activeCategory]} ${activeCategory} Reviews`}
            </h2>
            <span className="text-white/30 text-xs">{filtered.length} reviews</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24 text-white/20">
              <p className="text-4xl mb-3">🍿</p>
              <p className="text-sm">No reviews in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </section>

        {/* ── Stats bar ── */}
        <div className="mt-16 grid grid-cols-3 gap-4 border-t border-white/8 pt-10">
          {(["Movies", "Shows", "Games"] as const).map((cat) => {
            const items = REVIEWS.filter((r) => r.category === cat);
            const avg = items.reduce((s, r) => s + r.rating, 0) / items.length;
            return (
              <div key={cat} className="text-center">
                <span className="text-3xl block mb-1">{CATEGORY_ICONS[cat]}</span>
                <span className="text-white font-bold text-xl block">{items.length}</span>
                <span className="text-white/40 text-xs">{cat} reviewed</span>
                <span className="text-amber-400 text-xs block mt-0.5">
                  avg {avg.toFixed(1)}/10
                </span>
              </div>
            );
          })}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 mt-10 py-8 text-center text-white/25 text-xs">
        Blitz Critics · Reviews for Movies, Shows & Games
      </footer>
    </div>
  );
}
