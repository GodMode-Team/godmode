# Overnight Build: GodMode Account Auth + Payments System

## Mission

Replace the license key system with a modern account-based auth flow. Users should be able to:
1. Run `openclaw login` → get a device code → open browser → authenticate → done
2. Pay via Stripe checkout on lifeongodmode.com
3. Have their subscription validated automatically by the plugin
4. Manage their account at lifeongodmode.com/account
5. Re-authenticate from any machine without losing access

## Architecture Overview

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  CLI/Plugin  │───▶│  Auth API        │───▶│  Stripe         │
│  (this repo) │    │  (Vercel edge)   │    │  (payments)     │
└─────────────┘    └──────────────────┘    └─────────────────┘
                          │
                   ┌──────┴──────┐
                   │  Vercel KV  │
                   │  (user db)  │
                   └─────────────┘
```

## Tech Stack

- **Auth API**: Vercel serverless functions in `site/api/` (already deployed to lifeongodmode.com)
- **Database**: Vercel KV (Redis) for user records, device codes, sessions
- **Payments**: Stripe Checkout + Webhooks
- **Tokens**: JWT (signed with RS256) for offline validation in the plugin
- **Frontend**: Static pages at lifeongodmode.com/login, /account, /pricing

## Implementation Plan

### Phase 1: Auth API (Vercel Serverless)

#### 1A. Device Flow Endpoints (RFC 8628 pattern)

**`site/api/auth/device.js`** — Start device flow
```
POST /api/auth/device
Body: { client_id: "godmode-cli" }
Response: {
  device_code: "abc123...",
  user_code: "GODM-1234",
  verification_uri: "https://lifeongodmode.com/login",
  expires_in: 900,
  interval: 5
}
```

**`site/api/auth/token.js`** — Poll for token (CLI polls this)
```
POST /api/auth/token
Body: { device_code: "abc123...", grant_type: "urn:ietf:params:oauth:grant-type:device_code" }
Response (pending): { error: "authorization_pending" }
Response (success): {
  access_token: "eyJ...",
  refresh_token: "rt_...",
  token_type: "bearer",
  expires_in: 86400
}
```

**`site/api/auth/refresh.js`** — Refresh expired access token
```
POST /api/auth/refresh
Body: { refresh_token: "rt_..." }
Response: { access_token: "eyJ...", expires_in: 86400 }
```

**`site/api/auth/me.js`** — Get current user info + subscription status
```
GET /api/auth/me
Headers: { Authorization: "Bearer eyJ..." }
Response: {
  id: "usr_...",
  email: "user@example.com",
  name: "Caleb",
  subscription: {
    status: "active",
    plan: "pro",
    current_period_end: "2026-04-03T00:00:00Z"
  }
}
```

#### 1B. Data Model (Vercel KV)

Keys:
- `user:{id}` → `{ id, email, name, passwordHash, stripeCustomerId, subscription, createdAt }`
- `user:email:{email}` → `{userId}` (email lookup index)
- `device:{device_code}` → `{ userCode, clientId, expiresAt, userId?, status: "pending"|"authorized"|"denied" }`
- `refresh:{token_hash}` → `{ userId, expiresAt, createdAt }`
- `session:{access_token_hash}` → `{ userId, expiresAt }` (optional, for revocation)

#### 1C. JWT Token Design

Access token payload:
```json
{
  "sub": "usr_abc123",
  "email": "user@example.com",
  "plan": "pro",
  "iat": 1709500000,
  "exp": 1709586400
}
```

Sign with RS256. Public key embedded in the GodMode plugin for offline validation.
Private key stored as Vercel environment variable `AUTH_JWT_PRIVATE_KEY`.
Public key committed to repo at `src/lib/auth-public-key.pem` and also at `site/api/.well-known/jwks.json`.

### Phase 2: Web Pages

#### 2A. Login Page (`site/login/index.html`)

Simple page where user enters their device code:
- Shows "Enter the code from your terminal: [____-____]"
- On submit, validates the user_code, shows "Sign in or create account"
- Email + password form (or magic link)
- On successful auth, marks the device_code as authorized
- Shows "You can close this window and return to your terminal"

**Design: Use the GodMode plugin UI design system (light theme variant), NOT the dark landing page.**

Key design tokens from `ui/src/styles/base.css`:
- **Font**: Space Grotesk (body), JetBrains Mono (mono). Load from Google Fonts.
- **Accent**: `#dc2626` (red, light theme) / `#ff6b6b` (dark theme)
- **Backgrounds**: `#fafafa` (bg), `#ffffff` (cards)
- **Text**: `#3f3f46` (primary), `#18181b` (strong), `#71717a` (muted)
- **Borders**: `#e4e4e7` (default), `#d4d4d8` (strong)
- **Radius**: 6px (sm), 8px (md/buttons/inputs), 12px (lg/cards), 9999px (pills)
- **Shadows**: layered soft shadows with `rgba(0,0,0,0.08)` range
- **Buttons**: 9px 16px padding, 13px font, weight 500, primary fills with accent red
- **Inputs**: 8px 12px padding, 1px border, inset highlight, focus ring with red glow (`0 0 0 2px bg, 0 0 0 4px #dc2626`)
- **Cards**: 1px border, 12px radius, 20px padding, subtle hover lift
- **Effects**: Subtle glassmorphism, hover translateY(-1px), smooth 200ms transitions

