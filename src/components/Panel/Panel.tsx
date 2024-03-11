import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAppDispatch from '../../hooks/useAppDispatch';
import useTypedSelector from '../../hooks/useTypedSelector';
import { togglePopup } from '../../store/slices/file-slice';
import { popFromStack, setSort, setView } from '../../store/slices/file-slice';
import fileAPI from '../../store/rtk-queries/file-query';

import { ISort } from '../../types/file-types';
import FileList from '../FileList';
import BreadCrumps from '../BreadCrumps';
import Popup from '../Popup';
import Uploader from '../Uploader';

import arrowIcon from './../../assets/icons/arrow.svg';
import listIcon from './../../assets/icons/list.svg';
import plateIcon from './../../assets/icons/plate.svg';
import s from './Panel.module.sass';

const Panel: React.FC = () => {
	const dispatch = useAppDispatch();
	const currentUser = useTypedSelector(state => state.user.currentUser);
	const file = useTypedSelector(state => state.file);
	const { isUploaderVisible } = useTypedSelector(state => state.upload);
	const navigate = useNavigate();
	const [dragEnter, setDragEnter] = useState(false);
	const [uploadFiles] = fileAPI.useUploadFilesMutation();

	const { currentDir, dirStack, sort, isPopupVisible } = file;
	const { firstName, lastName } = currentUser;

	const uploadFilesHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = (e.target as HTMLInputElement).files;
		if (files) uploadFiles({ files: [...files], parent: currentDir.id });
		e.target.value = '';
	};
	const dragEnterHandler = (e: React.DragEvent<HTMLElement>) => {
		e.preventDefault();
		if (!dragEnter) setDragEnter(true);
	};
	const dragLeaveHandler = (e: React.DragEvent<HTMLElement>) => {
		e.preventDefault();
		if (dragEnter) setDragEnter(false);
	};
	const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragEnter(false);
		uploadFiles({ files: [...e.dataTransfer.files], parent: currentDir.id });
	};

	useEffect(() => {
		navigate('/mern-cloud');
	}, []);

	return (
		<section
			className={s.wrapper}
			onDragEnter={dragEnterHandler}
			onDragLeave={dragLeaveHandler}>
			{dragEnter ? (
				<div
					onDrop={dropHandler}
					onDragOver={dragEnterHandler}
					className={s.drag}>
					Upload Files
				</div>
			) : (
				<>
					<h2 className={s.title}>
						{firstName + ' ' + lastName + "'s " + 'Files'}
					</h2>
					<div className={s.top}>
						<div className={s.btns}>
							<button
								onClick={() => dirStack.length && dispatch(popFromStack())}
								className={[s.btn, s.btn__back].join(' ')}>
								<img src={arrowIcon} alt='arrowIcon' />
							</button>
							<button
								className={[s.btn, s.btn__create].join(' ')}
								onClick={() => dispatch(togglePopup())}>
								Create Folder
							</button>
							<label className={s.label}>
								<span>Upload File</span>
								<input onChange={uploadFilesHandler} type='file' multiple />
							</label>
						</div>
						<div className={s.views}>
							<div className={s.sortBlock}>
								<span>Sort: </span>
								<select
									defaultValue={sort}
									onChange={e => dispatch(setSort(e.target.value as ISort))}>
									<option value='type'>Type</option>
									<option value='name'>Name</option>
									<option value='date'>Date</option>
									<option value='size'>Size</option>
								</select>
							</div>
							<button
								className={[s.viewBtns, s.plateBtn].join(' ')}
								onClick={() => dispatch(setView('plate'))}>
								<img src={plateIcon} alt='plateIcon' />
							</button>
							<button
								className={[s.viewBtns, s.listBtn].join(' ')}
								onClick={() => dispatch(setView('list'))}>
								<img src={listIcon} alt='listIcon' />
							</button>
						</div>
					</div>
					<BreadCrumps
						currentDir={currentDir}
						dirStack={dirStack}
						firstName={firstName}
					/>
					<FileList />
					{isPopupVisible && <Popup />}
					{isUploaderVisible && <Uploader />}
				</>
			)}
		</section>
	);
};

export default Panel;
