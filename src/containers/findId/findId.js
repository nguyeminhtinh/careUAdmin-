import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap-modal';
import '../../public/css/findId.css';
import { isNumberKey, getPrefixPhoneNumber, isCharacterValid } from '../../services/functionService';
import { } from '@babel/polyfill';
import Select from 'react-select';
import { getUserFindId } from '../../services/userService';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HANGUL = new RegExp("[\u1100-\u11FF|\u3130-\u318F|\uA960-\uA97F|\uAC00-\uD7AF|\uD7B0-\uD7FF]");
class FindId extends Component {
	constructor() {
		super();
		this.state = {
			errors: [],
			user: {},
			openModalFindId: false,
			selectNumber: "",
			message: "",
			isClick: false
		}
	}

	validForm = () => {
		var userName = ReactDOM.findDOMNode(this.refs.userName).value;
		var phoneNumberPart02 = ReactDOM.findDOMNode(this.refs.phoneNumberPart02).value;
		var phoneNumberPart03 = ReactDOM.findDOMNode(this.refs.phoneNumberPart03).value;
		var dataError = [];
		let error = {};
		let dataStatus = true;
		let result = {};

		if (userName.trim().length === 0 || userName.trim().length > 22 || isCharacterValid(userName.trim(), HANGUL)) {
			error = {
				name: "required",
				msg: "이름을 정확히 입력해주세요"
			};
			dataError.push(error);
			dataStatus = false;
		}else {
			if (phoneNumberPart02.length !== 4 || phoneNumberPart03.length !== 4) {
				error = {
					name: "required and valid",
					msg: "휴대전화번호를 정확히 입력해주세요"
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
		this.setState({
			isClick: true
		})
		e.preventDefault();
		var userName = ReactDOM.findDOMNode(this.refs.userName).value;
		var phoneNumberPart02 = ReactDOM.findDOMNode(this.refs.phoneNumberPart02).value;
		var phoneNumberPart03 = ReactDOM.findDOMNode(this.refs.phoneNumberPart03).value;
		let phone = this.state.selectNumber + '-' + phoneNumberPart02 + '-' + phoneNumberPart03;
		let result = this.validForm();
		let errors = result.errors;

		try {
			if (result.status) {
				let response = await getUserFindId(userName, phone);

				if (response.data.user !== undefined) {
					this.props.history.push("find-id-success", { email: response.data.user.email });
				} else {
					this.handleChange({ 'message': response.message });
					this.handleChange({ 'openModalFindId': true });
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
			<div className="page-findId bg-white">
				<ToastContainer />
				<div className="wrapper-login fadeInDown">
					<div id="formContent">
						<div className="fadeIn first heading">
							<h1>아이디 찾기</h1>
						</div>
						<form className="input-content" onSubmit={this.submitForm}>
							<div className="form-groups">
								<label className="text text-left">이름<span className="text-danger"> *</span></label>
								<input
									type="text"
									className="fadeIn second form-control col-12"
									placeholder="이름을 입력해주세요"
									name="userName"
									ref="userName" />
							</div>
							<label className="text text-left form-groups mb-0 mt-2">휴대전화번호<span className="text-danger"> *</span></label>
							<div className="form-groups d-flex clearfix">

								<div className="d-flex justify-content-start handling-problem custom-slectoption h38">
									<Select
										className="d-inline-block"
										value=""
										onChange={(e) => this.handleChange({ selectNumber: e.value })}
										options={getPrefixPhoneNumber().prefix}
										blurInputOnSelect={true}
										isSearchable={false}
										name="phoneNumberPart01"
									/>
									<input
										type="text"
										className="form-control combo-input top5 w85"
										value={this.state.selectNumber}
										placeholder="000"
										onKeyPress={(e) => isNumberKey(e)}
										maxLength="3"
										onChange={(e) => this.handleChange({ selectNumber: e.target.value })}
									/>
								</div>
								<span className="dash col-1 float-left">-</span>
								<input
									type="text"
									className="form-control col-3 float-left"
									placeholder="0000"
									name="phoneNumberPart02"
									maxLength="4"
									onKeyPress={(e) => isNumberKey(e)}
									ref="phoneNumberPart02" />
								<span className="dash col-1 float-left">-</span>
								<input
									type="text"
									className=" form-control col-3 float-left"
									placeholder="0000"
									name="phoneNumberPart03"
									maxLength="4"
									onKeyPress={(e) => isNumberKey(e)}
									ref="phoneNumberPart03" />
							</div>
							<div className="form-groups text-left mt-3">
								<button
									disabled={this.state.isClick}
									type="submit"
									className="btn btn-default btn-width-l"
									type="submit">다음
								</button>
							</div>
						</form>
					</div>
				</div>
				<Modal className='modalPopup w-45'
					id="errorFindId"
					show={this.state.openModalFindId}
					onHide={() => this.handleChange({ openModalFindId: false })}
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
							onClick={() => this.handleChange({ openModalFindId: false })}
						>확인</button>
					</div>
				</Modal>
			</div>
		);
	}
}

export default FindId;