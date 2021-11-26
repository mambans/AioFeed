import React, { useContext } from 'react';
import MyInput from '../MyInput';
import SidebarExpandableSection from '../navigation/sidebar/SidebarExpandableSection';
import { StyledButton } from '../navigation/sidebar/UpdateTwitterLists';
import ToolTip from '../sharedComponents/ToolTip';
import MyListsContext from './MyListsContext';
import { AiFillEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { MdDelete, MdAdd } from 'react-icons/md';

const ListInAccountSidebar = () => {
  const { lists, addList, toggleList, editListName, deleteList } = useContext(MyListsContext);

  return (
    <SidebarExpandableSection
      title='Mylists'
      items={Object.values(lists)}
      keyGetter={({ id }) => id}
      renderItem={(list, index) => (
        <MyInput
          edit={editListName}
          item={list}
          name={list.title}
          valid={(name) => {
            return (
              name &&
              (!Object.values(lists).find((l) => l?.title?.toLowerCase() === name?.toLowerCase()) ||
                Object.values(lists).find(
                  (l) =>
                    l?.title?.toLowerCase() === name?.toLowerCase() &&
                    parseInt(l.id) === parseInt(list.id)
                ))
            );
          }}
          rightSide={
            <>
              {Object.values(lists).find((l) => parseInt(l.id) === parseInt(list.id)) && (
                <ToolTip
                  delay={{ show: 500, hide: 0 }}
                  toltip={`${list.enabled ? `Disable feed` : `Enable feed`}`}
                >
                  <StyledButton type='button' onClick={() => toggleList(list.id)}>
                    {list.enabled ? (
                      <AiFillEye size={22} color='#ffffff' />
                    ) : (
                      <AiOutlineEyeInvisible size={22} color='rgb(150,150,150)' />
                    )}
                  </StyledButton>
                </ToolTip>
              )}
              <ToolTip
                delay={{ show: 500, hide: 0 }}
                toltip={`${list.id ? `Remove list` : `Add new list`}`}
              >
                {list.id ? (
                  <StyledButton type='button' onClick={() => deleteList({ id: list.id })}>
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
          add={addList}
          valid={
            (name) =>
              !name ||
              (name &&
                !Object.values(lists).find(
                  (list) => list.title.toLowerCase() === name.toLowerCase()
                ))
            // name && !Object.values(lists).find((list) => name && list.name === name)
          }
        />
      }
    />
  );
};
export default ListInAccountSidebar;
