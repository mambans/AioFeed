import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { MdAddCircleOutline, MdRemoveCircleOutline } from 'react-icons/md';
import { FaExchangeAlt } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

const AddIcon = styled(MdAddCircleOutline).attrs({ size: 16 })`
  color: green;
`;
const RemoveIcon = styled(MdRemoveCircleOutline).attrs({ size: 16 })`
  color: red;
`;
const ChangeIcon = styled(FaExchangeAlt).attrs({ size: 16 })`
  color: blue;
`;

const List = {
  Container: styled.div`
    margin-bottom: 2.5rem;
  `,
  Header: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  Title: styled.h4``,
  Date: styled.span`
    font-size: 0.85rem;
    color: rgb(175, 175, 175);
  `,
  Items: styled.ul`
    padding-left: 0.2rem;
    margin: 0;
  `,
  Item: styled.li`
    list-style-type: none;
    display: flex;
    align-items: center;
    font-size: 0.95rem;
    svg {
      margin-right: 10px;
      min-width: 16px;
      min-height: 16px;
    }
    p {
      margin: 0;
    }
  `,
  Group: styled.div`
    padding: 5px 0;
    color: rgb(220, 220, 220);
  `,
  Add: ({ children }) => {
    return (
      <List.Item>
        <AddIcon />
        <p>{children}</p>
      </List.Item>
    );
  },
  Remove: ({ children }) => {
    return (
      <List.Item>
        <RemoveIcon />
        <p>{children}</p>
      </List.Item>
    );
  },
  Change: ({ children }) => {
    return (
      <List.Item>
        <ChangeIcon />
        <p>{children}</p>
      </List.Item>
    );
  },
  Button: styled(Button)`
    padding: 0.25rem 0.375rem;
  `,
  Message: styled.pre`
    font-size: 0.95rem;
    color: rgb(175, 175, 175);
    white-space: pre-wrap;
  `,
  Stats: styled.div`
    display: flex;
    justify-content: space-between;

    #total {
      color: rgb(80, 80, 80);
    }

    #additions {
      color: rgb(0, 80, 0);
    }

    #deletions {
      color: rgb(80, 0, 0);
    }
  `,
};

export default ({ name, body, published_at, showInfo, children }) => {
  const [info, setInfo] = useState({ loading: false, data: null });
  const [showFullMessage, setShowFullMessage] = useState(false);
  const additionsKeywords = useMemo(() => ['added', 'fixed'], []);
  const deletionsKeywords = useMemo(() => ['removed', 'deleted'], []);
  const changesKeywords = useMemo(
    () => [
      'changed',
      'refactored',
      'restyled',
      'moved',
      'renamed',
      'changes',
      'improved',
      'increased',
      'fixed/added',
      'added/fixed',
      'split',
      'extracted',
    ],
    []
  );

  const handleClick = useCallback(() => {
    setInfo({ loading: true });

    if (body) {
      let additions = [];
      let deletions = [];
      let changes = [];
      let rest = [];

      body.split(/(?:\r\n|\. )/g).map((sentence) => {
        const sentArray = sentence?.toLowerCase().split(' ');
        if (sentArray.some((word) => additionsKeywords.includes(word))) {
          if (sentence.length > 0) additions.push(sentence);
        } else if (sentArray.some((word) => deletionsKeywords.includes(word))) {
          if (sentence.length > 0) deletions.push(sentence);
        } else if (sentArray.some((word) => changesKeywords.includes(word))) {
          if (sentence.length > 0) changes.push(sentence);
        } else {
          if (sentence.length > 0) rest.push(sentence);
        }

        return '';
      });

      setInfo({
        loading: false,
        data: body,
        date: published_at,
        additions: additions,
        deletions: deletions,
        changes: changes,
        rest: rest,
      });
    }
  }, [body, published_at, additionsKeywords, deletionsKeywords, changesKeywords]);

  useEffect(() => showInfo && handleClick(), [showInfo, handleClick]);

  return (
    <List.Container>
      <List.Header>
        <List.Title>{name}</List.Title>
        {info.data && <List.Date>{new Date(info.date).toLocaleDateString()}</List.Date>}
      </List.Header>

      <List.Button
        size='sm'
        variant='dark'
        disabled={info.data}
        onClick={!info.data ? handleClick : null}
      >
        {info.loading ? 'Loading' : 'Info'}
      </List.Button>
      {info.additions && (
        <List.Group>
          {info.additions.map((sent) => {
            return <List.Add key={sent}>{sent}</List.Add>;
          })}
        </List.Group>
      )}
      {info.deletions && (
        <List.Group>
          {info.deletions.map((sent) => {
            return <List.Remove key={sent}>{sent}</List.Remove>;
          })}
        </List.Group>
      )}
      {info.changes && (
        <List.Group>
          {info.changes.map((sent) => {
            return <List.Change key={sent}>{sent}</List.Change>;
          })}
        </List.Group>
      )}
      {info.rest && (
        <List.Group>
          {info.rest.map((sent) => {
            return <List.Item key={sent}>{sent}</List.Item>;
          })}
        </List.Group>
      )}
      {info.data && (
        <List.Button
          size='sm'
          variant='dark'
          onClick={() => {
            if (info.data) setShowFullMessage(!showFullMessage);
          }}
        >
          Full message
        </List.Button>
      )}
      {info.data && (
        <div>
          {showFullMessage && <List.Message>{info.data}</List.Message>}
          <List.Items>{children}</List.Items>
        </div>
      )}
    </List.Container>
  );
};
