import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Spinner } from "react-bootstrap";
import React, { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";

import { StyledLoadmore } from "./../StyledComponents";
import { SubFeedContainer } from "./../../sharedStyledComponents";
import { SubFeedHeader } from "./StyledComponents";
import ClipsSortButton from "./ClipsSortButton";
import SortButton from "./SortButton";
import ClipElement from "./ClipElement";
import VodElement from "../vods/VodElement";
import Util from "./../../../util/Util";

export default ({
  feedName,
  items,
  sortBy,
  setSortBy,
  setSortData,
  loadmoreRef,
  fetchItems,
  itemPagination,
  itemsloadmoreLoaded,
  channelInfo,
}) => {
  const [numberOfVideos, setNumberOfVideos] = useState(
    Math.floor(document.documentElement.clientWidth / 350)
  );
  // const numberOfVideos = Math.floor(document.documentElement.clientWidth / 350);

  const recalcWidth = useMemo(
    () =>
      debounce(
        () => {
          setNumberOfVideos(Math.floor(document.documentElement.clientWidth / 350));
        },
        100,
        { leading: true, trailing: false }
      ),
    []
  );

  useEffect(() => {
    window.addEventListener("resize", recalcWidth);

    return () => {
      window.removeEventListener("resize", recalcWidth);
    };
  }, [recalcWidth]);

  return (
    <>
      <SubFeedHeader
        style={{
          width: `${numberOfVideos * 350}px`,
        }}>
        {feedName === "Vods" ? (
          <SortButton sortBy={sortBy} setSortBy={setSortBy} setData={setSortData} />
        ) : (
          <ClipsSortButton sortBy={sortBy} setSortBy={setSortBy} setData={setSortData} />
        )}
        <h3>{feedName}</h3>
      </SubFeedHeader>
      <SubFeedContainer
        style={{
          minHeight: feedName === "Vods" ? "unset" : "310px",
          paddingBottom: "0",
          width: `${numberOfVideos * 350}px`,
          margin: "auto",
        }}>
        <TransitionGroup className='twitch-vods' component={null}>
          {items.map((item) => {
            return (
              <CSSTransition key={item.id} timeout={750} classNames='fade-750ms' unmountOnExit>
                {feedName === "Vods" ? (
                  <VodElement data={item} transition='fade-750ms' vodBtnDisabled={true} />
                ) : (
                  <ClipElement
                    data={item}
                    user_name={channelInfo && channelInfo.name}
                    transition='fade-750ms'
                  />
                )}
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </SubFeedContainer>
      <StyledLoadmore
        ref={loadmoreRef}
        style={{
          width: `${numberOfVideos * 350}px`,
          margin: "auto",
        }}>
        <div />
        <div
          id='Button'
          onClick={() => {
            fetchItems(itemPagination.current);
          }}>
          {!itemsloadmoreLoaded ? (
            <>
              Loading..
              <Spinner
                animation='border'
                role='status'
                variant='light'
                style={{ ...Util.loadingSpinnerSmall, marginLeft: "10px" }}
              />
            </>
          ) : (
            "Load more"
          )}
        </div>
        <div />
      </StyledLoadmore>
    </>
  );
};
