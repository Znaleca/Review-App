"use client";

import { useState, useEffect } from "react";
import {
  FaFilm,
  FaTv,
  FaGamepad,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaBolt,
  FaFire,
  FaBook,
  FaSpinner
} from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Category = "All" | "Movies" | "Shows" | "Games" | "Books";

interface Review {
  id: string | number;
  title: string;
  category: Category;
  rating: number; // out of 10
  year: number | string;
  genre: string;
  reviewer: string;
  avatar: string;
  summary: string;
  image: string; // gradient identifier
  imageUrl?: string;
  featured?: boolean;
}

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
  book1: "from-blue-900 via-indigo-800 to-blue-950",
};

export const CATEGORY_ICON_COMPONENTS: Record<Category, React.ElementType> = {
  All: FaBolt,
  Movies: FaFilm,
  Shows: FaTv,
  Games: FaGamepad,
  Books: FaBook,
};

const CATEGORY_COLORS: Record<string, string> = {
  Movies: "bg-amber-100 text-amber-700 border-amber-200",
  Shows: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Games: "bg-violet-100 text-violet-700 border-violet-200",
  Books: "bg-blue-100 text-blue-700 border-blue-200",
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
    <article className="group relative rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-200/60 hover:border-slate-300/80 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-200/60 cursor-pointer flex flex-col h-[380px]">
      {/* Banner */}
      <div className={`h-40 shrink-0 bg-gradient-to-br ${CARD_GRADIENTS[review.image] || "from-slate-800 to-slate-900"} relative overflow-hidden`}>
        {review.imageUrl ? (
          <img src={review.imageUrl} alt={review.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
        )}

        {/* Decorative subtle overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Score badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md shadow-sm rounded-2xl px-3 py-1.5 transform group-hover:scale-105 transition-transform duration-300 border border-slate-100/50">
          <span className="text-slate-900 font-black text-sm">{typeof review.rating === 'number' ? review.rating.toFixed(1) : review.rating}</span>
          <span className="text-slate-500 font-medium text-xs">/10</span>
        </div>
        {/* Category tag */}
        <div className="absolute top-3 left-3">
          {(() => {
            const Icon = CATEGORY_ICON_COMPONENTS[review.category as Category];
            return (
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md ${CATEGORY_COLORS[review.category.toString()] || CATEGORY_COLORS['Movies']}`}>
                <Icon className="w-3 h-3" /> {review.category}
              </span>
            );
          })()}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="text-slate-900 font-extrabold text-lg leading-tight group-hover:text-yellow-600 transition-colors duration-300 line-clamp-1" title={review.title}>
            {review.title}
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            {review.year} &middot; {review.genre}
          </p>
        </div>

        <StarRating rating={review.rating} />

        <p className="text-slate-600 font-medium text-sm leading-relaxed mt-4 line-clamp-3">
          {review.summary}
        </p>

        {/* Reviewer */}
        <div className="flex items-center gap-2.5 mt-auto pt-4 border-t border-slate-200/50">
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
    <article className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${CARD_GRADIENTS[review.image] || "from-slate-800 to-slate-900"} h-full min-h-[260px] cursor-pointer group shadow-xl shadow-slate-300/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/60 transition-all duration-500 flex flex-col`}>
      {review.imageUrl ? (
        <img src={review.imageUrl} alt={review.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700" />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent group-hover:from-slate-900/100 transition-colors duration-500" />

      {/* Category + year */}
      <div className="absolute top-5 left-5 flex items-center gap-2.5 z-10">
        {(() => {
          const Icon = CATEGORY_ICON_COMPONENTS[review.category as Category];
          return (
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md ${CATEGORY_COLORS[review.category.toString()] || CATEGORY_COLORS['Movies']}`}>
              <Icon className="w-3 h-3" /> {review.category}
            </span>
          );
        })()}
        <span className="text-white/90 font-bold text-xs shadow-sm shadow-black/20 px-2.5 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20">{review.year}</span>
      </div>

      {/* Score */}
      <div className="absolute top-5 right-5 flex flex-col items-end z-10">
        <div className="text-4xl font-black text-white leading-none drop-shadow-md transform group-hover:scale-105 transition-transform duration-300">{typeof review.rating === 'number' ? review.rating.toFixed(1) : review.rating}</div>
        <div className="text-white/80 font-bold text-xs drop-shadow-md">/10</div>
      </div>

      {/* Bottom content */}
      <div className="mt-auto p-6 z-10 relative">
        <h3 className="text-white font-black text-2xl leading-tight group-hover:text-yellow-400 transition-colors drop-shadow-md mb-1 line-clamp-2">
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const categories: Category[] = ["All", "Movies", "Shows", "Games", "Books"];

  useEffect(() => {
    async function fetchDiscover() {
      setLoading(true);
      try {
        const tmdbKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const rawgKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

        const booksReq = fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&maxResults=10`)
          .then(res => res.json())
          .then(data => (data.items || []).map((b: any) => ({
            id: `book-${b.id}`,
            title: b.volumeInfo.title,
            category: "Books" as const,
            rating: b.volumeInfo.averageRating ? b.volumeInfo.averageRating * 2 : (Math.random() * 2 + 7), // Google books is out of 5, fallback to 7-9
            year: b.volumeInfo.publishedDate ? b.volumeInfo.publishedDate.split('-')[0] : 'N/A',
            genre: b.volumeInfo.categories ? b.volumeInfo.categories[0] : 'Fiction',
            reviewer: 'Google Books',
            avatar: 'GB',
            summary: b.volumeInfo.description || 'A newly discovered featured book.',
            image: 'book1',
            imageUrl: b.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
          })).slice(0, 6)).catch(() => []);

        const tmdbMoviesReq = tmdbKey ? fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${tmdbKey}`)
          .then(res => res.json())
          .then(data => (data.results || []).slice(0, 8).map((m: any) => ({
            id: `movie-${m.id}`,
            title: m.title,
            category: "Movies" as const,
            rating: m.vote_average || 0,
            year: m.release_date ? m.release_date.split('-')[0] : 'N/A',
            genre: 'Movie',
            reviewer: 'TMDB',
            avatar: 'TM',
            summary: m.overview || 'Trending movie right now.',
            image: 'movie2',
            imageUrl: m.backdrop_path ? `https://image.tmdb.org/t/p/w780${m.backdrop_path}` : null,
          }))) : Promise.resolve([]);

        const tmdbShowsReq = tmdbKey ? fetch(`https://api.themoviedb.org/3/trending/tv/day?api_key=${tmdbKey}`)
          .then(res => res.json())
          .then(data => (data.results || []).slice(0, 8).map((m: any) => ({
            id: `show-${m.id}`,
            title: m.name,
            category: "Shows" as const,
            rating: m.vote_average || 0,
            year: m.first_air_date ? m.first_air_date.split('-')[0] : 'N/A',
            genre: 'TV Show',
            reviewer: 'TMDB',
            avatar: 'TM',
            summary: m.overview || 'Highly popular TV show recently discovered.',
            image: 'show1',
            imageUrl: m.backdrop_path ? `https://image.tmdb.org/t/p/w780${m.backdrop_path}` : null,
          }))) : Promise.resolve([]);

        const rawgReq = rawgKey ? fetch(`https://api.rawg.io/api/games?key=${rawgKey}&ordering=-added&page_size=8`)
          .then(res => res.json())
          .then(data => (data.results || []).map((g: any) => ({
            id: `game-${g.id}`,
            title: g.name,
            category: "Games" as const,
            rating: g.rating ? g.rating * 2 : 0, // RAWG is out of 5
            year: g.released ? g.released.split('-')[0] : 'N/A',
            genre: g.genres && g.genres.length > 0 ? g.genres[0].name : 'Game',
            reviewer: 'RAWG',
            avatar: 'RG',
            summary: 'A trending and highly anticipated gaming experience that has captured players.',
            image: 'game1',
            imageUrl: g.background_image || null,
          }))) : Promise.resolve([]);

        // Run all fetches concurrently
        const [books, movies, shows, games] = await Promise.all([booksReq, tmdbMoviesReq, tmdbShowsReq, rawgReq]);

        // Combine results
        const all = [...movies, ...shows, ...games, ...books];

        // Shuffle them to give a random trending "discover" feel
        all.sort(() => 0.5 - Math.random());

        // Pick top 3 for featured, remaining for standard cards
        const top3 = all.slice(0, 3).map(r => ({ ...r, featured: true }));
        const rest = all.slice(3, 15); // Show up to 12 more

        setReviews([...top3, ...rest]);
      } catch (err) {
        console.error("Failed to load discover content", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDiscover();
  }, []);

  const featured = reviews.filter((r) => r.featured);
  const filtered =
    activeCategory === "All"
      ? reviews.filter((r) => !r.featured)
      : reviews.filter((r) => r.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ── Nav ── */}
      <Header
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <FaSpinner className="w-10 h-10 animate-spin mb-4 text-yellow-500" />
            <p className="font-medium">Discovering latest content...</p>
          </div>
        ) : (
          <>
            {/* ── Hero section (featured) ── */}
            {activeCategory === "All" && featured.length > 0 && (
              <section className="mb-12">
                <div className="flex items-baseline justify-between mb-5">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <FaFire className="text-orange-500 w-4 h-4" /> Discover Trending
                  </h2>
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
                    <><FaStar className="text-yellow-500 w-3 h-3" /> More Discoveries</>
                  ) : (
                    <>{(() => {
                      const I = CATEGORY_ICON_COMPONENTS[activeCategory] || FaBolt;
                      return <I className="w-3 h-3 text-slate-400" />;
                    })()} {activeCategory}</>
                  )}
                </h2>
                <span className="text-slate-400 text-xs font-medium">{filtered.length} items</span>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-24 text-slate-400">
                  <FaFilm className="text-4xl mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No results found for this category.</p>
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
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-200 pt-10">
              {(["Movies", "Shows", "Games", "Books"] as const).map((cat) => {
                const items = reviews.filter((r) => r.category === cat);
                if (items.length === 0) return null;
                const avg = items.reduce((s, r) => s + r.rating, 0) / items.length;
                return (
                  <div key={cat} className="text-center">
                    {(() => {
                      const I = CATEGORY_ICON_COMPONENTS[cat as Category] || FaBolt;
                      return <I className="text-3xl text-yellow-400 block mb-1 mx-auto" />;
                    })()}
                    <span className="text-slate-900 font-black text-2xl block">{items.length}</span>
                    <span className="text-slate-500 text-xs font-medium">{cat} trending</span>
                    <span className="text-yellow-600 font-bold text-xs block mt-0.5">
                      avg {avg.toFixed(1)}/10
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
