import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const PROFILES = {
  jae: { name: 'Jae', emoji: '👨‍💻', color: '#2563eb' },
  teelo: { name: 'Teelo', emoji: '👩', color: '#ec4899' },
  jayden: { name: 'Jayden', emoji: '🎮', color: '#8b5cf6' },
  jordan: { name: 'Jordan', emoji: '⚽', color: '#10b981' },
  felix: { name: 'Felix', emoji: '🇭🇳', color: '#00bce4' }
};

const CATEGORY_INFO = {
  trumpWatch: { name: 'Trump Watch', emoji: '🔴', color: '#dc2626' },
  politics: { name: 'Politics', emoji: '🏛️', color: '#6b7280' },
  worldNews: { name: 'World News', emoji: '🌍', color: '#059669' },
  honduras: { name: 'Honduras', emoji: '🇭🇳', color: '#00bce4' },
  mets: { name: 'NY Mets', emoji: '⚾', color: '#002d72' },
  knicks: { name: 'NY Knicks', emoji: '🏀', color: '#f58426' },
  soccer: { name: 'Soccer', emoji: '⚽', color: '#10b981' },
  aiTech: { name: 'AI & Tech', emoji: '🤖', color: '#3b82f6' },
  smartHome: { name: 'Smart Home', emoji: '🏠', color: '#14b8a6' },
  homelab: { name: 'Homelab', emoji: '🖥️', color: '#f59e0b' },
  networking: { name: 'Networking', emoji: '📡', color: '#8b5cf6' },
  finance: { name: 'Finance', emoji: '📈', color: '#059669' },
  tesla: { name: 'Tesla & EVs', emoji: '🚗', color: '#e31937' },
  trueCrime: { name: 'True Crime', emoji: '🔍', color: '#7c3aed' },
  parenting: { name: 'Parenting', emoji: '👨‍👩‍👧‍👦', color: '#ec4899' },
  recipes: { name: 'Recipes', emoji: '🍳', color: '#f97316' },
  health: { name: 'Health', emoji: '💪', color: '#10b981' },
  travel: { name: 'Travel', emoji: '✈️', color: '#0ea5e9' },
  fashion: { name: 'Fashion & Beauty', emoji: '👗', color: '#ec4899' },
  homeDecor: { name: 'Home Decor', emoji: '🏡', color: '#a855f7' },
  shopping: { name: 'Deals & Shopping', emoji: '🛍️', color: '#ef4444' },
  entertainment: { name: 'Entertainment', emoji: '⭐', color: '#eab308' },
  animation: { name: 'Animation', emoji: '🎬', color: '#6366f1' },
  movies: { name: 'Movies', emoji: '🎬', color: '#dc2626' },
  artSchool: { name: 'Art & Film School', emoji: '🎨', color: '#f472b6' },
  music: { name: 'Music', emoji: '🎸', color: '#8b5cf6' },
  comics: { name: 'Comics', emoji: '💥', color: '#ef4444' },
  streetwear: { name: 'Streetwear', emoji: '👟', color: '#171717' },
  bjj: { name: 'BJJ & MMA', emoji: '🥋', color: '#1e40af' },
  gaming: { name: 'Gaming', emoji: '🎮', color: '#7c3aed' },
  roblox: { name: 'Roblox', emoji: '🎲', color: '#e31937' },
  soccerSkills: { name: 'Soccer Skills', emoji: '⚽', color: '#16a34a' },
  trending: { name: 'Trending', emoji: '📱', color: '#f43f5e' }
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop';

function ArticleCard({ article, onClick }) {
  const [imgError, setImgError] = useState(false);
  const categoryInfo = CATEGORY_INFO[article.category] || { name: article.category, emoji: '📰', color: '#6b7280' };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(article)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imgError ? DEFAULT_IMAGE : (article.image || DEFAULT_IMAGE)}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
        />
        {article.isTrumpRelated && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
            🔴 TRUMP
          </div>
        )}
        <div
          className="absolute bottom-2 right-2 px-2 py-1 rounded-md text-xs font-semibold text-white"
          style={{ backgroundColor: categoryInfo.color }}
        >
          {categoryInfo.emoji} {categoryInfo.name}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
          {article.description}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">{article.source}</span>
          <span>{new Date(article.pubDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

function TrumpCard({ article, onClick }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(article)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
          <img
            src={imgError ? DEFAULT_IMAGE : (article.image || DEFAULT_IMAGE)}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        </div>
        <div className="md:w-3/5 p-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-white text-red-600 px-2 py-1 rounded text-xs font-bold">🔴 TRUMP WATCH</span>
          </div>
          <h3 className="font-bold text-xl mb-2 line-clamp-2 group-hover:underline">
            {article.title}
          </h3>
          <p className="text-red-100 text-sm line-clamp-2 mb-3">
            {article.description}
          </p>
          <div className="flex justify-between items-center text-xs text-red-200">
            <span className="font-medium">{article.source}</span>
            <span>{new Date(article.pubDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategorySection({ category, articles, onArticleClick }) {
  const categoryInfo = CATEGORY_INFO[category] || { name: category, emoji: '📰', color: '#6b7280' };

  if (!articles || articles.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
          style={{ backgroundColor: `${categoryInfo.color}20` }}
        >
          {categoryInfo.emoji}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {categoryInfo.name}
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {articles.length} articles
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, 6).map((article, idx) => (
          <ArticleCard key={idx} article={article} onClick={onArticleClick} />
        ))}
      </div>
    </div>
  );
}

function ProfileSwitcher({ currentProfile }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {Object.entries(PROFILES).map(([key, profile]) => (
        <Link
          key={key}
          to={`/${key}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentProfile === key
              ? 'text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          style={currentProfile === key ? { backgroundColor: profile.color } : {}}
        >
          {profile.emoji} {profile.name}
        </Link>
      ))}
    </div>
  );
}

function ArticleModal({ article, onClose }) {
  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="relative h-64">
          <img
            src={article.image || DEFAULT_IMAGE}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {article.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {article.source} • {new Date(article.pubDate).toLocaleDateString()}
            </span>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Read Full Article →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { profile = 'jae' } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!PROFILES[profile]) {
      navigate('/jae');
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/feed/${profile}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [profile, navigate]);

  const profileInfo = PROFILES[profile] || PROFILES.jae;

  const filteredArticles = data?.articles?.filter(article => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return article.title?.toLowerCase().includes(query) ||
           article.description?.toLowerCase().includes(query) ||
           article.source?.toLowerCase().includes(query);
  });

  const trumpArticles = filteredArticles?.filter(a => a.isTrumpRelated) || [];
  const regularArticles = filteredArticles?.filter(a => !a.isTrumpRelated) || [];

  const articlesByCategory = {};
  regularArticles.forEach(article => {
    if (!articlesByCategory[article.category]) {
      articlesByCategory[article.category] = [];
    }
    articlesByCategory[article.category].push(article);
  });

  const categoryOrder = data?.categoryOrder || Object.keys(CATEGORY_INFO);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg"
                style={{ backgroundColor: profileInfo.color }}
              >
                {profileInfo.emoji}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {profileInfo.name}'s News
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Wayne Manor News Hub
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <ProfileSwitcher currentProfile={profile} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-600 dark:text-red-400 font-medium">Failed to load news</p>
            <p className="text-red-500 dark:text-red-300 text-sm mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {data && !loading && (
          <>
            {/* Trump Watch Section */}
            {trumpArticles.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xl">
                    🔴
                  </div>
                  <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
                    Trump Watch
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {trumpArticles.length} articles
                  </span>
                </div>
                <div className="space-y-4">
                  {trumpArticles.slice(0, 3).map((article, idx) => (
                    <TrumpCard key={idx} article={article} onClick={setSelectedArticle} />
                  ))}
                </div>
              </div>
            )}

            {/* Category Sections */}
            {categoryOrder.map(category => (
              <CategorySection
                key={category}
                category={category}
                articles={articlesByCategory[category]}
                onArticleClick={setSelectedArticle}
              />
            ))}

            {/* Last Updated */}
            {data.generatedAt && (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 pb-8">
                Last updated: {new Date(data.generatedAt).toLocaleString()}
              </div>
            )}
          </>
        )}
      </main>

      {/* Article Modal */}
      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
}

export default App;
