import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';

import { getCookie } from '../../util/Utils';
import { DeleteListButton } from './StyledComponents';

export default ({ list, setLists }) => {
  const deleteList = async () => {
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
      .then((res) => {
        console.log('res', res);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <OverlayTrigger
      key={'delete ' + list.name}
      placement={'left'}
      delay={{ show: 500, hide: 0 }}
      overlay={<Tooltip id={`tooltip-${'left'}`}>{`Delete "${list.name}" list`}</Tooltip>}
    >
      <DeleteListButton onClick={deleteList} size={20} />
    </OverlayTrigger>
  );
};
