import React from "react";

const Input = ({ name, label, placeholder, onChange, error }) => {
	return (
		<div className="form-groups">
			<label className="text text-left" htmlFor={name}>{label} <span className="text-danger">*</span></label>
			<input
				name={name}
				id={name}
				className="form-control"
				placeholder={placeholder}
				onChange={onChange} />
			{error && <div className="alert alert-danger">{error}</div>}
		</div>
	);
};

export default Input;