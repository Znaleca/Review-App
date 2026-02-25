"use client";

import { useState } from "react";
import {
  FaFilm,
  FaTv,
  FaGamepad,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaBolt,
  FaFire,
} from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Category = "All" | "Movies" | "Shows" | "Games";

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

export const CATEGORY_ICON_COMPONENTS: Record<Category, React.ElementType> = {
  All: FaBolt,
  Movies: FaFilm,
  Shows: FaTv,
  Games: FaGamepad,
};

const CATEGORY_COLORS: Record<string, string> = {
  Movies: "bg-amber-100 text-amber-700 border-amber-200",
  Shows: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Games: "bg-violet-100 text-violet-700 border-violet-200",
};

function StarRating({ rating }: { rating: number }) {
  // Convert /10 rating to /5 stars with half-star support
  const out5 = rating / 2;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => {
        if (out5 >= s) {
          return <FaStar key={s} className="w-3 h-3 text-yellow-400" />;
        } else if (out5 >= s - 0.5) {
          return <FaStarHalfAlt key={s} className="w-3 h-3 text-yellow-400" />;
        } else {
          return <FaRegStar key={s} className="w-3 h-3 text-slate-300" />;
        }
      })}
    </div>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="group relative rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-200/60 hover:border-slate-300/80 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-200/60 cursor-pointer">
      {/* Gradient banner */}
      <div className={`h-32 bg-gradient-to-br ${CARD_GRADIENTS[review.image]} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
        {/* Decorative subtle overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Score badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md shadow-sm rounded-2xl px-3 py-1.5 transform group-hover:scale-105 transition-transform duration-300 border border-slate-100/50">
          <span className="text-slate-900 font-black text-sm">{review.rating}</span>
          <span className="text-slate-500 font-medium text-xs">/10</span>
        </div>
        {/* Category tag */}
        <div className="absolute top-3 left-3">
          {(() => {
            const Icon = CATEGORY_ICON_COMPONENTS[review.category as Category];
            return (
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md ${CATEGORY_COLORS[review.category]}`}>
                <Icon className="w-3 h-3" /> {review.category}
              </span>
            );
          })()}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-slate-900 font-extrabold text-lg leading-tight group-hover:text-yellow-600 transition-colors duration-300 line-clamp-1">
            {review.title}
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            {review.year} · {review.genre}
          </p>
        </div>

        <StarRating rating={review.rating} />

        <p className="text-slate-600 font-medium text-sm leading-relaxed mt-4 line-clamp-3">
          {review.summary}
        </p>

        {/* Reviewer */}
        <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-slate-200/50">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-sm shadow-amber-500/30">
            {review.avatar}
          </div>
          <span className="text-slate-600 font-semibold text-xs">{review.reviewer}</span>
        </div>
      </div>
    </article>
  );
}

// ─── Featured Hero Card ───────────────────────────────────────────────────────

function FeaturedCard({ review }: { review: Review }) {
  return (
    <article className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${CARD_GRADIENTS[review.image]} h-full min-h-[260px] cursor-pointer group shadow-xl shadow-slate-300/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/60 transition-all duration-500`}>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-black/10 group-hover:from-slate-900/95 transition-colors duration-500" />

      {/* Category + year */}
      <div className="absolute top-5 left-5 flex items-center gap-2.5 z-10">
        {(() => {
          const Icon = CATEGORY_ICON_COMPONENTS[review.category as Category];
          return (
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md ${CATEGORY_COLORS[review.category]}`}>
              <Icon className="w-3 h-3" /> {review.category}
            </span>
          );
        })()}
        <span className="text-white/90 font-bold text-xs shadow-sm shadow-black/20 px-2.5 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20">{review.year}</span>
      </div>

      {/* Score */}
      <div className="absolute top-5 right-5 flex flex-col items-end z-10">
        <div className="text-4xl font-black text-white leading-none drop-shadow-md transform group-hover:scale-105 transition-transform duration-300">{review.rating}</div>
        <div className="text-white/80 font-bold text-xs drop-shadow-md">/10</div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <h3 className="text-white font-black text-2xl leading-tight group-hover:text-yellow-400 transition-colors drop-shadow-md mb-1">
          {review.title}
        </h3>
        <p className="text-white/70 font-semibold text-xs mb-3 drop-shadow-sm uppercase tracking-wide">{review.genre}</p>
        <StarRating rating={review.rating} />
        <p className="text-white/90 font-medium text-sm leading-relaxed mt-3 line-clamp-2 drop-shadow-md">
          {review.summary}
        </p>
        <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-white/10">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-[10px] font-bold shadow-md">
            {review.avatar}
          </div>
          <span className="text-white/90 font-semibold text-xs drop-shadow-md">{review.reviewer}</span>
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ── Nav ── */}
      <Header
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* ── Hero section (featured) ── */}
        {activeCategory === "All" && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <FaFire className="text-orange-500 w-3 h-3" /> Featured Reviews
              </h2>
              <span className="text-slate-400 text-xs font-medium">{featured.length} picks</span>
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
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              {activeCategory === "All" ? (
                <><FaStar className="text-yellow-500 w-3 h-3" /> More Reviews</>
              ) : (
                <>{(() => { const I = CATEGORY_ICON_COMPONENTS[activeCategory]; return <I className="w-3 h-3 text-slate-400" />; })()} {activeCategory} Reviews</>
              )}
            </h2>
            <span className="text-slate-400 text-xs font-medium">{filtered.length} reviews</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24 text-slate-400">
              <FaFilm className="text-4xl mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No reviews in this category yet.</p>
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
        <div className="mt-16 grid grid-cols-3 gap-4 border-t border-slate-200 pt-10">
          {(["Movies", "Shows", "Games"] as const).map((cat) => {
            const items = REVIEWS.filter((r) => r.category === cat);
            const avg = items.reduce((s, r) => s + r.rating, 0) / items.length;
            return (
              <div key={cat} className="text-center">
                {(() => { const I = CATEGORY_ICON_COMPONENTS[cat as Category]; return <I className="text-3xl text-yellow-400 block mb-1 mx-auto" />; })()}
                <span className="text-slate-900 font-black text-2xl block">{items.length}</span>
                <span className="text-slate-500 text-xs font-medium">{cat} reviewed</span>
                <span className="text-yellow-600 font-bold text-xs block mt-0.5">
                  avg {avg.toFixed(1)}/10
                </span>
              </div>
            );
          })}
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
