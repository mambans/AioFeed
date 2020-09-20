import React from 'react';

import { Banner, Name, BannerInfoOverlay } from './StyledComponents';

export default () => {
  return (
    <Banner>
      <BannerInfoOverlay
        style={{
          backgroundColor: 'var(--navigationbarBackground)',
          width: 'calc(100% - 60px)',
          margin: 'auto',
          borderRadius: '15px',
        }}
      >
        <Name>
          <div id='HeaderChannelInfo'>
            <div id='ChannelName'>
              <div id='placeholderProfileImgCircle' />
              <div
                id='PlaceholderSmallText'
                style={{
                  marginBottom: '1rem',
                  width: '45%',
                  height: '35px',
                }}
              />
            </div>
            <div
              id='PlaceholderSmallText'
              style={{ margin: 'auto', marginBottom: '1rem', width: '55%' }}
            />
            <div
              id='PlaceholderSmallText'
              style={{ margin: 'auto', marginBottom: '1rem', width: '45%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div id='PlaceholderSmallText' style={{ marginRight: '50px' }} />
              <div id='PlaceholderSmallText' />
            </div>
            <div id='PlaceholderSmallText' style={{ margin: 'auto', marginBottom: '1rem' }} />
          </div>
        </Name>
      </BannerInfoOverlay>
    </Banner>
  );
};
