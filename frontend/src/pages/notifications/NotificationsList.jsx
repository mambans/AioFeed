import React from "react";

import { NotificationListContainer } from "./styledComponent";
import NotificationItem, { ClearAllNotifications } from "./NotificationItem";
import { useMarkNotificationsAsRead, useNotifications } from "../../stores/notifications";

//deconstruct nested params
// const NotificationTwitchItem = ({
//   data: { notiStatus, user_name, profile_image_url, text, title, date } = {},
// }) => {}

const NotificationsList = () => {
	const notifications = useNotifications();
	const markAllAsRead = useMarkNotificationsAsRead();

	console.log("notifications:", notifications);
	return (
		<NotificationListContainer>
			<ul>
				{notifications?.map(({ icon, body, title, date, onClick }, index) => {
					return (
						<NotificationItem
							key={String(index)}
							onClick={onClick}
							// title={title.replace(user_name, `<b>${user_name}</b>`)}
							title={title}
							text={
								body?.split("\n").map((line) => (
									<p className="UpdateText" key={line}>
										{line}
									</p>
								)) || title
							}
							icon={React.isValidElement(icon) ? icon : <img style={{ borderRadius: "50%" }} src={icon} alt=""></img>}
							date={date}
						/>
					);
				})}
				<ClearAllNotifications onClick={markAllAsRead} nr={notifications?.length || 0} disabled={!notifications?.length} />
			</ul>
		</NotificationListContainer>
	);
};

export default NotificationsList;
