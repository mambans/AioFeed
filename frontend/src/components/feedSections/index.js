import React, { useContext, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ToggleButtonsContainerHeader } from '../navigation/sidebar/StyledComponents';
import FeedSectionNameInList from './FeedSectionNameInList';
import { MdExpandMore } from 'react-icons/md';
import { ExpandSection } from './../sharedComponents/sharedStyledComponents';
import FeedSectionsContext from './FeedSectionsContext';

const FeedSectionAdd = () => {
  const { feedSections } = useContext(FeedSectionsContext);
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <ToggleButtonsContainerHeader expanded={expanded} onClick={() => setExpanded((c) => !c)}>
        Feed Sections
        <MdExpandMore />
      </ToggleButtonsContainerHeader>
      <ExpandSection
        height={60 + Object.values(feedSections).length * 60}
        expanded={String(expanded)}
      >
        <FeedSectionNameInList />
        <TransitionGroup component={null}>
          {Object.values(feedSections)?.map((section, index) => (
            <CSSTransition classNames='ListForm' key={section.name} timeout={500} unmountOnExit>
              <FeedSectionNameInList section={section} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ExpandSection>
    </div>
  );
};
export default FeedSectionAdd;
