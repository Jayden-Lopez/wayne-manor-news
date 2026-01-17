import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const PROFILES = {
  jae: { name: 'Jae', emoji: '👨‍💻', color: '#2563eb' },
  teelo: { name: 'Teelo', emoji: '👩', color: '#ec4899' },
  jayden: { name: 'Jayden', emoji: '🎮', color: '#8b5cf6' },
  jordan: { name: 'Jordan', emoji: '⚽', color: '#10b981' }
};

const CATEGORY_INFO = {
  trumpWatch: { name: 'Trump Watch', emoji: '🔴', color: '#dc2626' },
  politics: { name: 'Politics', emoji: '🏛️', color: '#6b7280' },
  ai: { name: 'AI & Tech', emoji: '🤖', color: '#3b82f6' },
  tech: { name: 'Technology', emoji: '💻', color: '#6366f1' },
  smartHome: { name: 'Smart Home', emoji: '🏠', color: '#14b8a6' },
  homelab: { name: 'Homelab', emoji: '🖥️', color: '#f59e0b' },
  sports: { name: 'Sports', emoji: '⚾', color: '#ef4444' },
  crime: { name: 'Crime & Justice', emoji: '⚖️', color: '#64748b' },
  recipes: { name: 'Recipes', emoji: '🍳', color: '#f97316' },
  music: { name: 'Music', emoji: '🎵', color: '#a855f7' },
  health: { name: 'Health', emoji: '💪', color: '#22c55e' },
  animation: { name: 'Animation', emoji: '🎬', color: '#e11d48' },
  bjj: { name: 'BJJ & MMA', emoji: '🥋', color: '#0ea5e9' },
  gaming: { name: 'Gaming', emoji: '🎮', color: '#8b5cf6' },
  soccer: { name: 'Soccer', emoji: '⚽', color: '#16a34a' },
  roblox: { name: 'Roblox', emoji: '🎲', color: '#ef4444' },
  travel: { name: 'Travel', emoji: '✈️', color: '#0891b2' }
};

// Fallback images by category
const CATEGORY_IMAGES = {
  trumpWatch: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=400&h=250&fit=crop',
  politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=250&fit=crop',
  ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop',
  smartHome: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=250&fit=crop',
  homelab: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop',
  sports: 'https://images.unsplash.com/photo-1461896836934- voices?w=400&h=250&fit=crop',
  crime: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop',
  recipes: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=250&fit=crop',
  music: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=250&fit=crop',
  health: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
  animation: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=400&h=250&fit=crop',
  bjj: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=250&fit=crop',
  gaming: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=250&fit=crop',
  soccer: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop',
  roblox: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400&h=250&fit=crop',
  travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop'
};

