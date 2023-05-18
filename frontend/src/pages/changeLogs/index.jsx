import React, { useEffect, useState } from 'react';
import styles from './ChangeLogs.module.scss';

import { Modal } from 'react-bootstrap';
import fetchRepoReleases from './FetchRepoReleases';
import ChangelogAlert from './Alert';
import ListItem from './ListItem';

const ChangeLogs = () => {
  const [repo, setRepo] = useState();

  useEffect(() => {
    (async () => {
      await fetchRepoReleases().then((tags) => setRepo({ tags: tags }));
    })();
  }, []);

  return (
    <>
      <Modal.Header closeButton bsPrefix={styles.header}>
        <Modal.Title bsPrefix={styles.title}>Changelog</Modal.Title>
      </Modal.Header>
      <Modal.Body bsPrefix={styles.ulContainer} as='div'>
        <ChangelogAlert />
        {repo?.tags.slice(0, 1).map((tag) => (
          <ListItem
            name={tag.name}
            key={tag.node_id}
            body={tag.body}
            published_at={tag.published_at}
            showInfo
          ></ListItem>
        ))}
        {repo?.tags.slice(1, 15).map((tag) => (
          <ListItem
            name={tag.name}
            key={tag.node_id}
            body={tag.body}
            published_at={tag.published_at}
          ></ListItem>
        ))}
      </Modal.Body>
    </>
  );
};

export default ChangeLogs;
