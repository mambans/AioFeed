import React, { useMemo } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Header, { HeaderNumberCount } from "../../components/Header";
import { Container } from "../twitch/StyledComponents";
import TwitchStreams from "./../twitch/live/Twitch";
import { BsCollectionFill } from "react-icons/bs";
import { ExpandCollapseFeedButton } from "../sharedComponents/sharedStyledComponents";
import ExpandableSection from "../../components/expandableSection/ExpandableSection";
import Colors from "../../components/themes/Colors";
import FeedSectionSettings from "./FeedSectionSettings";
import useStreamsStore from "../../stores/twitch/streams/useStreamsStore";
import { checkAgainstRules } from "./utilities";
import { useFeedSections } from "../../stores/twitch/feedSections";
import { useToggleFeedPreference, useFeedPreferences } from "../../stores/feedPreference";

const FeedSections = ({ data }) => {
	const feedSections = useFeedSections();

	return (
		<TransitionGroup component={null}>
			{Object.values(feedSections)
				.reduce((acc, feedSection) => {
					if (!feedSection.enabled) return acc;
					return [...acc, { ...feedSection }];
				}, [])
				?.map((section, index) => (
					<CSSTransition key={section.id} timeout={1000} classNames="listHorizontalSlide" unmountOnExit appear>
						<Section key={section.id} section={section} index={index} data={data} />
					</CSSTransition>
				))}
		</TransitionGroup>
	);
};

const Section = ({ section, data, index }) => {
	const { title, id } = section;
	const togglePreference = useToggleFeedPreference();
	const feedPreferences = useFeedPreferences();

	const baseStreams = useStreamsStore((state) => state.livestreams);

	const feedSectionStreams = useMemo(() => baseStreams?.filter((stream) => checkAgainstRules(stream, section.rules)), [baseStreams, section.rules]);

	if (!feedSectionStreams?.length) return null;

	return (
		<Container aria-labelledby={`FeedSection-${id}`} order={feedPreferences?.[id]?.order || 500} key={`FeedSection-${id}`} id={`FeedSection-${id}`}>
			<Header
				{...data}
				isLoading={data.loading}
				id={title}
				title={
					<h1 id={`FeedSection-${id}`} onClick={() => togglePreference(id, "collapsed")}>
						{title}
						<HeaderNumberCount text={feedSectionStreams?.length} />
						<BsCollectionFill size={22} color={Colors.raspberry} />
						<ExpandCollapseFeedButton collapsed={feedPreferences?.[id]?.collapsed} />
					</h1>
				}
				rightSide={<FeedSectionSettings section={section} width={290} />}
			/>
			<ExpandableSection collapsed={feedPreferences?.[id]?.collapsed}>
				<TwitchStreams data={data} streams={feedSectionStreams} hideOnEmpty />
				{/* <Container>
          {data.vods?.slice(0, videoElementsAmount).map((vod) => (
            <CSSTransition
              in={true}
              key={vod.id}
              timeout={750}
              classNames={'fade-750ms'}
              unmountOnExit
            >
              <VodElement data={vod} />
            </CSSTransition>
          ))}
        </Container> */}
			</ExpandableSection>
		</Container>
	);
};
export default FeedSections;