function App() {
  const { profile } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved !== null ? saved === 'true' : true; // Default to dark
    }
    return true;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [savedArticles, setSavedArticles] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('savedArticles') || '[]');
    }
    return [];
  });
  const [showSaved, setShowSaved] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const currentProfile = profile || 'jae';
  const profileInfo = PROFILES[currentProfile] || PROFILES.jae;

  useEffect(() => {
    fetchData();
  }, [currentProfile]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
  }, [savedArticles]);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/feed/${currentProfile}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const json = await response.json();
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleSaved(article) {
    const key = article.link;
    if (savedArticles.find(a => a.link === key)) {
      setSavedArticles(savedArticles.filter(a => a.link !== key));
    } else {
      setSavedArticles([...savedArticles, article]);
    }
  }

  function isSaved(article) {
    return savedArticles.some(a => a.link === article.link);
  }

  const articles = showSaved 
    ? savedArticles 
    : (data?.articles || []);

  const filteredArticles = articles.filter(a => {
    const matchesSearch = !searchTerm || 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const trumpArticles = filteredArticles.filter(a => a.isTrumpRelated);
  const otherArticles = filteredArticles.filter(a => !a.isTrumpRelated);

  const categories = [...new Set(articles.map(a => a.category))];

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-200`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${cardBg} border-b ${borderColor} shadow-sm`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🦇</span>
              <div>
                <h1 className="text-xl font-bold">Wayne Manor News</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {profileInfo.emoji} {profileInfo.name}'s Feed
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Profile Switcher */}
              <select
                value={currentProfile}
                onChange={(e) => navigate(`/${e.target.value}`)}
                className={`px-3 py-2 rounded-lg border ${borderColor} ${cardBg} text-sm`}
              >
                {Object.entries(PROFILES).map(([key, p]) => (
                  <option key={key} value={key}>{p.emoji} {p.name}</option>
                ))}
              </select>
              
              {/* Saved Toggle */}
              <button
                onClick={() => setShowSaved(!showSaved)}
                className={`p-2 rounded-lg border ${borderColor} ${showSaved ? 'bg-yellow-500 text-white' : cardBg}`}
                title="Saved Articles"
              >
                ⭐ {savedArticles.length}
              </button>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg border ${borderColor} ${cardBg}`}
                title="Toggle Dark Mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} ${cardBg}`}
            />
          </div>
          
          {/* Category Filter */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                selectedCategory === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : `${cardBg} border ${borderColor}`
              }`}
            >
              All
            </button>
            {categories.map(cat => {
              const info = CATEGORY_INFO[cat] || { name: cat, emoji: '📰' };
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'text-white' 
                      : `${cardBg} border ${borderColor}`
                  }`}
                  style={selectedCategory === cat ? { backgroundColor: info.color } : {}}
                >
                  {info.emoji} {info.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl">🔄</div>
            <p className="mt-4">Loading your feed...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-4xl">😕</div>
            <p className="mt-4 text-red-500">{error}</p>
            <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Last Updated */}
            {data?.generatedAt && (
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                Last updated: {new Date(data.generatedAt).toLocaleString()}
              </p>
            )}

            {/* Trump Watch Section */}
            {trumpArticles.length > 0 && selectedCategory === 'all' && (
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
                  Trump Watch
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {trumpArticles.slice(0, 6).map((article, i) => (
                    <ArticleCard 
                      key={article.link + i}
                      article={article}
                      darkMode={darkMode}
                      isSaved={isSaved(article)}
                      onToggleSave={() => toggleSaved(article)}
                      featured={i === 0}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Other Articles */}
            <section>
              {selectedCategory === 'all' && trumpArticles.length > 0 && (
                <h2 className="text-xl font-bold mb-4">More Stories</h2>
              )}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(selectedCategory === 'all' ? otherArticles : filteredArticles).map((article, i) => (
                  <ArticleCard 
                    key={article.link + i}
                    article={article}
                    darkMode={darkMode}
                    isSaved={isSaved(article)}
                    onToggleSave={() => toggleSaved(article)}
                  />
                ))}
              </div>
            </section>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl">📭</div>
                <p className="mt-4">No articles found</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={`${cardBg} border-t ${borderColor} py-6 mt-12`}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            🦇 Wayne Manor News Hub • Updated every 30 minutes
          </p>
          <div className="mt-2 flex justify-center gap-4">
            {Object.entries(PROFILES).map(([key, p]) => (
              <Link 
                key={key}
                to={`/${key}`}
                className={`text-sm ${currentProfile === key ? 'font-bold' : ''} hover:underline`}
                style={{ color: p.color }}
              >
                {p.emoji} {p.name}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function ArticleCard({ article, darkMode, isSaved, onToggleSave, featured }) {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const catInfo = CATEGORY_INFO[article.category] || { name: article.category, emoji: '📰', color: '#6b7280' };
  
  // Get image - use article image or fallback
  const imageUrl = article.image || CATEGORY_IMAGES[article.category] || CATEGORY_IMAGES.politics;
  
  const [imgError, setImgError] = useState(false);
  
  return (
    <article 
      className={`${cardBg} border ${borderColor} rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${
        featured ? 'md:col-span-2 lg:col-span-2' : ''
      } ${article.isTrumpRelated ? 'ring-2 ring-red-600' : ''}`}
    >
      {/* Image */}
      <div className={`relative ${featured ? 'h-48' : 'h-36'} overflow-hidden bg-gray-700`}>
        <img 
          src={imgError ? CATEGORY_IMAGES[article.category] || CATEGORY_IMAGES.politics : imageUrl}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        {/* Category Badge */}
        <span 
          className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full text-white font-medium"
          style={{ backgroundColor: catInfo.color }}
        >
          {catInfo.emoji} {catInfo.name}
        </span>
        {/* Save Button */}
        <button 
          onClick={(e) => { e.preventDefault(); onToggleSave(); }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          {isSaved ? '⭐' : '☆'}
        </button>
        {/* Trump Badge */}
        {article.isTrumpRelated && (
          <span className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded-full bg-red-600 text-white font-bold animate-pulse">
            🔴 TRUMP
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="block group">
          <h3 className={`font-semibold mb-2 group-hover:text-blue-500 transition-colors line-clamp-2 ${
            featured ? 'text-lg' : 'text-base'
          }`}>
            {article.title}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
            {article.description}
          </p>
        </a>
        
        <div className={`mt-3 flex items-center justify-between text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <span className="font-medium">{article.source}</span>
          <span>{new Date(article.pubDate).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
}

export default App;
