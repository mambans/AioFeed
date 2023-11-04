import React, { useState } from "react";
import { MdContentCopy } from "react-icons/md";

import { ListActionButton } from "./StyledComponents";
import NewListForm from "./addToListModal/NewListForm";

const CopyListBtn = ({ list, style, children }) => {
	const [open, setOpen] = useState(false);
	const copyList = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		setOpen((c) => !c);
	};

	return (
		<>
			<ListActionButton onClick={copyList} style={{ ...style }}>
				<MdContentCopy size={20}></MdContentCopy>
				{children || "Copy"}
			</ListActionButton>

			{open && (
				<div
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					<NewListForm item={list.videos} />
				</div>
			)}
		</>
	);
};

export default CopyListBtn;
