import React from 'react';

import { Container, ListHeader, EmailButtonAsLink } from './StyledComponents';

export default () => {
  const scrollTo = new URL(window.location.href).hash;

  if (scrollTo) {
    window.setTimeout(() => {
      const element = document.getElementById(scrollTo);
      element && element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }, 1);
  }

  return (
    <Container>
      <div id='#Conditions'>
        <h2>
          <a href='#Conditions'>Conditions of Use</a>
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed justo convallis, finibus
          urna vel, pharetra nisl. Duis velit augue, efficitur nec justo non, vehicula ornare
          sapien. Etiam commodo bibendum justo, vitae tristique neque scelerisque vel. Maecenas
          vulputate, leo quis ornare varius, orci ligula tristique ex, vel vehicula ligula augue vel
          diam. Suspendisse ultrices aliquam eros eu commodo. Ut ultrices ipsum lacus, eu vestibulum
          nibh aliquet sit amet. Sed hendrerit lectus et est cursus, et commodo augue viverra.
          Maecenas varius lectus nulla, vel sagittis mi mollis in.
        </p>
        <p>
          Duis a nulla laoreet, maximus arcu sed, pharetra risus. Nulla non odio luctus, faucibus
          metus sed, consectetur mauris. Duis ultricies eros tortor, vel ullamcorper dui molestie
          vel. Praesent at fermentum urna, non congue leo. Etiam imperdiet nibh ut facilisis
          aliquam. Ut pharetra interdum turpis sit amet vestibulum. Suspendisse commodo dapibus
          mollis. Donec ut felis ante. Suspendisse maximus eu justo at tempor. Aenean felis tellus,
          accumsan ut pharetra molestie, gravida et nisi. Phasellus porttitor dapibus justo at
          porttitor. Pellentesque eu congue ante, ut semper est. Orci varius natoque penatibus et
          magnis dis parturient montes, nascetur ridiculus mus. Integer eget purus maximus, rhoncus
          orci a, rutrum mauris.
        </p>
      </div>
      <div id='#Privacy'>
        <h2>
          <a href='#Privacy'>Privacy Notice</a>
        </h2>
        <p>
          Aiofeed uses stored Youtube/Twitch access and refresh tokens to re-authticate when tokens
          expire. It also stores the data to remove the need to re authticate/connect with
          Youtube/Twitch/Twitter when you login/logout, so when logging in all your data (excluding
          password) is delivered to you.
        </p>
        <p>
          Twitch and Youtube account info (username, profile image, id) are fetched when
          connnection/authenticating with Twitch/Youtube the first time or when manually
          re-connecting/re-authenticating by clicking the buttom in the sidebar.
        </p>
        <ListHeader cla>Aiofeed stores following info in database:</ListHeader>
        <ul id='Stored info'>
          <li>Account username</li>
          <li>Email</li>
          <li>Profile image url</li>
          <li>Password (Hashed)</li>
          <li>Channel list to fetch Twitch Vods from</li>
          <li>Random generated authentication key for Aiofeed API endpoints.</li>
          <li>Twitter list Id</li>
          <li>
            Twitch data:
            <ul>
              <li>username</li>
              <li>Id</li>
              <li>Profile image url</li>
              <li>Access token (Encrypted)</li>
              <li>Refresh token (Encrypted)</li>
            </ul>
          </li>
          <li>
            Youtube data:
            <ul>
              <li>username</li>
              <li>Profile image url</li>
              <li>Access token (Encrypted)</li>
              <li>Refresh token (Encrypted)</li>
            </ul>
          </li>
        </ul>
        <p>The Youtube permisison "manage account" is used to be able to unfollow channels.</p>
        <p>
          If you have any question you can contact{' '}
          <EmailButtonAsLink
            title='mailto:perssons1996@gmail.com?subject=subject&body=body'
            onClick={() => {
              window.open('mailto:perssons1996@gmail.com?subject=subject&body=body');
            }}
          >
            Perssons1996@gmail.com
          </EmailButtonAsLink>
          .
        </p>
      </div>
    </Container>
  );
};
