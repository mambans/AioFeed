import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { MdAddCircleOutline, MdRemoveCircleOutline } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";

import { Button } from "react-bootstrap";
import FetchRepoTagInfo from "./FetchRepoTagInfo";

const AddIcon = styled(MdAddCircleOutline).attrs({ size: 20 })`
  color: green;
`;
const RemoveIcon = styled(MdRemoveCircleOutline).attrs({ size: 20 })`
  color: red;
`;
const ChangeIcon = styled(FaExchangeAlt).attrs({ size: 20 })`
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
    }
    p {
      margin: 0;
    }
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
  Message: styled.p`
    font-size: 0.95rem;
    color: rgb(175, 175, 175);
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

export default ({ title, commitUrl, showInfo, children }) => {
  const [info, setInfo] = useState({ loading: false, data: null });

  const handleClick = useCallback(() => {
    setInfo({ loading: true });
    FetchRepoTagInfo(commitUrl).then((res) => {
      setInfo({ loading: false, data: res });
    });
  }, [commitUrl]);

  useEffect(() => {
    if (showInfo) {
      handleClick();
    }
  }, [showInfo, handleClick]);

  return (
    <List.Container>
      <List.Header>
        <List.Title>{title}</List.Title>
        {info.data && (
          <List.Date>{new Date(info.data.commit.committer.date).toLocaleDateString()}</List.Date>
        )}
      </List.Header>

      <List.Button
        size='sm'
        variant='dark'
        disabled={info.data}
        onClick={!info.data ? handleClick : null}>
        {info.loading ? "Loading" : "Info"}
      </List.Button>
      {info.data && (
        <div>
          <List.Message>{info.data.commit.message}</List.Message>
          {/* {info.commit.message.split(".").map((sentence) => {
            return <li>{sentence}</li>;
          })} */}
          <List.Items>{children}</List.Items>
          <List.Stats>
            {Object.keys(info.data.stats).map((key) => {
              return (
                <span key={key} id={key}>
                  {key}:{info.data.stats[key]}
                </span>
              );
            })}
          </List.Stats>
        </div>
      )}
    </List.Container>
  );
};
