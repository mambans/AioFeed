import { useSetRecoilState } from 'recoil';
import API from '../../../navigation/API';
import { twitchVodsAtom, vodChannelsAtom } from '../atoms';

const useVodChannel = () => {
  const setTwitchVods = useSetRecoilState(twitchVodsAtom);
  const setChannels = useSetRecoilState(vodChannelsAtom);

  const addVodChannel = async ({ channel }) => {
    try {
      setChannels((channels) => {
        const existingChannels = new Set(channels);
        existingChannels.add(channel.user_id);
        return [...existingChannels];
      });

      await API.addVodChannel(channel.user_id);
    } catch (e) {
      console.log('addVodChannel error: ', e.message);
    }
  };

  const removeChannel = async ({ channel }) => {
    try {
      setChannels((channels) => {
        const vodChannels = new Set(channels || []);
        vodChannels.delete(channel?.user_id);

        return [...vodChannels];
      });
      API.removeVodChannel(channel?.user_id);

      setTwitchVods((vods) => {
        const existingVodVideos = vods || { data: [] };
        const newVodVideos = {
          ...existingVodVideos,
          data: existingVodVideos.data
            .filter((video) => video?.user_id !== channel?.user_id)
            ?.slice(0, 100),
        };

        return newVodVideos;
      });
    } catch (e) {
      console.log('removeChannel error: ', e.message);
    }
  };

  return { addVodChannel, removeChannel };
};
export default useVodChannel;
