import styled from "styled-components";

export const Background = styled.div`
	position: fixed;
	inset: 0;
	background: ${({ theme }) => theme.colors.background};
	z-index: -1;
`;
