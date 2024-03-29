import React, { useEffect, useRef, useState } from "react";
import { ChatWrapper, StyledChat, ChatHeader, ChatHeaderInner, ToggleSwitchChatSide } from "./StyledComponents";
import styled from "styled-components";
import useEventListenerMemo from "../../../hooks/useEventListenerMemo";
import { FaWindowClose } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import ToolTip from "../../../components/tooltip/ToolTip";
import { TransparentButton } from "../../../components/styledComponents";

const Chat = ({ channelName, streamInfo, chatState, updateChatState }) => {
	const [dragging, setDragging] = useState();
	const [overlayPosition, setOverlayPosition] = useState({
		width: window.innerWidth - (chatState?.chatwidth || 300),
		...(chatState?.overlayPosition || {}),
	});

	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	const [rnd, setRnd] = useState();
	// const overlayBackdropRef = useRef();
	const chatRef = useRef();
	const [startPos, setStartPos] = useState({ x: 0, y: 0 });

	const keydown = (e) => e.key === "Escape" && setDragging(false);
	useEventListenerMemo("keydown", keydown, window, chatState?.chatAsOverlay);

	const onMouseOutsideWindow = async (e) => {
		console.log("onMouseOutsideWindow:");
		if ((e.clientX < 0 || e.clientY < 0 || e.clientX > window.innerWidth || e.clientY > window.innerHeight) && dragging && chatState?.chatAsOverlay) {
			await onDragMove(e);
			onDragStop();
		}
	};

	const onDragStop = (e) => {
		if (dragging && chatState?.chatAsOverlay) {
			updateChatState((c) => ({
				...c,
				overlayPosition,
				chatAsOverlay: true,
			}));
		}
		setDragging(false);
	};

	// const onResize = useMemo(
	//   () =>
	//     debounce(() => setRnd(Math.random()), 10, {
	//       leading: true,
	//       trailing: false,
	//     }),
	//   []
	// );
	const onResize = () => setRnd(Math.random());
	// trigger rerender to reposition chat when its outside window
	useEventListenerMemo("resize", onResize, window, chatState?.chatAsOverlay);
	useEventListenerMemo("mouseleave", onMouseOutsideWindow, window, chatState?.chatAsOverlay);

	const onDragInit = (e) => {
		if (e.button === 0) {
			setDragging(e.target);
			const mouseX = e.clientX;
			const mouseY = e.clientY;
			const chat = chatRef.current?.getBoundingClientRect();

			setStartPos((c) => ({
				x: mouseX - chat.left,
				y: mouseY - chat.top,
				// bottom: mouseY + chat.height,
			}));
		}
	};

	const onDragMove = async (e) => {
		if (!chatState?.chatAsOverlay) updateChatState((c) => ({ ...c, chatAsOverlay: true, top: window.innerHeight / 2 }), false);

		const mouseX = e.clientX;
		const mouseY = e.clientY;
		const chat = chatRef.current?.getBoundingClientRect();

		const x = mouseX - startPos.x;
		const y = mouseY - startPos.y;

		setOverlayPosition((c) => {
			const left = Math.max(0, Math.min(x, window.innerWidth - chat.width));
			const top = Math.max(0, Math.min(y, window.innerHeight - chat.height));
			const bottom = !chatState?.chatAsOverlay
				? window.innerHeight / 2
				: Math.max(0, window.innerHeight - Math.min(window.innerHeight, top + chat.height));

			const right = Math.max(0, window.innerWidth - Math.min(window.innerWidth, left + chat.width));

			return {
				...c,
				left: left < right ? left : "unset",
				top: top < bottom ? top : "unset",
				bottom: bottom < top ? bottom : "unset",
				right: right < left ? right : "unset",
			};
		});
	};

	useEffect(() => {}, []);

	useEffect(() => {
		setOverlayPosition((c) => ({
			...c,
			// top: window.innerHeight / 2,
			height: window.innerHeight / 2,
			// bottom: 0,
			// right: 0,
			width: chatState?.chatwidth,
			left: window.innerWidth - 300,
			...(chatState?.overlayPosition || {}),
			// width: chatState?.chatwidth,
		}));
	}, [chatState?.overlayPosition, chatState?.chatwidth]);

	return (
		<>
			<OverlayBackdrop onMouseUp={onDragStop} onMouseMove={onDragMove} dragging={chatState?.chatAsOverlay && dragging} />

			<ChatWrapper
				ref={chatRef}
				overlayPosition={overlayPosition}
				dragging={dragging}
				id="chat"
				chatAsOverlay={chatState?.chatAsOverlay}
				data-chatasoverlay={chatState?.chatAsOverlay}
				onMouseMove={dragging ? onDragMove : () => {}}
				onMouseUp={dragging ? onDragStop : () => {}}
			>
				<ChatHeader className="chatHeader" show={dragging}>
					<ChatHeaderBackdropEventDraggable
						onMouseDown={onDragInit}
						// onMouseUp={onDragStop}
						// onMouseMove={dragging ? onDragMove : () => {}}
					/>
					<ChatHeaderInner>
						{/* <ShowNavigationButton />
            <Link to='page'>
              <MdAccountBox size={24} />
            </Link> */}
						{/* <Schedule
              user={streamInfo?.user_name || channelName}
              user_id={streamInfo?.user_id}
              absolute={false}
              style={{ padding: 0, marginRight: '5px' }}
            /> */}

						{chatState?.chatAsOverlay && (
							<ToolTip tooltip="Reset chat to sides">
								<TransparentButton
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										updateChatState((c) => ({ ...c, chatAsOverlay: false }));
									}}
								>
									<GrPowerReset color="rgba(255, 255, 255, 0.75)" size={20} />
								</TransparentButton>
							</ToolTip>
						)}

						{!chatState?.chatAsOverlay && (
							<ToolTip placement={"left"} width="max-content" delay={{ show: 500, hide: 0 }} tooltip="Switch chat side">
								<ToggleSwitchChatSide
									id="switchSides"
									switched={String(chatState.switchChatSide)}
									onClick={() => {
										updateChatState((curr) => ({
											...curr,
											switchChatSide: !chatState.switchChatSide,
										}));
									}}
								/>
							</ToolTip>
						)}
					</ChatHeaderInner>
					<button className="chat__close-button" onClick={() => updateChatState((c) => ({ ...c, hideChat: true }))}>
						<FaWindowClose size={24} color="red" />
					</button>
				</ChatHeader>
				{chatState?.chatAsOverlay && (
					<ResizerAllSides
						setOverlayPosition={setOverlayPosition}
						updateChatState={updateChatState}
						target={chatRef.current}
						overlayPosition={overlayPosition}
					/>
				)}

				<InnerWrapper
					// onMouseDown={onDragInit}
					// onMouseUp={onDragStop}
					data-chatasoverlay={chatState?.chatAsOverlay}
				>
					{/* {chatAsOverlay && dragging && <DragOverlay />} */}

					<StyledChat
						data-chatasoverlay={chatState?.chatAsOverlay}
						frameborder="0"
						scrolling="yes"
						theme="dark"
						id={channelName + "-chat"}
						src={`https://www.twitch.tv/embed/${channelName}/chat?darkpopout&parent=aiofeed.com`}
					/>
				</InnerWrapper>
			</ChatWrapper>
		</>
	);
};
export default Chat;

