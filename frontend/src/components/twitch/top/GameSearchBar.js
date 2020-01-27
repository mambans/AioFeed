import React, { useState } from "react";
import { Redirect } from "react-router-dom";

const GameSearchBar = props => {
  const { gameName } = props;
  const [redirect, setRedirect] = useState(false);
  const useInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(""),
      bind: {
        value,
        onChange: event => {
          setValue(event.target.value);
        },
      },
    };
  };

  //eslint-disable-next-line
  const { value: game, bind: bindGame, reset: resetGame } = useInput("");

  const handleSubmit = evt => {
    evt.preventDefault();
    setRedirect(true);
    // resetGame();
  };

  return (
    <>
      {redirect ? <Redirect to={"/twitch/top/" + game} /> : null}
      <form
        onSubmit={handleSubmit}
        style={{
          marginRight: "25px",
          padding: "0.5rem 0.75rem",
          background: "var(--refreshButtonBackground)",
          boxShadow: "var(--refreshButtonShadow)",
          border: "thin solid rgb(47, 47, 47)",
          borderRadius: "5px",
          width: "250px",
        }}>
        <input
          style={{
            color: "var(--refreshButtonColor)",
            background: "transparent",
            border: "none",
            borderRadius: "5px",
            textOverflow: "ellipsis",
          }}
          type='text'
          placeholder={(gameName !== "" && gameName !== undefined ? gameName : "All") + "..."}
          {...bindGame}></input>
      </form>
    </>
  );
};

export default GameSearchBar;
