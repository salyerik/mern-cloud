import { useEffect } from 'react';

import useAppDispatch from '../../hooks/useAppDispatch';
import useTypedSelector from '../../hooks/useTypedSelector';
import fileAPI from '../../store/rtk-queries/file-query';
import { openDir, resetDownload } from '../../store/slices/file-slice';
import { nameCutter, sizeFormat } from '../../utils/helpers';

import fileIcon from './../../assets/icons/file.svg';
import folderIcon from './../../assets/icons/folder.svg';
import { IFile } from '../../types/file-types';
import s from './File.module.sass';

const File: React.FC<{ file: IFile }> = ({ file }) => {
	const dispatch = useAppDispatch();
	const view = useTypedSelector(state => state.file.view);
	const [openFile] = fileAPI.useGetFileUrlMutation();
	const [downloadFile, downloadParams] = fileAPI.useDownloadFileMutation();
	const [deleteFile, deleteParams] = fileAPI.useDeleteFileMutation();

	useEffect(() => {
		if (downloadParams.isSuccess) {
			dispatch(resetDownload(file._id));
		}
	}, [downloadParams.isSuccess]);

	const openDirHandler = () => {
		if (!deleteParams.isLoading) {
			dispatch(openDir({ id: file._id, name: file.name }));
		}
	};
	const openFileHandler = () => {
		if (!deleteParams.isLoading) {
			openFile(file._id);
		}
	};
	const deleteFileHandler = () => {
		deleteFile(file._id);
	};

	if (view === 'list') {
		return (
			<li className={s.item}>
				<div className={s.img}>
					<img
						draggable='false'
						onClick={file.type === 'dir' ? openDirHandler : openFileHandler}
						src={file.type === 'dir' ? folderIcon : fileIcon}
						alt='icon'
					/>
				</div>
				<h6
					onClick={file.type === 'dir' ? openDirHandler : openFileHandler}
					className={s.name}>
					{file.name}
				</h6>
				{file.type !== 'dir' && (
					<button
						disabled={downloadParams.isLoading || deleteParams.isLoading}
						className={[
							s.download,
							(deleteParams.isLoading || downloadParams.isLoading) &&
								s.downloadDisabled,
							file.downloadProgress && s.downloadActive,
						].join(' ')}
						onClick={() => downloadFile({ id: file._id, name: file.name })}>
						{file.downloadProgress ? file.downloadProgress + '%' : 'Download'}
					</button>
				)}
				<button
					disabled={deleteParams.isLoading}
					className={[
						s.download,
						deleteParams.isLoading && s.deleteActive,
					].join(' ')}
					onClick={file.type === 'dir' ? openDirHandler : openFileHandler}>
					Open
				</button>
				<button
					className={[
						s.delete,
						(deleteParams.isLoading || downloadParams.isLoading) &&
							s.deleteActive,
					].join(' ')}
					disabled={deleteParams.isLoading || downloadParams.isLoading}
					onClick={deleteFileHandler}>
					Delete
				</button>
				<span className={s.size}>
					{file.type !== 'dir' ? sizeFormat(file.size) : ''}
				</span>
				<span className={s.date}>{file.date.slice(0, 10)}</span>
			</li>
		);
	}

	if (view === 'plate') {
		return (
			<li className={s.plate}>
				<div className={s.plate__img}>
					<img
						onClick={file.type === 'dir' ? openDirHandler : openFileHandler}
						draggable='false'
						src={file.type === 'dir' ? folderIcon : fileIcon}
						alt='icon'
					/>
				</div>
				<h6
					onClick={file.type === 'dir' ? openDirHandler : openFileHandler}
					className={s.plate__name}>
					{nameCutter(file.name, 14)}
				</h6>
				<div className={s.plate__btns}>
					{file.type !== 'dir' && (
						<button
							disabled={downloadParams.isLoading || deleteParams.isLoading}
							className={[
								s.download,
								s.plate__download,
								(deleteParams.isLoading || downloadParams.isLoading) &&
									s.downloadDisabled,
								file.downloadProgress && s.downloadActive,
							].join(' ')}
							onClick={() => downloadFile({ id: file._id, name: file.name })}>
							{file.downloadProgress ? file.downloadProgress + '%' : 'Download'}
						</button>
					)}
					<button
						disabled={deleteParams.isLoading || downloadParams.isLoading}
						onClick={deleteFileHandler}
						className={[
							s.delete,
							s.plate__download,
							(deleteParams.isLoading || downloadParams.isLoading) &&
								s.deleteActive,
						].join(' ')}>
						Delete
					</button>
				</div>
			</li>
		);
	}
};

export default File;
