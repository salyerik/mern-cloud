import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import fileAPI from '../../store/rtk-queries/file-query';
import { openDir, resetDownload } from '../../store/slices/file-slice';
import { nameCutter, sizeFormat } from '../../utils/helpers';

import fileIcon from './../../assets/icons/file.svg';
import folderIcon from './../../assets/icons/folder.svg';
import s from './File.module.sass';

const File = ({ file }) => {
	const dispatch = useDispatch();
	const view = useSelector(state => state.file.view);
	const [isBtnClicked, setBtnClicked] = useState(false);
	const [openFile] = fileAPI.useGetFileUrlMutation();
	const [downloadFile] = fileAPI.useDownloadFileMutation();
	const [deleteFile, deleteParams] = fileAPI.useDeleteFileMutation();

	useEffect(() => {
		if (deleteParams.isError) setBtnClicked(false);
		if (file.downloadProgress) setBtnClicked(true);
		if (file.downloadProgress === '100') {
			dispatch(resetDownload(file._id));
			setBtnClicked(false);
		}
	}, [file.downloadProgress, deleteParams.isError]);

	const openDirHandler = () => {
		if (!isBtnClicked) {
			dispatch(openDir({ id: file._id, name: file.name }));
		}
	};
	const openFileHandler = () => {
		if (!isBtnClicked) {
			openFile(file._id);
		}
	};
	const deleteFileHandler = () => {
		setBtnClicked(true);
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
						disabled={file.downloadProgress || isBtnClicked}
						className={[
							s.download,
							isBtnClicked && s.downloadDisabled,
							file.downloadProgress && s.downloadActive,
						].join(' ')}
						onClick={() => downloadFile({ id: file._id, name: file.name })}>
						{file.downloadProgress ? file.downloadProgress + '%' : 'Download'}
					</button>
				)}
				<button
					disabled={isBtnClicked}
					className={[s.download, isBtnClicked && s.deleteActive].join(' ')}
					onClick={file.type === 'dir' ? openDirHandler : openFileHandler}>
					Open
				</button>
				<button
					className={[s.delete, isBtnClicked && s.deleteActive].join(' ')}
					disabled={isBtnClicked}
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
							disabled={file.downloadProgress || isBtnClicked}
							className={[
								s.download,
								s.plate__download,
								isBtnClicked && s.downloadDisabled,
								file.downloadProgress && s.downloadActive,
							].join(' ')}
							onClick={() => downloadFile({ id: file._id, name: file.name })}>
							{file.downloadProgress ? file.downloadProgress + '%' : 'Download'}
						</button>
					)}
					<button
						disabled={isBtnClicked}
						onClick={deleteFileHandler}
						className={[
							s.delete,
							s.plate__download,
							isBtnClicked && s.deleteActive,
						].join(' ')}>
						Delete
					</button>
				</div>
			</li>
		);
	}
};

export default File;
