# AioFeed

[![Build Status](https://app.travis-ci.com/mambans/AioFeed.svg?branch=master)](https://app.travis-ci.com/mambans/AioFeed)

[![Build Status](https://github.com/mambans/aiofeed/actions/workflows/master.yaml/badge.svg)

<img src="https://github.com/mambans/AioFeed/blob/master/frontend/public/android-chrome-192x192.webp" alt="Logo" width="300"/>

My personal project **AioFeed**, is a site that combines feeds from different sites such as [Twitch](https://twitch.tv), [Youtube](https://youtube.com) and Twitter lists into one page. Along with some features I personally thought was missing from [Twitch](https://twitch.tv) such as filtering out/grouping streams based on current title/game, saving vods in custom lists and show all vods without leaving main page.

## Pages

- Feeds
- Twitch top streams/clips (all/category)
- Twitch channel page
- Twitch player
- Youtube player
- Custom lists

## Feeds

Individual feeds can be disable.

- Twitch (followed online streams)
- Twitch Vods
- Youtube subscriptions
- Twitter list feed (feed from public lists, not home feed)
- Custom lists

### Twitter

Twitter feed from public Twitter lists, not the home feed. (No Twitter authentication needed)

### Twitch

AioFeed auto refreshes the Twitch live feed every 25sec with notifications. AioFeed also shows most recent vods from specific Twitch channels you have enabled/selected vods for in AioFeed. Auto refreches vods every 3 hours, can be manually refreshed from a button.

#### Features

- Online followed streams feed
- Vods feed
- Top streams.
- Followed channels list.
- Follow/Unfollow button
- Channel page with Vods and Clips. (+Sort buttons)
- Player to watch live streams, vods(no chat) and clips(no chat).

#### Added features I personally thought was missing from Twitch

- Auto refresh streams and their stats incl. viewers, games, title, thumbnail (For when /feed page stays open) (Can be disabled).
- Adjust volume with scroll wheel and mute with scroll click.
- Streams title/game updated notifications for selected channels.
- Seperate Live follows and Vod follows to be able to only fetch vods from selected channels and instead of all.
- Adjustable video/chat size.
- Switch chat sides
- See Uptime for Live stream on both Live video, thumbnails, sidebar and channel page.
- Repacing the "vigenette" effect for the video controlls with only black background/shadow behind buttons/text.
- Live preview of the stream when hovering thumbnails.
- Channel, title, category info in notification.
- Offline notifications for channels with vods enable, links to the latest vod.
- Notification list to see a "log" of live/offline notifications.
- Removing reruns from live feed.
- Show more vods without leaving the main/feed page.

(Notifications require the /feed page to be opened.)

### Youtube

Youtube feed fetches the 10 latest uploaded video from each followed/subscribed channel in the past 7 days. Doesn't auto refresh, can be manually refreshed from a button.

Hovering a video displays an iframe of the video.

_(This feed is pretty limited because of quite low quota/request limit.)_

### Custom lists

User created lists with Twitch vods/videos and YouTube videos.

<!-- ## Account & Data

AioFeed stores/saves the following data for safe storage and easier auto-reauthentication:

- **AioFeed**

  - Username
  - Email
  - _Hashed_ password
  - Profile image url
  - Custom user made lists

- **Twitch**

  - User id
  - Username
  - Profile image url
  - _Encrypted_ Access token
  - _Encrypted_ Refresh token
  - Vod-channels list
  - ChannelsUpdateNotifs list (channels list with enabled updated title/game notifications)
  - User created filters to filter out Twitch live streams

- **Youtube**

  - Username
  - Profile image url
  - _Encrypted_ access token
  - _Encrypted_ refresh token

- **Twitter**
  - List ids -->
