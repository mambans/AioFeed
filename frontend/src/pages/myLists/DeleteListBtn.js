import React, { useContext } from 'react';
import { MdDeleteForever } from 'react-icons/md';

import { ListActionButton } from './StyledComponents';
import MyListsContext from './MyListsContext';

const DeleteListBtn = ({ list, style, children }) => {
  const { deleteList } = useContext(MyListsContext);

  return (
    <ListActionButton onClick={() => deleteList(list)} style={{ ...style, marginLeft: '-3px' }}>
      <MdDeleteForever size={24} />
      {children || 'Delete'}
    </ListActionButton>
  );
};

export default DeleteListBtn;
