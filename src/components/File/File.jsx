import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { deleteFile, downloadFile, getFileUrl } from '../../services/file';
import { pushToStack, setCurrentDir } from '../../reducers/fileReducer';

import sizeFormat from '../../utils/size-format';
import { nameCutter } from '../../utils/helpers';
import fileIcon from './../../assets/icons/file.svg';
import folderIcon from './../../assets/icons/folder.svg';

import s from './File.module.sass';

const File = ({ file }) => {
	const dispatch = useDispatch();
	const [isDeleteClicked, setDeleteClicked] = useState(false);
	const { currentDir, view } = useSelector(state => state.file);

	const openDirHandler = () => {
		if (file.type === 'dir') {
			dispatch(pushToStack(currentDir));
			dispatch(setCurrentDir({ id: file._id, name: file.name }));
		}
	};
	const openFileHandler = () => {
		getFileUrl(file._id);
	};
	const downloadFileHandler = () => {
		downloadFile(file._id, file.name);
	};
	const deleteFileHandler = () => {
		setDeleteClicked(true);
		dispatch(deleteFile(file._id));
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
				<button
					disabled={isDeleteClicked}
					className={s.download}
					onClick={file.type === 'dir' ? openDirHandler : openFileHandler}>
					Open // 3 button
				</button>
				<button
					disabled={isDeleteClicked}
					className={[s.delete, isDeleteClicked && s.deleteActive].join(' ')}
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
					<button
						className={s.plate__download}
						onClick={file.type === 'dir' ? openDirHandler : openFileHandler}>
						Open
					</button>
					<button className={s.plate__delete} onClick={deleteFileHandler}>
						Delete
					</button>
				</div>
			</li>
		);
	}
};

export default File;
