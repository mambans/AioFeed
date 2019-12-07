import axios from "axios";
import Utilities from "../../utilities/Utilities";

const fetchNextPgeOfSubscriptions = async (previousPage, totalResults, prevpPageItems) => {
  // if (prevpPageItems.length < totalResults) {
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

  if (pageItems.length < totalResults) {
    return await fetchNextPgeOfSubscriptions(nextPage, totalResults, pageItems);
  } else {
    return pageItems;
  }
  // } else {
  //   return prevpPageItems;
  // }
};

async function getFollowedChannels() {
  try {
    if (
      !localStorage.getItem(`YT-followedChannels`) ||
      JSON.parse(localStorage.getItem(`YT-followedChannels`)).casheExpire <= new Date()
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

      const totalResults = previousPage.data.pageInfo.totalResults - 1;

      let allSubscriptions = previousPage.data.items;
      if (previousPage.data.items.length < totalResults) {
        allSubscriptions = await fetchNextPgeOfSubscriptions(
          previousPage,
          totalResults,
          previousPage.data.items
        );
      }

      let currentTime = new Date();

      localStorage.setItem(
        `YT-followedChannels`,
        JSON.stringify({
          data: allSubscriptions,
          casheExpire: currentTime.setHours(currentTime.getHours() + 12),
        })
      );

      return allSubscriptions;
    } else {
      console.log("Youtube: Followed-channels cache used.");
      return JSON.parse(localStorage.getItem("YT-followedChannels")).data;
    }
  } catch (error) {
    console.error(error.message);
    if (localStorage.getItem("followedChannels")) {
      return JSON.parse(localStorage.getItem("YT-followedChannels")).data;
    } else {
      return error;
    }
  }
}

export default getFollowedChannels;
