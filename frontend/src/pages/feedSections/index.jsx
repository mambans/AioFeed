import React from "react";
import MyInput from "../../components/myInput/MyInput";
import SidebarExpandableSection from "../navigation/sidebar/SidebarExpandableSection";
import { StyledButton } from "../../components/styledComponents";
import ToolTip from "../../components/tooltip/ToolTip";
import { MdAdd } from "react-icons/md";
import Colors from "../../components/themes/Colors";
import FeedSectionSettings from "./FeedSectionSettings";
import { useFeedSections, useFeedSectionsCreateFeedSection } from "../../stores/twitch/feedSections";

const FeedSectionAdd = () => {
	const createFeedSection = useFeedSectionsCreateFeedSection();
	const feedSections = useFeedSections();

	return (
		<SidebarExpandableSection
			title="Feed Sections"
			items={Object.values(feedSections)}
			keyGetter={(item) => item.id}
			renderItem={(section, index) => <FeedSectionSettings section={section} />}
			fixedTopItem={
				<MyInput
					add={createFeedSection}
					valid={
						(name) => !name || (name && !Object.values(feedSections).find((section) => section.title.toLowerCase() === name.toLowerCase()))
						// name && !Object.values(lists).find((list) => name && list.name === name)
					}
					rightSide={
						<ToolTip delay={{ show: 500, hide: 0 }} toltip={`Add new list`}>
							<StyledButton>
								<MdAdd size={22} color={Colors.green} />
							</StyledButton>
						</ToolTip>
					}
				/>
			}
		/>
	);
};
export default FeedSectionAdd;
