import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import useFullscreen from '../../../hooks/useFullscreen';
import NavigationContext from '../../navigation/NavigationContext';
// import useQuery from '../../../hooks/useQuery';

import { StyledChat, ChatContainer, PlayerExtraButtons } from './StyledComponents';

const StandaloneChat = () => {
  const channelName = useParams()?.channelName;
  const { visible } = useContext(NavigationContext);

  useFullscreen({ hideNavbar: false });

  // const darkpopout = useQuery().get('darkpopout');

  return (
    <ChatContainer visible={visible}>
      <PlayerExtraButtons channelName={channelName}></PlayerExtraButtons>
      <StyledChat
        frameborder='0'
        scrolling='yes'
        theme='dark'
        id={channelName + '-chat'}
        src={`https://www.twitch.tv/embed/${channelName}/chat?darkpopout&parent=aiofeed.com`}
      />
    </ChatContainer>
  );
};

export default StandaloneChat;
