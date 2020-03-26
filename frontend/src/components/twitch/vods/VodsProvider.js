import React, { useState, useEffect, useContext } from "react";
import VodsContext from "./VodsContext";
import FetchMonitoredVodChannelsList from "./FetchMonitoredVodChannelsList";
import AccountContext from "../../account/AccountContext";

export default ({ children }) => {
  const { username, authKey } = useContext(AccountContext);
  const [vods, setVods] = useState();
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    (async () => {
      const fetchedChannels = await FetchMonitoredVodChannelsList(username, authKey);
      console.log("useEffect-fetchedChannels", fetchedChannels);
      setChannels(fetchedChannels);
      localStorage.setItem("VodChannels", JSON.stringify(fetchedChannels));
    })();
  }, [username, authKey]);

  return (
    <VodsContext.Provider
      value={{
        vods: vods,
        setVods: setVods,
        channels: channels,
        setChannels: setChannels,
      }}>
      {children}
    </VodsContext.Provider>
  );
};
