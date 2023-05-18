import React, { useContext } from 'react';
import { MdAdd } from 'react-icons/md';

import MyListsContext from '../MyListsContext';
import MyInput from '../../../components/myInput/MyInput';
import ToolTip from '../../../components/tooltip/ToolTip';
import { StyledButton } from '../../../components/styledComponents';
import Colors from '../../../components/themes/Colors';

const NewListForm = ({ item, style } = {}) => {
  const { addList, checkIfListNameIsAvaliable } = useContext(MyListsContext) || {};

  return (
    <MyInput
      add={(name) => addList(name, item)}
      valid={checkIfListNameIsAvaliable}
      rightSide={
        <ToolTip delay={{ show: 500, hide: 0 }} toltip={`Add new list`}>
          <StyledButton>
            <MdAdd size={22} color={Colors.green} />
          </StyledButton>
        </ToolTip>
      }
      error={'List already exists'}
      style={{ display: 'flex', alignItems: 'center' }}
      placeholder='New list..'
    />
  );
};

export default NewListForm;
