import React, { useEffect, useState, useRef } from "react";
import { MdVideocamOff } from "react-icons/md";
import { MdVideocam } from "react-icons/md";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default ({ channel, removeChannel }) => {
  const [isHovered, setIsHovered] = useState();
  const vodButton = useRef();

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    if (vodButton.current) {
      const refEle = vodButton.current;
      refEle.addEventListener("mouseenter", handleMouseOver);
      refEle.addEventListener("mouseleave", handleMouseOut);

      return () => {
        refEle.removeEventListener("mouseenter", handleMouseOver);
        refEle.removeEventListener("mouseleave", handleMouseOut);
      };
    }
  }, []);

  return (
    <li>
      <Link to={"/channel/" + channel}>{channel}</Link>
      <Button
        ref={vodButton}
        variant='danger'
        size='sm'
        onClick={() => {
          removeChannel(channel);
        }}>
        {isHovered ? (
          <MdVideocamOff size={24} color='red' />
        ) : (
          <MdVideocam size={24} color='green' />
        )}
      </Button>
    </li>
  );
};
