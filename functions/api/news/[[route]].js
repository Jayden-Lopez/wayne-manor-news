// Cloudflare Worker - Wayne Manor News API
// functions/api/news/[[route]].js

export async function onRequest(context) {
  const { request, env, params } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const route = params.route ? params.route.join('/') : '';
    
    // Route: /api/news - Main news data
    if (!route || route === '') {
      const data = await env.NEWS_KV.get('news-data', { type: 'json' });
      if (!data) {
        return new Response(JSON.stringify({ error: 'No news data available' }), {
          status: 404,
          headers: corsHeaders
        });
      }
      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    // Route: /api/news/:profile - Profile-specific data
    const validProfiles = ['jae', 'teelo', 'jayden', 'jordan', 'felix'];
    const profile = route.toLowerCase();
    
    if (validProfiles.includes(profile)) {
      // Try to get profile-specific data first
      let data = await env.NEWS_KV.get(`profile-${profile}`, { type: 'json' });
      
      // Fallback to main data if profile data doesn't exist
      if (!data) {
        const mainData = await env.NEWS_KV.get('news-data', { type: 'json' });
        if (mainData && mainData.feedsByProfile && mainData.feedsByProfile[profile]) {
          data = {
            generatedAt: mainData.generatedAt,
            profile: profile,
            articles: mainData.feedsByProfile[profile],
            trumpWatch: mainData.trumpWatch || []
          };
        }
      }
      
      if (!data) {
        return new Response(JSON.stringify({ error: `No data for profile: ${profile}` }), {
          status: 404,
          headers: corsHeaders
        });
      }
      
      return new Response(JSON.stringify(data), { headers: corsHeaders });
    }

    // Unknown route
    return new Response(JSON.stringify({ error: 'Unknown route', validRoutes: ['/api/news', '/api/news/jae', '/api/news/teelo', '/api/news/jayden', '/api/news/jordan', '/api/news/felix'] }), {
      status: 404,
      headers: corsHeaders
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
