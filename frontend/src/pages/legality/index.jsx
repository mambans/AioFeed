import React, { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { AiFillEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import CopyListBtn from '../myLists/CopyListBtn';
import DeleteListBtn from '../myLists/DeleteListBtn';
import DropDownSimple from '../myLists/DropDownSimple';
import DropDown from '../navigation/DropDown';

import { Container, ListHeader, EmailButtonAsLink } from './StyledComponents';

const Legality = () => {
  const scrollTo = new URL(window.location.href).hash;

  useEffect(() => {
    if (scrollTo) {
      const element = document.getElementById(scrollTo);
      element && element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }, [scrollTo]);

  return (
    <Container>
      <DropDown
        showArrow={false}
        trigger={<p>asdasdasdasdsd</p>}
        items={[
          {
            title: {}?.enabled ? 'Visible' : 'Hidden',
            icon: {}?.enabled ? (
              <AiFillEye size={22} color='#ffffff' />
            ) : (
              <AiOutlineEyeInvisible size={22} color='rgb(150,150,150)' />
            ),
          },
        ]}
      >
        <CopyListBtn list={{}} />
        <DeleteListBtn list={{}} />

        {/* <ListActionButton onClick={() => toggleList(list.id)}>
                {list.enabled ? (
                  <>
                    <AiFillEye size={22} color='#ffffff' />
                    Visible
                  </>
                ) : (
                  <>
                    <AiOutlineEyeInvisible size={22} color='rgb(150,150,150)' />
                    Hidden
                  </>
                )}
              </ListActionButton> */}
      </DropDown>
      <DropDown
        items={[
          {
            title: 'item1',
            icon: <AiFillEye />,
            onClick: () => {
              console.log('clickkk');
            },
          },
        ]}
        title='click'
      >
        <p>asdasd</p>
        <p>asdasd</p>
        <p>asdasd</p>
        <p>asdasdaasdasdsadasd</p>
      </DropDown>
      <DropDownSimple trigger={<p>Click here too</p>}>
        <p>12312312</p>
        <p>12312312</p>
        <p>12312312</p>
        <p>12312312</p>
      </DropDownSimple>{' '}
      <Form.Select aria-label='Default select example'>
        <option>Open this select menu</option>
        <option value='1'>One</option>
        <option value='2'>Two</option>
        <option value='3'>Three</option>
      </Form.Select>
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
        <p>Youtube's sensitive scope is used to be able to unfollow channels.</p>
        <p>All stored data is deleted when account is deleted.</p>
        <ListHeader cla>Aiofeed stores following data:</ListHeader>
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

              <li>Favorite marked streams</li>
              <li>channels to fetch vods from</li>
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
          <li>
            Twitter data:
            <ul>
              <li>List ids</li>
            </ul>
          </li>
          <li>
            Saved list data:
            <ul>
              <li>list name</li>
              <li>video/vod ids</li>
            </ul>
          </li>
          <li>
            Feed sections data:
            <ul>
              <li>Feed section name</li>
              <li>Feed sections rules</li>
            </ul>
          </li>
        </ul>
        <p>The Youtube permisison "manage account" is used to be able to unfollow channels.</p>
        <p>
          If you have any question you can contact{' '}
          <EmailButtonAsLink
            title='mailto:perssons1996@gmail.com?subject=subject&body=body'
            onClick={() => window.open('mailto:perssons1996@gmail.com?subject=subject&body=body')}
          >
            Perssons1996@gmail.com
          </EmailButtonAsLink>
          .
        </p>
      </div>{' '}
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
    </Container>
  );
};

export default Legality;
