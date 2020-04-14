import React from "react";
import Select from 'react-select';
import { getSuffixEmail } from '../../services/functionService';

const InputEmailCustom = ({ email, email_suffixes, handleChangeData, label }) => {

	return (
		<div className="form-groups">
			{
				label ? <label className="text text-left">{label} <span className="text-danger">*</span></label> : <span />
			}
			<div className="position-relative d-flex align-items-baseline input-email-custom">
				<input
					type="text"
					className="form-control col-7 input-email"
					placeholder="이메일 아이디를 입력해주세요"
					name="email"
					value={email}
					onChange={(e) => handleChangeData({ email: e.target.value })}
				/>
				<p className="unit-email">@</p>
				<div className="position-relative d-inline-block w-150">
					<Select
						value=""
						onChange={(e) => handleChangeData({ email_suffixes: e.value })}
						options={getSuffixEmail().suffixes}
						blurInputOnSelect={true}
						isSearchable={false}
					/>
					<input
						type="text"
						className="form-control col-11 combo-input"
						value={email_suffixes}
						placeholder=""
						onChange={(e) => handleChangeData({ email_suffixes: e.target.value })}
					/>
				</div>
			</div>
		</div>
	);
};

export default InputEmailCustom;