Reference files for exact values:
- `ui/src/styles/base.css` — theme variables
- `ui/src/styles/components.css` — button, card, input, pill styles
- `ui/src/styles/layout.css` — shell & layout patterns

The auth pages should feel like part of the GodMode app, not the marketing site.

#### 2B. Signup/Account Creation

Part of the login flow:
- If email not found, show "Create your GodMode account"
- Name, email, password (bcrypt hashed)
- Create user in KV, redirect to pricing/checkout if no subscription

#### 2C. Pricing Page (`site/pricing/index.html`)

Simple pricing page:
- **GodMode** — $297/mo per seat
  - Full AI Operating System
  - All integrations
  - Priority support

Single "Get Started" button that creates a Stripe Checkout session.

Stripe Price ID (test): `price_1T75u8EtK2soZQjqiZ11zEU7`
Stripe Product ID (test): `prod_U5GQlJ6WBHCAcO`

#### 2D. Account Page (`site/account/index.html`)

Protected page (requires auth cookie or redirect to login):
- Shows current plan, next billing date
- "Manage Subscription" button → Stripe Customer Portal
- "Devices" section → list of authenticated devices, ability to revoke
- "API Keys" → generate API keys for programmatic access
- "Log Out" button

### Phase 3: Stripe Integration

#### 3A. Checkout (`site/api/payments/checkout.js`)
```
POST /api/payments/checkout
Headers: { Authorization: "Bearer eyJ..." }
Body: { seats?: 1 }
Response: { url: "https://checkout.stripe.com/..." }
```

Creates a Stripe Checkout Session with:
- `customer` linked to user's `stripeCustomerId`
- `metadata.userId` for webhook correlation
- `success_url: https://lifeongodmode.com/account?session_id={CHECKOUT_SESSION_ID}`
- `cancel_url: https://lifeongodmode.com/pricing`

#### 3B. Webhooks (`site/api/payments/webhook.js`)

Handle these Stripe events:
- `checkout.session.completed` → activate subscription, update user record
- `customer.subscription.updated` → update plan/status
- `customer.subscription.deleted` → mark as cancelled
- `invoice.payment_failed` → mark as past_due, send notification

Verify webhook signature with `STRIPE_WEBHOOK_SECRET` env var.

#### 3C. Customer Portal (`site/api/payments/portal.js`)
```
POST /api/payments/portal
Headers: { Authorization: "Bearer eyJ..." }
Response: { url: "https://billing.stripe.com/..." }
```

### Phase 4: Plugin Integration

#### 4A. Auth Client (`src/lib/auth-client.ts`)

New module that handles the device flow from the plugin side:

```typescript
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export async function startDeviceFlow(): Promise<DeviceFlowResponse> {
  const res = await fetch("https://lifeongodmode.com/api/auth/device", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: "godmode-cli" })
  });
  return res.json();
}

export async function pollForToken(deviceCode: string, interval: number): Promise<AuthTokens> {
  // Poll /api/auth/token every `interval` seconds until authorized or expired
}

export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  // Call /api/auth/refresh
}

export async function validateToken(accessToken: string): Promise<TokenPayload> {
  // Offline JWT validation using embedded public key
  // Falls back to /api/auth/me if token is expired
}
```

