import React from "react";
import { useParams } from "react-router-dom";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import useFullscreen from "../../../hooks/useFullscreen";
// import useQuery from '../../../hooks/useQuery';

import { StyledChat, ChatContainer } from "./StyledComponents";
import { useNavigationBarVisible } from "../../../stores/navigation";

const StandaloneChat = () => {
	const channelName = useParams()?.channelName;

	const navigationBarVisible = useNavigationBarVisible();

	useFullscreen({ hideNavbar: false });
	useDocumentTitle(`${channelName}'s chat'`);

	// const darkpopout = useQuery().get('darkpopout');

	return (
		<ChatContainer visible={navigationBarVisible}>
			<StyledChat
				frameborder="0"
				scrolling="yes"
				theme="dark"
				id={channelName + "-chat"}
				src={`https://www.twitch.tv/embed/${channelName}/chat?darkpopout&parent=aiofeed.com`}
			/>
		</ChatContainer>
	);
};

export default StandaloneChat;
