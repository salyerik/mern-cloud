export type IView = 'list' | 'plate';
export type ISort = 'type' | 'size' | 'name' | 'date';

export interface IDir {
	id: string | null;
	name: string | null;
}

export interface IFile {
	_id: string;
	name: string;
	type: string;
	accessLink: string;
	size: number;
	path: string;
	user: string;
	parent: string;
	children: string[];
	date: string;
	downloadProgress?: null | number;
}

export interface IFileSlice {
	isPopupVisible: boolean;
	files: IFile[];
	currentDir: IDir;
	dirStack: IDir[];
	sort: ISort;
	view: IView;
}
