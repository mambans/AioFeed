interface Client {
	endpoint: string;
	fetchOptions: Record<string, any>;
}

interface UserPool {
	userPoolId: string;
	clientId: string;
	client: Client;
	advancedSecurityDataCollectionFlag: boolean;
	storage: Record<string, string>;
}

interface IdTokenPayload {
	sub: string;
	email_verified: boolean;
	iss: string;
	"cognito:username": string;
	origin_jti: string;
	aud: string;
	event_id: string;
	token_use: string;
	auth_time: number;
	exp: number;
	iat: number;
	jti: string;
	email: string;
}

interface RefreshToken {
	token: string;
}

interface AccessTokenPayload {
	sub: string;
	iss: string;
	client_id: string;
	origin_jti: string;
	event_id: string;
	token_use: string;
	scope: string;
	auth_time: number;
	exp: number;
	iat: number;
	jti: string;
	username: string;
}

interface SignInUserSession {
	idToken: {
		jwtToken: string;
		payload: IdTokenPayload;
	};
	refreshToken: RefreshToken;
	accessToken: {
		jwtToken: string;
		payload: AccessTokenPayload;
	};
	clockDrift: number;
}

interface Storage {
	[key: string]: string;
}

interface Attributes {
	sub: string;
	email_verified: boolean;
	email: string;
}

interface UserType {
	username: string;
	pool: UserPool;
	Session: null | any; // Replace 'any' with a specific type if needed
	client: Client;
	signInUserSession: SignInUserSession;
	authenticationFlowType: string;
	storage: Storage;
	keyPrefix: string;
	userDataKey: string;
	attributes: Attributes;
	preferredMFA: string;
}
