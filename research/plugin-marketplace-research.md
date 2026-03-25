# Plugin & Extension Marketplace Research Report

**Date:** March 24, 2026
**Purpose:** Competitive analysis of successful plugin/extension marketplaces to inform marketplace strategy

---

## Table of Contents

1. [Shopify App Store](#1-shopify-app-store)
2. [WordPress Plugin Directory](#2-wordpress-plugin-directory)
3. [VS Code Extensions Marketplace](#3-vs-code-extensions-marketplace)
4. [Obsidian Community Plugins](#4-obsidian-community-plugins)
5. [Cursor Rules Marketplace (cursor.directory)](#5-cursor-rules-marketplace)
6. [Zapier Templates / IFTTT Applets / Apple Shortcuts Gallery](#6-workflow-template-marketplaces)
7. [Cross-Cutting Themes & Takeaways](#7-cross-cutting-themes--takeaways)

---

## 1. Shopify App Store

### Scale
- **~13,000-15,500 apps** listed as of late 2025 (Shopify's own 2025 annual filing claims 21,000+, but third-party trackers show ~15,508 as of Nov 2025 with 445 added in the last 30 days). ([Uptek](https://uptek.com/shopify-statistics/app-store/), [AppNavigator](https://appnavigator.io/statistics/))
- **7,874 partners** have apps in the App Store, out of 40,556 registered partners. Most have only 1 app listed. ([AppNavigator](https://appnavigator.io/statistics/))
- **87% of merchants** use apps; average merchant installs 6 apps. ([Meetanshi](https://meetanshi.com/blog/shopify-app-store-statistics/))
- App count declined 8.15% from 2023-2024 due to Shopify removing low-quality apps. ([Uptek](https://uptek.com/shopify-statistics/app-store/))

### Revenue Model & Splits
- **0% on first $1M USD lifetime** (changed in 2025 -- previously reset annually). **15% on revenue above $1M.** ([Shopify Dev Docs](https://shopify.dev/docs/apps/launch/distribution/revenue-share))
- 2.9% processing fee on all billing, plus applicable sales tax. ([Shopify Dev Docs](https://shopify.dev/docs/apps/launch/distribution/revenue-share))
- Developers earning $20M+/year or with $100M+ company revenue pay 15% on ALL revenue (no free tier). ([BetaKit](https://betakit.com/shopify-app-developers-will-no-longer-be-exempt-from-sharing-their-first-1-million-usd-in-revenue-every-year/))
- $19 one-time registration fee. ([Shopify Dev Docs](https://shopify.dev/docs/apps/launch/distribution/revenue-share))
- Developers have collectively earned $1.5B+ since inception; top 25% earn ~$167K/year, average ~$93K. ([AppNavigator](https://appnavigator.io/statistics/))

### Quality Control
- **100-checkpoint review** for every new app submission. ([Shopify Partners Blog](https://www.shopify.com/blog/trust-shopify-apps))
- App Excellence Team conducts ongoing quality checks post-launch. ([Shopify Dev Docs](https://shopify.dev/docs/apps/launch/app-store-review/review-process))
- **"Built for Shopify" (BFS) badge**: Only ~676 apps (1 in 20) qualify. BFS apps see average 49% boost in new installs within 14 days. Reviewed annually. ([Shopify Partners Blog](https://www.shopify.com/partners/blog/built-for-shopify-updates))
- Technical mandates: All new public apps must use GraphQL Admin API (as of April 2025). Lighthouse performance scores must stay within 10% of baseline. Must follow Polaris design system. ([Shopify App Store Requirements](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements))
- Review integrity: Pressuring merchants for positive reviews or offering incentives is explicitly forbidden. ([Shopify Blog](https://www.shopify.com/blog/trust-shopify-apps))

### Discovery & Search
- **Keyword relevance** (title, description, 5 keyword slots), **reviews/ratings**, **behavioral data** (click-through and install rates), and **trending signals** all factor into ranking. ([Shopify Partners Blog](https://www.shopify.com/partners/blog/search-improvements), [SaaSInsights](https://saasinsights.com/shopify-app-store-ranking))
- BFS apps get priority placement in "Recommended for you" sections, homepage headers, and category pages. BFS apps can run targeted ads in App Store search. ([Shopify Partners Blog](https://www.shopify.com/partners/blog/built-for-shopify-updates))
- 34.98% of apps have zero reviews; 44.72% have 4.5+ average rating. ([Uptek](https://uptek.com/shopify-statistics/app-store/))
- 47% of apps offer a free plan or trial. Average monthly app cost: $58.49 (higher tiers: ~$102). ([Meetanshi](https://meetanshi.com/blog/shopify-app-store-statistics/))

### What Works Well
- Aggressive quality enforcement (removing low-quality apps) keeps the ecosystem healthy.
- The BFS badge creates a clear quality signal and incentivizes developers to build to higher standards.
- The $1M free tier is generous for small developers, lowering barriers to entry.
- Behavioral search ranking surfaces genuinely popular apps rather than keyword-stuffed listings.

### What Doesn't Work Well
- The 2025 change from annual to lifetime $1M threshold was controversial and seen as a rollback of developer-friendly policy.
- 35% of apps have zero reviews, making quality assessment difficult for many apps.
- High saturation in popular categories (SEO, reviews, popups) makes discovery hard for new entrants.

---

## 2. WordPress Plugin Directory

### Scale
- **60,000+ free plugins** in the official WordPress.org repository; **~30,000 premium plugins** across third-party marketplaces (CodeCanyon, WooCommerce.com, etc.). Total ecosystem: **90,000+ plugins.** ([WP Odyssey](https://blog.wpodyssey.com/plugins-tools/how-many-wordpress-plugins-are-there-in-2025/), [DemandSage](https://www.demandsage.com/wordpress-statistics/))
- Plugin submissions **doubled in 2025** vs 2024 -- from ~150/week to 330+/week by year-end. AI-related submissions doubled. ([WordPress Plugins Team](https://make.wordpress.org/plugins/2026/01/07/a-year-in-the-plugins-team-2025/))
- **12,713 plugins reviewed** in 2025, a 40.6% increase over 2024. **58,000+ total reviews** conducted (52.2% increase). ([WordPress Plugins Team](https://make.wordpress.org/plugins/2026/01/07/a-year-in-the-plugins-team-2025/))
- Top plugins: WooCommerce (7M+ active installs), Yoast SEO (10M+ active installs, 550M+ total downloads). ([SQ Magazine](https://sqmagazine.co.uk/wordpress-statistics/))

### Revenue Model
- **WordPress.org plugin directory is 100% free** -- no revenue share, no listing fees. Developers cannot sell plugins directly through WordPress.org. ([WordPress.org](https://wordpress.org/plugins/))
- Premium plugins are sold through third-party platforms: **Freemius** (focused WordPress monetization platform), **CodeCanyon/Envato** (marketplace with fees), **WooCommerce Marketplace**, or developers' own websites. ([Freemius](https://freemius.com/wordpress/))
- Common models: Freemium (free core on WordPress.org, paid features sold externally), premium-only, add-ons/extensions model. ([Freemius Blog](https://freemius.com/blog/premium-vs-add-ons-which-is-the-best-monetization-model-for-your-wordpress-plugin/))
- WooCommerce Marketplace handles billing for plugins that extend WooCommerce. ([WooCommerce Developer Docs](https://developer.woocommerce.com/docs/woo-marketplace/monetization-expectations/))

### Quality Control
- **Volunteer-based Plugin Review Team** acts as gatekeepers. Each plugin typically requires multiple review rounds before approval. ([WordPress Plugins Team](https://make.wordpress.org/plugins/2026/01/07/a-year-in-the-plugins-team-2025/))
- **59,137 issues identified** during 2025 reviews (15.1% increase), though average issues per plugin decreased (better-prepared submissions). ([WordPress Plugins Team](https://make.wordpress.org/plugins/2026/01/07/a-year-in-the-plugins-team-2025/))
- Sample weekly stats (April 2025): 182 requested, 79 rejected, 48 closed, 100 approved. ([WordPress Plugin Review Team Updates](https://make.wordpress.org/updates/2025/04/07/plugin-review-team-7-april-2025/))
- **Automated tools expanded significantly**: 80+ new features/checks added to internal scanner, 100+ improvements. AI-assisted reviews help manage doubled submission volume. ([WordPress Plugins Team](https://make.wordpress.org/plugins/2026/01/07/a-year-in-the-plugins-team-2025/))
- **Plugin Check Plugin** (PCP): Automatic detection of issues before human review; automatic security reports after each plugin update (introduced Oct 2025). ([WordPress Plugins Team](https://make.wordpress.org/plugins/2025/10/29/plugin-check-plugin-now-creates-automatic-security-reports-update/))
- New security checks: nonce verification, direct DB queries, forbidden functions, minified files, wp_safe_redirect, and 10+ code quality checks. ([WordPress Plugins Team](https://make.wordpress.org/plugins/2026/01/07/a-year-in-the-plugins-team-2025/))

### Discovery & Search
- WordPress.org provides category browsing, search, "Popular", "Newest", and "Favorites" tabs. ([WordPress.org](https://wordpress.org/plugins/))
- Ratings and active installation counts are prominently displayed.
- Discovery is largely organic -- SEO, word of mouth, "best plugins for X" blog posts drive significant traffic.
- Top 10 plugins account for 27.6% of all installs -- extreme power-law distribution. ([Market Clarity](https://mktclarity.com/blogs/news/wordpress-plugin-market-overcrowded))

### What Works Well
- Massive scale and open ecosystem lower barriers to entry.
- The free directory is an incredible distribution channel for freemium developers.
- Automated review tooling (AI-assisted) is keeping pace with doubled submission volume.
- Plugin Check Plugin catches issues before human review, improving submission quality.

### What Doesn't Work Well
- **57% of plugins never receive any ratings or reviews.** Only 30 plugins published in the last 3 years achieved 100K+ installs. ([Market Clarity](https://mktclarity.com/blogs/news/wordpress-plugin-market-overcrowded))
- **30% of security vulnerabilities** in plugins go unpatched; 15.7% of vulnerable plugins are removed entirely. ([SQ Magazine](https://sqmagazine.co.uk/wordpress-statistics/))
- No built-in monetization -- developers must cobble together their own payment/licensing infrastructure or use third-party platforms.
- Volunteer review team creates bottleneck risk at scale.

---

## 3. VS Code Extensions Marketplace

### Scale
- **60,000+ extensions** available. ([VS Code Docs](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace))
- **14M+ users**, with VS Code holding ~73-75% market share among developers (Stack Overflow 2024 Survey). ([GoCodeo](https://www.gocodeo.com/post/navigating-vscodes-marketplace-how-to-vet-and-trust-extension-quality))
- Growth: from 28,000 extensions in 2021 to 60,000+ by 2025. ([Multiple sources](https://marketplace.visualstudio.com/vscode))

### Revenue Model
- **VS Code Marketplace does NOT support paid extensions.** Microsoft has explicitly stated: "We don't have any plans on having 'for pay' extensions for VS Code." ([GitHub Issue #111800](https://github.com/microsoft/vscode/issues/111800), [Brian Harry's Blog](https://devblogs.microsoft.com/bharry/paid-extension-in-the-visual-studio-marketplace/))
- Full Visual Studio IDE marketplace does support paid extensions (monthly per-user licensing, 30-day trials). ([Brian Harry's Blog](https://devblogs.microsoft.com/bharry/paid-extension-in-the-visual-studio-marketplace/))
- **VS Code is a strategic loss leader** for Microsoft: drives adoption of Azure, GitHub, Copilot ($19/mo subscription), and GitHub Codespaces (usage-billed). ([Quora Discussion](https://www.quora.com/How-is-Microsoft-monetizing-Visual-Studio-Code))
- Third-party workarounds exist (e.g., "code-checkout" with 10% transaction fee), but adoption is minimal. Most extensions are free or open-source. ([DEV Community](https://dev.to/shawnroller/vscode-extensions-adding-paid-features-1noa))

### Quality Control
- **Automated malware scanning** using multiple antivirus engines on every publish. ([VS Code Docs](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security))
- **Dynamic detection**: Extensions run in sandboxed clean-room VMs for behavioral analysis. ([VS Code Docs](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security))
- **Signature verification**: All extensions are signed at publish; VS Code verifies on install. ([VS Code Docs](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security))
- **Secret scanning**: Blocks publishing if API keys or credentials are detected. ([VS Code Docs](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security))
- **Verified publishers**: Blue checkmark for proven domain ownership. ([VS Code Docs](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security))
- **Block list**: Malicious extensions are removed and auto-uninstalled from all users. ([VS Code Docs](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security))
- **Trust prompt** (since v1.97): First install from third-party publisher triggers user confirmation dialog. ([VS Code Docs](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security))
- Despite these measures, **malicious extension detections grew from 27 in 2024 to 105 in the first 10 months of 2025** (ReversingLabs). ([The Hacker News](https://thehackernews.com/2025/12/researchers-find-malicious-vs-code-go.html), [Checkmarx](https://checkmarx.com/zero-post/how-we-take-down-malicious-visual-studio-code-extensions/))
- **Private Marketplace** (Nov 2025): Enterprise-grade curated extension hub for GitHub Enterprise customers. ([VS Code Blog](https://code.visualstudio.com/blogs/2025/11/18/privatemarketplace))

### Discovery & Search
- In-editor Extensions view: shows popular extensions, with search, 5-star ratings, download counts, and publisher info. ([VS Code Docs](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace))
- Marketplace web portal with ratings, Q&A, issue links, repository links, license info. ([VS Code Marketplace](https://marketplace.visualstudio.com/vscode))
- Verified publisher badges, installation counts, and review quality are primary signals.
- Curated "Featured" and "Trending" sections.
- No formal categorization taxonomy as robust as Shopify's -- discovery relies heavily on search and "top lists" blog posts.

### What Works Well
- Largest developer tool extension ecosystem in the world.
- Multi-layered automated security (scan, sandbox, sign, block).
- Verified publisher system creates trust signals.
- Extensions run in-process, providing deep editor integration.

### What Doesn't Work Well
- **No monetization support** creates a sustainability problem: developers have no financial incentive, leading to abandoned extensions.
- **Malicious extensions are a growing threat** (4x increase in 2025). Extensions have the same permissions as VS Code itself -- no granular permission model.
- **Discovery at scale is poor**: 60,000+ extensions with basic search makes finding quality tools difficult.
- Critical security flaws in extensions with 125M+ installs went unpatched for months despite disclosure attempts. ([The Hacker News](https://thehackernews.com/2026/02/critical-flaws-found-in-four-vs-code.html))

---

## 4. Obsidian Community Plugins

### Scale
- **2,713 published plugins** and **418 themes** as of end of 2025. ([Obsidian Stats Wrapped 2025](https://www.obsidianstats.com/posts/2025-12-04-wrapped-2025))
- **101.5M+ total plugin downloads** (lifetime). ([Obsidian Stats](https://www.obsidianstats.com/posts/2025-12-04-wrapped-2025))
- In 2025 alone: **821 new plugins**, **140 new themes**, **805 contributing developers**, **12,366 plugin updates**, **33.7M downloads**. ([Obsidian Stats](https://www.obsidianstats.com/posts/2025-12-04-wrapped-2025))
- Top plugin downloads in 2025: Excalidraw (1.93M), Templater (1.51M), Dataview (1.19M). ([Obsidian Stats](https://www.obsidianstats.com/posts/2025-12-04-wrapped-2025))

### Revenue Model
- **No built-in monetization.** Community plugins are overwhelmingly free and open source. ([Obsidian Forum](https://forum.obsidian.md/t/paid-plugin-market-and-how-to-solve-unmaintained-plugins/109137))
- Developers rely on voluntary donations ("Buy Me a Coffee", GitHub Sponsors, etc.). ([Obsidian Forum](https://forum.obsidian.md/t/being-able-to-pay-plugin-developers/78177))
- A small number of plugins are paid/subscription-based, managed independently by developers (listed on [Obsidian Hub](https://publish.obsidian.md/hub/02+-+Community+Expansions/02.01+Plugins+by+Category/Paid+and+subscription-based+plugins)).
- Active community discussion about creating a paid plugin marketplace or revenue-sharing model, but Obsidian has not implemented this. ([Obsidian Forum](https://forum.obsidian.md/t/revenue-program-for-developers/99041))
- Obsidian itself monetizes through Sync ($5/mo) and Publish ($10/mo) services, plus the Catalyst early-adopter tier. ([Robin Landy](https://www.robinlandy.com/blog/obsidian-as-an-example-of-thoughtful-pricing-strategy-and-the-power-of-product-tradeoffs))

### Quality Control & Security
- **Initial code review** on submission via GitHub PR to `community-plugins.json` in the `obsidian-releases` repo. ([GitHub](https://github.com/obsidianmd/obsidian-releases))
- Plugins must adhere to **Obsidian Developer Policies**. ([Obsidian Help](https://help.obsidian.md/plugin-security))
- **No review of subsequent updates** -- the Obsidian team is too small to review every release. Relies on community reporting. ([Obsidian Help](https://help.obsidian.md/plugin-security))
- **Restricted Mode** is on by default -- users must explicitly opt in to third-party plugins. ([Obsidian Help](https://help.obsidian.md/plugin-security))
- **Critical limitation: plugins have FULL system access.** No permission model. Plugins inherit Obsidian's access levels and can read/write any file on the user's machine. ([BigGo News](https://biggo.com/news/202509200713_Obsidian_Plugin_Security_Concerns), [Obsidian Forum](https://forum.obsidian.md/t/how-concerned-should-one-be-about-security-when-using-community-plugins/89829))
- Core Obsidian app has strong supply chain protections (minimal dependencies, delayed upgrades), but this does not extend to plugins. ([Obsidian Blog](https://obsidian.md/blog/less-is-safer/))
- Community has requested a manifest-based permission system (similar to browser extensions), but this has not been implemented. ([Obsidian Forum](https://forum.obsidian.md/t/community-plugin-security-hint-and-quality-gate/26227))

### Discovery & Search
- Built-in plugin browser within Obsidian (Settings > Community Plugins > Browse). ([Obsidian Help](https://help.obsidian.md/community-plugins))
- Third-party stats site [obsidianstats.com](https://www.obsidianstats.com/) tracks trending, most downloaded, and recently updated plugins.
- No ratings/review system within Obsidian itself -- discovery relies on download counts, GitHub stars, and community recommendations (Discord, Reddit, forums).

### What Works Well
- Low barrier to entry for developers: submit a GitHub PR, pass review, get listed.
- Active, passionate community that self-organizes around quality (obsidianstats.com, Discord, forums).
- Restricted Mode default is a good safety baseline.
- Rapid ecosystem growth (~800 new plugins/year).

### What Doesn't Work Well
- **No permission model** is the biggest security gap. Personal note-taking apps contain highly sensitive data, making this more consequential than in code editors.
- **No monetization** leads to plugin abandonment. Many excellent plugins haven't been updated in years. ([Obsidian Forum](https://forum.obsidian.md/t/paid-plugin-market-and-how-to-solve-unmaintained-plugins/109137))
- **No ratings/reviews** within the platform -- hard for users to assess quality without external research.
- Updates are not reviewed, creating a window for supply chain attacks.

---

## 5. Cursor Rules Marketplace (cursor.directory)

### Scale
- **75,300+ developers** building with Cursor are connected through cursor.directory. ([Cursor Directory](https://cursor.directory/))
- **23,308 Cursor rule files** found across **3,306 GitHub repositories** (as of March 2025, per CMU study). 806 "engineered" repos (10+ stars) had adopted Cursor rules. ([CMU Study](https://www.cs.cmu.edu/~ckaestne/pdf/msr26.pdf))
- The broader MCP ecosystem (which cursor.directory indexes) has grown to **5,000+ community-built MCP servers** as of early 2026. ([NxCode](https://www.nxcode.io/resources/news/cursor-mcp-servers-complete-guide-2026))
- Cursor itself: **1M+ users**, 360K paying customers, **$500M ARR** (May 2025), $2.6B valuation. ([DevGraphiq](https://devgraphiq.com/cursor-statistics/), [TapTwiceDigital](https://taptwicedigital.com/stats/cursor))

### Revenue Model
- **cursor.directory itself is free and open source.** No monetization of the directory. ([Cursor Directory](https://cursor.directory/))
- Revenue comes from Cursor IDE subscriptions ($20/mo Pro, $40/mo Business). ([Cursor](https://cursor.com))
- Rules, MCP server configs, and plugins are community-contributed at no cost.

### Quality Control
- **No formal review process.** Community-contributed rules are submitted openly; quality is crowd-sourced.
- GitHub-based contribution model (PRs to the open-source repo). ([Hacker News](https://news.ycombinator.com/item?id=41346156))
- Alternative community directories also exist: dotcursorrules.com, awesomereviewers.com. ([Medium](https://medium.com/@hilalkara.dev/cursor-ai-complete-guide-2025-real-experiences-pro-tips-mcps-rules-context-engineering-6de1a776a8af))
- Cursor's official MCP Directory provides **verified plugins** with curated integrations (Datadog, Slack, Stripe, Figma, etc.). ([Cursor Docs](https://cursor.com/docs/mcp/directory))
- Team Marketplaces (shipped early 2026) allow organizations to curate their own approved rules and MCP servers. ([Markaicode](https://markaicode.com/cursor-beta-features-2026/))

### Discovery & Search
- Browsable directory on cursor.directory organized by language/framework (Python, TypeScript, React, Next.js, etc.). ([Cursor Directory](https://cursor.directory/))
- Categories include Rules, MCP Servers, Plugins, and Events.
- Search within the directory; also discoverable via GitHub code search.
- No ratings system -- discovery is primarily through community recommendation (Twitter, Discord, blog posts).

### What Works Well
- **Extremely low friction**: Copy a file into your project, done. No installation, no accounts, no dependency management.
- Open-source model encourages rapid contribution and iteration.
- Rules are version-controlled with the project, making them portable and auditable.
- The concept of composable, scoped rules (`.cursor/rules/*.mdc`) is elegant.

### What Doesn't Work Well
- **No quality signals**: No ratings, reviews, download counts, or verification on community rules.
- **No standardization**: Rules vary wildly in quality and format.
- **Discovery is weak**: Finding the right rule for your stack requires manual browsing or relying on blog recommendations.
- No monetization path for rule authors who invest significant effort.
- Fragmented across multiple directories (cursor.directory, dotcursorrules, etc.) with no canonical source.

---

## 6. Workflow Template Marketplaces

### 6a. Zapier Templates

#### Scale
- **8,000+ app integrations**, **25M+ Zaps created**, **3.1B+ tasks/month**. ([TapTwiceDigital](https://taptwicedigital.com/stats/zapier), [ElectroIQ](https://electroiq.com/stats/zapier-statistics/))
- **3.4M+ businesses** use Zapier; **100K+ paying customers**. ([Fueler](https://fueler.io/blog/zapier-usage-revenue-valuation-growth-statistics))
- **$400M estimated 2025 revenue** (~29% YoY growth from $310M in 2024). Profitable since 2014. ([TapTwiceDigital](https://taptwicedigital.com/stats/zapier))
- **$5B valuation**, raised less than $2M in external funding (highly capital-efficient). ([SQ Magazine](https://sqmagazine.co.uk/zapier-statistics/))
- 45% uplift in pre-built template adoption. ([SQ Magazine](https://sqmagazine.co.uk/zapier-statistics/))
- 1,221 employees across 40 countries (fully remote). ([TapTwiceDigital](https://taptwicedigital.com/stats/zapier))

#### Revenue Model
- Freemium: Free tier (100 tasks/month, 5 Zaps), Starter ($29.99/mo), Professional ($73.50/mo), Team ($103.50/mo), Enterprise (custom). ([Zapier](https://zapier.com/pricing))
- Templates themselves are free -- revenue comes from task execution volume on the Zapier platform.
- No developer revenue share -- developers build integrations to drive adoption of their own products on Zapier.
- ARPU doubled from $20 to $41.70; customer lifetime value rose from ~$400 to $883. ([SQ Magazine](https://sqmagazine.co.uk/zapier-statistics/))

#### Quality Control & Discovery
- All Zap templates are subject to a review process for quality standards. ([Zapier Docs](https://docs.zapier.com/platform/publish/zap-templates))
- Templates are promoted via SEO, the app directory, and partner site embeds. Ordered loosely by popularity. ([Zapier Docs](https://docs.zapier.com/platform/publish/zap-templates))
- Two template types: Simple (any user can create/share) and Developer (for integration builders). ([Zapier Docs](https://docs.zapier.com/platform/publish/zap-templates))
- Sharing options: Public, link-only, team-only, or disabled. ([Zapier Help](https://help.zapier.com/hc/en-us/articles/8496292155405-Share-a-template-of-your-Zap))
- Zapier Agents (launched Jan 2025, GA May 2025): AI-powered workflows that reason and make decisions dynamically. ([Zapier](https://zapier.com))

#### What Works Well
- Templates dramatically lower the onboarding barrier -- users start from working examples rather than blank canvases.
- SEO-driven discovery surfaces templates organically when users search for integration solutions.
- The integration-first model (developers build connectors to get their apps in front of Zapier's user base) creates a virtuous cycle.

#### What Doesn't Work Well
- Pricing scales steeply with usage, pushing high-volume users toward alternatives.
- Template quality varies; no user rating system for individual templates.
- The sheer number of integrations (8,000+) can make it hard to find the right combination.

---

### 6b. IFTTT Applets

#### Scale
- **17-25M users** (varies by source and counting method), across **140 countries**. ([Expanded Ramblings](https://expandedramblings.com/index.php/ifttt-statistics-and-facts/), [IFTTT](https://ifttt.com/developers))
- **900+ services**, **200K+ developers**, **700+ enterprise partners**. ([IFTTT Developers](https://ifttt.com/developers))
- **90M+ activated connections**; millions of applets run monthly. 5,000+ new connections created daily in 2025. ([IFTTT](https://ifttt.com/explore/top-services-of-2025))
- Top applet of 2025: 200K+ all-time connections. ([IFTTT](https://ifttt.com/explore/top-applets-2025))

#### Revenue Model
- **Free**: 5 applets, standard speed (15min-few hours).
- **Pro ($5/mo)**: 20 applets, faster speed, multi-action.
- **Pro+ ($10/mo)**: Unlimited applets, advanced filters, AI services, multi-account, developer tools. ([IFTTT Pricing](https://ifttt.com/plans))
- Enterprise: IFTTT Connect (white-label integration platform for businesses). ([IFTTT](https://ifttt.com/developers))
- No revenue share with applet creators.

#### Quality Control & Discovery
- Curated "Explore" page with top applets, categories, and service-based browsing. ([IFTTT](https://ifttt.com/))
- IFTTT publishes annual "Top Services" and "Top Applets" lists. ([IFTTT Blog](https://ifttt.com/explore/top-services-of-2025))
- Pre-made applets are searchable by service and use case.
- No formal user rating system for individual applets.

#### What Works Well
- Consumer-friendly: Strong for IoT/smart home, personal automation, and simple trigger-action workflows.
- Enterprise Connect platform provides white-label integration for device manufacturers.
- Applets running 20% faster in 2025. ([IFTTT](https://ifttt.com/explore/top-applets-2025))

#### What Doesn't Work Well
- Free tier is very limited (5 applets) compared to historical unlimited free usage.
- Declining mindshare as platforms build native integrations.
- Trigger-action model is simpler than Zapier's multi-step workflows, limiting complex use cases.
- No developer monetization for applet creators.

---

### 6c. Apple Shortcuts Gallery

#### Scale
- **300+ built-in actions** across Contacts, Calendar, Maps, Music, Photos, Safari, Health, etc. ([Apple Support](https://support.apple.com/guide/shortcuts/welcome/ios))
- Official Gallery: **curated but limited** collection (one user review claims ~50 shortcuts). ([Apple App Store](https://apps.apple.com/us/app/shortcuts/id915249334))
- Community platforms fill the gap: **RoutineHub** hosts thousands of shortcuts with top shortcuts seeing 100K-250K+ downloads. ([RoutineHub](https://routinehub.co/))
- Other community hubs: ShortcutsGallery.com, r/shortcuts on Reddit, MacStories Shortcuts Archive. ([MacStories](https://www.macstories.net/shortcuts/))
- iOS 26 (2025): 25+ new actions added, including LLM-based actions. ([9to5Mac](https://9to5mac.com/2025/12/09/ios-26s-shortcuts-app-adds-25-new-actions-heres-everything-new/))

#### Revenue Model
- **Completely free.** No monetization mechanism in the official Gallery.
- RoutineHub offers a "CreatorHub" with developer subscriptions for signing/monetizing shortcuts. ([RoutineHub](https://routinehub.co/))
- Apple does not take any revenue share.

#### Quality Control & Discovery
- Official Gallery is Apple-curated (high quality but very limited selection).
- RoutineHub introduced **Trusty Trail** for shortcut safety verification. ([RoutineHub Blog](https://blog.routinehub.co/))
- Sharing via iCloud links (no centralized vetting of community shortcuts).
- Security concern: Shortcuts can potentially access sensitive data; users are advised to review actions before running shared shortcuts.

#### What Works Well
- Deep OS integration: Shortcuts can access virtually any iOS/macOS API surface.
- iCloud sharing makes distribution frictionless.
- Community platforms (RoutineHub) have organically filled the gap Apple left.

#### What Doesn't Work Well
- **Apple's official Gallery is extremely limited** -- does not scale to community ambitions.
- **No official third-party marketplace** -- fragmented across multiple community sites.
- No ratings, reviews, or quality signals in the official Gallery.
- No monetization for creators.
- Apple publishes no statistics about Shortcuts usage or downloads.

---

## 7. Cross-Cutting Themes & Takeaways

### Quality Control Spectrum

| Marketplace | Review Model | Ongoing Monitoring | Automated Tools |
|---|---|---|---|
| **Shopify** | 100-point human review + BFS badge | Active quality checks, annual BFS re-review | Lighthouse benchmarks, API compliance |
| **WordPress** | Human review team (volunteer) | Community reporting, security scans | AI-assisted scanner, Plugin Check Plugin, 80+ automated checks |
| **VS Code** | Automated scanning (no human review) | Block list, auto-uninstall | Malware scan, dynamic sandbox, signature verification, secret scanning |
| **Obsidian** | Initial human review (small team) | None (relies on community) | None |
| **Cursor Directory** | None (open contribution) | None | None |
| **Zapier/IFTTT** | Template review process | Platform manages integration quality | Platform-level testing |

### Monetization Models

| Marketplace | Developer Revenue | Platform Take | Developer Incentive |
|---|---|---|---|
| **Shopify** | Direct app sales | 15% above $1M lifetime | Strong -- direct revenue |
| **WordPress** | External platforms only | 0% (WordPress.org) | Moderate -- requires own infrastructure |
| **VS Code** | None supported | 0% | Weak -- no path to revenue |
| **Obsidian** | Donations only | 0% | Weak -- leads to abandonment |
| **Cursor** | None | 0% | Weak -- goodwill only |
| **Zapier** | No direct revenue | N/A | Indirect -- drives own product adoption |
| **IFTTT** | No direct revenue | N/A | Indirect -- drives own product adoption |

### Key Success Factors

1. **Monetization sustains quality.** Shopify's marketplace is the healthiest because developers can earn meaningful revenue ($93K average, $167K top quartile). WordPress and VS Code suffer from abandonment because developers lack financial incentive.

2. **Automated quality gates scale; human review does not.** WordPress's doubled submission volume was only manageable because of AI-assisted scanning. Obsidian's small team cannot review updates. VS Code's fully automated approach catches most issues but misses sophisticated attacks.

3. **Quality badges/tiers create strong incentives.** Shopify's "Built for Shopify" badge (49% install boost) is the gold standard. It gives developers a clear target and gives users a clear signal.

4. **Discovery is the universal weakness.** Every marketplace struggles with discovery at scale. Power-law distributions dominate: top 10 WordPress plugins get 27.6% of installs; 35% of Shopify apps have zero reviews; 57% of WordPress plugins have no ratings.

5. **Security is the emerging battleground.** VS Code malicious extensions grew 4x in 2025. Obsidian plugins have unrestricted system access. The industry is moving toward: verified publishers, sandboxed execution, permission manifests, and enterprise-curated private marketplaces.

6. **Templates lower onboarding friction dramatically.** Zapier's 45% uplift in template adoption shows that pre-built, click-to-run starting points dramatically accelerate user activation. This is the model Cursor's rules directory follows, and it is effective.

7. **Community fills gaps that platforms leave.** RoutineHub for Apple Shortcuts, obsidianstats.com for Obsidian, cursor.directory for Cursor -- passionate communities create the discovery, curation, and quality signals that platforms fail to provide.

---

## Sources

### Shopify App Store
- [Shopify App Store Statistics 2026 - Uptek](https://uptek.com/shopify-statistics/app-store/)
- [Shopify App Store Statistics - Meetanshi](https://meetanshi.com/blog/shopify-app-store-statistics/)
- [Shopify App Store Statistics 2025 - AppNavigator](https://appnavigator.io/statistics/)
- [Revenue Share for Shopify App Store Developers](https://shopify.dev/docs/apps/launch/distribution/revenue-share)
- [Update to Shopify's App Developer Revenue Share](https://shopify.dev/changelog/update-to-shopifys-app-developer-revenue-share)
- [Shopify Rolls Back $1M Revenue Exemption - BetaKit](https://betakit.com/shopify-app-developers-will-no-longer-be-exempt-from-sharing-their-first-1-million-usd-in-revenue-every-year/)
- [App Store Requirements - Shopify Dev](https://shopify.dev/docs/apps/launch/shopify-app-store/app-store-requirements)
- [Built for Shopify Updates 2025](https://www.shopify.com/partners/blog/built-for-shopify-updates)
- [About the App Review Process](https://shopify.dev/docs/apps/launch/app-store-review/review-process)
- [Our Commitment to App Quality - Shopify Blog](https://www.shopify.com/blog/trust-shopify-apps)
- [Search Improvements on the Shopify App Store](https://www.shopify.com/partners/blog/search-improvements)
- [Dominate Shopify App Store Rankings - SaaSInsights](https://saasinsights.com/shopify-app-store-ranking)

### WordPress Plugin Directory
- [How Many WordPress Plugins Are There in 2025 - WP Odyssey](https://blog.wpodyssey.com/plugins-tools/how-many-wordpress-plugins-are-there-in-2025/)
- [WordPress Statistics 2026 - DemandSage](https://www.demandsage.com/wordpress-statistics/)
- [A Year in the Plugins Team - 2025](https://make.wordpress.org/plugins/2026/01/07/a-year-in-the-plugins-team-2025/)
- [Plugin Check Plugin Security Reports](https://make.wordpress.org/plugins/2025/10/29/plugin-check-plugin-now-creates-automatic-security-reports-update/)
- [WordPress Plugin Market Overcrowded - Market Clarity](https://mktclarity.com/blogs/news/wordpress-plugin-market-overcrowded)
- [WordPress Statistics 2025 - SQ Magazine](https://sqmagazine.co.uk/wordpress-statistics/)
- [Freemius - WordPress Plugin Monetization](https://freemius.com/wordpress/)
- [Premium vs Add-ons Model - Freemius](https://freemius.com/blog/premium-vs-add-ons-which-is-the-best-monetization-model-for-your-wordpress-plugin/)

### VS Code Extensions Marketplace
- [Extension Marketplace - VS Code Docs](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace)
- [Extension Runtime Security - VS Code Docs](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security)
- [Navigating VS Code Marketplace Quality - GoCodeo](https://www.gocodeo.com/post/navigating-vscodes-marketplace-how-to-vet-and-trust-extension-quality)
- [Private Marketplace Announcement - VS Code Blog](https://code.visualstudio.com/blogs/2025/11/18/privatemarketplace)
- [How We Take Down Malicious Extensions - Checkmarx](https://checkmarx.com/zero-post/how-we-take-down-malicious-visual-studio-code-extensions/)
- [Malicious VS Code Extensions - The Hacker News](https://thehackernews.com/2025/12/researchers-find-malicious-vs-code-go.html)
- [Supply Chain Risk in VS Code - Wiz](https://www.wiz.io/blog/supply-chain-risk-in-vscode-extension-marketplaces)
- [Critical Flaws in VS Code Extensions - The Hacker News](https://thehackernews.com/2026/02/critical-flaws-found-in-four-vs-code.html)
- [VS Code Paid Extensions Issue #111800](https://github.com/microsoft/vscode/issues/111800)
- [Paid Extensions in VS Marketplace - Brian Harry's Blog](https://devblogs.microsoft.com/bharry/paid-extension-in-the-visual-studio-marketplace/)

### Obsidian Community Plugins
- [Obsidian Plugins Wrapped 2025 - ObsidianStats](https://www.obsidianstats.com/posts/2025-12-04-wrapped-2025)
- [Plugin Security - Obsidian Help](https://help.obsidian.md/plugin-security)
- [Community Plugins - Obsidian Help](https://help.obsidian.md/community-plugins)
- [Obsidian Plugin Security Criticism - BigGo News](https://biggo.com/news/202509200713_Obsidian_Plugin_Security_Concerns)
- [Less is Safer - Obsidian Blog](https://obsidian.md/blog/less-is-safer/)
- [Obsidian Releases - GitHub](https://github.com/obsidianmd/obsidian-releases)
- [Paid Plugin Market Discussion - Obsidian Forum](https://forum.obsidian.md/t/paid-plugin-market-and-how-to-solve-unmaintained-plugins/109137)
- [Revenue Program for Developers - Obsidian Forum](https://forum.obsidian.md/t/revenue-program-for-developers/99041)
- [Plugin Security Discussion - Obsidian Forum](https://forum.obsidian.md/t/community-plugin-security-hint-and-quality-gate/26227)
- [Obsidian Pricing Strategy - Robin Landy](https://www.robinlandy.com/blog/obsidian-as-an-example-of-thoughtful-pricing-strategy-and-the-power-of-product-tradeoffs)

### Cursor Rules Marketplace
- [Cursor Directory](https://cursor.directory/)
- [Cursor Statistics 2025 - DevGraphiq](https://devgraphiq.com/cursor-statistics/)
- [Cursor Statistics - TapTwiceDigital](https://taptwicedigital.com/stats/cursor)
- [CMU Study: Speed at the Cost of Quality](https://www.cs.cmu.edu/~ckaestne/pdf/msr26.pdf)
- [Cursor AI Complete Guide 2025 - Medium](https://medium.com/@hilalkara.dev/cursor-ai-complete-guide-2025-real-experiences-pro-tips-mcps-rules-context-engineering-6de1a776a8af)
- [Cursor Rules - Cursor Docs](https://docs.cursor.com/context/rules)
- [Cursor MCP Servers 2026 - NxCode](https://www.nxcode.io/resources/news/cursor-mcp-servers-complete-guide-2026)
- [Cursor MCP Directory](https://cursor.com/docs/mcp/directory)
- [Show HN: Cursor AI Rules Directory - Hacker News](https://news.ycombinator.com/item?id=41346156)
- [Cursor Beta Features 2026 - Markaicode](https://markaicode.com/cursor-beta-features-2026/)

### Zapier / IFTTT / Apple Shortcuts
- [Zapier Statistics 2025 - TapTwiceDigital](https://taptwicedigital.com/stats/zapier)
- [Zapier Statistics - ElectroIQ](https://electroiq.com/stats/zapier-statistics/)
- [Zapier Statistics 2026 - SQ Magazine](https://sqmagazine.co.uk/zapier-statistics/)
- [Zapier Statistics 2026 - Fueler](https://fueler.io/blog/zapier-usage-revenue-valuation-growth-statistics)
- [Zap Templates - Zapier Docs](https://docs.zapier.com/platform/publish/zap-templates)
- [Share a Template of Your Zap - Zapier Help](https://help.zapier.com/hc/en-us/articles/8496292155405-Share-a-template-of-your-Zap)
- [IFTTT Statistics 2025 - Expanded Ramblings](https://expandedramblings.com/index.php/ifttt-statistics-and-facts/)
- [IFTTT Top Applets 2025](https://ifttt.com/explore/top-applets-2025)
- [IFTTT Top Services 2025](https://ifttt.com/explore/top-services-of-2025)
- [IFTTT Developers](https://ifttt.com/developers)
- [IFTTT Pricing](https://ifttt.com/plans)
- [Apple Shortcuts User Guide](https://support.apple.com/guide/shortcuts/welcome/ios)
- [iOS 26 Shortcuts Updates - 9to5Mac](https://9to5mac.com/2025/12/09/ios-26s-shortcuts-app-adds-25-new-actions-heres-everything-new/)
- [RoutineHub](https://routinehub.co/)
- [MacStories Shortcuts Archive](https://www.macstories.net/shortcuts/)
