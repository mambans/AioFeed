# AioFeed

<img src="https://github.com/mambans/AioFeed/blob/master/frontend/public/logo-text.png" alt="Logo" width="300"/>

My personal project **AioFeed**, is a site that combines feeds from different sites such as Twitch.tv and Youtube.com into one page. And features for that I personally thought was missing from Twitch.tv.

## Account

AioFeed stores the AioFeed account Username, email, **hashed** password in database and Youtube and Twitch access tokens so you don't need to reconnected on each session.
It also stores profile image url, twitch channels to fetch vods from, AioFeed twitch settings (enbled/disabled, auto refresh, id ..).

## Feeds

Individual feeds can be disable.

- Twitch followed online streams
- Twitch Vods
- Youtube subscriptions

* Twitch top streams (all/category)

### Twitch

AioFeed auto refreshes the live Twitch feed every 25sec with live Notifications. AioFeed also shows most recent vods from specific Twitch channels you have enabled/selected vods for in AioFeed. Auto refreches vods every 3 hours, can be manually refreshed from a button.

#### Features

- Online followed streams feed
- Vods feed
- Top streams.
- Followed channels list.
- Follow/Unfollow button
- Channel page with Vods and Clips. (+Sort buttons)
- Player to watch live streams, vods(no chat) and clips(no chat).

#### Added features I personally thought was missing from Twitch

- Auto refresh streams and their stats incl. viewers, games, title, thumbnail (For when Site stays Open or Pinned.)
- Adjust volume with scroll wheel and mute with scroll click.
- Seperate Live follows and vod follows so I only fetch vods from selected channels.
- Bigger live video & smaller chat.
- Switch chat side and able to hide chat.
- See Uptime on both Live video, thumbnails and sidebar.
- Repacing the "vigenette" effect on hover only have black background/shadow where text is.
- Live preview of the stream when Hovering thumbnails.
- Channel, title, category info in notification.
- More stable/consistant notifications (imo).
- Notification list to see a "log" of live/offline notifications.
- Removing reruns from live feed.
- Load more vods without leaving the main/feed page.

* (Small/normal delay ~1 sec with no ads)

### Youtube

(Youtube currently disabled)

Youtube feed shows the 5 latest uploaded video from each followed/subscribed channel in the past 3 days. Doesn't auto refresh, can be manually refreshed from a button.

Hovering a video displays an iframe of the video.
