import { getLocalstorage } from '../../../util';
import API from '../../navigation/API';

const addVodChannel = async ({
  channel,
  channels = getLocalstorage('TwitchVods-Channels') || [],
  setChannels,
  username,
  authKey,
}) => {
  try {
    const existingChannels = new Set(channels);
    const newChannels = [...existingChannels.add(channel?.user_id)];

    setChannels([...newChannels]);

    await API.updateVodChannels(newChannels);

    return newChannels;
  } catch (e) {
    console.log(e.message);
  }
};
export default addVodChannel;