const ChatHeaderBackdropEventDraggable = styled.div`
	position: absolute;
	inset: 0;
	z-index: 0;
	cursor: move;
`;

// const DragOverlay = styled.div`
//   position: absolute;
//   height: 100%;
//   width: 100%;
//   background: transparent;
// `;

const InnerWrapper = styled.div`
	position: relative;
	height: 100%;
	width: 100%;
	cursor: move;
`;

const OverlayBackdrop = styled.div`
	position: fixed;
	cursor: ${({ cursor = "move" }) => cursor};
	inset: 0;
	background: transparent;
	z-index: 99999;
	pointer-events: ${({ dragging }) => (dragging ? "auto" : "none")};
`;

const ResizerIcon = styled.div`
	position: absolute;
	z-index: 2;

	width: 20px;
	height: 20px;
	transition: border 250ms, opacity 250ms;
	border-color: #ffffff;
	opacity: 0.2;

	&.topleft {
		top: 0;
		left: 0;
		cursor: nw-resize;
		border-style: solid none none solid;
		border-top-left-radius: 10px;
	}
	&.topright {
		top: 0;
		right: 0;
		cursor: ne-resize;
		border-style: solid solid none none;
		border-top-right-radius: 10px;
	}
	&.bottomright {
		bottom: 0;
		right: 0;
		cursor: nw-resize;
		border-style: none solid solid none;
		border-bottom-right-radius: 10px;
	}

	&.bottomleft {
		bottom: 0;
		left: 0;
		cursor: ne-resize;
		border-style: none none solid solid;
		border-bottom-left-radius: 10px;
	}

	&:hover {
		opacity: 1;
	}

	svg {
		transition: fill 250ms;
		transform: rotate(90deg);
		fill: ${({ active }) => (active ? "rgb(255,255,255)" : "rgba(255,255,255,0.3)")};

		&:hover {
			fill: ${({ active }) => (active ? "rgb(255,255,255)" : "rgba(255,255,255,0.5)")};
		}
	}
`;

