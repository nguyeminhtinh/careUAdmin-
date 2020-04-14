import React, { Component } from 'react';
import ImageMan from '../../public/images/user_man.png';
import ImageWomen from '../../public/images/user_women.png';
import '../../public/css/register.css';
import { TYPE_USER } from '../../config.json';

class ChooseUser extends Component {
	render() {
		const {type_user} = this.props;
		return (
			<div className="page-register">
				<div className="wrapper-login fadeInDown">
					<div id="formContent">
						<div className="fadeIn first">
							<h1>가입유형 선택</h1>
						</div>
						<p className="fadeIn second description">가입 유형을 선택해주세요</p>
						<div className="form-groups d-flex form-email align-self-center">
							<div className="d-flex justify-content-center w-100">
								<div className="fadeIn second wrapp-choose">
									<img src={ImageMan} alt="" className="img-user" />
									<div className="custom-radio first">
										<label className="radio-wrapper">
											<input
												type="radio"
												name="optradioone"
												checked={type_user == 1 ? 'checked' : ''}
												onChange={(e) => this.props.handleChange({ type_user: TYPE_USER.MASTER })}
											/>
											<span className="checkradio" />
											<span className="text">원장(마스터)</span>
										</label>
									</div>
								</div>
								<div className="fadeIn second wrapp-choose">
									<img src={ImageWomen} alt="" className="img-user" />
									<div className="custom-radio second">
										<label className="radio-wrapper">
											<input
												type="radio"
												name="optradioone"
												checked={type_user == 1 ? '' : 'checked'}
												onChange={(e) => this.props.handleChange({ type_user: TYPE_USER.CAREGIVER })}
											/>
											<span className="checkradio" />
											<span className="text">일반</span>
										</label>
									</div>
								</div>
							</div>
						</div>
						<div className="form-groups mt-2">
							<button className="btn-default w-100" onClick={() => this.props.handleChange({ step: 2 })}>다음</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ChooseUser;