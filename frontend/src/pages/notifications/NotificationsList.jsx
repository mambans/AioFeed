import React from "react";

import { NotificationListContainer } from "./styledComponent";
import NotificationItem, { ClearAllNotifications } from "./NotificationItem";
import { useClearNotifications, useNotifications } from "../../stores/notifications";

//deconstruct nested params
// const NotificationTwitchItem = ({
//   data: { notiStatus, user_name, profile_image_url, text, title, date } = {},
// }) => {}

const NotificationsList = () => {
	const notifications = useNotifications();
	const clearNotifications = useClearNotifications();

	return (
		<NotificationListContainer>
			<ul>
				{notifications
					?.sort((a, b) => new Date(b.date) - new Date(a.date))
					?.map(({ icon, body, title, date, onClick }, index) => {
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
				<ClearAllNotifications onClick={clearNotifications} nr={notifications?.length || 0} disabled={!notifications?.length} />
			</ul>
		</NotificationListContainer>
	);
};

export default NotificationsList;
