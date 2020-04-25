import React, { useContext } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import styled from "styled-components";

import useInput from "./../../../hooks/useInput";
import Util from "../../../util/Util";
import FeedsContext from "../../feed/FeedsContext";
import AccountContext from "../../account/AccountContext";
import { RemoveCookie, AddCookie } from "../../../util/Utils";

const StyledForm = styled(Form)`
  input {
    color: rgb(150, 150, 150);
    background-color: transparent;
    border: none;
    padding: 0.1875rem 0.75rem;
    height: calc(1.5em + 0.5rem + 0px);
    border-bottom: 1px solid #ffffff;
    border-radius: 0;
  }
`;

export default ({ style }) => {
  const { enableTwitter, setTwitterListName } = useContext(FeedsContext);
  const { username } = useContext(AccountContext);
  const { value: listName, bind: bindListName } = useInput(
    Util.getCookie("Twitter-Listname") || ""
  );

  const addList = async () => {
    AddCookie("Twitter-Listname", listName);
    setTwitterListName(listName);

    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/account/update`, {
        username: username,
        columnValue: listName,
        columnName: "TwitterListId",
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const clearListId = async () => {
    RemoveCookie("Twitter-Listname");
    setTwitterListName(false);
    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/account/update`, {
        username: username,
        columnValue: "null",
        columnName: "TwitterListId",
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (listName !== Util.getCookie("Twitter-Listname")) {
      addList();
    }
  };

  if (enableTwitter) {
    return (
      <StyledForm onSubmit={handleSubmit} style={{ ...style }}>
        <Form.Group controlId='formGroupListName'>
          <Form.Label
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Twitter list id
            <Button variant='secondary' style={{ padding: "0.3rem 0.5rem" }} onClick={clearListId}>
              Clear
            </Button>
          </Form.Label>
          <div style={{ display: "flex" }}>
            <Form.Control
              type='text'
              placeholder='674523...'
              name='listName'
              required
              // isInvalid={!listName}
              {...bindListName}
            />
            {/* <Form.Control.Feedback type='invalid'>Enter</Form.Control.Feedback> */}
            <Button
              type='submit'
              variant='secondary'
              style={{ padding: "0.3rem 0.5rem", marginLeft: "10px", minWidth: "53px" }}>
              Add
            </Button>
          </div>
        </Form.Group>
      </StyledForm>
    );
  } else {
    return null;
  }
};
