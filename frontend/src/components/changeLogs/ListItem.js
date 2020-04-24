import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { MdAddCircleOutline, MdRemoveCircleOutline } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";

import { Button } from "react-bootstrap";
import FetchRepoTagInfo from "./FetchRepoTagInfo";

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
  const [showFullMessage, setShowFullMessage] = useState(false);

  const handleClick = useCallback(() => {
    setInfo({ loading: true });
    FetchRepoTagInfo(commitUrl).then((res) => {
      let additions = [];
      let deletions = [];
      let changes = [];
      let rest = [];

      // "Added something todate.\\Removed anoher tomorrow but toeday.\\Changed that one thing you told me to change.\\Add nabbar to that.\\Dont dio that but asd."
      res.commit.message.split("\n").map((sentence) => {
        const sentArray = sentence.toLowerCase().split(" ");
        if (
          sentArray.includes("added") ||
          sentArray.includes("add") ||
          sentArray.includes("fix") ||
          sentArray.includes("fixed")
        ) {
          additions.push(sentence);
        } else if (
          sentArray.includes("removed") ||
          sentArray.includes("remove") ||
          sentArray.includes("deleted") ||
          sentArray.includes("delete")
        ) {
          deletions.push(sentence);
        } else if (
          sentArray.includes("changed") ||
          sentArray.includes("change") ||
          sentArray.includes("refactored") ||
          sentArray.includes("refactor") ||
          sentArray.includes("moved") ||
          sentArray.includes("move") ||
          sentArray.includes("renamed") ||
          sentArray.includes("rename")
        ) {
          changes.push(sentence);
        } else {
          rest.push(sentence);
        }

        return "";
      });

      setInfo({
        loading: false,
        data: res,
        additions: additions,
        deletions: deletions,
        changes: changes,
        rest: rest,
      });
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
          onClick={
            info.data
              ? () => {
                  console.log(info.data.commit.message);
                  setShowFullMessage(!showFullMessage);
                }
              : null
          }>
          Full message
        </List.Button>
      )}
      {info.data && (
        <div>
          {showFullMessage && <List.Message>{info.data.commit.message}</List.Message>}
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
