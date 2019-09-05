import axios from "axios";

async function getFollowedChannels() {
    try {
        const followedchannels = await axios
            .get(`https://api.twitch.tv/helix/users/follows?`, {
                params: {
                    from_id: 32540540,
                    first: 50,
                },
                headers: {
                    "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                },
            })
            .catch(error => {
                console.error("-Error: ", error.message);
                return error;
            });

        if (followedchannels.data.data.length < followedchannels.data.total) {
            const secondPage = await axios.get(`https://api.twitch.tv/helix/users/follows?`, {
                params: {
                    from_id: 32540540,
                    first: 50,
                    after: followedchannels.data.pagination.cursor,
                },
                headers: {
                    "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                },
            });

            secondPage.data.data.forEach(channel => {
                followedchannels.data.data.push(channel);
            });
        }
        return followedchannels;
    } catch (error) {
        console.error("-Error: ", error.message);
        return error;
    }
}

export default getFollowedChannels;
