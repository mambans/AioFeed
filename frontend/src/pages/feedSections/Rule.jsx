import React from "react";
import { Form } from "react-bootstrap";
import styled from "styled-components";
import useInput from "../../hooks/useInput";
import ToolTip from "../../components/tooltip/ToolTip";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MdDelete, MdAdd, MdStarBorder, MdStar, MdSave, MdCheck } from "react-icons/md";
import { StyledListForm, StyledButton } from "../../components/styledComponents";
import { CheckBox } from "../../components";
import Colors from "../../components/themes/Colors";
import ChannelSearchBar from "../twitch/searchbars/ChannelSearchBar";
import GameSearchBar from "../twitch/searchbars/GameSearchBar";
import { useFeedSectionsAddFeedSectionRule, useFeedSectionsDeleteFeedSectionRule } from "../../stores/twitch/feedSections";

const StyledRule = styled.div`
	height: ${({ height }) => height}px;

	.searchbar {
		background: transparent;
	}

	&.ListForm-appear {
		opacity: 0;
		height: 0;
		/* margin: 0 10px !important; */
		transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
	}

	&.ListForm-appear-active {
		opacity: 1;
		height: ${({ height }) => height}px;
		/* margin: 10px !important; */
		transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
	}

	&.ListForm-appear-done {
		opacity: 1;
		height: ${({ height }) => height}px;
		/* margin: 10px !important; */
		transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
	}

	&.ListForm-enter {
		opacity: 0;
		height: 0;
		/* margin: 0 10px !important; */
		transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
	}

	&.ListForm-enter-done {
		opacity: 1;
		height: ${({ height }) => height}px;
		/* margin: 10px !important; */
		transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
	}

	&.ListForm-enter-active {
		opacity: 1;
		height: ${({ height }) => height}px;
		/* margin: 10px !important; */
		transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
	}

	&.ListForm-exit {
		opacity: 1;
		height: ${({ height }) => height}px;
		/* margin: 10px !important; */
		transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
	}

	&.ListForm-exit-active {
		opacity: 0;
		height: 0;
		/* margin: 0 10px !important; */
		transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
	}

	&.ListForm-exit-done {
		opacity: 0;
		height: 0;
		/* margin: 0 10px !important; */
		transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
	}
`;

const InputsContainer = styled.div`
	display: flex;

	input {
		margin: 0 5px;
	}
`;

const Input = styled(Form.Control)`
	font-weight: ${({ value }) => value && "600"};
	color: ${({ value }) => value && "#ffffff"};

	&::placeholder {
		color: #373d44;
	}
`;

