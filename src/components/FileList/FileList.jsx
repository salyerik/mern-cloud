import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFiles } from '../../services/file-service';
import { showLoader } from '../../reducers/appReducer';
import File from '../File/File';
import Loader from '../UI/Loader';
import s from './FileList.module.sass';

const FileList = () => {
	const { files, currentDir, sort, view } = useSelector(state => state.file);
	const isLoaderVisible = useSelector(state => state.app.isLoaderVisible);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(showLoader());
		dispatch(getFiles(currentDir.id, sort));
	}, [currentDir.id, sort]);

	if (isLoaderVisible) {
		return (
			<div className={s.loader}>
				<Loader />
			</div>
		);
	}

	if (view === 'list') {
		return (
			<section className={s.wrapper}>
				<div className={s.info}>
					<span className={s.icon}>Type</span>
					<span className={s.name}>Name</span>
					<span className={s.size}>Size</span>
					<span className={s.date}>Date</span>
				</div>
				{files.map(file => (
					<File key={file._id} file={file} />
				))}
			</section>
		);
	}

	if (view === 'plate') {
		return (
			<section className={s.plate}>
				{files.map(file => (
					<File key={file._id} file={file} />
				))}
			</section>
		);
	}
};

export default FileList;
