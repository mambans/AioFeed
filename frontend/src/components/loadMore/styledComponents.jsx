import styled from "styled-components";

export const StyledLoadmore = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	max-width: 100%;
	padding-bottom: 10px;
	position: relative;

	&:hover {
		div:not(.button) {
			opacity: 1;
			transition: opacity 200ms;
		}
	}

	div:not(.button).line {
		background: var(--subFeedHeaderBorder);
		height: 1px;
		opacity: 0.75;
		transition: opacity 200ms;
		flex-grow: 1;
	}

	div.button {
		display: flex;
		width: max-content;
		cursor: pointer;
		margin: 0;
		font-weight: bold;
		color: var(--textColor2);
		padding: 0px 15px;
		transition: color 200ms, padding 200ms;
		white-space: nowrap;

		&:hover {
			color: white;
			padding: 0px 25px;
		}
	}

	#reset {
		cursor: pointer;
		color: var(--textColor2);
		margin-left: 5px;
		transition: color 200ms, margin 200ms, stroke 200ms;

		path {
			transition: stroke 200ms;
			stroke: var(--textColor2);
		}

		&:hover {
			color: white;
			margin-left: 10px;

			path {
				stroke: white;
			}
		}
	}
`;
