import React, { Component } from 'react';
import Modal from 'react-bootstrap-modal';
import '../../public/css/findpassword.css';
import { isCharacterValid } from '../../services/functionService';
import { getUserFindByEmail } from '../../services/userService';
import Input from "../../components/common/input";
import InputEmail from "../../components/common/inputEmailCustom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { css } from '@emotion/core';
// First way to import
import { BeatLoader } from 'react-spinners';

const HANGUL = new RegExp("[\u1100-\u11FF|\u3130-\u318F|\uA960-\uA97F|\uAC00-\uD7AF|\uD7B0-\uD7FF]");
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;
class FindPassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {
				name: "",
				email: "",
				email_suffixes: "naver.com",
			},
			openModalFindPassword: false,
			openModalSuccessFindPassword: false,
			message: '',
			loading: false,
			isClick: false
		}
	}

	handleChangeData = (data) => {
		this.setState({
			data: {
				...this.state.data,
				...data,
			},
		});
	}

	handleChangeSelectOption = (name, value) => {
		let dataOption = {};
		dataOption[name] = value;

		this.handleChangeData(dataOption);
	}

	returnLogin = () => {
		window.location.href = '/login';
	}

	validForm = () => {
		const { name, email } = this.state.data;

		var dataError = [];
		let error = {};
		let dataStatus = true;
		let result = {};
		if (name.trim().length === 0 || name.trim().length > 22 || isCharacterValid(name.trim(), HANGUL)) {
			error = {
				name: 'name validate',
				msg: "이름을 올바르게 입력하십시오."
			};
			dataError.push(error);
			dataStatus = false;
		}else {
			if (email.trim().length === 0) {
				error = {
					name: 'email validate',
					msg: "이메일은 비어 있지 않습니다."
				};
				dataError.push(error);
				dataStatus = false;
			}
		}
		
		this.setState({
			errors: dataError,
			status: dataStatus
		});

		result = { 'errors': dataError, 'status': dataStatus };

		return result;
	}

	submitForm = async (e) => {
		this.handleChange({'loading':true});
		this.setState({
			isClick: true
		})
		e.preventDefault();
		
		const { name, email, email_suffixes } = this.state.data;
		let data = {
			name: name.trim(),
			email: email.trim(),
			email_suffixes: email_suffixes
		}
		let result = this.validForm();
		let errors = result.errors;
		try {
			if (result.status) {
				let response = await getUserFindByEmail(data);

				if (response.data.user !== undefined) {
					this.setState({
						message: response.message,
						openModalSuccessFindPassword: true
					});
				} else {
					this.setState({
						message: response.message,
						openModalFindPassword: true
					});
				}
			} else {
				for (var i = 0; i < errors.length; i++) {
					toast.error(errors[i].msg);
				}
			}
			setTimeout(() => {
				this.setState({
					isClick: false
				})
			}, 3000);
			this.handleChange({'loading':false});
		} catch (e) {
			console.log(e);
		}
	}

	handleChange = (data) => {
		this.setState({
			...data
		});
	}

	render() {
		return (
			<div className="page-findpassword bg-white">
				<ToastContainer />
				<form onSubmit={this.submitForm}>
					<div className="wrapper-login fadeInDown">
						<div id="formContent">
							<div className="fadeIn first">
								<h1>비밀번호 찾기</h1>
							</div>
							<Input
								name="text"
								value={this.state.data.name}
								label="이름"
								placeholder="이름을 입력해주세요"
								onChange={(e) => this.handleChangeData({ name: e.target.value })}
							/>
							<InputEmail
								email={this.state.data.email}
								email_suffixes={this.state.data.email_suffixes}
								handleChangeData={this.handleChangeData}
								label="이메일 아이디"
							/>
							<div className="form-groups mt-2">
								<button 
									ref="btn"
									disabled={this.state.isClick}
									className="btn btn-default w-100 m-0"
									type="submit">
								전송</button>
							</div>
							<div className='sweet-loading'>
								<BeatLoader
								css={override}
								sizeUnit={"px"}
								size={10}
								color={'#123abc'}
								loading={this.state.loading}
								/>
							</div>
						</div>
					</div>
				</form>
				<Modal className='modalPopup w-45'
					id="errorFindPassword"
					show={this.state.openModalFindPassword}
					onHide={() => this.handleChange({ openModalFindPassword: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						{this.state.message}
					</div>
					<div className="action-footer text-center">
						<button
							className="btn btn-secondary"
							onClick={() => this.handleChange({ openModalFindPassword: false })}
						>확인</button>
					</div>
				</Modal>

				<Modal className='modalPopup w-45'
					id="successFindPassword"
					show={this.state.openModalSuccessFindPassword}
					onHide={() => this.handleChange({ openModalSuccessFindPassword: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						{this.state.message}
					</div>
					<div className="action-footer text-center">
						<span>
							<button
								className="btn btn-secondary"
								onClick={() => this.returnLogin()}
							>로그인
							</button>
						</span>
					</div>
				</Modal>
			</div>
		);
	}
}

export default FindPassword;