import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useFeedPreferences } from '../../atoms/atoms';
import AccountContext from '../account/AccountContext';
import API from '../navigation/API';
import { feedSectionsAtom } from '../twitch/atoms';
import { TwitchContext } from '../twitch/useToken';
// import useSyncedLocalState from './../../hooks/useSyncedLocalState';

const FeedSectionsContext = React.createContext();

export const FeedSectionsProvider = ({ children }) => {
  const { user } = useContext(AccountContext);
  const { twitchAccessToken } = useContext(TwitchContext);
  const [isloading, setIsLoading] = useState();
  // const [feedSections, setFeedSections] = useSyncedLocalState('customFeedSections', {});
  // const [feedSections, setFeedSections] = useSyncedLocalState('customFeedSections', {});
  const setFeedSections = useSetRecoilState(feedSectionsAtom);
  const { toggleEnabled } = useFeedPreferences();
  const invoked = useRef(false);

  const fetchFeedSectionsContextData = useCallback(async () => {
    setIsLoading(true);
    const { Items } = (await API.fetchCustomFeedSections()) || {};

    const sections = Items?.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id]: curr,
      };
    }, {});

    if (sections) setFeedSections(sections, invoked.current);
    setIsLoading(false);
    invoked.current = true;
  }, [setFeedSections]);

  const createFeedSection = (title) => {
    const id = Date.now();
    const data = {
      id,
      title,
      enabled: true,
      notifications_enabled: true,
      nonFeedSectionLiveStreams: false,
      sidebar_enabled: true,
      rules: [],
    };
    setFeedSections((c) => {
      return {
        ...c,
        [id]: data,
      };
    });
    toggleEnabled(id);
    API.createCustomFeedSections({ id, data });
  };

  const deleteFeedSection = (id) => {
    setFeedSections((c) => {
      const current = { ...c };
      delete current[id];
      return current;
    });
    API.deleteCustomFeedSections(id);
  };

  const editFeedSectionTitle = async ({ id, title }) => {
    setFeedSections((c) => {
      const current = { ...c };
      const list = current[id];
      const newList = { [id]: { ...list, title } };
      return { ...current, ...newList };
    });
    API.updateCustomFeedSections(id, { title });
  };

  const addFeedSectionRule = (id, rule) => {
    setFeedSections((c) => {
      const existingRule = rule?.id && c?.[id]?.rules.findIndex((r) => r.id === rule?.id);

      const rules = (() => {
        if (existingRule !== undefined && existingRule >= 0) {
          const rules = [...(c?.[id]?.rules || [])];
          rules.splice(existingRule, 1, rule);
          return rules;
        }
        return [{ ...rule, id: Date.now() }, ...c?.[id]?.rules];
      })();

      API.updateCustomFeedSections(id, { rules });
      return {
        ...c,
        [id]: { ...c[id], rules },
      };
    });
  };

  const deleteFeedSectionRule = (id, rule) => {
    setFeedSections((c) => {
      const rules = c[id].rules.filter((r) => r.id !== rule.id);

      API.updateCustomFeedSections(id, { rules });

      return {
        ...c,
        [id]: { ...c[id], rules },
      };
    });
  };

  const toggleFeedSection = (id) => {
    setFeedSections((c) => {
      const enabled = !c[id].enabled;

      API.updateCustomFeedSections(id, { enabled });

      return {
        ...c,
        [id]: { ...c[id], enabled },
      };
    });
  };

  const toggleFeedSectionSidebar = (id) => {
    setFeedSections((c) => {
      const sidebar_enabled = !c[id].sidebar_enabled;

      API.updateCustomFeedSections(id, { sidebar_enabled });

      return {
        ...c,
        [id]: { ...c[id], sidebar_enabled },
      };
    });
  };

  const toggleFeedSectionNotification = (id) => {
    setFeedSections((c) => {
      const notifications_enabled = !c[id].notifications_enabled;
      API.updateCustomFeedSections(id, { notifications_enabled });

      return {
        ...c,
        [id]: { ...c[id], notifications_enabled },
      };
    });
  };

  const toggleFeedSectionExcludeFromTwitch = (id) => {
    setFeedSections((c) => {
      const excludeFromTwitch_enabled = !c[id].excludeFromTwitch_enabled;

      API.updateCustomFeedSections(id, { excludeFromTwitch_enabled });

      return {
        ...c,
        [id]: { ...c[id], excludeFromTwitch_enabled },
      };
    });
  };

  useEffect(() => {
    if (twitchAccessToken && user && !invoked.current) fetchFeedSectionsContextData();
  }, [fetchFeedSectionsContextData, twitchAccessToken, user]);

  return (
    <FeedSectionsContext.Provider
      value={{
        isloading,
        // feedSections,
        createFeedSection,
        deleteFeedSection,
        addFeedSectionRule,
        deleteFeedSectionRule,
        toggleFeedSection,
        fetchFeedSectionsContextData,
        editFeedSectionTitle,
        toggleFeedSectionNotification,
        toggleFeedSectionExcludeFromTwitch,
        toggleFeedSectionSidebar,
      }}
    >
      {children}
    </FeedSectionsContext.Provider>
  );
};

export default FeedSectionsContext;
