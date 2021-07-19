import API from '../../navigation/API';

const fetchMonitoredVodChannelsList = async (username, authKey) =>
  await API.getMonitoredVodChannelsList();

export default fetchMonitoredVodChannelsList;
