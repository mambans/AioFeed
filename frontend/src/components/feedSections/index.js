import React, { useContext } from 'react';
import MyInput from '../MyInput';
import SidebarExpandableSection from '../navigation/sidebar/SidebarExpandableSection';
import { StyledButton } from '../navigation/sidebar/UpdateTwitterLists';
import ToolTip from '../sharedComponents/ToolTip';
import FeedSectionsContext from './FeedSectionsContext';
import { AiFillEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { MdDelete, MdAdd } from 'react-icons/md';
import Rules from './Rules';
import NavigationContext from '../navigation/NavigationContext';

const FeedSectionAdd = () => {
  const {
    createFeedSection,
    deleteFeedSection,
    toggleFeedSection,
    feedSections,
    editFeedSectionTitle,
  } = useContext(FeedSectionsContext);

  const { setOverflow } = useContext(NavigationContext);

  return (
    <SidebarExpandableSection
      title='Feed Sections'
      items={Object.values(feedSections)}
      keyGetter={(item) => item.id}
      // renderItem={(section, index, setOverflow) => (
      //   <FeedSectionNameInList section={section} setOverflow={setOverflow} />
      // )}
      // fixedTopItem={<FeedSectionNameInList style={{ marginTop: '10px' }} />}
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
              {Object.values(feedSections).find((l) => parseInt(l.id) === parseInt(section.id)) && (
                <ToolTip
                  delay={{ show: 500, hide: 0 }}
                  toltip={`${section.enabled ? `Disable feed` : `Enable feed`}`}
                >
                  <StyledButton type='button' onClick={() => toggleFeedSection(section.id)}>
                    {section.enabled ? (
                      <AiFillEye size={22} color='#ffffff' />
                    ) : (
                      <AiOutlineEyeInvisible size={22} color='rgb(150,150,150)' />
                    )}
                  </StyledButton>
                </ToolTip>
              )}
              <ToolTip
                delay={{ show: 500, hide: 0 }}
                toltip={`${section.id ? `Remove list` : `Add new list`}`}
              >
                {section.id ? (
                  <StyledButton type='button' onClick={() => deleteFeedSection(section.id)}>
                    <MdDelete size={22} color='rgb(200,0,0)' />
                  </StyledButton>
                ) : (
                  <StyledButton>
                    <MdAdd size={22} color='rgb(0,230,0)' />
                  </StyledButton>
                )}
              </ToolTip>
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
