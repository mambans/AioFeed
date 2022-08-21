import React from 'react';
import { MdHighQuality } from 'react-icons/md';
import ContextMenu, { ContextMenuDropDown } from './ContextMenuWrapper';
import { MdOutlineHighQuality } from 'react-icons/md';

const PlayerContextMenu = ({ PlayerUIControlls, TwitchPlayer, showAndResetTimer, children }) => {
  const Qualities = () => {
    if (!TwitchPlayer?.getQualities() || !TwitchPlayer?.getQualities()?.length) return null;

    return (
      <>
        <div onClick={() => TwitchPlayer?.setQuality('chunked')}>
          <MdHighQuality size={24} />
          {'Max quality (Source)'}
        </div>
        <ContextMenuDropDown
          trigger={
            <>
              <MdOutlineHighQuality size={24} />
              Qualities
            </>
          }
        >
          {TwitchPlayer?.getQualities()
            ?.filter((q) => q.group !== 'chunked')
            ?.map((q, index) => (
              <div key={q.name || index} onClick={() => TwitchPlayer?.setQuality(q.group)}>
                {q.name}
              </div>
            ))}
        </ContextMenuDropDown>
      </>
    );
  };

  return (
    <ContextMenu
      outerContainer={PlayerUIControlls}
      showAndResetTimer={showAndResetTimer}
      children={
        <>
          <Qualities />
          {children}
        </>
      }
    />
  );
};
export default PlayerContextMenu;
