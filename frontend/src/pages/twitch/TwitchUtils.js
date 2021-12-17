export const formatTwitchVodsDuration = (duration) => {
  if (duration) {
    const duration1 = duration.replace('h', ':').replace('m', ':').replace('s', '');
    const durationParts = duration1.split(':');

    const tr = durationParts.map((number, index) => {
      if (index === 0) return number;
      return number.padStart(2, 0) || '';
    });
    return tr.join(':');
  }
  return '0';
};

export const durationToDate = (duration, vodCreateDate) => {
  if (duration) {
    const durationParts = duration?.replace('h', ':').replace('m', ':').replace('s', '').split(':');

    const asd = ['h', 'm', 's'].map((char) => {
      if (char === 'h' && duration?.includes('h')) {
        return durationParts[durationParts?.length - 3] * 3600000;
      } else if (char === 'm' && duration?.includes('m')) {
        return durationParts[durationParts?.length - 2] * 60000;
      } else if (char === 's' && duration?.includes('s')) {
        return durationParts[durationParts?.length - 1] * 1000;
      }
      return null;
    });

    const durationMs = asd?.reduce((s, v) => s + (v || 0), 0);
    return new Date(vodCreateDate).getTime() + durationMs;
  }
  return '0';
};

export const formatViewerNumbers = (viewers) => {
  if (!viewers) {
    return viewers;
  } else if (viewers.toString().length < 5) {
    return viewers;
  } else if (viewers.toString().length === 7) {
    return (viewers / 1000000).toString().substring(0, 5) + 'm';
  } else if (viewers.toString().length >= 5) {
    return viewers.toString().substring(0, viewers.toString().length - 3) + 'k';
  }
  return viewers;
};

export const addVodEndTime = async (videos) =>
  videos.map((stream = {}) => ({
    ...stream,
    endDate:
      stream.type === 'archive'
        ? durationToDate(stream.duration, stream.created_at)
        : new Date(stream.created_at).getTime(),
  }));
