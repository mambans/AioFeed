import React, { useContext } from 'react';
import TwitterContext from '../../twitter/TwitterContext';
import UpdateTwitterLists from './UpdateTwitterLists';
import SidebarExpandableSection from './SidebarExpandableSection';

const TwitterForms = () => {
  const { twitterLists } = useContext(TwitterContext);

  return (
    <SidebarExpandableSection
      title='Twitter lists'
      items={twitterLists}
      renderItem={(id, index) => <UpdateTwitterLists key={id} id={id} index={index} />}
      keyGetter={(id) => id}
      fixedTopItem={<UpdateTwitterLists style={{ opacity: '0.5', transition: 'opacity 250ms' }} />}
    />
  );
};

export default TwitterForms;
