import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PROFILES = {
  jae: { name: 'Jae', emoji: '👨‍💻', color: '#2563eb' },
  teelo: { name: 'Teelo', emoji: '👩', color: '#ec4899' },
  jayden: { name: 'Jayden', emoji: '🎮', color: '#8b5cf6' },
  jordan: { name: 'Jordan', emoji: '⚽', color: '#10b981' }
};

const CATEGORY_INFO = {
  // Shared
  trumpWatch: { name: 'Trump Watch', emoji: '🔴', color: '#dc2626' },
  politics: { name: 'Politics', emoji: '🏛️', color: '#6b7280' },
  worldNews: { name: 'World News', emoji: '🌍', color: '#0369a1' },
  trending: { name: 'Trending Videos', emoji: '📱', color: '#ff0050' },
  
  // Jae
  aiTech: { name: 'AI & Tech', emoji: '🤖', color: '#3b82f6' },
  smartHome: { name: 'Smart Home', emoji: '🏠', color: '#14b8a6' },
  homelab: { name: 'Homelab', emoji: '🖥️', color: '#f59e0b' },
  networking: { name: 'Networking', emoji: '📡', color: '#0ea5e9' },
  sports: { name: 'Sports', emoji: '⚾', color: '#ff5910' },
  finance: { name: 'Finance', emoji: '📈', color: '#059669' },
  tesla: { name: 'Tesla & EVs', emoji: '🚗', color: '#cc0000' },
  
  // Teelo
  trueCrime: { name: 'True Crime', emoji: '🔍', color: '#991b1b' },
  parenting: { name: 'Parenting', emoji: '👨‍👩‍👧‍👦', color: '#f472b6' },
  recipes: { name: 'Recipes', emoji: '🍳', color: '#f97316' },
  health: { name: 'Health', emoji: '💪', color: '#22c55e' },
  travel: { name: 'Travel', emoji: '✈️', color: '#0891b2' },
  fashion: { name: 'Fashion & Beauty', emoji: '👗', color: '#ec4899' },
  homeDecor: { name: 'Home Decor', emoji: '🏡', color: '#8b5cf6' },
  shopping: { name: 'Deals & Shopping', emoji: '🛍️', color: '#ef4444' },
  entertainment: { name: 'Entertainment', emoji: '⭐', color: '#fbbf24' },
  
  // Jayden
  animation: { name: 'Animation', emoji: '🎬', color: '#e11d48' },
  movies: { name: 'Movies', emoji: '🎥', color: '#7c3aed' },
  artSchool: { name: 'Art & Film', emoji: '🎨', color: '#c026d3' },
  music: { name: 'Music', emoji: '🎸', color: '#a855f7' },
  comics: { name: 'Comics', emoji: '💥', color: '#eab308' },
  streetwear: { name: 'Streetwear', emoji: '👟', color: '#171717' },
  bjj: { name: 'BJJ & MMA', emoji: '🥋', color: '#0ea5e9' },
  
  // Jordan
  soccer: { name: 'Soccer', emoji: '⚽', color: '#16a34a' },
  gaming: { name: 'Gaming', emoji: '🎮', color: '#8b5cf6' },
  youtube: { name: 'YouTube', emoji: '📺', color: '#ff0000' }
};

// Politics first, then profile-specific, trending last
const CATEGORY_ORDER = [
  'politics', 'worldNews',
  // Jae
  'aiTech', 'smartHome', 'homelab', 'networking', 'sports', 'finance', 'tesla',
  // Teelo
  'trueCrime', 'parenting', 'recipes', 'health', 'travel', 'fashion', 'homeDecor', 'shopping', 'entertainment',
  // Jayden
  'animation', 'movies', 'artSchool', 'music', 'comics', 'bjj',
  // Jordan + Jayden shared
  'soccer', 'gaming', 'youtube', 'streetwear',
  // Shared last
  'trending'
];

