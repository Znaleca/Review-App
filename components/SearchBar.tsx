"use client";

import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaSpinner, FaBook, FaFilm, FaTv, FaGamepad, FaKey, FaFire } from 'react-icons/fa';

interface MediaResult {
    id: string;
    title: string;
    subtitle?: string; // Author, Director, or Release Year
    imageUrl?: string;
    type: 'book' | 'movie' | 'tv' | 'game';
}

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<MediaResult[]>([]);
    const [trendingResults, setTrendingResults] = useState<MediaResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingTrending, setLoadingTrending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [missingApiKey, setMissingApiKey] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Fetch trending data on mount
    useEffect(() => {
        let isMounted = true;
        const fetchTrending = async () => {
            setLoadingTrending(true);
            try {
                const tmdbKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
                const rawgKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

                // 1. Fetch Books
                const fetchBooks = fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&maxResults=3`)
                    .then(res => res.json())
                    .then(data => {
                        if (!data.items) return [];
                        return data.items.map((book: any) => ({
                            id: `trend-book-${book.id}`,
                            title: book.volumeInfo.title,
                            subtitle: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : '',
                            imageUrl: book.volumeInfo.imageLinks?.smallThumbnail?.replace('http:', 'https:'),
                            type: 'book' as const
                        }));
                    }).catch(() => []);

                // 2. Fetch Trending Movies/TV
                const fetchTmdb = tmdbKey
                    ? fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${tmdbKey}`)
                        .then(res => res.json())
                        .then(data => {
                            if (!data.results) return [];
                            return data.results
                                .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
                                .slice(0, 3)
                                .map((item: any) => ({
                                    id: `trend-tmdb-${item.id}`,
                                    title: item.title || item.name,
                                    subtitle: (item.release_date || item.first_air_date || '').split('-')[0],
                                    imageUrl: item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : undefined,
                                    type: (item.media_type) as 'movie' | 'tv'
                                }));
                        }).catch(() => [])
                    : Promise.resolve([]);

                // 3. Fetch Popular Games
                const fetchRawg = rawgKey
                    ? fetch(`https://api.rawg.io/api/games?key=${rawgKey}&ordering=-added&page_size=3`)
                        .then(res => res.json())
                        .then(data => {
                            if (!data.results) return [];
                            return data.results.map((game: any) => ({
                                id: `trend-rawg-${game.id}`,
                                title: game.name,
                                subtitle: game.released ? game.released.split('-')[0] : '',
                                imageUrl: game.background_image || undefined,
                                type: 'game' as const
                            }));
                        }).catch(() => [])
                    : Promise.resolve([]);

                const [books, tmdbResults, games] = await Promise.all([fetchBooks, fetchTmdb, fetchRawg]);

                if (isMounted) {
                    // Combine and shuffle to show a random mix
                    const combined = [...tmdbResults, ...games, ...books].sort(() => 0.5 - Math.random()).slice(0, 6);
                    setTrendingResults(combined);
                }
            } catch (error) {
                console.error("Error fetching trending:", error);
            } finally {
                if (isMounted) setLoadingTrending(false);
            }
        };

        fetchTrending();
        return () => { isMounted = false; };
    }, []);

    // Debounce search
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setMissingApiKey(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            setMissingApiKey(false);

            try {
                const tmdbKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
                const rawgKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

                if (!tmdbKey || !rawgKey) {
                    setMissingApiKey(true);
                }

                // 1. Fetch Books
                const fetchBooks = fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=3`)
                    .then(res => res.json())
                    .then(data => {
                        if (!data.items) return [];
                        return data.items.map((book: any) => ({
                            id: `book-${book.id}`,
                            title: book.volumeInfo.title,
                            subtitle: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : '',
                            imageUrl: book.volumeInfo.imageLinks?.smallThumbnail?.replace('http:', 'https:'),
                            type: 'book' as const
                        }));
                    }).catch(() => []);

                // 2. Fetch Movies & TV (if key exists)
                const fetchTmdb = tmdbKey
                    ? fetch(`https://api.themoviedb.org/3/search/multi?api_key=${tmdbKey}&query=${encodeURIComponent(query)}&include_adult=false`)
                        .then(res => res.json())
                        .then(data => {
                            if (!data.results) return [];
                            return data.results
                                .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
                                .slice(0, 4)
                                .map((item: any) => ({
                                    id: `tmdb-${item.id}`,
                                    title: item.title || item.name,
                                    subtitle: (item.release_date || item.first_air_date || '').split('-')[0],
                                    imageUrl: item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : undefined,
                                    type: (item.media_type) as 'movie' | 'tv'
                                }));
                        }).catch(() => [])
                    : Promise.resolve([]);

                // 3. Fetch Games (if key exists)
                const fetchRawg = rawgKey
                    ? fetch(`https://api.rawg.io/api/games?key=${rawgKey}&search=${encodeURIComponent(query)}&page_size=3`)
                        .then(res => res.json())
                        .then(data => {
                            if (!data.results) return [];
                            return data.results.map((game: any) => ({
                                id: `rawg-${game.id}`,
                                title: game.name,
                                subtitle: game.released ? game.released.split('-')[0] : '',
                                imageUrl: game.background_image || undefined,
                                type: 'game' as const
                            }));
                        }).catch(() => [])
                    : Promise.resolve([]);

                // Run concurrently
                const [books, tmdbResults, games] = await Promise.all([fetchBooks, fetchTmdb, fetchRawg]);

                // Interleave or just combine results (prioritize finding exact matches or sort by type)
                const combined = [...tmdbResults, ...games, ...books].slice(0, 9);

                if (combined.length > 0) {
                    setResults(combined);
                    setIsOpen(true);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error("Error searching media:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full max-w-[14rem] md:max-w-[16rem] lg:max-w-sm hidden sm:block" ref={searchRef}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {loading ? (
                        <FaSpinner className="h-3.5 w-3.5 text-slate-400 animate-spin" />
                    ) : (
                        <FaSearch className="h-3.5 w-3.5 text-slate-400" />
                    )}
                </div>
                <input
                    type="text"
                    className="block w-full pl-9 pr-4 py-1.5 lg:py-2 border border-slate-200/80 rounded-full leading-5 bg-slate-100/50 hover:bg-white placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 sm:text-sm transition-all shadow-inner"
                    placeholder="Search books..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        setIsOpen(true);
                    }}
                />
            </div>

            {/* Dropdown */}
            {isOpen && ((query.trim() ? results.length > 0 : trendingResults.length > 0) || (query.trim() && missingApiKey)) && (
                <div className="absolute top-full mt-2 w-[280px] md:w-full md:min-w-[340px] left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden z-50">

                    {!query.trim() && trendingResults.length > 0 && (
                        <div className="bg-slate-50 border-b border-slate-100 p-2.5 flex items-center gap-2">
                            <FaFire className="text-orange-500 w-3.5 h-3.5" />
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Discover Trending</span>
                        </div>
                    )}

                    <ul className="max-h-[70vh] md:max-h-[400px] overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                        {(query.trim() ? results : trendingResults).map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setQuery('');
                                    }}
                                    className="w-full text-left flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
                                >
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-10 h-14 md:w-12 md:h-[72px] object-cover rounded shadow-sm group-hover:shadow transition-shadow shrink-0 bg-slate-100"
                                        />
                                    ) : (
                                        <div className="w-10 h-14 md:w-12 md:h-[72px] bg-slate-100 rounded flex items-center justify-center border border-slate-200 shrink-0">
                                            {item.type === 'book' ? <FaBook className="text-slate-300" /> :
                                                item.type === 'movie' ? <FaFilm className="text-slate-300" /> :
                                                    item.type === 'game' ? <FaGamepad className="text-slate-300" /> :
                                                        <FaTv className="text-slate-300" />}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 py-0.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-sm font-bold text-slate-900 truncate pr-2">
                                                {item.title}
                                            </h4>
                                            <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${item.type === 'movie' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                                item.type === 'tv' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                    item.type === 'game' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                        'bg-amber-50 text-amber-600 border border-amber-100'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </div>
                                        {item.subtitle && (
                                            <p className="text-xs text-slate-500 truncate mt-1 font-medium">
                                                {item.subtitle}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>

                    {missingApiKey && (
                        <div className="bg-slate-50 border-t border-slate-100 p-3 text-xs text-slate-500 flex items-start gap-2">
                            <FaKey className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                            <p>
                                Missing some API keys. To see all results, add <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">NEXT_PUBLIC_TMDB_API_KEY</code> and <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">NEXT_PUBLIC_RAWG_API_KEY</code> to your <code className="font-mono text-[10px]">.env.local</code>.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
