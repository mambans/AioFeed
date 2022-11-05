import React, { useState } from 'react';
import { MdContentCopy } from 'react-icons/md';

import { ListActionButton } from './StyledComponents';
import NewListForm from './addToListModal/NewListForm';

const CopyListBtn = ({ list, style, children }) => {
  const [open, setOpen] = useState();
  const copyList = async () => setOpen((c) => !c);

  return (
    <>
      <ListActionButton onClick={copyList} style={{ ...style }} color={'rgb(255, 255, 0)'}>
        <MdContentCopy size={20}></MdContentCopy>
        {children || 'Copy'}
      </ListActionButton>

      {open && <NewListForm item={list.videos} />}
    </>
  );
};

export default CopyListBtn;
