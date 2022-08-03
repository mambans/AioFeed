import React, { useContext } from 'react';
import NavigationContext from './NavigationContext';
import { MdVerticalAlignBottom } from 'react-icons/md';
import Button from '../../components/Button';

const ShowNavigationButton = ({ text }) => {
  const { visible, setVisible } = useContext(NavigationContext);

  const handleOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible((c) => !c);
  };

  return (
    <Button onClick={handleOnClick}>
      <MdVerticalAlignBottom
        style={{
          transform: visible ? 'rotateX(180deg)' : 'unset',
          right: '10px',
        }}
        size={26}
        title='Show navbar'
      />
      {text}
    </Button>
  );
};
export default ShowNavigationButton;
