# Notifies

My personal project.
Notifies v.2 refactored to use react hooks.

---

<img src="./src/assets/images/logo-white-v2.png" alt="Logo" width="300" />

<img src="./src/assets/images/logo-v2.png" alt="Logo" width="300" />

**Notifies** is a site that combines feeds from different sites such as Twitch.tv and Youtube.com into one feed/page.

## Feeds

- Twitch follows
- Twitch Vods follows
- Youtube subscriptions

### Twitch

Notifies auto refreshes the live Twitch feed every 2min. Notifies also shows the three most recent vods from specific Twitch channels that you have followed in Notifies (vod follows doesn't sync with Twitch, stored on Notifies database server). Auto refreches vods every 3hours, can be manually refreshed from a button.

### Youtube

Youtube feed shows the 5 latest uploaded video from each followed/subscribed channel in the past 3 days. Doesn't auto refresh, can be manually refreshed from a button.

#### Problems

- Youtube feed doesn't live-streams (cost to much quota/requests)
