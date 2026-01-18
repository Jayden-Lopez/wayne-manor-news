// Analytics Endpoint - GET /api/analytics/[profile]
// Returns click analytics for a profile

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

    if (!data) {
      return new Response(JSON.stringify({
        profile,
        totalClicks: 0,
        topCategories: [],
        topSources: [],
        recentClicks: [],
        message: 'No analytics data yet'
      }), { headers: corsHeaders });
    }

    // Calculate top categories
    const topCategories = Object.entries(data.categoryCount || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([category, count]) => ({ category, count, percentage: 0 }));

    const totalCatClicks = topCategories.reduce((sum, c) => sum + c.count, 0);
    topCategories.forEach(c => {
      c.percentage = Math.round((c.count / totalCatClicks) * 100);
    });

    // Calculate top sources
    const topSources = Object.entries(data.sourceCount || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([source, count]) => ({ source, count }));

    // Recent clicks (last 20)
    const recentClicks = (data.clicks || []).slice(0, 20);

    return new Response(JSON.stringify({
      profile,
      totalClicks: data.clicks?.length || 0,
      topCategories,
      topSources,
      recentClicks,
      lastUpdated: data.lastUpdated
    }), { headers: corsHeaders });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