const CATEGORY_IMAGES = {
  politics: ['https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=250&fit=crop'],
  worldNews: ['https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop'],
  trending: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop'],
  aiTech: ['https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop'],
  smartHome: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=250&fit=crop'],
  homelab: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop'],
  networking: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop'],
  sports: ['https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=250&fit=crop'],
  finance: ['https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop'],
  tesla: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=250&fit=crop'],
  trueCrime: ['https://images.unsplash.com/photo-1453873531674-2151bcd01707?w=400&h=250&fit=crop'],
  parenting: ['https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=250&fit=crop'],
  recipes: ['https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=250&fit=crop'],
  health: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop'],
  travel: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop'],
  fashion: ['https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=250&fit=crop'],
  homeDecor: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=250&fit=crop'],
  shopping: ['https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=250&fit=crop'],
  entertainment: ['https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=250&fit=crop'],
  animation: ['https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=400&h=250&fit=crop'],
  movies: ['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=250&fit=crop'],
  artSchool: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=250&fit=crop'],
  music: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=250&fit=crop'],
  comics: ['https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=250&fit=crop'],
  streetwear: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=250&fit=crop'],
  bjj: ['https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=250&fit=crop'],
  soccer: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop'],
  gaming: ['https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=250&fit=crop'],
  youtube: ['https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=250&fit=crop']
};

const DEFAULT_IMAGES = ['https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop'];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getFallbackImage(category, title) {
  const images = CATEGORY_IMAGES[category] || DEFAULT_IMAGES;
  return images[hashString(title || 'default') % images.length];
}

function App() {
  const { profile } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved !== null ? saved === 'true' : true;
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
  const isJae = currentProfile === 'jae';

  useEffect(() => { fetchData(); }, [currentProfile]);
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);
  useEffect(() => { localStorage.setItem('savedArticles', JSON.stringify(savedArticles)); }, [savedArticles]);

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
    if (savedArticles.find(a => a.link === article.link)) {
      setSavedArticles(savedArticles.filter(a => a.link !== article.link));
    } else {
      setSavedArticles([...savedArticles, article]);
    }
  }

  function isSaved(article) { return savedArticles.some(a => a.link === article.link); }

  const articles = showSaved ? savedArticles : (data?.articles || []);
  
  // Filter by search
  const searchFiltered = articles.filter(a => {
    if (!searchTerm) return true;
    return a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get categories sorted (politics first)
  const rawCategories = [...new Set(articles.map(a => a.category))];
  const categories = rawCategories.sort((a, b) => {
    const orderA = CATEGORY_ORDER.indexOf(a);
    const orderB = CATEGORY_ORDER.indexOf(b);
    return (orderA === -1 ? 999 : orderA) - (orderB === -1 ? 999 : orderB);
  });

  // For "All" view: group by category, show top 3 each
  const trumpArticles = searchFiltered.filter(a => a.isTrumpRelated);
  
  // Group articles by category for "All" view
  const articlesByCategory = {};
  for (const cat of categories) {
    articlesByCategory[cat] = searchFiltered.filter(a => a.category === cat && !a.isTrumpRelated).slice(0, 3);
  }

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-200`}>
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
              {isJae && (
                <select
                  value={currentProfile}
                  onChange={(e) => navigate(`/${e.target.value}`)}
                  className={`px-3 py-2 rounded-lg border ${borderColor} ${cardBg} text-sm`}
                >
                  {Object.entries(PROFILES).map(([key, p]) => (
                    <option key={key} value={key}>{p.emoji} {p.name}</option>
                  ))}
                </select>
              )}
              <button
                onClick={() => setShowSaved(!showSaved)}
                className={`p-2 rounded-lg border ${borderColor} ${showSaved ? 'bg-yellow-500 text-white' : cardBg}`}
              >
                ⭐ {savedArticles.length}
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg border ${borderColor} ${cardBg}`}>
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${cardBg}`}
            />
          </div>
          
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${selectedCategory === 'all' ? 'bg-blue-500 text-white' : `${cardBg} border ${borderColor}`}`}
            >
              All
            </button>
            {categories.map(cat => {
              const info = CATEGORY_INFO[cat] || { name: cat, emoji: '📰' };
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${selectedCategory === cat ? 'text-white' : `${cardBg} border ${borderColor}`}`}
                  style={selectedCategory === cat ? { backgroundColor: info.color } : {}}
                >
                  {info.emoji} {info.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

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
            <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Try Again</button>
          </div>
        )}

        {!loading && !error && (
          <>
            {data?.generatedAt && (
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                Last updated: {new Date(data.generatedAt).toLocaleString()}
              </p>
            )}

            {/* SPECIFIC CATEGORY VIEW - Show all articles for that category */}
            {selectedCategory !== 'all' && (
              <section>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchFiltered.filter(a => a.category === selectedCategory).map((article, i) => (
                    <ArticleCard key={article.link + i} article={article} darkMode={darkMode} isSaved={isSaved(article)} onToggleSave={() => toggleSaved(article)} featured={i === 0} />
                  ))}
                </div>
                {searchFiltered.filter(a => a.category === selectedCategory).length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl">📭</div>
                    <p className="mt-4">No articles found</p>
                  </div>
                )}
              </section>
            )}

            {/* ALL VIEW - Trump Watch + Top 3 per category */}
            {selectedCategory === 'all' && (
              <>
                {/* Trump Watch Section */}
                {trumpArticles.length > 0 && (
                  <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
                      Trump Watch
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {trumpArticles.slice(0, 3).map((article, i) => (
                        <ArticleCard key={article.link + i} article={article} darkMode={darkMode} isSaved={isSaved(article)} onToggleSave={() => toggleSaved(article)} featured={i === 0} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Categories - Top 3 each */}
                {categories.map(cat => {
                  const catArticles = articlesByCategory[cat] || [];
                  if (catArticles.length === 0) return null;
                  const info = CATEGORY_INFO[cat] || { name: cat, emoji: '📰', color: '#6b7280' };
                  
                  return (
                    <section key={cat} className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <span>{info.emoji}</span>
                          {info.name}
                        </h2>
                        <button
                          onClick={() => setSelectedCategory(cat)}
                          className={`text-sm px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                          See all →
                        </button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {catArticles.map((article, i) => (
                          <ArticleCard key={article.link + i} article={article} darkMode={darkMode} isSaved={isSaved(article)} onToggleSave={() => toggleSaved(article)} />
                        ))}
                      </div>
                    </section>
                  );
                })}

                {Object.values(articlesByCategory).flat().length === 0 && trumpArticles.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl">📭</div>
                    <p className="mt-4">No articles found</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <footer className={`${cardBg} border-t ${borderColor} py-6 mt-12`}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            🦇 Wayne Manor News Hub • Updated every 30 minutes
          </p>
        </div>
      </footer>
    </div>
  );
}

