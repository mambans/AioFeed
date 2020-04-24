import axios from "axios";

export default async (name) => {
  return await axios
    .get(`https://api.github.com/repos/mambans/aiofeed/releases/tags/${name}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error);
    });
};
