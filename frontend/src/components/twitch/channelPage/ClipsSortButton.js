import React, { useState } from "react";
import { MdSort } from "react-icons/md";

import { SortButton, SortDropDownList } from "./StyledComponents";

export default ({ sortBy, setSortBy, setData, resetOldData }) => {
  const [open, setOpen] = useState(false);

  const SortOptionsNames = {
    "3": "3 days",
    "7": "1 week",
    "14": "2 weeks",
    "30": "1 month",
    "90": "3 months",
    "180": "6 months",
    "360": "1 year",
    null: "Lifetime",
  };

  return (
    <div style={{ marginLeft: "0px" }}>
      <SortButton
        title={`Fetch clips from the last ${SortOptionsNames[sortBy || "null"]}`}
        onClick={() => {
          setOpen(!open);
        }}>
        <MdSort size={30} />
        Within: {SortOptionsNames[sortBy || "null"]}
      </SortButton>
      {open && (
        <SortDropDownList>
          {Object.keys(SortOptionsNames).map((option) => {
            return (
              <li
                key={option}
                onClick={() => {
                  if (option !== sortBy && option !== "" + sortBy) {
                    setData();
                    if (resetOldData) resetOldData();
                    setSortBy(option === "null" ? null : option);
                    setOpen(false);
                  }
                }}>
                {SortOptionsNames[option]}
              </li>
            );
          })}
        </SortDropDownList>
      )}
    </div>
  );
};
