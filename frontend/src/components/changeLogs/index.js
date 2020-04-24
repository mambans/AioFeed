import React, { useEffect, useState } from "react";
import styles from "./ChangeLogs.module.scss";

import { Modal } from "react-bootstrap";
// import FetchRepoTags from "./FetchRepoTags";
import FetchRepoReleases from "./FetchRepoReleases";
import Alert from "./Alert";
import ListItem from "./ListItem";

export default ({ NewAlertName }) => {
  const [repo, setRepo] = useState();

  useEffect(() => {
    (async () => {
      await FetchRepoReleases().then((tags) => {
        setRepo({ tags: tags });
      });
    })();
  }, []);

  return (
    <>
      <Modal.Header closeButton bsPrefix={styles.header}>
        <Modal.Title bsPrefix={styles.title}>Changelog</Modal.Title>
      </Modal.Header>
      <Modal.Body bsPrefix={styles.ulContainer} as='div'>
        <Alert AlertName={NewAlertName} />
        {repo &&
          repo.tags.slice(0, 1).map((tag) => {
            return (
              <ListItem
                title={tag.name}
                key={tag.node_id}
                body={tag.body}
                created_at={tag.created_at}
                // commitUrl={tag.commit.url}
                showInfo></ListItem>
            );
          })}
        {repo &&
          repo.tags.slice(1, 15).map((tag) => {
            return (
              <ListItem
                title={tag.name}
                key={tag.node_id}
                // commitUrl={tag.commit.url}
              ></ListItem>
            );
          })}
      </Modal.Body>
    </>
  );
};
