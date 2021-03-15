import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';

import { getCookie } from '../../util/Utils';
import { DeleteListButton } from './StyledComponents';

export default ({ list, setLists, style }) => {
  const deleteList = async () => {
    const confirmed = window.confirm(`Delete list ${list.name}?`);
    if (!confirmed) return false;

    setLists((curr) => {
      const orginialList = { ...curr };
      const name = Object.keys(orginialList).find((key) => orginialList[key].name === list.name);
      delete orginialList[name];

      return orginialList;
    });

    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/savedlists/delete`, {
        username: getCookie('AioFeed_AccountName'),
        listName: list.name,
      })
      .catch((e) => console.error(e));
  };

  return (
    <OverlayTrigger
      key={'delete ' + list.name}
      placement={'left'}
      delay={{ show: 500, hide: 0 }}
      overlay={<Tooltip id={`tooltip-${'left'}`}>{`Delete "${list.name}" list`}</Tooltip>}
    >
      <DeleteListButton onClick={deleteList} size={26} style={{ ...style }} />
    </OverlayTrigger>
  );
};
