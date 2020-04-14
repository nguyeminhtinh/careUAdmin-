import React from "react";
import FormSelect from '../../components/login/formSelect';
import _ from 'lodash';

const InputEmail = ({ name, label, placeholder, onChange, emails, classInput, onChangeEmail, handleOnBlur, showLabel, error }) => {

	return (
		<div className="form-groups">
			{
				showLabel ? <label className="text text-left" htmlFor={name}>{label} <span className="text-danger">*</span></label> : <span />
			}
			<div className="d-flex form-email align-self-center">
				<input
					name={name}
					id={name}
					className={classInput ? classInput : "form-control col-7"}
					placeholder={placeholder}
					onChange={onChange}
					onBlur={_.isFunction(handleOnBlur) ? (e) => handleOnBlur(e.target) : console.log()}
				/>
				<div className="unit-email">@</div>
				<div className="select-email">
					<FormSelect
						data={emails}
						name="email_suffixes"
						className="form-control"
						handleChange={onChangeEmail}
					/>
				</div>
			</div>

			{error && <div className="alert alert-danger">{error}</div>}
		</div>
	);
};

export default InputEmail;