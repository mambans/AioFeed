import React from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useFullscreen from '../../../hooks/useFullscreen';
import { navigationBarVisibleAtom } from '../../navigation/atoms';
// import useQuery from '../../../hooks/useQuery';

import { StyledChat, ChatContainer, PlayerExtraButtons } from './StyledComponents';

const StandaloneChat = () => {
  const channelName = useParams()?.channelName;
  const navigationSidebarOverflow = useRecoilValue(navigationBarVisibleAtom);

  useFullscreen({ hideNavbar: false });
  useDocumentTitle(`${channelName}'s chat'`);

  // const darkpopout = useQuery().get('darkpopout');

  return (
    <ChatContainer visible={navigationSidebarOverflow}>
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
