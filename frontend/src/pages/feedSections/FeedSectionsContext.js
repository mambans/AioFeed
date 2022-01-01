import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import AccountContext from '../account/AccountContext';
import API from '../navigation/API';
import { TwitchContext } from '../twitch/useToken';
import useSyncedLocalState from './../../hooks/useSyncedLocalState';

const FeedSectionsContext = React.createContext();

export const FeedSectionsProvider = ({ children }) => {
  const { authKey } = useContext(AccountContext);
  const { twitchAccessToken } = useContext(TwitchContext);
  const [isloading, setIsLoading] = useState();
  const [feedSections, setFeedSections] = useSyncedLocalState('customFeedSections', {});
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

    if (sections) setFeedSections(sections);
    invoked.current = true;
    setIsLoading(false);
  }, [setFeedSections]);

  const createFeedSection = (title) => {
    const id = Date.now();
    const data = {
      id,
      title,
      enabled: true,
      rules: [],
    };
    setFeedSections((c) => {
      return {
        ...c,
        [id]: data,
      };
    });
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
          c?.[id]?.rules.splice(existingRule, 1, rule);
          return c?.[id]?.rules;
        }
        return [{ ...rule, id: Date.now() }, ...c?.[id]?.rules];
      })();

      const newRule = {
        [id]: { ...c[id], rules },
      };
      API.updateCustomFeedSections(id, { rules });
      return {
        ...c,
        ...newRule,
      };
    });
  };

  const deleteFeedSectionRule = (id, rule) => {
    setFeedSections((c) => {
      const rules = c[id].rules.filter((r) => r.id !== rule.id);
      const newRule = {
        [id]: { ...c[id], rules },
      };
      API.updateCustomFeedSections(id, { rules });

      return {
        ...c,
        ...newRule,
      };
    });
  };

  const toggleFeedSection = (id) => {
    setFeedSections((c) => {
      const enabled = !c[id].enabled;

      const newFeedSection = {
        [id]: { ...c[id], enabled },
      };

      API.updateCustomFeedSections(id, { enabled });

      return {
        ...c,
        ...newFeedSection,
      };
    });
  };

  const toggleFeedSectionNotification = (id) => {
    setFeedSections((c) => {
      const notifications_enabled = !c[id].notifications_enabled;

      const newFeedSection = {
        [id]: { ...c[id], notifications_enabled },
      };

      API.updateCustomFeedSections(id, { notifications_enabled });

      return {
        ...c,
        ...newFeedSection,
      };
    });
  };

  useEffect(() => {
    if (twitchAccessToken && authKey && !invoked.current) fetchFeedSectionsContextData();
  }, [fetchFeedSectionsContextData, twitchAccessToken, authKey]);

  return (
    <FeedSectionsContext.Provider
      value={{
        isloading,
        feedSections,
        createFeedSection,
        deleteFeedSection,
        addFeedSectionRule,
        deleteFeedSectionRule,
        toggleFeedSection,
        fetchFeedSectionsContextData,
        editFeedSectionTitle,
        toggleFeedSectionNotification,
      }}
    >
      {children}
    </FeedSectionsContext.Provider>
  );
};

export default FeedSectionsContext;
