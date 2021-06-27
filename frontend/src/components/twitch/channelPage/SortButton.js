import React, { useState } from 'react';
import { MdSort } from 'react-icons/md';

import { StyledSortButton, SortDropDownList } from './StyledComponents';
import { Link } from 'react-router-dom';

const SortButton = ({ sortBy, setSortBy, setData }) => {
  const [open, setOpen] = useState(false);
  const SortOptions = ['Time', 'Trending', 'Views'];

  return (
    <div>
      <StyledSortButton onClick={() => setOpen(!open)}>
        <MdSort size={30} />
        Sort by: {sortBy}
      </StyledSortButton>
      {open && (
        <SortDropDownList>
          {SortOptions.map((option) => (
            <Link
              to={`?type=vods&sort=${option}`}
              key={option}
              onClick={() => {
                setData();
                setSortBy(option);
                setOpen(false);
              }}
            >
              {option}
            </Link>
          ))}
        </SortDropDownList>
      )}
    </div>
  );
};
export default SortButton;
