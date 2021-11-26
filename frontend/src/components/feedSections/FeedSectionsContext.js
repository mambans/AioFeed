import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import AccountContext from '../account/AccountContext';
import LogsContext from '../logs/LogsContext';
import API from '../navigation/API';
import { TwitchContext } from '../twitch/useToken';
import useSyncedLocalState from './../../hooks/useSyncedLocalState';

const FeedSectionsContext = React.createContext();

export const FeedSectionsProvider = ({ children }) => {
  const { authKey } = useContext(AccountContext);
  const { twitchAccessToken } = useContext(TwitchContext);
  const { addLog } = useContext(LogsContext);
  const [isloading, setIsLoading] = useState();
  const [feedSections, setFeedSections] = useSyncedLocalState('customFeedSections', {});
  const invoked = useRef(false);

  const fetchFeedSectionsContextData = useCallback(async () => {
    setIsLoading(true);
    const result = await API.fetchCustomFeedSections();

    if (result) setFeedSections(result);
    invoked.current = true;
    setIsLoading(false);
  }, [setFeedSections]);

  const createFeedSection = (name) => {
    setFeedSections((c) => {
      const obj = {
        name,
        enabled: true,
        rules: [],
      };
      const newFeedSection = {
        [name]: obj,
      };

      API.updateCustomFeedSections(name, obj);
      return {
        ...c,
        ...newFeedSection,
      };
    });
  };

  const deleteFeedSection = (name) => {
    API.deleteCustomFeedSections(name);
    setFeedSections((c) => {
      const current = { ...c };
      delete current[name];
      return current;
    });
    addLog({
      title: `${name} feed section deleted`,
      text: `${name} feed section deleted`,
      icon: 'feedsection',
    });
  };

  const addFeedSectionRule = (name, rule) => {
    setFeedSections((c) => {
      const existingRule = rule?.id && c?.[name]?.rules.findIndex((r) => r.id === rule?.id);

      const rules = (() => {
        if (existingRule !== undefined && existingRule >= 0) {
          c?.[name]?.rules.splice(existingRule, 1, rule);
          return c?.[name]?.rules;
        }
        return [{ ...rule, id: Date.now() }, ...c?.[name]?.rules];
      })();

      const obj = {
        ...c[name],
        rules,
      };
      const newRule = {
        [name]: obj,
      };
      API.updateCustomFeedSections(name, obj);
      return {
        ...c,
        ...newRule,
      };
    });
  };

  const deleteFeedSectionRule = (name, rule) => {
    setFeedSections((c) => {
      const obj = { ...c[name], rules: c[name].rules.filter((r) => r.id !== rule.id) };
      const newRule = {
        [name]: obj,
      };
      API.updateCustomFeedSections(name, obj);

      return {
        ...c,
        ...newRule,
      };
    });
  };

  const toggleFeedSection = (name) => {
    setFeedSections((c) => {
      const obj = {
        ...c[name],
        enabled: !c[name].enabled,
      };
      const newFeedSection = {
        [name]: obj,
      };
      API.updateCustomFeedSections(name, obj);

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
      }}
    >
      {children}
    </FeedSectionsContext.Provider>
  );
};

export default FeedSectionsContext;
