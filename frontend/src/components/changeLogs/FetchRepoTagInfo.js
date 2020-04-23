import axios from "axios";

export default async (url) => {
  return await axios.get(url).then((res) => {
    return res.data;
  });
};