const ResizerAllSides = ({ setOverlayPosition, updateChatState, target, overlayPosition }) => {
	const [active, setActive] = useState();

	const onMouseDown = (e, dir) => {
		if (e.button === 0) {
			e.preventDefault();
			e.stopPropagation();
			setActive(dir);
		}
	};
	const onMouseUp = () => {
		setActive(false);
		updateChatState((c) => ({ ...c, overlayPosition }));
	};

	const keydown = (e) => {
		if (e.key === "Escape") setActive(false);
	};
	useEventListenerMemo("keydown", keydown, window, active);

	const onMouseMove = (e) => {
		const targetPos = target?.getBoundingClientRect();

		switch (active) {
			case "topleft":
				setOverlayPosition((c) => {
					return {
						...c,
						top: e.clientY,
						left: e.clientX,
						height: targetPos.height + (targetPos.top - e.clientY),
						width: targetPos.width + (targetPos.left - e.clientX),
					};
				});
				break;
			case "topright":
				setOverlayPosition((c) => {
					return {
						...c,
						top: targetPos.top - (targetPos.top - e.clientY),
						height: targetPos.height + (targetPos.top - e.clientY),
						width: targetPos.width + (e.clientX - targetPos.right),
					};
				});
				break;
			case "bottomright":
				setOverlayPosition((c) => ({
					...c,
					height: targetPos.height + (e.clientY - targetPos.bottom),
					width: targetPos.width + (e.clientX - targetPos.right),
				}));
				break;
			case "bottomleft":
				setOverlayPosition((c) => ({
					...c,
					left: e.clientX,
					height: targetPos.height + (e.clientY - targetPos.bottom),
					width: targetPos.width + (targetPos.left - e.clientX),
				}));
				break;
			default:
				break;
		}
	};

	const cursor = (() => {
		if (["topleft", "bottomright"].includes(active)) return "nw";
		if (["topright", "bottomleft"].includes(active)) return "ne";
	})();

	return (
		<>
			<Resizer onMouseDown={(e) => onMouseDown(e, "topleft")} onMouseUp={onMouseUp} active={!!active} className={"topleft"} />
			<Resizer onMouseDown={(e) => onMouseDown(e, "topright")} onMouseUp={onMouseUp} active={!!active} className={"topright"} />
			<Resizer onMouseDown={(e) => onMouseDown(e, "bottomright")} onMouseUp={onMouseUp} active={!!active} className={"bottomright"} />
			<Resizer onMouseDown={(e) => onMouseDown(e, "bottomleft")} onMouseUp={onMouseUp} active={!!active} className={"bottomleft"} />

			{!!active && <OverlayBackdrop onMouseUp={onMouseUp} onMouseMove={onMouseMove} cursor={`${cursor}-resize`} dragging={true} />}
		</>
	);
};

const Resizer = ({ className, onMouseDown, active }) => {
	return (
		<>
			<ResizerIcon onMouseDown={onMouseDown} active={active} className={className} />
		</>
	);
};
