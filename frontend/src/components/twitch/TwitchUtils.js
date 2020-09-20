export const formatTwitchVodsDuration = (duration) => {
  if (duration) {
    let hour = '0';

    const duration1 = duration?.replace('h', ':').replace('m', ':').replace('s', '');

    const durationParts = duration1.split(':');
    if (duration.includes('h')) hour = durationParts.shift();

    let i = 0;
    durationParts.map((number) => {
      if (number.length < 2) durationParts[i] = 0 + number;

      i++;

      return '';
    });

    if (hour) return hour + ':' + durationParts.join(':');

    return durationParts.join(':');
  }
  return '0';
};

export const durationToDate = (duration, vodCreateDate) => {
  if (duration) {
    const durationParts = duration?.replace('h', ':').replace('m', ':').replace('s', '').split(':');

    const asd = ['h', 'm', 's'].map((char) => {
      if (char === 'h' && duration.includes('h')) {
        return durationParts[durationParts?.length - 3] * 3600000;
      } else if (char === 'm' && duration.includes('m')) {
        return durationParts[durationParts?.length - 2] * 60000;
      } else if (char === 's' && duration.includes('s')) {
        return durationParts[durationParts?.length - 1] * 1000;
      }
      return null;
    });

    const durationMs = asd.reduce(function (s, v) {
      return s + (v || 0);
    }, 0);
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
