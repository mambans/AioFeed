import React, { useState } from 'react';
import { MdSort } from 'react-icons/md';

import { SortButton, SortDropDownList } from './StyledComponents';
import { Link } from 'react-router-dom';

export default ({ sortBy, setSortBy, setData }) => {
  const [open, setOpen] = useState(false);
  const SortOptions = ['Time', 'Trending', 'Views'];

  return (
    <div>
      <SortButton onClick={() => setOpen(!open)}>
        <MdSort size={30} />
        Sort by: {sortBy}
      </SortButton>
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
