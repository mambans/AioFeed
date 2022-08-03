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
          transition: 'transform 250ms',
          transform: visible ? 'rotateX(180deg)' : 'unset',
          right: '10px',
        }}
        size={26}
        title='Toggle navbar'
      />
      {text}
    </Button>
  );
};
export default ShowNavigationButton;
