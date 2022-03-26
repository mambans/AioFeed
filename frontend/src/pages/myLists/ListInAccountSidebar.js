import React, { useContext } from 'react';
import MyInput from '../../components/myInput/MyInput';
import SidebarExpandableSection from '../navigation/sidebar/SidebarExpandableSection';
import { StyledButton } from '../../components/styledComponents';
import ToolTip from '../../components/tooltip/ToolTip';
import MyListsContext from './MyListsContext';
import { AiFillEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { MdDelete, MdAdd } from 'react-icons/md';
import Colors from '../../components/themes/Colors';

const ListInAccountSidebar = () => {
  const { lists, addList, toggleList, editListName, deleteList, checkIfListNameIsAvaliable } =
    useContext(MyListsContext);

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
          valid={(name) =>
            checkIfListNameIsAvaliable(name) ||
            Object.values(lists).find(
              (l) =>
                l?.title?.toLowerCase() === name?.toLowerCase() &&
                parseInt(l.id) === parseInt(list.id)
            )
          }
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
                    <MdDelete size={22} color={Colors.red} />
                  </StyledButton>
                ) : (
                  <StyledButton>
                    <MdAdd size={22} color={Colors.green} />
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
          valid={checkIfListNameIsAvaliable}
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
export default ListInAccountSidebar;
