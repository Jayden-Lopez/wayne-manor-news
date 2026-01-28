import { useState, useEffect } from 'react';

const API_BASE = 'https://jutalo26.com';

// Category configuration with icons and display names (English and Spanish)
const categoryConfig = {
  politics: { name: 'Politics', nameEs: 'Política', icon: '🏛️' },
  worldNews: { name: 'World News', nameEs: 'Noticias Mundiales', icon: '🌍' },
  honduras: { name: 'Honduras', nameEs: 'Honduras', icon: '🇭🇳' },
  trending: { name: 'Trending Videos', icon: '📱' },
  aiTech: { name: 'AI & Tech', icon: '🤖' },
  smartHome: { name: 'Smart Home', icon: '🏠' },
  homelab: { name: 'Homelab', icon: '🖥️' },
  networking: { name: 'Networking', icon: '🌐' },
  sports: { name: 'Sports', icon: '⚾' },
  finance: { name: 'Finance', icon: '💰' },
  tesla: { name: 'Tesla/EVs', icon: '🚗' },
  trueCrime: { name: 'True Crime', icon: '🔍' },
  parenting: { name: 'Parenting', icon: '👨‍👩‍👧' },
  recipes: { name: 'Recipes', icon: '🍳' },
  health: { name: 'Health', icon: '💪' },
  travel: { name: 'Travel', icon: '✈️' },
  fashion: { name: 'Fashion', icon: '👗' },
  homeDecor: { name: 'Home Decor', icon: '🛋️' },
  shopping: { name: 'Shopping', icon: '🛍️' },
  entertainment: { name: 'Entertainment', icon: '🎬' },
  animation: { name: 'Animation', icon: '🎨' },
  movies: { name: 'Movies', icon: '🎥' },
  artSchool: { name: 'Art School', icon: '🖌️' },
  music: { name: 'Music', icon: '🎸' },
  comics: { name: 'Comics', icon: '📚' },
  bjj: { name: 'BJJ/MMA', icon: '🥋' },
  soccer: { name: 'Soccer', icon: '⚽' },
  streetwear: { name: 'Streetwear', icon: '👟' },
  gaming: { name: 'Gaming', icon: '🎮' },
  youtube: { name: 'YouTube', icon: '📺' },
  soccerYT: { name: 'Soccer Training', icon: '⚽' }
};

// Category mapping - map backend categories to display categories
// Priority order within sports: mets (1), knicks (2), soccer (3)
const categoryMapping = {
  mets: { displayCategory: 'sports', priority: 1 },
  knicks: { displayCategory: 'sports', priority: 2 },
  soccer: { displayCategory: 'sports', priority: 3 }
};

// Profile configurations
const profileConfig = {
  jae: {
    name: "Jae's Feed",
    icon: '👨‍💻',
    categories: ['politics', 'worldNews', 'aiTech', 'smartHome', 'homelab', 'networking', 'sports', 'finance', 'tesla', 'trending']
  },
  teelo: {
    name: "Teelo's Feed",
    icon: '👩',
    categories: ['politics', 'worldNews', 'trueCrime', 'parenting', 'recipes', 'health', 'travel', 'fashion', 'homeDecor', 'shopping', 'entertainment', 'trending']
  },
  jayden: {
    name: "Jayden's Feed",
    icon: '🎨',
    categories: ['politics', 'worldNews', 'animation', 'movies', 'artSchool', 'music', 'comics', 'bjj', 'soccer', 'streetwear', 'trending']
  },
  jordan: {
    name: "Jordan's Feed",
    icon: '🎮',
    categories: ['politics', 'worldNews', 'soccer', 'gaming', 'youtube', 'soccerYT', 'streetwear', 'trending']
  },
  felix: {
    name: "Felix's Feed",
    nameEs: "Noticias de Felix",
    icon: '🇭🇳',
    lang: 'es',
    categories: ['politics', 'worldNews', 'honduras']
  }
};

// Translations for UI elements
const translations = {
  en: {
    siteTitle: 'Wayne Manor News',
    searchPlaceholder: 'Search articles...',
    all: 'All',
    lastUpdated: 'Last updated',
    noSavedArticles: 'No saved articles yet',
    noArticlesFound: 'No articles found',
    errorLoading: 'Error loading news',
    trumpWatch: 'Trump Watch'
  },
  es: {
    siteTitle: 'Noticias Wayne Manor',
    searchPlaceholder: 'Buscar artículos...',
    all: 'Todos',
    lastUpdated: 'Última actualización',
    noSavedArticles: 'No hay artículos guardados',
    noArticlesFound: 'No se encontraron artículos',
    errorLoading: 'Error al cargar noticias',
    trumpWatch: 'Alerta Trump'
  }
};

