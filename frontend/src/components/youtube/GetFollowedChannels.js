import axios from "axios";
import { getCookie } from "../../util/Utils";

const fetchNextPgeOfSubscriptions = async (previousPage, totalResults, prevpPageItems) => {
  const nextPage = await axios
    .get(`https://www.googleapis.com/youtube/v3/subscriptions?`, {
      params: {
        maxResults: 50,
        mine: true,
        part: "snippet",
        order: "relevance",
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
        pageToken: previousPage.data.nextPageToken,
      },
      headers: {
        Authorization: "Bearer " + getCookie("Youtube-access_token"),
        Accept: "application/json",
      },
    })
    .catch((error) => {
      console.log(error);
    });

  const pageItems = await prevpPageItems.concat(nextPage.data.items);

  if (pageItems.length < totalResults) {
    return await fetchNextPgeOfSubscriptions(nextPage, totalResults, pageItems);
  } else {
    return pageItems;
  }
};

async function getFollowedChannels() {
  try {
    try {
      const page = await axios.get(`https://www.googleapis.com/youtube/v3/subscriptions?`, {
        params: {
          maxResults: 50,
          mine: true,
          part: "snippet",
          order: "relevance",
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
        },
        headers: {
          Authorization: "Bearer " + getCookie("Youtube-access_token"),
          Accept: "application/json",
        },
      });

      const totalResults = page.data.pageInfo.totalResults - 1;

      let allSubscriptions = page.data.items;
      if (page.data.items.length < totalResults) {
        allSubscriptions = await fetchNextPgeOfSubscriptions(page, totalResults, page.data.items);
      }

      localStorage.setItem(
        `YT-followedChannels`,
        JSON.stringify({
          data: allSubscriptions,
          casheExpire: Date.now() + 12 * 60 * 60 * 1000,
        })
      );

      return allSubscriptions;
    } catch (error) {
      console.log("Youtube: Followed-channels cache used.");
      return JSON.parse(localStorage.getItem("YT-followedChannels")).data;
    }
  } catch (error) {
    console.error(error.message);
    if (localStorage.getItem("YT-followedChannels")) {
      return JSON.parse(localStorage.getItem("YT-followedChannels")).data;
    } else {
      return error;
    }
  }
}

export default getFollowedChannels;
