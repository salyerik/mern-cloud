import { useDispatch } from 'react-redux';
import { hideFile } from '../../reducers/uploadReducer';
import s from './UploaderFile.module.sass';
import { nameCutter } from '../../utils/helpers';

const UploaderFile = ({ file }) => {
	const dispatch = useDispatch();
	return (
		<section className={s.wrapper}>
			<div className={s.header}>
				<span className={s.name}>{nameCutter(file.name, 24)}</span>
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
