import React, { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import FeedsContext from '../../feed/FeedsContext';
import UpdateTwitterLists from './UpdateTwitterLists';

const TwitterForms = () => {
  const { twitterLists } = useContext(FeedsContext);

  return (
    <TransitionGroup component={null}>
      {twitterLists?.map((id, index) => (
        <CSSTransition classNames='ListForm' key={id} timeout={500} unmountOnExit>
          <UpdateTwitterLists key={id} id={id} index={index} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

export default TwitterForms;
