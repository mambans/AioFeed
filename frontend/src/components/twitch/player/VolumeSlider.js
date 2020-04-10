import { FaVolumeMute } from "react-icons/fa";
import { FaVolumeUp } from "react-icons/fa";
import { MdVolumeDown } from "react-icons/md";
import { MdVolumeMute } from "react-icons/md";
import { MdVolumeUp } from "react-icons/md";
import React from "react";
import Slider from "react-rangeslider";

import { StyledVolumeSlider } from "./StyledComponents";
import "react-rangeslider/lib/index.css";

export default ({ volume, setVolumeText, TwitchPlayer, volumeMuted, setVolumeMuted }) => {
  const volumeIcon = () => {
    const attrs = {
      id: "icon",
      size: 30,
      style: {
        color: volumeMuted ? "#bd0202" : "inherit",
      },
      onClick: () => {
        TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
        setVolumeMuted(!TwitchPlayer.getMuted());
      },
    };
    let IconVolume = MdVolumeMute;

    if (volumeMuted) {
      IconVolume = FaVolumeMute;
    } else if (volume < 1) {
      IconVolume = MdVolumeMute;
    } else if (volume <= 33) {
      IconVolume = MdVolumeDown;
    } else if (volume <= 66) {
      IconVolume = MdVolumeUp;
    } else if (volume <= 100) {
      IconVolume = FaVolumeUp;
    } else {
      IconVolume = MdVolumeMute;
    }

    return <IconVolume {...attrs} />;
  };

  const handleChange = (value) => {
    if (TwitchPlayer.getMuted()) {
      TwitchPlayer.setMuted(false);
      setVolumeMuted(false);
    }
    setVolumeText(value);
    TwitchPlayer.setVolume(value / 100);
  };

  return (
    <StyledVolumeSlider volumeMuted={volumeMuted}>
      <h3 className='value'>{volume && volume.toFixed(0)}</h3>

      <div id='BottomRow'>
        {volumeIcon()}
        <Slider value={volume} orientation='horizontal' onChange={handleChange} />
      </div>
    </StyledVolumeSlider>
  );
};
