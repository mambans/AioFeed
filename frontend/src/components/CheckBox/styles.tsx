import styled, { keyframes } from "styled-components";
import Colors from "../themes/Colors";

const wave = keyframes`
  50% {
    transform: scale(0.9);
  }
`;

export const CheckBoxContainer = styled.div`
	cursor: pointer;

	input[type="checkbox"] {
		display: none;
		visibility: hidden;
	}

	.cbx {
		margin: auto;
		-webkit-user-select: none;
		user-select: none;
		cursor: pointer;
	}
	.cbx span {
		display: inline-block;
		vertical-align: middle;
		transform: translate3d(0, 0, 0);
	}
	.cbx span:first-child {
		position: relative;
		width: 20px;
		height: 20px;
		border-radius: 3px;
		transform: scale(1);
		vertical-align: middle;
		border: 2px solid #9098a9;
		transition: all 0.2s ease;
	}
	.cbx span:first-child svg {
		position: absolute;
		top: 3px;
		left: 2px;
		fill: none;
		stroke: #ffffff;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 16px;
		stroke-dashoffset: 16px;
		transition: all 0.3s ease;
		transition-delay: 0.1s;
		transform: translate3d(0, 0, 0);
	}
	.cbx span:first-child:before {
		content: "";
		width: 100%;
		height: 100%;
		background: ${({ theme }) => theme.colors.accent};
		display: block;
		transform: scale(0);
		opacity: 1;
		border-radius: 50%;
	}
	.cbx span:last-child {
		padding-left: 8px;
	}
	.cbx:hover span:first-child {
		border-color: ${({ theme }) => theme.colors.accent};
	}

	input[type="checkbox"]:checked + .cbx span:first-child {
		background: ${({ theme }) => Colors.rgba(theme.colors.accent, 0.5)};
		border-color: ${({ theme }) => theme.colors.accent};
		animation: ${wave} 0.4s ease;
	}
	input[type="checkbox"]:checked + .cbx span:first-child svg {
		stroke-dashoffset: 0;
	}
	input[type="checkbox"]:checked + .cbx span:first-child:before {
		transform: scale(3.5);
		opacity: 0;
		transition: all 0.6s ease;
	}
`;
