import React, { useState, useEffect, useMemo } from 'react';

// Profile configurations
const PROFILES = {
  jae: { name: 'Jae', emoji: '🦇', color: '#3b82f6' },
  teelo: { name: 'Teelo', emoji: '👩', color: '#ec4899' },
  jayden: { name: 'Jayden', emoji: '🎮', color: '#8b5cf6' },
  jordan: { name: 'Jordan', emoji: '⚽', color: '#10b981' },
  felix: { name: 'Felix', emoji: '🇭🇳', color: '#00bce4', lang: 'es' }
};

// Category display info with Spanish translations
const CATEGORY_INFO = {
  politics: { name: 'Politics', nameEs: 'Política', icon: '🏛️', color: '#dc2626' },
  worldNews: { name: 'World News', nameEs: 'Noticias Mundiales', icon: '🌍', color: '#2563eb' },
  aiTech: { name: 'AI & Tech', nameEs: 'IA y Tecnología', icon: '🤖', color: '#8b5cf6' },
  smartHome: { name: 'Smart Home', nameEs: 'Casa Inteligente', icon: '🏠', color: '#06b6d4' },
  homelab: { name: 'Homelab', nameEs: 'Homelab', icon: '🖥️', color: '#64748b' },
  networking: { name: 'Networking', nameEs: 'Redes', icon: '🌐', color: '#0ea5e9' },
  mets: { name: 'NY Mets', nameEs: 'NY Mets', icon: '⚾', color: '#f97316' },
  knicks: { name: 'NY Knicks', nameEs: 'NY Knicks', icon: '🏀', color: '#f97316' },
  soccer: { name: 'Soccer', nameEs: 'Fútbol', icon: '⚽', color: '#22c55e' },
  finance: { name: 'Finance', nameEs: 'Finanzas', icon: '💰', color: '#eab308' },
  tesla: { name: 'Tesla/EVs', nameEs: 'Tesla/EVs', icon: '🚗', color: '#ef4444' },
  trending: { name: 'Trending', nameEs: 'Tendencias', icon: '🔥', color: '#f43f5e' },
  trueCrime: { name: 'True Crime', nameEs: 'Crimen Real', icon: '🔍', color: '#78716c' },
  parenting: { name: 'Parenting', nameEs: 'Crianza', icon: '👨‍👩‍👧', color: '#ec4899' },
  recipes: { name: 'Recipes', nameEs: 'Recetas', icon: '🍳', color: '#f59e0b' },
  health: { name: 'Health', nameEs: 'Salud', icon: '💪', color: '#10b981' },
  travel: { name: 'Travel', nameEs: 'Viajes', icon: '✈️', color: '#0ea5e9' },
  fashion: { name: 'Fashion', nameEs: 'Moda', icon: '👗', color: '#d946ef' },
  homeDecor: { name: 'Home Decor', nameEs: 'Decoración', icon: '🛋️', color: '#a855f7' },
  shopping: { name: 'Shopping', nameEs: 'Compras', icon: '🛍️', color: '#ec4899' },
  entertainment: { name: 'Entertainment', nameEs: 'Entretenimiento', icon: '🎬', color: '#f43f5e' },
  animation: { name: 'Animation', nameEs: 'Animación', icon: '🎨', color: '#8b5cf6' },
  artSchool: { name: 'Art School', nameEs: 'Escuela de Arte', icon: '🖌️', color: '#a855f7' },
  music: { name: 'Music', nameEs: 'Música', icon: '🎸', color: '#1d4ed8' },
  comics: { name: 'Comics', nameEs: 'Cómics', icon: '📚', color: '#eab308' },
  bjj: { name: 'BJJ/MMA', nameEs: 'BJJ/MMA', icon: '🥋', color: '#dc2626' },
  streetwear: { name: 'Streetwear', nameEs: 'Streetwear', icon: '👟', color: '#1f2937' },
  gaming: { name: 'Gaming', nameEs: 'Videojuegos', icon: '🎮', color: '#7c3aed' },
  roblox: { name: 'Roblox', nameEs: 'Roblox', icon: '🧱', color: '#dc2626' },
  soccerSkills: { name: 'Soccer Skills', nameEs: 'Técnicas de Fútbol', icon: '⚽', color: '#22c55e' },
  movies: { name: 'Movies', nameEs: 'Películas', icon: '🎥', color: '#6366f1' },
  honduras: { name: 'Honduras', nameEs: 'Honduras', icon: '🇭🇳', color: '#00bce4' }
};

// Categories by profile
const PROFILE_CATEGORIES = {
  jae: ['politics', 'worldNews', 'aiTech', 'smartHome', 'homelab', 'networking', 'mets', 'knicks', 'soccer', 'finance', 'tesla', 'trending'],
  teelo: ['politics', 'worldNews', 'trueCrime', 'parenting', 'recipes', 'health', 'travel', 'fashion', 'homeDecor', 'shopping', 'entertainment', 'movies', 'trending'],
  jayden: ['politics', 'worldNews', 'animation', 'artSchool', 'music', 'comics', 'bjj', 'streetwear', 'soccer', 'movies', 'trending'],
  jordan: ['politics', 'worldNews', 'gaming', 'roblox', 'soccerSkills', 'streetwear', 'soccer', 'trending'],
  felix: ['honduras', 'politics', 'worldNews']
};

