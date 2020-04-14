import React from "react";
import FormSelect from '../../components/login/formSelect';
import { isNumberKey } from '../../services/functionService';

const InputPhoneNumber = ({ onChange, prefix, error }) => {
	return (
		<div className="form-groups">
			<div className="d-flex form-email align-self-center">
				<div className=" m-0 phone-number-sel float-left">
					<FormSelect
						data={prefix}
						name="email_suffixes"
						className="form-control"
						handleChange={onChange}
					/>
				</div>
				<span className="dash col-1 float-left">-</span>
				<input
					type="text"
					className=" form-control border col-3 m-0 float-left"
					placeholder="0000"
					maxLength="4"
					onKeyPress={(e) => isNumberKey(e)}
				/>
				<span className="dash col-1 float-left">-</span>
				<input
					type="text"
					className=" form-control border col-3 m-0 float-left"
					placeholder="0000"
					maxLength="4"
					onKeyPress={(e) => isNumberKey(e)}
				/>
			</div>

			{error && <div className="alert alert-danger">{error}</div>}
		</div>
	);
};
export default InputPhoneNumber;