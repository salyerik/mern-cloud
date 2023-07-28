export interface IUploadingFile {
	id: string;
	progress: number;
	name?: string;
}
export interface IUploadSlice {
	isUploaderVisible: boolean;
	uploadingFiles: IUploadingFile[];
}
