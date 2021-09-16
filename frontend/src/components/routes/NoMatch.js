import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

import './NoMatch.scss';

const NoMatch = () => {
  useDocumentTitle('404 Error');

  return (
    <section className='error-container'>
      <div>
        <span className='four'>
          <span className='screen-reader-text'></span>
        </span>
        <span className='zero'>
          <span className='screen-reader-text'></span>
        </span>
        <span className='four'>
          <span className='screen-reader-text'></span>
        </span>
      </div>
      <div className='text'>
        <span className='text'>Page n</span>
        <span className='zero'>o</span>
        <span className='text'>t f</span>
        <span className='zero'>o</span>
        <span className='text'>und</span>
      </div>
    </section>
  );
};

export default NoMatch;
