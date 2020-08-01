# AioFeed

<img src="https://github.com/mambans/AioFeed/blob/master/frontend/public/android-chrome-192x192.png" alt="Logo" width="300"/>

My personal project **AioFeed**, is a site that combines feeds from different sites such as [Twitch](https://twitch.tv), [Youtube](https://youtube.com) and a Twitter List into one page. With some features I personally thought was missing from [Twitch](https://twitch.tv).tv.

## Pages

- Feeds
- Twitch top streams/clips (all/category)
- Twitch player
- Twitch channel page
- Youtube player

## Feeds

Individual feeds can be disable.

- Twitch (followed online streams)
- Twitch Vods
- Youtube subscriptions
- Twitter list feed (feed from a public list, not home feed)

### Twitter

Twitter feed from a public Twitter list, not the home feed. (No Twitter authentication needed)

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
- Adjustable chat/video size.
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

* Small/normal delay ~1 sec.
  (Notifications require website to be opened.)

### Youtube

Youtube feed fetches the 10 latest uploaded video from each followed/subscribed channel in the past 7 days. Doesn't auto refresh, can be manually refreshed from a button.

Hovering a video displays an iframe of the video.

_(This feed is pretty limited because of quite low quota/request limit.)_

## Account & Data

AioFeed stores/saves the following data for easier auto-reauthentication:

- **AioFeed**

  - username
  - email
  - _hashed_ password
  - profile image url

- **Twitch**

  - user id
  - username
  - Profile image url
  - _encrypted_ Access token
  - _encrypted_ Refresh token
  - Vod-channels list
  - Update-notifications list (notifications for update title/game)

- **Youtube**

  - username
  - profile image url
  - _encrypted_ access token
  - _encrypted_ refresh token

- **Twitter**
  - List id
