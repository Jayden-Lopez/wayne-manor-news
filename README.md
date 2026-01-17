# Wayne Manor News Hub 🦇

Personalized family news aggregator with profile-based feeds.

## Profiles
- `/jae` - Tech, AI, Sports, Homelab
- `/teelo` - Crime & Justice, Recipes, Health
- `/jayden` - Animation, BJJ, Gaming, Music
- `/jordan` - Soccer, Roblox, Travel

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Hosting**: Cloudflare Pages
- **Data**: Cloudflare KV (fed by n8n every 30 min)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Local development
```bash
npm run dev
```

### 3. Deploy to Cloudflare Pages

#### Option A: Via Dashboard
1. Go to Cloudflare Dashboard → Pages
2. Create project → Connect to Git
3. Select this repository
4. Build settings:
   - Build command: `npm run build`
   - Build output: `dist`
5. Add KV binding in Settings:
   - Variable name: `NEWS_KV`
   - KV namespace: `wayne-manor-news`

#### Option B: Via Wrangler CLI
```bash
npm run pages:deploy
```

## Custom Domain
1. Go to Pages project → Custom domains
2. Add `jutalo26.com`
3. Add `www.jutalo26.com` (optional)

## Architecture
```
n8n (Mac Mini) → Cloudflare KV → Cloudflare Pages → jutalo26.com
     │                 │                 │
     │                 │                 └── React app reads from /api/feed/:profile
     │                 └── Stores JSON for each profile
     └── Fetches RSS every 30 min, saves to KV
```

## License
Private - Wayne Manor Family Use Only