function App() {
  const [articles, setArticles] = useState([]);
  const [trumpWatch, setTrumpWatch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [savedArticles, setSavedArticles] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [currentProfile, setCurrentProfile] = useState('jae');

  // Get current profile from URL
  useEffect(() => {
    const path = window.location.pathname.replace('/', '').toLowerCase();
    if (profileConfig[path]) {
      setCurrentProfile(path);
    } else if (path === '' || path === 'index.html') {
      setCurrentProfile('jae');
    }
  }, []);

  // Load saved articles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`savedArticles-${currentProfile}`);
    if (saved) {
      setSavedArticles(JSON.parse(saved));
    }
  }, [currentProfile]);

  // Transform articles: map categories and add priority for sorting
  const transformArticles = (articlesArray) => {
    return articlesArray.map(article => {
      const mapping = categoryMapping[article.category];
      if (mapping) {
        return {
          ...article,
          sourceCategory: article.category, // Keep original category (mets, knicks, soccer)
          category: mapping.displayCategory, // Map to display category (sports)
          sportsPriority: mapping.priority   // For sorting within sports
        };
      }
      return { ...article, sportsPriority: 999 }; // Non-sports get low priority
    });
  };

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/news/${currentProfile}`);
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();

        setArticles(transformArticles(data.articles || []));
        setTrumpWatch(data.trumpWatch || []);
        setLastUpdated(data.generatedAt);
        setError(null);
      } catch (err) {
        setError(err.message);
        // Try fallback to main data
        try {
          const fallback = await fetch(`${API_BASE}/api/news`);
          const data = await fallback.json();
          if (data.feedsByProfile && data.feedsByProfile[currentProfile]) {
            setArticles(transformArticles(data.feedsByProfile[currentProfile]));
            setTrumpWatch(data.trumpWatch || []);
            setLastUpdated(data.generatedAt);
            setError(null);
          }
        } catch (e) {
          console.error('Fallback failed:', e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [currentProfile]);

  // Get categories for current profile
  const profileCategories = profileConfig[currentProfile]?.categories || [];

  // Get language for current profile
  const lang = profileConfig[currentProfile]?.lang || 'en';
  const t = translations[lang];

  // Filter articles
  const filteredArticles = (showSaved ? savedArticles : articles).filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Toggle save article
  const toggleSave = (article) => {
    const newSaved = savedArticles.some(a => a.link === article.link)
      ? savedArticles.filter(a => a.link !== article.link)
      : [...savedArticles, article];
    setSavedArticles(newSaved);
    localStorage.setItem(`savedArticles-${currentProfile}`, JSON.stringify(newSaved));
  };

  // Group articles by category for display
  const groupedArticles = {};
  const trumpArticles = filteredArticles.filter(a => a.isTrumpRelated);

  filteredArticles.forEach(article => {
    if (!groupedArticles[article.category]) {
      groupedArticles[article.category] = [];
    }
    groupedArticles[article.category].push(article);
  });

  // Sort sports articles by priority (Mets first, then Knicks, then Soccer)
  if (groupedArticles['sports']) {
    groupedArticles['sports'].sort((a, b) => {
      // First by priority (Mets=1, Knicks=2, Soccer=3)
      if (a.sportsPriority !== b.sportsPriority) {
        return a.sportsPriority - b.sportsPriority;
      }
      // Then by date (newest first)
      return new Date(b.pubDate) - new Date(a.pubDate);
    });
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const locale = lang === 'es' ? 'es-HN' : 'en-US';
    return date.toLocaleDateString(locale, { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  const formatLastUpdated = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const locale = lang === 'es' ? 'es-HN' : 'en-US';
    return date.toLocaleString(locale, {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get category name based on language
  const getCategoryName = (catKey) => {
    const cat = categoryConfig[catKey];
    if (!cat) return catKey;
    return lang === 'es' && cat.nameEs ? cat.nameEs : cat.name;
  };

  // Get profile display name based on language
  const getProfileName = (key) => {
    const config = profileConfig[key];
    if (!config) return key;
    // Show Spanish name for Felix when viewing Felix's feed
    if (key === currentProfile && config.lang === 'es' && config.nameEs) {
      return config.nameEs;
    }
    return config.name;
  };

  // Profile selector - dropdown only for Jae's profile
  const ProfileSelector = () => {
    // Only show dropdown for Jae's profile
    if (currentProfile !== 'jae') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5">
          <span>{profileConfig[currentProfile]?.icon}</span>
          <span className="text-sm text-gray-300">{getProfileName(currentProfile)}</span>
        </div>
      );
    }

    return (
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors">
          <span>{profileConfig[currentProfile]?.icon}</span>
          <span className="text-sm text-gray-300">{getProfileName(currentProfile)}</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[160px]">
          {Object.entries(profileConfig).map(([key, config]) => (
            <a
              key={key}
              href={`/${key}`}
              className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                currentProfile === key ? 'bg-gray-700' : ''
              }`}
            >
              <span>{config.icon}</span>
              <span className="text-sm text-gray-300">{config.name}</span>
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-sm border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🦇</span>
              <div>
                <h1 className="text-xl font-bold">{t.siteTitle}</h1>
                <ProfileSelector />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSaved(!showSaved)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  showSaved 
                    ? 'bg-yellow-500 text-black' 
                    : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <span>⭐</span>
                <span>{savedArticles.length}</span>
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {t.all}
            </button>
            {profileCategories.map(catKey => {
              const cat = categoryConfig[catKey];
              if (!cat) return null;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                    selectedCategory === catKey
                      ? 'bg-blue-500 text-white'
                      : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{getCategoryName(catKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {lastUpdated && (
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.lastUpdated}: {formatLastUpdated(lastUpdated)}
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-2">{t.errorLoading}</p>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{error}</p>
          </div>
        ) : (
          <>
            {/* Trump Watch Section */}
            {trumpArticles.length > 0 && selectedCategory === 'all' && !showSaved && (
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  {t.trumpWatch}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trumpArticles.slice(0, 6).map((article, idx) => (
                    <ArticleCard
                      key={idx}
                      article={article}
                      darkMode={darkMode}
                      isSaved={savedArticles.some(a => a.link === article.link)}
                      onToggleSave={() => toggleSave(article)}
                      formatDate={formatDate}
                      showTrumpBadge={true}
                      lang={lang}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Articles by category */}
            {selectedCategory === 'all' ? (
              profileCategories.map(catKey => {
                const catArticles = groupedArticles[catKey];
                if (!catArticles || catArticles.length === 0) return null;
                const cat = categoryConfig[catKey];
                return (
                  <section key={catKey} className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span>{cat?.icon}</span>
                      {getCategoryName(catKey)}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {catArticles.slice(0, 6).map((article, idx) => (
                        <ArticleCard
                          key={idx}
                          article={article}
                          darkMode={darkMode}
                          isSaved={savedArticles.some(a => a.link === article.link)}
                          onToggleSave={() => toggleSave(article)}
                          formatDate={formatDate}
                          lang={lang}
                        />
                      ))}
                    </div>
                  </section>
                );
              })
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArticles.map((article, idx) => (
                  <ArticleCard
                    key={idx}
                    article={article}
                    darkMode={darkMode}
                    isSaved={savedArticles.some(a => a.link === article.link)}
                    onToggleSave={() => toggleSave(article)}
                    formatDate={formatDate}
                    lang={lang}
                  />
                ))}
              </div>
            )}

            {filteredArticles.length === 0 && (
              <div className="text-center py-20">
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {showSaved ? t.noSavedArticles : t.noArticlesFound}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Article Card Component
function ArticleCard({ article, darkMode, isSaved, onToggleSave, formatDate, showTrumpBadge, lang = 'en' }) {
  const cat = categoryConfig[article.category];
  const catName = lang === 'es' && cat?.nameEs ? cat.nameEs : (cat?.name || article.category);
  const trumpLabel = lang === 'es' ? 'TRUMP' : 'TRUMP';

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-xl overflow-hidden transition-transform hover:scale-[1.02] ${
        darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'
      } ${article.isTrumpRelated ? 'ring-2 ring-red-500/50' : ''}`}
    >
      <div className="relative">
        <img
          src={article.image}
          alt=""
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop';
          }}
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            darkMode ? 'bg-blue-500/90' : 'bg-blue-500'
          } text-white`}>
            {cat?.icon} {catName}
          </span>
          {(showTrumpBadge || article.isTrumpRelated) && (
            <span className="px-2 py-1 rounded text-xs font-medium bg-red-500 text-white">
              🔴 {trumpLabel}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSave();
          }}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
            isSaved 
              ? 'bg-yellow-500 text-black' 
              : darkMode ? 'bg-gray-900/70 hover:bg-gray-900' : 'bg-white/70 hover:bg-white'
          }`}
        >
          {isSaved ? '⭐' : '☆'}
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
        {article.description && (
          <p className={`text-sm mb-3 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {article.description}
          </p>
        )}
        <div className={`flex items-center justify-between text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          <span>{article.source}</span>
          <span>{formatDate(article.pubDate)}</span>
        </div>
      </div>
    </a>
  );
}

export default App;
