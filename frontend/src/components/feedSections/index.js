import React, { useContext } from 'react';
import SidebarExpandableSection from '../navigation/sidebar/SidebarExpandableSection';
import FeedSectionNameInList from './FeedSectionNameInList';
import FeedSectionsContext from './FeedSectionsContext';

const FeedSectionAdd = () => {
  const { feedSections } = useContext(FeedSectionsContext);

  return (
    <SidebarExpandableSection
      title='Feed Sections'
      items={Object.values(feedSections)}
      renderItem={(section, index, setOverflow) => (
        <FeedSectionNameInList section={section} setOverflow={setOverflow} />
      )}
      keyGetter={(item) => item.name}
      fixedTopItem={<FeedSectionNameInList style={{ marginTop: '10px' }} />}
    />
  );
};
export default FeedSectionAdd;
