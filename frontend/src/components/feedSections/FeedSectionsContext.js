import React, { useCallback, useEffect, useState } from 'react';
import { getCookie } from '../../util';
import API from '../navigation/API';
import useSyncedLocalState from './../../hooks/useSyncedLocalState';

const FeedSectionsContext = React.createContext();

export const FeedSectionsProvider = ({ children }) => {
  const [isloading, setIsLoading] = useState();
  const [feedSections, setFeedSections] = useSyncedLocalState('customFeedSections', {});

  const fetch = useCallback(async () => {
    setIsLoading(true);
    const result = await API.fetchCustomFeedSections();

    if (result) setFeedSections(result);
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
    if (getCookie(`AioFeed_AccountName`)) fetch();
  }, [fetch]);

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
      }}
    >
      {children}
    </FeedSectionsContext.Provider>
  );
};

export default FeedSectionsContext;
