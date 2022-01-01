import React, { useContext } from 'react';
import MyInput from '../../components/myInput/MyInput';
import SidebarExpandableSection from '../navigation/sidebar/SidebarExpandableSection';
import { StyledButton } from '../../components/styledComponents';
import ToolTip from '../../components/tooltip/ToolTip';
import FeedSectionsContext from './FeedSectionsContext';
import { AiFillEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { MdDelete, MdAdd, MdNotifications, MdNotificationsOff } from 'react-icons/md';
import { HiDotsVertical } from 'react-icons/hi';
import Rules from './Rules';
import NavigationContext from '../navigation/NavigationContext';
import MyModal from '../../components/mymodal/MyModal';
import styled from 'styled-components';

const RightButton = styled(StyledButton)`
  width: 100%;
`;

const FeedSectionAdd = () => {
  const {
    createFeedSection,
    deleteFeedSection,
    toggleFeedSection,
    feedSections,
    editFeedSectionTitle,
    toggleFeedSectionNotification,
  } = useContext(FeedSectionsContext);

  const { setOverflow } = useContext(NavigationContext);

  return (
    <SidebarExpandableSection
      title='Feed Sections'
      items={Object.values(feedSections)}
      keyGetter={(item) => item.id}
      renderItem={(section, index) => (
        <MyInput
          edit={editFeedSectionTitle}
          item={section}
          name={section.title}
          valid={(name) => {
            return (
              name &&
              (!Object.values(feedSections).find(
                (l) => l?.title?.toLowerCase() === name?.toLowerCase()
              ) ||
                Object.values(feedSections).find(
                  (l) =>
                    l?.title?.toLowerCase() === name?.toLowerCase() &&
                    parseInt(l.id) === parseInt(section.id)
                ))
            );
          }}
          leftSide={
            <Rules
              rules={section.rules}
              name={section.title}
              setOverflow={setOverflow}
              id={section.id}
            />
          }
          rightSide={
            <>
              <MyModal
                trigger={<HiDotsVertical size={20} />}
                direction={'left'}
                // onClick={() => setOverflow('visible')}
                // onClose={() => setOverflow(null)}
                style={{
                  right: 0,
                  background: 'rgba(29, 29, 29, 0.88)',
                  minWidth: '125px',
                  marginTop: '5px',
                }}
                relative
                duration={350}
              >
                {/* {Object.values(feedSections).find((l) => parseInt(l.id) === parseInt(section.id)) && ( */}
                {section.id && (
                  <RightButton type='button' onClick={() => toggleFeedSection(section.id)}>
                    {section.enabled ? (
                      <AiFillEye size={22} color='#ffffff' />
                    ) : (
                      <AiOutlineEyeInvisible size={22} color='rgb(150,150,150)' />
                    )}
                    <span style={{ paddingLeft: '5px' }}>
                      {section.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </RightButton>
                )}
                {section.id && (
                  <RightButton
                    type='button'
                    onClick={() => toggleFeedSectionNotification(section.id)}
                  >
                    {section.notifications_enabled ? (
                      <MdNotifications size={22} color='#ffffff' />
                    ) : (
                      <MdNotificationsOff size={22} color='rgb(150,150,150)' />
                    )}
                    <span style={{ paddingLeft: '5px' }}>
                      {section.notifications_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </RightButton>
                )}

                {section.id ? (
                  <RightButton type='button' onClick={() => deleteFeedSection(section.id)}>
                    <MdDelete size={22} color='rgb(200,0,0)' />
                    <span style={{ paddingLeft: '5px' }}>Delete</span>
                  </RightButton>
                ) : (
                  <RightButton>
                    <MdAdd size={22} color='rgb(0,230,0)' />
                    <span style={{ paddingLeft: '5px' }}>Add </span>
                  </RightButton>
                )}
              </MyModal>
            </>
          }
        />
      )}
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
                <MdAdd size={22} color='rgb(0,230,0)' />
              </StyledButton>
            </ToolTip>
          }
        />
      }
    />
  );
};
export default FeedSectionAdd;
