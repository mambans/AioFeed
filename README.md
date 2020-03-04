# Notifies

<img src="https://github.com/mambans/Notifies/blob/master/frontend/public/logo-text.png" alt="Logo" width="300"/>

My personal project **Notifies**, is a site that combines feeds from different sites such as Twitch.tv and Youtube.com into one page.

## Account

Notifies stores the Notifies account Username, email, **hashed** password in database and Youtube and Twitch access tokens so you don't need to reconnected on each session.
It also stores:

- Profile image url
- Twitch channels to fetch vods from.
- Notifies Twitch settings (enbled/disabled, auto refresh, id ..)

## Feeds

Individual feeds can be disable.

- Twitch followed online streams
- Twitch Vods
- Twitch top streams (all/category) (most viewers)
- Youtube subscriptions

### Twitch

Notifies auto refreshes the live Twitch feed every 25sec with Notifications. Notifies also shows most recent vods from specific Twitch channels you have enabled fods for in Notifies, so you can follow a live stream but dont't enbled vods for them and the other way around. Auto refreches vods every 3 hours, can be manually refreshed from a button.

Features:

- Online followed streams feed
- Vods feed
- Preview Vods and Live streams on hover.
- Top streams (all/category) feed.
- See all followed channels
- Follow/Unfollow button
- Channel page with Vods and Clips. (+Sort buttons)
- Player to watch live streams, vods(no chat) and clips(no chat).
- Notifications list for Online and Offline notifications.

### Youtube

(Youtube currently disabled)

Youtube feed shows the 5 latest uploaded video from each followed/subscribed channel in the past 3 days. Doesn't auto refresh, can be manually refreshed from a button.

Hovering a video displays an iframe of the video.
