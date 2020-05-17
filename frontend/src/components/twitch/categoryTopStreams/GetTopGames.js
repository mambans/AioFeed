import API from "../API";

export default async () => {
  const topGames = await API.getTopGames({
    params: {
      first: 100,
    },
  }).catch((error) => {
    console.log(error);
  });
  return topGames.data.data;
};
