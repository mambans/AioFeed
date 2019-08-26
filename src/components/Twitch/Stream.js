import React from "react";

class RenderTwitchStream extends React.Component {
    render() {
        return (
            <div id='twitch-embed'></div>,
            <script src='https://embed.twitch.tv/embed/v1.js'></script>,
            new Twitch.Embed("twitch-embed", {
                width: 854,
                height: 480,
                channel: "monstercat",
            })
        );
    }
}

export default RenderTwitchStream;
