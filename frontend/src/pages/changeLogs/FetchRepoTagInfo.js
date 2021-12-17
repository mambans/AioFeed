import axios from 'axios';

const fetchRepoTagInfo = async (name) => {
  return await axios
    .get(`https://api.github.com/repos/mambans/aiofeed/releases/tags/${name}`)
    .then((res) => res.data)
    .catch((error) => console.error(error));
};

export default fetchRepoTagInfo;
