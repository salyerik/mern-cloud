import useAppDispatch from '../../hooks/useAppDispatch';
import { hideFile } from '../../store/slices/upload-slice';
import { nameCutter } from '../../utils/helpers';
import { IUploadingFile } from '../../types/upload-types';
import s from './UploaderFile.module.sass';

const UploaderFile: React.FC<{ file: IUploadingFile }> = ({ file }) => {
	const dispatch = useAppDispatch();
	return (
		<section className={s.wrapper}>
			<div className={s.header}>
				<span className={s.name}>{nameCutter(file.name || '', 24)}</span>
				<button onClick={() => dispatch(hideFile(file.id))} className={s.close}>
					X
				</button>
			</div>
			<div className={s.progress}>
				<span style={{ width: file.progress + '%' }} className={s.bar}></span>
				<span className={s.percent}>{file.progress}%</span>
			</div>
		</section>
	);
};

export default UploaderFile;
