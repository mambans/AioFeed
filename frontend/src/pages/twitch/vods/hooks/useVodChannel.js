import { useContext } from 'react';
import API from '../../../navigation/API';
import VodsContext from '../VodsContext';

const useVodChannel = () => {
  const { channels, setChannels, setVods, vods } = useContext(VodsContext);

  const addVodChannel = async ({ channel }) => {
    try {
      const existingChannels = new Set(channels);
      const newChannels = [...existingChannels.add(channel.user_id)];

      setChannels([...newChannels]);

      await API.addVodChannel(channel.user_id);

      return newChannels;
    } catch (e) {
      console.log('addVodChannel error: ', e.message);
    }
  };

  const removeChannel = async ({ channel }) => {
    try {
      const vodChannels = new Set(channels || []);
      vodChannels.delete(channel?.user_id);

      setChannels([...vodChannels]);
      API.removeVodChannel(channel?.user_id);

      const existingVodVideos = vods || { data: [] };
      const newVodVideos = {
        ...existingVodVideos,
        data: existingVodVideos.data
          .filter((video) => video?.user_id !== channel?.user_id)
          ?.slice(0, 100),
      };

      setVods(newVodVideos);

      return vodChannels;
    } catch (e) {
      console.log('removeChannel error: ', e.message);
    }
  };

  return { addVodChannel, removeChannel };
};
export default useVodChannel;
