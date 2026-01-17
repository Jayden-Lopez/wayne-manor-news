// Cloudflare Pages Function - /api/feed/[profile]
// This reads from KV and returns the profile's news feed

export async function onRequest(context) {
  const { params, env } = context;
  const profile = params.profile?.toLowerCase() || 'jae';
  
  // Valid profiles
  const validProfiles = ['jae', 'teelo', 'jayden', 'jordan'];
  if (!validProfiles.includes(profile)) {
    return new Response(JSON.stringify({ error: 'Invalid profile' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Get profile data from KV
    const data = await env.NEWS_KV.get(`profile-${profile}`, 'json');
    
    if (!data) {
      return new Response(JSON.stringify({ 
        error: 'No data found',
        profile,
        articles: [],
        trumpWatch: []
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60'
        }
      });
    }
    
    return new Response(JSON.stringify(data), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch data',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
