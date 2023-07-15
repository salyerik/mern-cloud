import s from './Input.module.sass';

const Input = ({ type = 'text', placeholder, value, onChange }) => (
	<input
		className={s.input}
		type={type}
		placeholder={placeholder}
		value={value}
		onChange={onChange}
	/>
);

export default Input;