Token storage: `~/.openclaw/godmode-auth.json`
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "rt_...",
  "expiresAt": 1709586400,
  "user": { "id": "usr_...", "email": "...", "plan": "pro" }
}
```

#### 4B. Replace License Gate (`index.ts`)

Replace the current license key validation with JWT-based auth:

```typescript
// OLD:
const licenseKey = api.pluginConfig?.licenseKey;
if (!licenseKey) { licenseState = { status: "no-key" }; }

// NEW:
const authTokens = await loadAuthTokens();
if (!authTokens) {
  licenseState = { status: "no-key" };
} else {
  const payload = await validateToken(authTokens.accessToken);
  if (payload) {
    licenseState = { status: "valid", tier: payload.plan, user: payload };
  } else {
    // Try refresh
    const refreshed = await refreshAccessToken(authTokens.refreshToken);
    if (refreshed) {
      saveAuthTokens(refreshed);
      licenseState = { status: "valid", ... };
    } else {
      licenseState = { status: "expired" };
    }
  }
}
```

Keep backward compatibility: if `licenseKey` is set in config AND starts with `GM-DEV-`, honor it (dev keys still work). Otherwise, use JWT auth.

#### 4C. New RPC Methods

- `auth.status` → returns current auth state (logged in, plan, email)
- `auth.login` → starts device flow, returns device code + URL
- `auth.loginPoll` → polls for token completion
- `auth.logout` → clears stored tokens
- `auth.account` → returns full account info from API

#### 4D. Update Install Script

Replace the license key step with account login:

```sh
# Step 6: Account login
step 6 "GodMode account"
if [ -f "$HOME/.openclaw/godmode-auth.json" ]; then
  ok "Already logged in"
else
  info "Log in to your GodMode account (or create one):"
  info "  openclaw godmode login"
  info "Or log in during onboarding in the GodMode UI"
