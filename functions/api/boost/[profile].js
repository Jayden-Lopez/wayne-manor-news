// Boost Scores Endpoint - GET /api/boost/[profile]
// Returns source/category boost multipliers based on click history
// Used by n8n workflow to rank articles

export async function onRequestGet(context) {
  const { params, env } = context;
  const profile = params.profile;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const analyticsKey = `analytics:${profile}`;
    const data = await env.NEWS_KV.get(analyticsKey, 'json');

    if (!data || !data.clicks || data.clicks.length < 5) {
      // Not enough data - return neutral boosts
      return new Response(JSON.stringify({
        profile,
        hasData: false,
        sourceBoosts: {},
        categoryBoosts: {},
        message: 'Not enough click data yet (need 5+ clicks)'
      }), { headers: corsHeaders });
    }

    // Calculate total clicks
    const totalClicks = data.clicks.length;
    
    // Calculate source boosts (1.0 = neutral, >1 = boost, <1 = reduce)
    const sourceBoosts = {};
    const totalSources = Object.keys(data.sourceCount).length;
    const avgClicksPerSource = totalClicks / Math.max(totalSources, 1);
    
    for (const [source, count] of Object.entries(data.sourceCount)) {
      // Boost formula: ratio of actual clicks to expected clicks
      // Capped between 0.5 and 2.0 to avoid extreme swings
      const ratio = count / avgClicksPerSource;
      sourceBoosts[source] = Math.min(2.0, Math.max(0.5, ratio));
    }

    // Calculate category boosts
    const categoryBoosts = {};
    const totalCategories = Object.keys(data.categoryCount).length;
    const avgClicksPerCat = totalClicks / Math.max(totalCategories, 1);
    
    for (const [category, count] of Object.entries(data.categoryCount)) {
      const ratio = count / avgClicksPerCat;
      categoryBoosts[category] = Math.min(2.0, Math.max(0.5, ratio));
    }

    // Recent trend (last 50 clicks weighted more)
    const recentClicks = data.clicks.slice(0, 50);
    const recentSourceCount = {};
    const recentCategoryCount = {};
    
    for (const click of recentClicks) {
      recentSourceCount[click.source] = (recentSourceCount[click.source] || 0) + 1;
      recentCategoryCount[click.category] = (recentCategoryCount[click.category] || 0) + 1;
    }

    return new Response(JSON.stringify({
      profile,
      hasData: true,
      totalClicks,
      sourceBoosts,
      categoryBoosts,
      recentTrend: {
        topSources: Object.entries(recentSourceCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([source, count]) => ({ source, count })),
        topCategories: Object.entries(recentCategoryCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([category, count]) => ({ category, count }))
      },
      lastUpdated: data.lastUpdated
    }), { headers: corsHeaders });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
