import axios from "axios";

export default async () => {
  return await axios
    .get("https://api.github.com/repos/mambans/aiofeed/tags")
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error);
    });
};
