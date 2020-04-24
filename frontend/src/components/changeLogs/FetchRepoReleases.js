import axios from "axios";

export default async () => {
  return await axios.get("https://api.github.com/repos/mambans/aiofeed/releases").then((res) => {
    return res.data;
  });
};
