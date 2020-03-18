import React, { useState, useEffect, useContext } from "react";
import VodsContext from "./VodsContext";
import FetchMonitoredVodChannelsList from "./FetchMonitoredVodChannelsList";
import AccountContext from "../../account/AccountContext";

export default ({ children }) => {
  const { username, authKey } = useContext(AccountContext);
  const [vods, setVods] = useState();
  const [channels, setChannels] = useState();

  useEffect(() => {
    if (!channels) {
      (async () => {
        setChannels(await FetchMonitoredVodChannelsList(username, authKey));
      })();
    }
  }, [username, authKey, channels]);

  return (
    <VodsContext.Provider
      value={{
        vods: vods,
        setVods: setVods,
        channels: channels || [],
        setChannels: setChannels,
      }}>
      {children}
    </VodsContext.Provider>
  );
};
