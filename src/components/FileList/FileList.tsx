import { useEffect } from 'react';
import useTypedSelector from '../../hooks/useTypedSelector';
import fileAPI from '../../store/rtk-queries/file-query';

import File from '../File/File';
import Loader from '../UI/Loader';
import s from './FileList.module.sass';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const FileList: React.FC = () => {
	const { files, currentDir, sort, view, isSearching } = useTypedSelector(
		state => state.file
	);
	const [getFiles, params] = fileAPI.useGetFilesMutation();

	useEffect(() => {
		getFiles({ dirId: currentDir.id, sort });
	}, [currentDir.id, sort]);

	if (isSearching || params.isLoading) {
		return (
			<div className={s.loader}>
				<Loader />
			</div>
		);
	}

	if (files.length === 0) {
		return (
			<div className={s.loader}>
				<h1>No Files</h1>
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