// Translations for UI elements
const TRANSLATIONS = {
  en: {
    searchPlaceholder: 'Search articles...',
    allCategories: 'All',
    lastUpdated: 'Last updated',
    favorites: 'Favorites',
    noArticles: 'No articles found',
    loading: 'Loading...',
    readMore: 'Read more',
    trumpWatch: 'TRUMP'
  },
  es: {
    searchPlaceholder: 'Buscar artículos...',
    allCategories: 'Todos',
    lastUpdated: 'Última actualización',
    favorites: 'Favoritos',
    noArticles: 'No se encontraron artículos',
    loading: 'Cargando...',
    readMore: 'Leer más',
    trumpWatch: 'TRUMP'
  }
};

const KV_WORKER_URL = 'https://wayne-manor-kv.juan-lopez26.workers.dev';

function App() {
  const [profile, setProfile] = useState(() => {
    const path = window.location.pathname.slice(1).toLowerCase();
    return PROFILES[path] ? path : 'jae';
  });
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('wayne-manor-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showDropdown, setShowDropdown] = useState(false);

  const currentProfile = PROFILES[profile];
  const lang = currentProfile.lang || 'en';
  const t = TRANSLATIONS[lang];
  const categories = PROFILE_CATEGORIES[profile] || [];

  // Load favorites
  useEffect(() => {
    localStorage.setItem('wayne-manor-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Load articles
  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${KV_WORKER_URL}/profile-${profile}`);
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles || []);
          setLastUpdated(data.generatedAt);
        }
      } catch (error) {
        console.error('Failed to load articles:', error);
      }
      setLoading(false);
    };
    loadArticles();
    setSelectedCategory('all');
  }, [profile]);

  // Handle URL changes
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1).toLowerCase();
      if (PROFILES[path]) {
        setProfile(path);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleProfileChange = (newProfile) => {
    setProfile(newProfile);
    setShowDropdown(false);
    window.history.pushState({}, '', `/${newProfile}`);
  };

  const toggleFavorite = (articleLink) => {
    setFavorites(prev =>
      prev.includes(articleLink)
        ? prev.filter(l => l !== articleLink)
        : [...prev, articleLink]
    );
  };

  // Filter articles
  const filteredArticles = useMemo(() => {
    let result = articles;

    if (selectedCategory !== 'all') {
      result = result.filter(a => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query) ||
        a.source.toLowerCase().includes(query)
      );
    }

    return result;
  }, [articles, selectedCategory, searchQuery]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const locale = lang === 'es' ? 'es-HN' : 'en-US';
    return date.toLocaleString(locale, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getCategoryName = (category) => {
    const info = CATEGORY_INFO[category];
    if (!info) return category;
    return lang === 'es' ? info.nameEs : info.name;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Profile Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">🦇</span>
              <h1 className="text-xl font-bold">Wayne Manor News</h1>

              {/* Profile Dropdown */}
              <div className="relative ml-2">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  style={{ borderLeft: `3px solid ${currentProfile.color}` }}
                >
                  <span>{currentProfile.emoji}</span>
                  <span className="font-medium">{currentProfile.name}'s Feed</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-gray-700 rounded-lg shadow-xl border border-gray-600 overflow-hidden">
                    {Object.entries(PROFILES).map(([key, p]) => (
                      <button
                        key={key}
                        onClick={() => handleProfileChange(key)}
                        className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-600 transition-colors ${profile === key ? 'bg-gray-600' : ''}`}
                      >
                        <span>{p.emoji}</span>
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Favorites Counter */}
            <div className="flex items-center gap-2 text-sm">
              <span>⭐</span>
              <span>{favorites.length}</span>
              <span className="text-yellow-400">✨</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-3">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
            />
          </div>

          {/* Category Pills */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {t.allCategories}
            </button>
            {categories.map(cat => {
              const info = CATEGORY_INFO[cat];
              if (!info) return null;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                    selectedCategory === cat
                      ? 'text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  style={selectedCategory === cat ? { backgroundColor: info.color } : {}}
                >
                  <span>{info.icon}</span>
                  <span>{getCategoryName(cat)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-gray-400">{t.loading}</div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {t.noArticles}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article, index) => {
              const catInfo = CATEGORY_INFO[article.category] || {};
              const isFavorite = favorites.includes(article.link);

              return (
                <article
                  key={article.link || index}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex">
                    {/* Image */}
                    {article.image && (
                      <div className="w-32 h-32 flex-shrink-0">
                        <img
                          src={article.image}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 p-4">
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: catInfo.color || '#6b7280' }}
                        >
                          {getCategoryName(article.category)}
                        </span>
                        {article.isTrumpRelated && (
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">
                            {t.trumpWatch}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h2 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                      </a>

                      {/* Description */}
                      {article.description && (
                        <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                          {article.description}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{article.source}</span>
                          <span>•</span>
                          <span>{formatDate(article.pubDate)}</span>
                        </div>

                        <button
                          onClick={() => toggleFavorite(article.link)}
                          className="text-lg hover:scale-110 transition-transform"
                        >
                          {isFavorite ? '⭐' : '☆'}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-4 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            {t.lastUpdated}: {formatDate(lastUpdated)}
          </p>
          <p className="mt-1">🦇 Wayne Manor News Hub</p>
        </div>
      </footer>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}

export default App;
