import React from 'react';
import { AddToQueueButton, PositionInQueue, RemoveFromQueueButton } from './sharedStyledComponents';

const AddRemoveFromPlayQueueButton = ({ videoId, playQueue, setPlayQueue, active }) => {
  const addToPlayQueue = () => setPlayQueue((c = []) => [...c, videoId]);
  const removeFromPlayQueue = () => setPlayQueue((c) => c?.filter((v) => v !== videoId));

  if (active) return null;
  if (playQueue?.includes(videoId)) {
    return (
      <>
        <RemoveFromQueueButton
          enabled={String(!!playQueue?.includes(videoId))}
          onClick={removeFromPlayQueue}
          size={25}
        />
        <PositionInQueue>{playQueue.indexOf(videoId) || 'up next'}</PositionInQueue>
      </>
    );
  }
  return (
    <AddToQueueButton
      enabled={String(!!playQueue?.includes(videoId))}
      onClick={addToPlayQueue}
      size={25}
    />
  );
};
export default AddRemoveFromPlayQueueButton;
