// Click Tracking Endpoint - POST /api/track
// Stores click data in KV for learning user preferences

export async function onRequestPost(context) {
  const { request, env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const data = await request.json();
    const { profile, category, source, articleId, timestamp } = data;

    if (!profile || !category || !source) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get existing analytics or create new
    const analyticsKey = `analytics:${profile}`;
    const existing = await env.NEWS_KV.get(analyticsKey, 'json') || {
      clicks: [],
      categoryCount: {},
      sourceCount: {},
      lastUpdated: null
    };

    // Add click event (keep last 500 clicks per profile)
    existing.clicks.unshift({
      category,
      source,
      articleId: articleId || null,
      timestamp: timestamp || new Date().toISOString()
    });
    existing.clicks = existing.clicks.slice(0, 500);

    // Update category counts
    existing.categoryCount[category] = (existing.categoryCount[category] || 0) + 1;

    // Update source counts
    existing.sourceCount[source] = (existing.sourceCount[source] || 0) + 1;

    existing.lastUpdated = new Date().toISOString();

    // Save back to KV
    await env.NEWS_KV.put(analyticsKey, JSON.stringify(existing));

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
