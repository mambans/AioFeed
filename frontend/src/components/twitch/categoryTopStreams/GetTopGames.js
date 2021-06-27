import API from '../API';

const getTopGames = async (cursor) => {
  const topGames = await API.getTopGames({
    params: {
      first: 100,
      after: cursor || null,
    },
  }).catch((error) => console.log('er: ', error));
  if (topGames?.data) return topGames.data;
  return { data: [] };
};
export default getTopGames;
