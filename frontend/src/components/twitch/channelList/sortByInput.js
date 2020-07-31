const sortAlphaByProp = (a, b) => {
  var channelA = (a.user_name || a.name)?.toLowerCase();
  var channelB = (b.user_name || b.name)?.toLowerCase();
  return channelA.localeCompare(channelB);
};

export default (input, data) => {
  let caseSensitive = [];
  let caseInsensitive = [];
  let others = [];

  if (!data) return null;

  const inputFilteredList = data?.filter((item) => {
    return (item.user_name || item.name)?.toLowerCase().includes(input?.toLowerCase() || '');
  });

  inputFilteredList.forEach((element) => {
    if ((element.user_name || element.name).slice(0, input?.length || '') === input) {
      caseSensitive.push(element);
    } else if (
      (element.user_name || element.name).slice(0, input?.length || '')?.toLowerCase() ===
      input?.toLowerCase()
    ) {
      caseInsensitive.push(element);
    } else {
      others.push(element);
    }
  });

  caseSensitive.sort(sortAlphaByProp);
  caseInsensitive.sort(sortAlphaByProp);
  others.sort(sortAlphaByProp);
  return [...caseSensitive, ...caseInsensitive, ...others];
};
