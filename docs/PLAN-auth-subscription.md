# Plan: Full Auth & Subscription Management

## Current State

### What's Built (code-complete, not wired up)
- **Device Flow OAuth** (RFC 8628): `src/lib/auth-client.ts` — `startDeviceFlow()`, `pollForToken()`, `refreshAccessToken()`
- **JWT Offline Validation**: RS256 with embedded public key at `src/lib/auth-public-key.pem`
- **Auth RPC handlers**: `src/methods/auth.ts` — `auth.login`, `auth.loginPoll`, `auth.logout`, `auth.status`, `auth.account`
- **Token storage**: `~/.openclaw/godmode-auth.json` (600 permissions)
- **License gate in index.ts**: Already supports JWT — if no license key, tries JWT from auth file
- **Stripe account**: Patient Autopilot, product `prod_U5GQlJ6WBHCAcO`, price `price_1T75u8EtK2soZQjqiZ11zEU7` ($297/mo)
- **Blueprint doc**: `docs/OVERNIGHT-AUTH-BUILD.md` has full spec

### What's Missing

| Area | Gap |
|------|-----|
| **Backend** | No `/api/auth/device`, `/api/auth/token`, `/api/auth/refresh`, `/api/auth/me` endpoints deployed on Vercel |
| **Backend** | No Stripe checkout/webhook/portal endpoints |
| **Website** | No `/login` page (device code entry form) |
| **Website** | No `/pricing` page ($297/mo with Stripe checkout) |
| **Website** | No `/account` page (subscription status, manage, logout) |
| **UI** | Setup tab still shows "License Key" input instead of "Log In" button |
| **UI** | No device flow modal (show code, poll for completion) |
| **UI** | No account/subscription display anywhere |
| **UI** | No logout button |
| **Onboarding** | No subscription check during onboarding |

---

## Implementation Plan

### Phase 1: Deploy Auth Backend (Vercel serverless functions)

**Files to create in `godmode-website` repo:**

1. `api/auth/device.js` — POST: Start device flow
   - Generate `device_code` (random), `user_code` (GODM-XXXX format)
   - Store in Vercel KV with 15-min TTL
   - Return `{ device_code, user_code, verification_uri, expires_in, interval }`

2. `api/auth/token.js` — POST: Poll for token
   - Accept `device_code` + `grant_type`
   - If pending: return `{ error: "authorization_pending" }`
   - If approved: issue JWT (RS256), refresh token, return tokens
   - If expired/denied: return error

3. `api/auth/refresh.js` — POST: Refresh expired JWT
   - Accept `refresh_token`
   - Validate, issue new JWT + new refresh token
   - Return tokens

4. `api/auth/me.js` — GET: Account info (requires Bearer token)
   - Validate JWT
   - Return user info + subscription status from Stripe

5. `api/auth/register.js` — POST: Create account
   - Accept email + password (or OAuth)
   - Create user in Vercel KV
   - Return user record

### Phase 2: Deploy Payment Backend

6. `api/payments/checkout.js` — POST: Create Stripe checkout session
   - Accept `userId`, create Stripe customer if needed
   - Create checkout session for $297/mo price
   - Return `{ url }` (Stripe hosted checkout)

7. `api/payments/webhook.js` — POST: Stripe webhook handler
   - Verify Stripe signature
   - Handle: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
   - Update user subscription status in KV

8. `api/payments/portal.js` — POST: Create Stripe billing portal session
   - Accept `userId`
   - Return portal URL for self-service subscription management

### Phase 3: Deploy Web Pages

9. `login/index.html` — Device code entry + account creation
   - Form: "Enter your device code" (GODM-XXXX)
   - Or: "Create an account" (email + password)
   - Or: "Already have an account? Sign in"
   - On code submit: validate device code, mark as approved
   - Redirect to account page on success

10. `pricing/index.html` — Subscription page
    - $297/mo plan card
    - "Get Started" → Stripe checkout
    - Feature list, FAQ

11. `account/index.html` — Account management
    - Show: name, email, plan, billing date
    - "Manage Subscription" → Stripe billing portal
    - "Your Devices" → list paired devices
    - "Log Out" button

### Phase 4: Update GodMode UI

12. **Replace license key input with "Log In" button** in `ui/src/ui/views/setup.ts`
    - Remove license key field
    - Add "Log In to GodMode" button that starts device flow
    - Show device code modal: "Enter code GODM-XXXX at lifeongodmode.com/login"
    - Poll for completion, show success

13. **Add account info display** — header bar or settings
    - Show logged-in user email and plan
    - "Manage Account" link → opens lifeongodmode.com/account
    - "Log Out" button

14. **Wire device flow in setup controller** — `ui/src/ui/controllers/setup.ts`
    - Call `auth.login` → get device code
    - Show code to user
    - Poll `auth.loginPoll` every 5s
    - On success: update UI state, hide login button

15. **Add subscription status to overview** — `ui/src/ui/views/overview.ts`
    - Show plan, billing date, status
    - Link to billing portal

### Phase 5: Update Install Script

16. Replace license key prompt with device flow hint:
    ```
    openclaw godmode login    # starts device flow in terminal
    ```
    Or link to web onboarding for browser-based login.

### Phase 6: Deprecate License Keys

17. Keep `GM-DEV-*` keys working for internal dev
18. Remove `GM-PROD-*` key validation
19. Remove license key field from all UI
20. Update docs

---

## Env Vars Needed (Vercel)

| Var | Status |
|-----|--------|
| `AUTH_JWT_PRIVATE_KEY` | Needs to be set (RS256 private key) |
| `STRIPE_SECRET_KEY` | Already set (test mode) |
| `STRIPE_WEBHOOK_SECRET` | Needs to be set after webhook creation |
| `KV_REST_API_URL` | Needs Vercel KV store provisioned |
| `KV_REST_API_TOKEN` | Needs Vercel KV store provisioned |

## Priority Order (if time-limited)

1. Auth backend (device flow works end-to-end) — Phase 1
2. Login page — Phase 3 (item 9)
3. UI login button — Phase 4 (item 12)
4. Stripe checkout + webhooks — Phase 2
5. Pricing + account pages — Phase 3 (items 10-11)
6. Full UI integration — Phase 4 (items 13-15)
