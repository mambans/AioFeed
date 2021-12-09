import React, { useContext } from 'react';
import { MdAdd } from 'react-icons/md';

import MyListsContext from '../MyListsContext';
import MyInput from '../../MyInput';
import ToolTip from '../../sharedComponents/ToolTip';
import { StyledButton } from '../../navigation/sidebar/UpdateTwitterLists';

const NewListForm = ({ item, style } = {}) => {
  const { addList, checkIfListNameIsAvaliable } = useContext(MyListsContext) || {};

  return (
    <MyInput
      add={(name) => addList(name, item)}
      valid={checkIfListNameIsAvaliable}
      rightSide={
        <ToolTip delay={{ show: 500, hide: 0 }} toltip={`Add new list`}>
          <StyledButton>
            <MdAdd size={22} color='rgb(0,230,0)' />
          </StyledButton>
        </ToolTip>
      }
      error={'List already exists'}
    />
  );
};

export default NewListForm;
