import { IInput } from '../../../types/components-types';
import s from './Input.module.sass';

const Input: React.FC<IInput> = ({
	type = 'text',
	placeholder,
	value,
	onChange,
}) => (
	<input
		className={s.input}
		type={type}
		placeholder={placeholder}
		value={value}
		onChange={onChange}
	/>
);

export default Input;
