import React from "react";

const InputCheckbox = ({ name, onCheck, checked, text, disabled }) => {
	return (
		<label className="checkbox-wrapper">
			<input
				type="checkbox"
				name={name}
				id={name}
				checked={checked}
				onChange={onCheck}
				disabled={disabled}
			/>
			<span className="checkmark"></span>
			<span className="text">{text}</span>
		</label>
	);
};

export default InputCheckbox;