import React, { useContext } from 'react';
import MyInput from '../../components/myInput/MyInput';
import SidebarExpandableSection from '../navigation/sidebar/SidebarExpandableSection';
import { StyledButton } from '../../components/styledComponents';
import ToolTip from '../../components/tooltip/ToolTip';
import FeedSectionsContext from './FeedSectionsContext';
import { MdAdd } from 'react-icons/md';
import Colors from '../../components/themes/Colors';
import { useRecoilValue } from 'recoil';
import { feedSectionsAtom } from '../twitch/atoms';
import FeedSectionSettings from './FeedSectionSettings';

const FeedSectionAdd = () => {
  const { createFeedSection } = useContext(FeedSectionsContext);
  const feedSections = useRecoilValue(feedSectionsAtom);

  return (
    <SidebarExpandableSection
      title='Feed Sections'
      items={Object.values(feedSections)}
      keyGetter={(item) => item.id}
      renderItem={(section, index) => <FeedSectionSettings section={section} />}
      fixedTopItem={
        <MyInput
          add={createFeedSection}
          valid={
            (name) =>
              !name ||
              (name &&
                !Object.values(feedSections).find(
                  (section) => section.title.toLowerCase() === name.toLowerCase()
                ))
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
