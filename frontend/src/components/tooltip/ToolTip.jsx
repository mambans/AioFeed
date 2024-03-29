import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styled from "styled-components";
import { useFeedVideoSizeObject } from "../../stores/feedVideoSize";

const ToolTipText = styled(Tooltip)`
	width: ${({ width }) => (width ? (typeof width === "number" ? width + "px" : width) : "max-content")};
	z-index: 99999999;

	top: ${({ top }) => (top ? top + " !important" : "initial")};
	right: ${({ right }) => (right ? right + " !important" : "initial")};
	bottom: ${({ bottom }) => (bottom ? bottom + " !important" : "initial")};
	left: ${({ left }) => (left ? left + " !important" : "initial")};

	&&& {
		.tooltip-inner {
			font-size: ${({ fontSize }) => fontSize};
		}
	}
`;

/**
 * Add tooltip on hover
 *
 * @param {Element} children - Html elements children
 * @param {Boolean} [show = True] - Boolean to enable on hover tooltip
 * @param {Text} [tooltip = ''] - Tooltip text
 * @param {Text} [placement='bottom'] - HTML element(s) to as trigger for 'on hover'.
 * @param {Object} [delay = { show: 250, hide: 0 }] - Object '{ show: 250, hide: 0 }' for tooltip delays
 * @param {Text} [fontSize='inherit'] - Font size for tooltip
 */

const ToolTip = ({
	children,
	show = true,
	tooltip = "",
	content = "",
	placement = "bottom",
	delay = { show: 250, hide: 0 },
	fontSize = "inherit",
	width = "unset",
	style,
}) => {
	const feedVideoSizeProps = useFeedVideoSizeObject();

	// return (
	//   <div title={tooltip} style={{ display: 'flex' }}>
	//     {children || null}
	//   </div>
	// );
	if (show)
		return (
			// Error locally about ref
			<OverlayTrigger
				key={tooltip + Date.now()}
				placement={placement}
				delay={typeof delay === "object" ? delay : { show: delay }}
				overlay={
					<ToolTipText
						top={style?.top}
						right={style?.right}
						bottom={style?.bottom}
						left={style?.left}
						fontSize={fontSize}
						id={`tooltip-${"bottom"}`}
						width={width || feedVideoSizeProps?.width || 350}
					>
						{tooltip || content}
					</ToolTipText>
				}
			>
				{children}
			</OverlayTrigger>
		);

	return children;
};

export default ToolTip;
