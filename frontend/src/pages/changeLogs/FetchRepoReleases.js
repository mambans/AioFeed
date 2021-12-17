import axios from 'axios';

const fetchRepoReleases = async () => {
  return await axios
    .get('https://api.github.com/repos/mambans/aiofeed/releases')
    .then((res) => res.data)
    .catch((error) => console.error(error));
};

export default fetchRepoReleases;
