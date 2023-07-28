import { IDir } from './file-types';

export interface IBreadCrumps {
	currentDir: IDir;
	dirStack: IDir[];
	firstName: string;
}

export interface IInput {
	type?: string;
	placeholder: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
