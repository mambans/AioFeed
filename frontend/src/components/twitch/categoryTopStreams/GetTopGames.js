import API from "../API";

export default async (cursor) => {
  const topGames = await API.getTopGames({
    params: {
      first: 100,
      after: cursor || null,
    },
  }).catch((error) => {
    console.log(error);
  });
  if (topGames && topGames.data) return topGames.data;
  return { data: [] };
};
