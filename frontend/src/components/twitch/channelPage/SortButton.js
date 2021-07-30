import React, { useRef, useState } from 'react';
import { MdSort } from 'react-icons/md';

import { StyledSortButton, SortDropDownList } from './StyledComponents';
import { Link } from 'react-router-dom';
import useClicksOutside from '../../../hooks/useClicksOutside';

const SortButton = ({ sortBy, setSortBy, setData }) => {
  const [open, setOpen] = useState(false);
  const SortOptions = ['Time', 'Trending', 'Views'];
  const triggerRef = useRef();
  const dropdownRef = useRef();

  useClicksOutside([triggerRef, dropdownRef], () => setOpen(false), open);

  return (
    <div>
      <StyledSortButton onClick={() => setOpen(!open)} ref={triggerRef}>
        <MdSort size={30} />
        Sort by: {sortBy}
      </StyledSortButton>
      {open && (
        <SortDropDownList ref={dropdownRef}>
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
