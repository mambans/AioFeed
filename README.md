# Notifies

My personal project.
Notifies v.2 refactored to use react hooks.

---

<img src="/public/icons/v2/logo-4k.png" alt="Logo" width="300" />

**Notifies** is a site that combines feeds from different sites such as Twitch.tv and Youtube.com into one feed/page.

## Account

Notifies stores the Notifies account Username, email and **Hashed** password in databse. It also stores Youtube and Twitch access tokens so you don't need to reconnected on each session.

## Feeds

Individual feeds can be disable.

- Twitch follows
- Twitch Vods follows
- Youtube subscriptions

### Twitch

Notifies auto refreshes the live Twitch feed every 20sec and dispays system notification(HTML5). Notifies also shows the three most recent vods from specific Twitch channels that you have followed in Notifies (vod follows doesn't sync with Twitch, stored on Notifies database server). Auto refreches vods every 3hours, can be manually refreshed from a button.

Hovering a stream displays an iframe of the stream.

### Youtube

Youtube feed shows the 5 latest uploaded video from each followed/subscribed channel in the past 3 days. Doesn't auto refresh, can be manually refreshed from a button.

Hovering a video displays an iframe of the video.

#### Problems

- Youtube feed doesn't include live-streams (cost to much quota/requests)
