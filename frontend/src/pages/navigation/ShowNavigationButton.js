import React, { useContext } from 'react';
import { StyledShowNavbarBtn } from '../twitch/player/StyledComponents';
import NavigationContext from './NavigationContext';
import { MdVerticalAlignBottom } from 'react-icons/md';

const ShowNavigationButton = ({ text }) => {
  const { visible, setVisible } = useContext(NavigationContext);

  const handleOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible((c) => !c);
  };

  return (
    <StyledShowNavbarBtn onClick={handleOnClick}>
      <MdVerticalAlignBottom
        style={{
          transform: visible ? 'rotateX(180deg)' : 'unset',
          right: '10px',
        }}
        size={26}
        title='Show navbar'
      />
      {text}
    </StyledShowNavbarBtn>
  );
};
export default ShowNavigationButton;
