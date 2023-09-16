// styledComponents.d.ts
import { CSSObject } from "styled-components";
import { ButtonProps } from "react-bootstrap";

declare module "styled-components" {
	// Declaration for TransparentButton
	export const TransparentButton: React.FC<CSSObject>;

	// Declaration for StyledListForm
	export const StyledListForm: React.FC<CSSObject>;

	// Declaration for HeaderOuterMainContainer
	export const HeaderOuterMainContainer: React.FC<CSSObject>;

	// Declaration for HeaderNumberCountContainer
	export const HeaderNumberCountContainer: React.FC<CSSObject>;

	// Declaration for HeaderTopContainer
	export const HeaderTopContainer: React.FC<CSSObject>;

	// Declaration for LeftRightDivs
	export const LeftRightDivs: React.FC<CSSObject>;

	// Declaration for ButtonLookalikeStyle
	export const ButtonLookalikeStyle: CSSObject;

	// Declaration for HeaderLines
	export const HeaderLines: React.FC<CSSObject>;

	// Declaration for HeaderTitle
	export const HeaderTitle: React.FC<CSSObject>;

	// Declaration for StyledCountdownCircle
	export const StyledCountdownCircle: React.FC<{
		size: number;
		isLoading: boolean;
	}>;

	// Declaration for VideosContainer
	export const VideosContainer: React.FC<{
		dragging: boolean;
	}>;

	// Declaration for SearchListError
	export const SearchListError: React.FC<CSSObject>;

	// Declaration for ButtonGroup

	// Declaration for StyledButton
	export const StyledButton: React.FC<ButtonProps & CSSObject>;

	export const ButtonGroup: React.FC<{
		gap?: string;
		direction?: string;
		justifyContent?: string;
	}>;
	// Export other components and styles as needed
}
