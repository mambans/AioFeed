# AioFeed

<img src="https://github.com/mambans/AioFeed/blob/master/frontend/public/android-chrome-192x192.png" alt="Logo" width="300"/>

My personal project **AioFeed**, is a site that combines feeds from different sites such as Twitch.tv, Youtube.com and Twitter List into one page. And features for that I personally thought was missing from Twitch.tv.

## Account

AioFeed stores the AioFeed account Username, email, **hashed** password in database and encrypted Youtube and Twitch access tokens so you don't need to reconnected on each session, tokens can still have expired until next login.
It also stores profile image url, vod channel list (twitch channels to fetch vods from).

## Pages

- Feed
- Twitch top streams/clips (all/category)

## Feeds

Individual feeds can be disable.

- Twitch (followed online streams)
- Twitch Vods
- Youtube subscriptions
- Twitter list feed (feed from a public list, not home feed)

### Twitter

Twitter feed from a public Twitter list, not the home feed. (No Twitter authentication needed)

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

- Auto refresh streams and their stats incl. viewers, games, title, thumbnail (For when Site stays Open or Pinned.) (Can be disabled)
- Adjust volume with scroll wheel and mute with scroll click.
- Notifications require website to be opened.
- Switch chat sides
- Seperate Live follows and Vod follows to be able to only fetch vods from selected channels and instead of all.
- Bigger live video & smaller chat.
- See Uptime for Live stream on both Live video, thumbnails, sidebar and channel page.
- Repacing the "vigenette" effect for the video controlls with only black background/shadow behind buttons/text.
- Live preview of the stream when hovering thumbnails.
- Channel, title, category info in notification.
- Offline notifications for channels with vods enable, links to the latest vod.
- Notification list to see a "log" of live/offline notifications.
- Removing reruns from live feed.
- Load more vods without leaving the main/feed page.

* Small/normal delay ~1 sec (with no ads?)

### Youtube

Youtube feed shows the 7 latest uploaded video from each followed/subscribed channel in the past 3 days. Doesn't auto refresh, can be manually refreshed from a button.

Hovering a video displays an iframe of the video.

This feed is pretty limited because of quite low quota/request limit.
