import React from "react";

import "./NoMatch.scss";

export default () => {
  document.title = "AioFeed | 404 Error";

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
