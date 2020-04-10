import React, { useContext } from "react";
import { TwitterTimelineEmbed } from "react-twitter-embed";

import { Container, LoadingPlaceholder } from "./StyledComponents";
import FeedsContext from "../feed/FeedsContext";

export default ({ width }) => {
  const { twitterListName } = useContext(FeedsContext);
  console.log("qasdasd");

  return (
    <Container width={width} key={twitterListName}>
      <TwitterTimelineEmbed
        sourceType='list'
        ownerScreenName='Mambans'
        id={twitterListName}
        placeholder={<LoadingPlaceholder width={width} />}
        autoHeight={true}
        theme={"dark"}
        noScrollbar={true}
        noHeader={true}
        noFooter={true}
        noBorders={true}
        transparent={true}
        onLoad={() => {
          console.log(`Twitter feed with list id '${twitterListName}' loaded.`);
        }}
      />
    </Container>
  );
};