function ArticleCard({ article, darkMode, isSaved, onToggleSave, featured }) {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const catInfo = CATEGORY_INFO[article.category] || { name: article.category, emoji: '📰', color: '#6b7280' };
  const imageUrl = article.image || getFallbackImage(article.category, article.title);
  const [imgError, setImgError] = useState(false);
  
  return (
    <article className={`${cardBg} border ${borderColor} rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${featured ? 'md:col-span-2 lg:col-span-2' : ''} ${article.isTrumpRelated ? 'ring-2 ring-red-600' : ''}`}>
      <div className={`relative ${featured ? 'h-48' : 'h-36'} overflow-hidden bg-gray-700`}>
        <img 
          src={imgError ? getFallbackImage(article.category, article.title + '_err') : imageUrl}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full text-white font-medium" style={{ backgroundColor: catInfo.color }}>
          {catInfo.emoji} {catInfo.name}
        </span>
        <button onClick={(e) => { e.preventDefault(); onToggleSave(); }} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70">
          {isSaved ? '⭐' : '☆'}
        </button>
        {article.isTrumpRelated && (
          <span className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded-full bg-red-600 text-white font-bold animate-pulse">🔴 TRUMP</span>
        )}
      </div>
      
      <div className="p-4">
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="block group">
          <h3 className={`font-semibold mb-2 group-hover:text-blue-500 transition-colors line-clamp-2 ${featured ? 'text-lg' : 'text-base'}`}>
            {article.title}
          </h3>
          {article.description && (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
              {article.description}
            </p>
          )}
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
