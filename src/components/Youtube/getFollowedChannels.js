import axios from "axios";
import Utilities from "../../utilities/Utilities";

const fetchNextPgeOfSubscriptions = async (previousPage, totalResults, prevpPageItems) => {
  if (prevpPageItems.length < totalResults) {
    const nextPage = await axios.get(`https://www.googleapis.com/youtube/v3/subscriptions?`, {
      params: {
        maxResults: 50,
        mine: true,
        part: "snippet",
        order: "relevance",
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
        pageToken: previousPage.data.nextPageToken,
      },
      headers: {
        Authorization: "Bearer " + Utilities.getCookie("Youtube-access_token"),
        Accept: "application/json",
      },
    });

    const pageItems = await prevpPageItems.concat(nextPage.data.items);

    return await fetchNextPgeOfSubscriptions(nextPage, totalResults, pageItems);
  } else {
    return prevpPageItems;
  }
};

async function getFollowedChannels() {
  try {
    if (
      !localStorage.getItem(`followedChannels`) ||
      JSON.parse(localStorage.getItem(`followedChannels`)).casheExpire <= new Date()
    ) {
      const previousPage = await axios
        .get(`https://www.googleapis.com/youtube/v3/subscriptions?`, {
          params: {
            maxResults: 50,
            mine: true,
            part: "snippet",
            order: "relevance",
            key: process.env.REACT_APP_YOUTUBE_API_KEY,
          },
          headers: {
            Authorization: "Bearer " + Utilities.getCookie("Youtube-access_token"),
            Accept: "application/json",
          },
        })
        .catch(error => {
          console.error(error);
        });

      const totalResults = previousPage.data.pageInfo.totalResults;
      const allSubscriptions = await fetchNextPgeOfSubscriptions(
        previousPage,
        totalResults,
        previousPage.data.items
      );

      let currentTime = new Date();

      localStorage.setItem(
        `followedChannels`,
        JSON.stringify({
          data: allSubscriptions,
          casheExpire: currentTime.setHours(currentTime.getHours() + 12),
        })
      );

      return allSubscriptions;
    } else {
      console.log("Youtube: Followed-channels cashe used.");
      return JSON.parse(localStorage.getItem("followedChannels")).data;
    }
  } catch (error) {
    console.error(error.message);
    if (localStorage.getItem("followedChannels")) {
      return JSON.parse(localStorage.getItem("followedChannels")).data;
    } else {
      return error;
    }
  }
}

export default getFollowedChannels;