const Rule = ({ rule, height, id, index }) => {
	const addFeedSectionRule = useFeedSectionsAddFeedSectionRule();
	const deleteFeedSectionRule = useFeedSectionsDeleteFeedSectionRule();

	const { checked: enabled, bind: bindEnabled, reset: resetEnabled } = useInput(!!rule?.enabled);
	const { checked: favorited, bind: bindFavorited, reset: resetFavorited } = useInput(!!rule?.favorited);
	const { value: title, bind: bindTitle, reset: resetTitle } = useInput(rule?.title || "");
	const { value: category, bind: bindCategory, reset: resetCategory } = useInput(rule?.category || "");
	const {
		value: channel,
		bind: bindChannel,
		reset: resetChannel,
		// setValue: setChannel,
	} = useInput(rule?.channel || "");
	const { value: viewers, bind: bindViewers, reset: resetViewers } = useInput(rule?.viewers || "", { type: "number" });
	const { value: tag, bind: bindTag, reset: resetTag } = useInput(rule?.tag || "");

	const checkIfChanged = () => {
		return (
			Boolean(title || category || channel || viewers || tag || favorited || enabled) &&
			Boolean(
				title?.toLowerCase() !== rule?.title?.toLowerCase() ||
					category?.toLowerCase() !== rule?.category?.toLowerCase() ||
					channel?.toLowerCase() !== rule?.channel?.toLowerCase() ||
					tag?.toLowerCase() !== rule?.tag?.toLowerCase() ||
					viewers !== rule?.viewers ||
					favorited !== !!rule?.favorited ||
					enabled !== !!rule?.enabled
			)
		);
	};

	const handleSubmit = (evt) => {
		evt?.preventDefault?.();

		if (checkIfChanged()) {
			addFeedSectionRule(id, { title, category, channel, viewers, tag, id: rule?.id, favorited, enabled });
			if (!rule?.id) {
				resetTitle();
				resetCategory();
				resetFavorited();
				resetEnabled();
				resetChannel();
				resetViewers();
				resetTag();
			}
		}
	};

	const handleAdd = (e) => {
		e?.preventDefault?.();

		if (!rule?.id && Boolean(title || category || channel || viewers || tag || favorited || enabled)) {
			addFeedSectionRule(id, { title, category, channel, tag, viewers, favorited, enabled });
			resetTitle();
			resetCategory();
			resetFavorited();
			resetChannel();
			resetViewers();
			resetTag();
		}
	};
	const handleRemove = (e) => {
		e.preventDefault();
		deleteFeedSectionRule(id, rule);
	};

	const handleKeyDown = (ev) => ev.key === "Enter" && handleSubmit(ev);

	return (
		<StyledRule height={height}>
			<StyledListForm onSubmit={handleSubmit}>
				<Form.Group controlId="formGroupListName" style={{ marginBottom: "0" }} onKeyDown={handleKeyDown}>
					{/* <Form.Label>asd</Form.Label> */}
					<InputsContainer>
						{/* <InputGroup className='mb-3'> */}

						<CheckBox {...bindEnabled} style={{ marginRight: "1rem" }} tooltip="Enabled/Disabled this rule" />

						<CheckBox
							{...bindFavorited}
							icons={{
								checked: <MdStar size={22} color={Colors.yellow} />,
								unchecked: <MdStarBorder size={22} color={Colors.yellow} />,
							}}
							tooltip="Stream must be favorited"
						/>
						<Input type="text" placeholder="title.." name="title" {...bindTitle} />
						<GameSearchBar
							style={{
								minWidth: "200px",
								width: "unset",
								margin: "0 5px",
								// zIndex: 9999 - parseInt(index),
								zIndex: String(9999 - parseInt(index)),
							}}
							{...bindCategory}
							placeholder={category || "category.."}
						/>
						<ChannelSearchBar
							style={{
								minWidth: "200px",
								width: "unset",
								margin: "0 5px",
								// zIndex: 9999 - parseInt(index),
								zIndex: String(9999 - parseInt(index)),
							}}
							{...bindChannel}
							placeholder={channel || "channel.."}
							hideExtraButtons
							// open={true}
							onSubmit={(value) => {
								handleAdd();
							}}
						/>
						<Input type="text" placeholder="tag.." name="tag" {...bindTag} />
						<Input type="number" placeholder="viewers.." name="viewers" {...bindViewers} />
						{checkIfChanged() && rule?.id && (
							<ToolTip delay={{ show: 500, hide: 0 }} tooltip={"Save"}>
								<StyledButton onClick={handleSubmit} type="button">
									<MdCheck size={22} color={Colors.green} />
								</StyledButton>
							</ToolTip>
						)}

						<ToolTip delay={{ show: 500, hide: 0 }} tooltip={`${rule?.id ? `Remove list` : `Add new list`}`}>
							{rule?.id ? (
								<StyledButton onClick={handleRemove} type="button">
									<MdDelete size={22} color={Colors.red} />
								</StyledButton>
							) : (
								<StyledButton onClick={handleAdd} type="button">
									<MdAdd size={22} color={Colors.green} />
								</StyledButton>
							)}
						</ToolTip>
					</InputsContainer>
				</Form.Group>
			</StyledListForm>
		</StyledRule>
	);
};
export default Rule;
