import React, { useMemo, useState, useEffect } from "react";
import LoadingList from "../categoryTopStreams/LoadingList";
import InifinityScroll from "../channelList/InifinityScroll";
import ChannelSearchBarItem from "./ChannelSearchBarItem";
import { DropDownWrapper } from "./styledComponents";

const ChannelSearchBarList = React.forwardRef(
	({ items, search, position, hideExtraButtons, onChange, onSelect, page, loading, result, limit, loadmore, listRef, wrap }, ref) => {
		/* eslint-disable no-unused-vars */
		const [hiddenItems, setHiddenItems] = useState([]);
		const [visibleItems, setVisibleItems] = useState([]);
		/* eslint-enable no-unused-vars */
		// const listRef = useRef();

		const observer = useMemo(() => {
			if (listRef.current) {
				return new IntersectionObserver(
					function (entries) {
						const { visible, hidden } = entries.reduce(
							(acc, item) => {
								if (item.isIntersecting) {
									acc.visible.push(item?.target?.dataset?.["id"]);
								} else {
									acc.hidden.push(item?.target?.dataset?.["id"]);
								}

								return acc;
							},
							{ visible: [], hidden: [] }
						);

						setHiddenItems((c) => {
							return [...c, ...hidden].filter((id) => !visible.includes(id));
						});
						setVisibleItems((c) => {
							return [...c, ...visible].filter((id) => !hidden.includes(id));
						});
					},
					{ root: listRef.current, threshhold: 0.1, rootMargin: "50px" }
				);
			}
		}, [listRef]);

		useEffect(() => {
			return () => {
				console.log("observer.disconnect:");
				observer?.disconnect?.();
			};
		}, [observer]);

		return (
			<DropDownWrapper
				ref={ref}
				position={position}
				width={
					String(position === "fixed" && 300)
					// String(position === 'fixed' && ref.current?.getBoundingClientRect?.()?.width)
				}
				$wrap={wrap}
			>
				<>
					<div className="total" style={{ textAlign: "center" }}>
						{loading ? "Loading.." : `Total: ${items?.length}`}
					</div>
					{items?.map((i, index) => {
						return (
							<ChannelSearchBarItem
								searchInput={search}
								key={i.id}
								item={i}
								className={index === 0 && "selected"}
								observer={observer}
								// visible={visibleItems.includes(String(i.id))}
								visible={!hiddenItems.includes(String(i.id)) || true}
								hideExtraButtons={hideExtraButtons}
								onSelect={onSelect}
								wrap={wrap}
							/>
						);
					})}
					{loading && <LoadingList amount={2} style={{ paddingLeft: "10px" }} />}

					{page && !loading && result.length > limit && <InifinityScroll observerFunction={loadmore} />}
				</>
			</DropDownWrapper>
		);
	}
);
export default ChannelSearchBarList;
