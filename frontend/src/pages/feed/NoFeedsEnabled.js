import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { feedPreferencesAtom } from '../../atoms/atoms';
import Alert from '../../components/alert';
import { navigationSidebarAtom } from '../navigation/atoms';

const NoFeedsEnabled = () => {
  const { twitch, youtube, vods, mylists, twitter } = useRecoilValue(feedPreferencesAtom) || {};
  const showNavigationSidebar = useSetRecoilState(navigationSidebarAtom);

  if (
    !twitch?.enabled &&
    !youtube?.enabled &&
    !vods?.enabled &&
    !mylists?.enabled &&
    !twitter?.enabled
  ) {
    return (
      <Alert
        type='info'
        title='No feeds enabled'
        message='Enable feeds in the navigation sidebar on the right.'
        onClick={showNavigationSidebar}
      />
    );
  }
  return null;
};

export default NoFeedsEnabled;