fi
```

#### 4E. Update Onboarding UI

Replace the license key input in the quick setup form with a "Log In" button that:
1. Calls `auth.login` RPC → gets device code
2. Shows the code to the user
3. Opens browser to lifeongodmode.com/login
4. Polls `auth.loginPoll` until complete
5. Shows success with user email and plan

### Phase 5: Security

- **Rate limiting**: Device code creation: 10/min per IP. Token polling: 60/min per device_code.
- **Password hashing**: bcrypt with cost 12.
- **CORS**: Only allow lifeongodmode.com origin for browser requests.
- **Webhook verification**: Always verify Stripe webhook signatures.
- **Token rotation**: Refresh tokens are single-use (rotate on each refresh).
- **Revocation**: Deleting a refresh token from KV immediately blocks that device.

### Phase 6: Environment Variables

All set on Vercel project `lifeongodmode` (under `patient-autopilot` team) for production, preview, and development:

| Variable | Status | Notes |
|---|---|---|
| `AUTH_JWT_PRIVATE_KEY` | SET | RS256 2048-bit, all envs |
| `AUTH_JWT_PUBLIC_KEY` | SET | All envs. Also committed at `src/lib/auth-public-key.pem` |
| `STRIPE_SECRET_KEY` | SET | Test mode (`sk_test_...`), all envs |
| `STRIPE_PRICE_ID` | SET | `price_1T75u8EtK2soZQjqiZ11zEU7` ($297/mo), all envs |
| `REDIS_URL` | SET | Upstash Redis, auto-set by integration |
| `STRIPE_WEBHOOK_SECRET` | **NOT SET** | Create after deploying webhook endpoint: deploy → configure webhook in Stripe dashboard → get signing secret → `vercel env add STRIPE_WEBHOOK_SECRET production` |
| `GHL_PIT_TOKEN` | SET | Pre-existing, production only |

### Stripe Test Mode Credentials

- **Account**: Patient Autopilot (Holistic Health Media, LLC) — `acct_18ZBSOEtK2soZQjq`
- **Test Secret Key**: `sk_test_518ZBSOEtK2soZQjq...` (set as `STRIPE_SECRET_KEY`)
- **Test Publishable Key**: `pk_test_sfDZJHdmVwbXkmXufSEdZwzE` (use in frontend checkout)
- **Product ID**: `prod_U5GQlJ6WBHCAcO` — "GodMode"
- **Price ID**: `price_1T75u8EtK2soZQjqiZ11zEU7` — $297/mo recurring per seat
- Stripe CLI is authenticated locally. Use `stripe listen --forward-to ...` for webhook testing.

### Redis Connection

- **Provider**: Upstash (via Vercel Marketplace integration)
- **Host**: `redis-19843.c114.us-east-1-4.ec2.cloud.redislabs.com:19843`
- **Connection**: Use `REDIS_URL` env var (standard Redis protocol)
- **Capacity**: 30MB free tier (more than sufficient for user records + device codes)
- **Tested**: PING/SET/GET/DEL all confirmed working

### Vercel Project

- **Project**: `lifeongodmode` under `patient-autopilot` team
- **Domain**: lifeongodmode.com
- **Node**: 24.x
- **Link**: `site/.vercel/project.json` — project ID `prj_DoSyx6km5nSCAo3wOIQyQkXFvbiu`
- **Deploy from**: `site/` directory. Use `vercel --cwd site/` or `cd site && vercel deploy`
- **Existing rewrites**: `/install.sh`, `/setup`, `/support` (in `site/vercel.json`)

## Files to Create/Modify

### New files:
- `site/api/auth/device.js` — Device flow initiation
- `site/api/auth/token.js` — Token polling endpoint
- `site/api/auth/refresh.js` — Token refresh
- `site/api/auth/me.js` — User info endpoint
- `site/api/auth/register.js` — Account creation
- `site/api/payments/checkout.js` — Stripe checkout
- `site/api/payments/webhook.js` — Stripe webhooks
- `site/api/payments/portal.js` — Customer portal redirect
- `site/login/index.html` — Login/device code entry page
- `site/pricing/index.html` — Pricing page with Stripe checkout buttons
- `site/account/index.html` — Account management page
- `src/lib/auth-client.ts` — Plugin-side auth client
- `src/lib/auth-public-key.pem` — JWT public key for offline validation
- `src/methods/auth.ts` — Auth RPC handlers

### Modified files:
- `index.ts` — Replace license gate with JWT auth, register auth RPC methods
- `scripts/install.sh` — Replace license key step with account login
- `site/install.sh` — Same
- `site/vercel.json` — Add rewrites for /login, /pricing, /account
- `site/index.html` — Update CTA buttons to link to /pricing
- `ui/src/ui/views/setup.ts` — Replace license key input with login button
- `ui/src/ui/controllers/setup.ts` — Wire login flow
- `openclaw.plugin.json` — Remove licenseKey from configSchema (keep for backward compat transition period)

## Constraints

- Keep dev keys working (`GM-DEV-*`) for the transition period
- Don't break existing installations — if `licenseKey` is set and valid, honor it
- All API endpoints must work as Vercel serverless functions
- JWT offline validation must work without network (for airplane mode etc)
- The login flow must work on headless VPS (device flow is perfect for this)
- Use GodMode plugin UI design system (light theme) for auth pages — Space Grotesk font, red accent, light backgrounds. See `ui/src/styles/base.css` for exact tokens
- Use vanilla JS for site pages (no framework needed for these simple pages)
- Vercel KV for storage (already available on the Vercel project)
- Generate the RSA keypair and commit the public key, store private as env var

## Testing

**Already done (pre-flight):**
- [x] RSA keypair generated and env vars set
- [x] Stripe product/price created (`prod_U5GQlJ6WBHCAcO` / `price_1T75u8EtK2soZQjqiZ11zEU7`)
- [x] Redis KV connected and tested (PING/SET/GET/DEL)
- [x] Vercel project linked and env vars deployed

**Overnight session should verify:**
1. Deploy auth endpoints → test device flow: `curl -X POST https://lifeongodmode.com/api/auth/device -H 'Content-Type: application/json' -d '{"client_id":"godmode-cli"}'`
2. Open login page with user_code, create account, verify token polling returns JWT
3. Test offline JWT validation in plugin using embedded public key
4. Test Stripe checkout flow end-to-end (creates customer, redirects to checkout, returns to /account)
5. Test webhook handling with Stripe CLI: `stripe listen --forward-to localhost:3000/api/payments/webhook`
6. Verify existing `GM-DEV-*` license keys still bypass JWT auth
7. Test on headless VPS (device flow should work without browser on the server)
8. Build plugin: `pnpm build` — confirm no type errors after auth-client integration

## Priority Order

If time is limited, build in this order:
1. **Auth API + Login page** (device flow works end-to-end)
2. **Plugin auth client** (replaces license gate)
3. **Install script update** (uses new login flow)
4. **Stripe payments** (checkout + webhooks)
5. **Account page** (manage subscription)
6. **Onboarding UI update** (login button replaces key input)
