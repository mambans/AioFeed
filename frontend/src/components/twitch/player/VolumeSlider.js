import { volumeHigh } from "react-icons-kit/icomoon/volumeHigh";
import { volumeLow } from "react-icons-kit/icomoon/volumeLow";
import { volumeMedium } from "react-icons-kit/icomoon/volumeMedium";
import { volumeMute } from "react-icons-kit/icomoon/volumeMute";
import { volumeMute2 } from "react-icons-kit/icomoon/volumeMute2";
import Icon from "react-icons-kit";
import React from "react";
import Slider from "react-rangeslider";

import { StyledVolumeSlider } from "./StyledComponents";
import "react-rangeslider/lib/index.css";

export default ({ volume, setVolumeText, TwitchPlayer, volumeMuted, setVolumeMuted }) => {
  const volumeIcon = () => {
    if (volumeMuted) {
      return volumeMute2;
    } else if (volume < 1) {
      return volumeMute;
    } else if (volume <= 33) {
      return volumeLow;
    } else if (volume <= 66) {
      return volumeMedium;
    } else if (volume <= 100) {
      return volumeHigh;
    } else {
      return volumeMute;
    }
  };

  const handleChange = value => {
    setVolumeText(value);
    TwitchPlayer.setVolume(value / 100);
  };

  return (
    <StyledVolumeSlider volumeMuted={volumeMuted}>
      <h3 className='value'>{volume && volume.toFixed(0)}</h3>

      <div id='BottomRow'>
        <Icon
          id='icon'
          icon={volumeIcon()}
          size={30}
          style={{
            color: volumeMuted ? "#bd0202" : "inherit",
          }}
          onClick={() => {
            TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
            setVolumeMuted(!TwitchPlayer.getMuted());
          }}
        />
        <Slider value={volume} orientation='horizontal' onChange={handleChange} />
      </div>
    </StyledVolumeSlider>
  );
};
