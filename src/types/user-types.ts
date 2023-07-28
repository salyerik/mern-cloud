export interface IUser {
	firstName: string;
	lastName: string;
	avatar: string | null;
}

export interface IAuthorized {
	user: IUser;
	token: string;
}

export interface IUserSlice {
	isAuth: boolean;
	currentUser: IUser;
}

export interface IUserAuthParams {
	body: {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
	};
	path: string;
}
