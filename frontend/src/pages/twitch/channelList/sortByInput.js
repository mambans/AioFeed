const sortAlphaByProp = (a, b) => {
  var channelA = (a.user_name || a.name)?.toLowerCase();
  var channelB = (b.user_name || b.name)?.toLowerCase();
  return channelA.localeCompare(channelB);
};

const sortByInput = (input, data) => {
  if (!data) return null;

  const inputFilteredList = data?.filter((item) => {
    return (item.user_name || item.name)?.toLowerCase().includes(input?.toLowerCase() || '');
  });

  const channels = inputFilteredList.reduce(
    (acc, element) => {
      if ((element.user_name || element.name).slice(0, input?.length || '') === input) {
        return { ...acc, caseSensitive: [...acc.caseSensitive, element] };
      } else if (
        (element.user_name || element.name).slice(0, input?.length || '')?.toLowerCase() ===
        input?.toLowerCase()
      ) {
        return { ...acc, caseInsensitive: [...acc.caseInsensitive, element] };
      } else {
        return { ...acc, others: [...acc.others, element] };
      }
    },
    { caseSensitive: [], caseInsensitive: [], others: [] }
  );

  return Object?.values?.(channels)?.flatMap((ar = []) => ar?.sort(sortAlphaByProp));

  // const caseSensitive = channels.caseSensitive.sort(sortAlphaByProp);
  // const caseInsensitive = channels.caseInsensitive.sort(sortAlphaByProp);
  // const others = channels.others.sort(sortAlphaByProp);
  // return [...caseSensitive, ...caseInsensitive, ...others];
};
export default sortByInput;
