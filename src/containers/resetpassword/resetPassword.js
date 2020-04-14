import React, { Component } from 'react';
import InputPassword from '../../components/login/inputPassword';
import '../../public/css/resetpassword.css';
import { getUser, resetPasswordUser, getUserToken, checkCodeUser } from "../../services/userService";
import imgError from "../../public/images/errors.png";
import imgSuccess from "../../public/images/success.png";
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Modal from 'react-bootstrap-modal';

class ResetPassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			user: {
				email: ""
			},
			dataReset: {
				email: "",
				password: "",
				password_confirm: ""
			},
			error_password: {
				name: "password",
				status: "",
				msg: ""
			},
			error_password_confirm: {
				name: "password_confirm",
				status: "",
				msg: ""
			},
			dataModal: {
				status: false,
				msg: ""
			},
			id: "",
			openModalResetPasswordFinal: false
		}
	}

	async componentDidMount() {
		const checkCode = await checkCodeUser(code);
		const { code } = this.props.match.params;
		const user = await getUserToken(code);
		if (user.data == '' || user.data == undefined) {
			window.location.href = '/reset-password-error';
		}
		console.log(user.data);
		this.setState({
			user:{
				email: user.data.user.email
			},
			dataReset: {
				...this.state.dataReset,
				email: user.data.email
			}
		});
	};

	componentWillMount() {
		if (this.props.location.search.split("=")[1] !== undefined) {
			this.setState({
				id: this.props.location.search.split("=")[1]
			});
		}
	}

	validForm = () => {
		let isCheck = true;

		if (this.handleOnBlurPasword()) {
			isCheck = false;
		}

		if (this.handleOnBlurConfirmPasword()) {
			isCheck = false;
		}

		return isCheck;
	}

	submitForm = async () => {
		if (this.validForm()) {
			let password = ReactDOM.findDOMNode(this.refs.password).firstChild.value;
			let password_confirmation = ReactDOM.findDOMNode(this.refs.password_confirm).firstChild.value;

			let formValue = {
				password,
				password_confirmation
			}

			try {
				let response = await resetPasswordUser(this.props.match.params.code, formValue);
				if (response.data.user !== undefined) {
					this.setState({
						dataModal: response,
						openModalResetPasswordFinal: true
					});
				}else {
					console.log('error');
				}

			} catch (ex) {
				console.log(ex);
			}
		}
	}

	handleChange = (data) => {
		this.setState({
			...data
		});
	}

	renderErrorPassword = (value) => {
		const { status, msg } = { ...value };

		if (status && _.isBoolean(status)) {
			return (
				<div className="text-left">
					<span className="help-block text-danger">{msg}</span>
					<img src={imgError} alt="" className="image-input" />
				</div>
			);
		}

		if (!status && _.isBoolean(status)) {
			return (
				<div className="text-left">
					<img src={imgSuccess} alt="" className="image-input" />
				</div>
			);
		}
	}

	handleOnBlurPasword = () => {
		let password = ReactDOM.findDOMNode(this.refs.password).firstChild.value;
		let error_password = {};

		if (password.trim().length === 0) {
			error_password = {
				name: "password",
				status: true,
				msg: "이메일 또는 비밀번호를 입력해주세요."
			};
		} else {
			if (password.length < 6 || password.length > 16) {
				error_password = {
					name: "password",
					status: true,
					msg: "6~16자리의 영문자,숫자,특수문자를 비밀번호로 사용할 수 있습니다."
				};
			} else {
				error_password = {
					name: "password",
					status: false,
					msg: ""
				};
			}
		}

		this.setState({
			error_password
		});

		return error_password.status;
	}

	handleOnBlurConfirmPasword = () => {
		let password = ReactDOM.findDOMNode(this.refs.password).firstChild.value;
		let password_confirm = ReactDOM.findDOMNode(this.refs.password_confirm).firstChild.value;
		let error_password_confirm = {};

		if (password_confirm.trim().length === 0) {
			error_password_confirm = {
				name: "password_confirm",
				status: true,
				msg: "이메일 또는 비밀번호를 입력해주세요."
			};
		} else if (password_confirm.length < 6 || password_confirm.length > 16) {
			error_password_confirm = {
				name: "password_confirm",
				status: true,
				msg: "6~16자리의 영문자,숫자,특수문자를 비밀번호로 사용할 수 있습니다."
			};
		} else {
			if (password.trim() !== password_confirm.trim()) {
				error_password_confirm = {
					name: "password_confirm",
					status: true,
					msg: "비밀번호가 일치하지 않습니다. 다시 입력해주세요"
				};
			} else {
				error_password_confirm = {
					name: "password",
					status: false,
					msg: ""
				};
			}
		}

		

		this.setState({
			error_password_confirm
		});

		return error_password_confirm.status;
	}

	render() {
		return (
			<div className="page-resetpassword bg-white">
				<div className="wrapper fadeInDown">
					<div id="formContent">
						<div className="fadeIn first">
							<h1>
								비밀번호 재설정
                            </h1>
						</div>
						<div className="form-groups">
							<span className="d-block text-left mt-3">본인확인 절차가 완료되었습니다.</span>
							<span className="d-block text-left">비밀번호를 새로 설정해 주세요.</span>

							<label className="text text-left">이메일 아이디</label>
							<p className="text-email text-left">{this.state.user.email}</p>
						</div>
						<div className="form-groups">
							<label className="text text-left">새 비밀번호<span className="text-danger">*</span></label>
							<InputPassword
								className="form-control input-password"
								placeholder="새 비밀번호를 입력해주세요"
								ref="password"
								handleOnBlur={this.handleOnBlurPasword}
							/>
							{this.renderErrorPassword(this.state.error_password)}
						</div>
						<div className="form-groups">
							<label className="text text-left">새 비밀번호 확인<span className="text-danger">*</span></label>
							<InputPassword
								className="form-control input-password"
								placeholder="새 비밀번호 다시 입력해주세요"
								ref="password_confirm"
								handleOnBlur={this.handleOnBlurConfirmPasword}
							/>
							{this.renderErrorPassword(this.state.error_password_confirm)}
						</div>
						<div className="form-groups mt-2">
							<button className="btn-default btn-submit w-100" onClick={this.submitForm}>확인</button>
						</div>
					</div>
				</div>
				<Modal className='modalPopup w-45'
					id="resetPasswordFinal"
					show={this.state.openModalResetPasswordFinal}
					onHide={() => this.handleChange({ openModalResetPasswordFinal: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						비밀번호가 변경되었습니다
					</div>
					<div className="action-footer text-center">
						<button
							className="btn btn-secondary"
							onClick={() => window.location.href = '/login'}
						>확인</button>
					</div>
				</Modal>
			</div>
		);
	}
}

export default ResetPassword;