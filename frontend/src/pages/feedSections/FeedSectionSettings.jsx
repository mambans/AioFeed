import React from "react";
import MyInput from "../../components/myInput/MyInput";
import { StyledButton } from "../../components/styledComponents";
import { AiFillEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdDelete, MdAdd, MdNotifications, MdNotificationsOff } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { BsExclude } from "react-icons/bs";
import Rules from "./Rules";
import MyModal from "../../components/mymodal/MyModal";
import styled from "styled-components";
import { askForBrowserNotificationPermission } from "../../utilities";
import Colors from "../../components/themes/Colors";
import {
	useFeedSections,
	useFeedSectionsDeleteFeedSection,
	useFeedSectionsEditFeedSection,
	useFeedSectionsToggleFeedSection,
} from "../../stores/twitch/feedSections";

const RightButton = styled(StyledButton)`
	width: 100%;
`;
const FeedSectionSettings = ({ section, width }) => {
	const feedSections = useFeedSections();
	const deleteFeedSection = useFeedSectionsDeleteFeedSection();
	const toggleFeedSection = useFeedSectionsToggleFeedSection();
	const editFeedSection = useFeedSectionsEditFeedSection();

	return (
		<MyInput
			edit={editFeedSection}
			width={width}
			onBlur={(value) => {
				if (value && section?.id && value !== section?.title) {
					editFeedSection(section.id, { title: value });
				}
			}}
			item={section}
			name={section.title}
			valid={(name) => {
				return (
					name &&
					(!Object.values(feedSections).find((l) => l?.title?.toLowerCase() === name?.toLowerCase()) ||
						Object.values(feedSections).find((l) => l?.title?.toLowerCase() === name?.toLowerCase() && parseInt(l.id) === parseInt(section.id)))
				);
			}}
			leftSide={<Rules rules={section.rules} name={section.title} id={section.id} />}
			rightSide={
				<>
					<MyModal
						trigger={<HiDotsVertical size={20} />}
						direction={"left"}
						style={{
							right: 0,
							background: "rgba(29, 29, 29, 0.88)",
							minWidth: "125px",
							marginTop: "5px",
						}}
						relative
						duration={350}
					>
						{/* {Object.values(feedSections).find((l) => parseInt(l.id) === parseInt(section.id)) && ( */}
						{section.id && (
							<>
								<RightButton type="button" onClick={() => toggleFeedSection(section.id, "enabled")}>
									{section.enabled ? <AiFillEye size={22} color="#ffffff" /> : <AiOutlineEyeInvisible size={22} color="rgb(150,150,150)" />}
									<span style={{ paddingLeft: "5px" }}>{section.enabled ? "Visible" : "Hidden"}</span>
								</RightButton>
								<RightButton type="button" onClick={() => toggleFeedSection(section.id, "sidebar_enabled")}>
									{section.sidebar_enabled ? <AiFillEye size={22} color="#ffffff" /> : <AiOutlineEyeInvisible size={22} color="rgb(150,150,150)" />}
									<span style={{ paddingLeft: "5px" }}>{section.sidebar_enabled ? "Sidebar visible" : "Sidebar hidden"}</span>
								</RightButton>

								<RightButton
									type="button"
									onClick={() => {
										askForBrowserNotificationPermission();
										toggleFeedSection(section.id, "notifications_enabled");
									}}
								>
									{section.notifications_enabled ? (
										<MdNotifications size={22} color="#ffffff" />
									) : (
										<MdNotificationsOff size={22} color="rgb(150,150,150)" />
									)}
									<span style={{ paddingLeft: "5px" }}>{section.notifications_enabled ? "Notis ON" : "Notis OFF"}</span>
								</RightButton>

								<RightButton
									type="button"
									onClick={() => {
										toggleFeedSection(section.id, "excludeFromTwitch_enabled");
									}}
								>
									{section.excludeFromTwitch_enabled ? <BsExclude size={22} color="#ffffff" /> : <BsExclude size={22} color="rgb(150,150,150)" />}
									<span style={{ paddingLeft: "5px" }}>{section.excludeFromTwitch_enabled ? "Excluding" : "Including"}</span>
								</RightButton>
							</>
						)}

						{section.id ? (
							<RightButton type="button" onClick={() => deleteFeedSection(section.id)}>
								<MdDelete size={22} color={Colors.red} />
								<span style={{ paddingLeft: "5px" }}>Delete</span>
							</RightButton>
						) : (
							<RightButton>
								<MdAdd size={22} color={Colors.green} />
								<span style={{ paddingLeft: "5px" }}>Add </span>
							</RightButton>
						)}
					</MyModal>
				</>
			}
		/>
	);
};
export default FeedSectionSettings;
