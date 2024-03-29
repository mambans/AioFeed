import React, { useImperativeHandle, useState } from "react";
// import { ButtonLookalikeStyle } from './styledComponents';
// import { Button } from 'react-bootstrap';
import { MdRefresh } from "react-icons/md";
// import styled from 'styled-components';
import CountdownCircleTimer from "./CountdownCircleTimer";
import Button from "./Button";

// const StyledRefreshButton = styled(Button).attrs({ variant: 'outline-secondary' })`
//   ${ButtonLookalikeStyle}
//   position: relative;
//   left: 6px;
//   align-items: center;
//   margin-right: 25px;
//   width: 46px;
//   height: 40px;
//   display: flex;
//   align-content: center;
//   justify-content: center;
//   padding: 0;

//   div[aria-label='Countdown timer'] {
//     &&& {
//       margin: 5px auto;
//     }
//   }
// `;

const RefreshButton = React.forwardRef(({ children, refreshTimer, nextRefresh, parentIsLoading, ...props }, ref) => {
	const [isLoading, setIsLoading] = useState();

	useImperativeHandle(ref, () => ({
		setIsLoading(a) {
			setIsLoading(a);
		},
	}));

	return (
		<Button {...props} loading={isLoading || parentIsLoading}>
			{children}
			{nextRefresh || isLoading || parentIsLoading ? (
				<CountdownCircleTimer key={refreshTimer} isLoading={isLoading || parentIsLoading} nextRefresh={nextRefresh} style={{ margin: "4px" }} />
			) : (
				<MdRefresh size={32} />
			)}
		</Button>
	);
});

export default RefreshButton;
