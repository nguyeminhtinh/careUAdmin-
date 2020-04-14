import React, { Component } from 'react';
import { isNumberKey, isCharacterValid, getSuffixEmail, getPrefixPhoneNumber } from '../../services/functionService';
import Modal from 'react-bootstrap-modal';
import { TYPE_ERROR } from '../../config.json';
import imgError from "../../public/images/errors.png";
import imgSuccess from "../../public/images/success.png";
import auth from '../../services/authService';
import Select from 'react-select';
import { getUserProfile } from '../../services/userService';
import { updateProfile } from '../../services/userService';
import { toast } from 'react-toastify';
import {checkPhoneExists} from '../../services/authService';
import {closeJoinHospital} from '../../services/hospitals';

import {  withRouter } from 'react-router-dom';

const MASTER = 2;
const ALPHANUMERIC = /^[a-zA-Z0-9!@#$%^&*()]+$/i;
const BTN_SUBMIT_VALID = "btn-primary";
const BTN_SUBMIT_INVALID = "btn-secondary";
const CANCEL = "cancel";
const EDIT = "edit";

class EditProfile extends Component {
	state = {
		errorPassword: "",
		errorConfirmPassword: "",
		errorPhoneNumber: "",
		errorPhoneUnique: false,
		editProfileModal: false,
		terminationModal: false,
		modalMessage: "",
		modalEvent: "",
		profile: {		
			role: null,
			hospitalName: "",
			email: '',
			phone: '',
			hospital: '',
			phone_head: '',
		},
		hospital: {
			codeFirst: '',
			codeMiddle: '',
			codeEnd: '',
		}
	}

	componentWillMount() {
		this._renderData(this.props.profile.id);
	}

	getCodeHospital = (hospital) => {
		if(hospital && hospital.code && hospital.code !== null) {
			let code = hospital.code;
			let arrCode = code.split("-");
			if(arrCode.length > 0) {
				this.setState({
					hospital: {
						codeFirst: arrCode[0],
						codeMiddle: arrCode[1],
						codeEnd: arrCode[2]
					}
				})
				}
		}
	}

	_renderData = async (id) => {
		let response = await getUserProfile(id);
		this.setState({
			profile: response.data.data
		});
		this.getCodeHospital(response.data.data.hospital)
	}

	renderTitle = () => {
		const { role } = this.state.profile;

		if (role !== null) {
			if (role.id === MASTER) {
				return (
					<label className="title-register font-weight-light">원장(마스터) 정보</label>
				);
			}
		}

		return (
			<label className="title-register font-weight-light">일반 정보</label>
		);
	}

	openModalTerminateMaster = () => {
		this.handleChangeData({ terminationModal: true, modalMessage: "폐업 시 모든 정보는 초기화되고정산 시 문제가 없어야 폐업이 가능합니다문의사항이 있으면 00-000-0000로 연락주세요." })
	}

	openModalTerminateNormal = () => {
		this.handleChangeData({ terminationModal: true, modalMessage: "해지하겠습니까? 이 병원의 소속에서 해지됩니다" })
	}

	handleCloseJoinHospital = async () => {
		let data = {'user_id' : this.props.profile.id};
		let response = await closeJoinHospital(this.props.profile.hospital.id, data);

		if(response.data.data.length !== 0){
			this.handleChangeData({ terminationModal: false})
			toast.success(response.data.message);
			setTimeout(() => { this.navLoginPage(true); }, 3000);
		}else {
			toast.error(response.data.message);
		}
	}

	renderBtnTermination = () => {
		const { role } = this.state.profile;

		if (role !== null) {
			if (role.id === MASTER) {
				return (
					<button
						type="button"
						className="btn btn-secondary btn-width-l mt-0"
						onClick={this.openModalTerminateMaster}
					>폐업</button>
				);
			}
		}

		return (
			<button
				type="button"
				className="btn btn-secondary btn-width-l mt-0"
				data-toggle="modal"
				data-target="#modalTerminationNormal"
				onClick={this.openModalTerminateNormal}
			>해지</button>
		);
	}

	renderError = (result, messageError) => {
		if (result === TYPE_ERROR.ERROR) {
			return (
				<div>
					<img src={imgError} alt="" className="display-middle message-icon" />
					<p className="display-bottom-left m-0 text-danger">{messageError}</p>
				</div>
			);
		} else if (result === TYPE_ERROR.VALID) {
			return (
				<img src={imgSuccess} alt="" className="display-middle message-icon" />
			);
		}
	}

	renderContentUserMaster = () => {
		const { profile } = this.state;

		if (profile.role !== null) {
			if (profile.role.id === MASTER) {
				return (
					<div>
						<label className="title-register font-weight-light">병원 정보</label>
						<table className="table table-bordered">
							<tbody>
								<tr>
									<th>병원이름<span className="text-danger">*</span></th>
									<td className="position-relative">
										<input type="text"
											className="form-control border col-7 m-0"
											placeholder="병원이름을 입력해주세요"
											name="hospitalName" maxLength="100"
											disabled
											defaultValue={profile.hospital.name} />
										<button className="btn btn-secondary display-middle margin-right-x disabled not-allowed">병원검색</button>
									</td>
								</tr>
								<tr>
									<th>요양기관기호<span className="text-danger">*</span></th>
									<td className="position-relative">
										<input type="text"
											className="form-control border col-10 m-0"
											placeholder="요양기관기호를 입력해주세요"
											name="nursingSign" maxLength="8"
											disabled
											defaultValue={profile.hospital.symbol} />
									</td>
								</tr>
								<tr>
									<th>사업자등록증 번호<span className="text-danger">*</span></th>
									<td className="position-relative">
										<input type="text" className="form-control border col-2 m-0 float-left"
											name="businessNumber01" maxLength="3"
											disabled value={this.state.hospital.codeFirst}
										/>
										<span className="dash-letter col-1 float-left">-</span>
										<input type="text" className="form-control border col-2 m-0 float-left"
											name="businessNumber02" maxLength="2"
											disabled value={this.state.hospital.codeMiddle}
										/>
										<span className="dash-letter col-1 float-left">-</span>
										<input type="text" className="form-control border col-2 m-0 float-left"
											name="businessNumber03" maxLength="5"
											disabled value={this.state.hospital.codeEnd}
										/>
									</td>
								</tr>
								<tr>
									<th>사업자등록증<span className="text-danger">*</span></th>
									<td className="position-relative">
										<input type="text"
											className="form-control border col-7 m-0"
											placeholder="파일 업로드 하세요"
											name="businessImage"
											disabled
											defaultValue={profile.hospital.image} />
										<input type="file"
											name="uploadFile"
											id="uploadFile"
											accept="image/png, image/jpeg, image/jpg"
											className="d-none"
											onChange={this.getFileName}
										/>
										<button
											className="btn-upload btn btn-secondary display-middle margin-right-x disabled not-allowed"
											disabled >
											업로드
									</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				);
			}
		}
	}

	handleMasking = (refName) => {
		var masking;
		if (refName === "password") {
			masking = this.getPassword;
		} else {
			masking = this.getConfirmPassword;
		}
		if (masking.type === "password") {
			masking.type = "text";
		} else {
			masking.type = "password";
		}
	}

	checkPassword = () => {
		var password = this.getPassword.value;
		var	confirmPassword = this.getConfirmPassword.value;
		if(password !== '')
		{
			if (password.length < 6 || password.length > 16 || isCharacterValid(password, ALPHANUMERIC)) {
				this.setState({
					errorPassword: TYPE_ERROR.ERROR
				})
			} else {
				this.setState({
					errorPassword: TYPE_ERROR.VALID
				})
				if (password === confirmPassword) {
					this.setState({
						errorPassword: TYPE_ERROR.VALID
					})
					this.setState({
						errorConfirmPassword: TYPE_ERROR.VALID
					})
				} else {
					this.setState({
						errorConfirmPassword: TYPE_ERROR.ERROR
					})
				}
			}
		} else if(password === '' && confirmPassword === '') {
			this.setState({
				errorPassword: '',
				errorConfirmPassword: ''
			});
		}
	}

	checkConfirmPassword = () => {
		var password = this.getPassword.value;
		var confirmPassword = this.getConfirmPassword.value;

		if(confirmPassword !== '')
		{
			if (confirmPassword.length < 6 || confirmPassword.length > 16 || isCharacterValid(confirmPassword, ALPHANUMERIC)) {
				this.setState({
					errorConfirmPassword: TYPE_ERROR.ERROR
				})
			} else {
				if (password === confirmPassword) {
					this.setState({
						errorPassword: TYPE_ERROR.VALID
					})
					this.setState({
						errorConfirmPassword: TYPE_ERROR.VALID
					})
				} else {
					this.setState({
						errorConfirmPassword: TYPE_ERROR.ERROR
					})
				}
			}
		} else if(password === '' && confirmPassword === '') {
			this.setState({
				errorPassword: '',
				errorConfirmPassword: ''
			});
		}
	}

	checkPhoneNumber = async () => {
		var phoneHead = this.getPhoneHead.value,
			phoneMidle = this.getPhoneMidle.value,
			phoneEnd = this.getPhoneEnd.value,
			verifyPhoneNumber = this.getVerifyPhoneNumber;

		var valuePhone = phoneHead + '-' + phoneMidle + '-'+ phoneEnd;

		if(valuePhone != this.state.profile.phone)
		{
			let phoneExists = await checkPhoneExists(valuePhone);
			if (phoneExists.data.data === true) {
				this.setState({
					errorPhoneUnique: true,
					errorPhoneNumber: TYPE_ERROR.ERROR
				})
			}else if (phoneHead.length >= 2 && phoneHead.length <= 4 &&
				phoneMidle.length === 4 && phoneEnd.length === 4) {
				verifyPhoneNumber.innerHTML = "인증완료";
				this.setState({
					errorPhoneUnique: false,
					errorPhoneNumber: TYPE_ERROR.VALID,
				})
			} else {
				verifyPhoneNumber.innerHTML = "본인인증";
				this.setState({
					errorPhoneUnique: false,
					errorPhoneNumber: TYPE_ERROR.ERROR
				})
			}
		}else {
			this.setState({
				errorPhoneUnique: false,
				errorPhoneNumber: TYPE_ERROR.VALID
			})
		}
	}

	checkSelectPhoneNumber = (data) => {
		var phoneHead = this.getPhoneHead.value;
		phoneHead = data.phonefirst;
		this.checkPhoneNumber(phoneHead);
		this.setState({
			profile:{
				...this.state.profile,
				phone_head: phoneHead
			}
		});
	}

	navLoginPage = (isChangedPass) => {
		if (isChangedPass) {
			auth.logout();
			this.props.history.push('/login');
		} else {
			const urlHome = localStorage.getItem('urlHome')
			this.props.history.push(urlHome);
		}

	}

	handelModalEvent = (step) => {
		if (step === CANCEL) {
			this.navLoginPage(false);
		} else if (step === EDIT) {
			this.handleSaveData();
		}
	}

	removeLocalStorage = () => {
		localStorage.removeItem('email');
		localStorage.removeItem('password');
		localStorage.removeItem('email_suffixes');
		localStorage.removeItem('remember');
	}

	handleSaveData = () => {
		this.handleChangeData({ editProfileModal: false })

		// save data update
		// 이메일 아이디*	
		// let emailPart01 = ReactDOM.findDOMNode(this.refs.emailPart01).value;
		// let emailPart02 = ReactDOM.findDOMNode(this.refs.emailPart02).value;

		// 비밀번호
		let isChangedPass = false;
		let password = this.getPassword.value;
		if (password !== '') {
			isChangedPass = true;
			this.removeLocalStorage();
		}

		//비밀번호 확인
		// let confirmPassword = ReactDOM.findDOMNode(this.refs.confirmPassword).value;

		//휴대전화번호
		// let phoneHead = ReactDOM.findDOMNode(this.refs.phoneHead).value;
		// let phoneMidle = ReactDOM.findDOMNode(this.refs.phoneMidle).value;
		// let phoneEnd = ReactDOM.findDOMNode(this.refs.phoneEnd).value;

		this.navLoginPage(isChangedPass);
	}

	isFormValid = () => {
		var chekFormValid = this.state.errorPassword !== TYPE_ERROR.ERROR
			&& this.state.errorConfirmPassword !== TYPE_ERROR.ERROR
			&& this.state.errorPhoneNumber !== TYPE_ERROR.ERROR;

		return chekFormValid;
	}

	submitForm =  async (e) => {
		if(this.isFormValid())
		{
			e.preventDefault();
			var password = this.getPassword.value.trim();
			var password_confirmation = this.getConfirmPassword.value.trim();

			var phoneHead = this.getPhoneHead.value;
			var phoneMidle = this.getPhoneMidle.value;
			var phoneEnd = this.getPhoneEnd.value;
			
			//phoneHead = this.state.selectNumber !== null ? this.state.selectNumber : phoneHead;
			let phone = phoneHead + '-' + phoneMidle + '-' + phoneEnd;
			let data = {
					phone: phone
				}
			try {
				if(password !== "")
				{
					data = {
						password: password,
						password_confirmation: password_confirmation,
						phone: phone
					}
				}
				let response = await updateProfile(this.props.profile.id, data);

				if(response.errors === undefined)
				{
					this.handleChangeData({ editProfileModal: true, modalMessage: "개인정보가 수정되었습니다.", modalEvent: EDIT });
					
				}else {
					toast.error(response.errors.message);
				}
			} catch (ex) {
				console.log(ex);
			}
		}
	}

	updateValue = (e, name) => {
		this.handleChangeData(e, name);  //call the passed props here
	}

	handleChangeData = (data) => {
		this.setState({
			...data
		});
	}

	render() {
		const { profile } = this.state;
		const btnSumitStatus = (this.isFormValid() ? BTN_SUBMIT_VALID : BTN_SUBMIT_INVALID);

		return (
			<div className="stage-register edit-user bg-white">
				<div>
					{this.renderTitle()}
					<table className="table table-bordered">
						<tbody>
							<tr>
								<th>이메일 아이디<span className="text-danger">*</span></th>
								<td className="position-relative input-email-custom">
									<input type="text"
										className="form-control col-6 m-0 float-left"
										placeholder=" 이메일 아이디를 입력해주세요"
										name="emailPart01"
										ref={(input) => this.getEmail = input}
										disabled
										defaultValue={profile.email.split("@")[0]} />

									<span className="dash-letter col-1 float-left">@</span>
									<div className="position-relative d-inline-block custom-p custom-disabled">
										<Select
											className="mail-suffix-sel float-left top-0"
											isDisabled={true}
											options={getSuffixEmail().suffixes}
											blurInputOnSelect={true}
											isSearchable={false}
										/>
										<input
											type="text"
											disabled
											defaultValue={profile.email.split("@")[1]}
											className="form-control col-11 combo-input disabled"
											placeholder="naver.com"
											ref="emailPart02"
										/>
									</div>
								</td>
							</tr>
							<tr>
								<th>새 비밀번호<span className="text-danger"></span></th>
								<td className="position-relative">
									<div className="input-custom masking">
										<input type="password"
											className="form-control col-10 m-0"
											placeholder="비밀번호를 입력해주세요"
											name="password"
											onBlur={this.checkPassword}
											// ref="password"
											ref={(input) => this.getPassword = input}											
											/>
										<i className="fa fa-eye" onClick={this.handleMasking.bind(this, "password")} />
									</div>
									{this.renderError(this.state.errorPassword, "6~16자리의 영문자, 숫자, 특수문자(!@#$%^&*()) 만 사용할 수 있습니다.")}
								</td>
							</tr>
							<tr>
								<th>새 비밀번호 확인<span className="text-danger"></span></th>
								<td className="position-relative">
									<div className="input-custom masking">
										<input type="password"
											className="form-control col-10 m-0"
											placeholder="비밀번호를 다시 입력해주세요"
											name="confirmPassword"
											onBlur={this.checkConfirmPassword}
											// ref="confirmPassword"
											ref={(input) => this.getConfirmPassword = input}
											//defaultValue={profile.password} 
											/>
										<i className="fa fa-eye" onClick={this.handleMasking.bind(this, "confirmPassword")} />
									</div>
									{this.renderError(this.state.errorConfirmPassword, "입력한 비밀번호와 일치하지 않습니다.")}
								</td>
							</tr>
							<tr>
								<th>이름<span className="text-danger">*</span></th>
								<td className="position-relative">
									<input type="text"
										className="form-control col-10 m-0"
										placeholder="이름"
										name="full_name"
										// ref="name"
										ref={(input) => this.getName = input}
										disabled
										defaultValue={profile.full_name} />
								</td>
							</tr>
							<tr>
								<th>휴대전화번호<span className="text-danger">*</span></th>
								<td className="position-relative d-flex align-items-center select-fix border-none">
									<div className="d-flex justify-content-start handling-problem custom-slectoption w80">
										<Select
											options={getPrefixPhoneNumber().prefix}
											onChange={(e) => this.checkSelectPhoneNumber({ phonefirst: e.value })}
											blurInputOnSelect={true}
											isSearchable={false}
											placeholder="000"
										/>
										<input
											type="text"
											className="form-control combo-input top4"
											name="phoneHead"
											ref={(input) => this.getPhoneHead = input}
											placeholder="000"
											onKeyPress={(e) => isNumberKey(e)}
											maxLength="3"
											onBlur={this.checkPhoneNumber}
											value={profile.phone_head}
											onChange={(e) => this.checkSelectPhoneNumber({ phonefirst: e.target.value })}
										/>
									</div>

									<span className="dash-letter col-1 float-left">-</span>
									<input type="text" className="form-control border col-2 m-0 float-left"
										placeholder="0000" name="phoneMidle" maxLength="4"
										onKeyPress={(e) => isNumberKey(e)}
										ref={(input) => this.getPhoneMidle = input}
										onBlur={this.checkPhoneNumber}
										defaultValue={profile.phone_midle}
									/>
									<span className="dash-letter col-1 float-left">-</span>
									<input type="text" className="form-control border col-2 m-0 float-left"
										placeholder="0000" name="phoneEnd" maxLength="4"
										onKeyPress={(e) => isNumberKey(e)}
										// ref="phoneEnd"
										ref={(input) => this.getPhoneEnd = input}
										onBlur={this.checkPhoneNumber}
										defaultValue={profile.phone_end}
									/>
									<button type="button"
										className="btn btn-secondary display-middle margin-right-x"
										ref={(value) => this.getVerifyPhoneNumber = value}>
										인증완료
									</button>
									{this.renderError(this.state.errorPhoneNumber,this.state.errorPhoneUnique ? "전화 번호가 이미 있습니다." : "휴대전화번호를 정확히 입력해주세요.")}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				{this.renderContentUserMaster()}
				<div className="form-groups d-flex justify-content-between text-right">
					{this.renderBtnTermination()}
					<div>
						<button
							type="button"
							className={"btn btn-width-l mr-3 mt-0 " + btnSumitStatus}
							onClick={this.submitForm}
						>수정</button>
						<button
							type="button"
							className="btn btn-secondary btn-width-l mt-0"
							onClick={() => this.handleChangeData({ editProfileModal: true, modalMessage: "취소하시겠습니까?", modalEvent: CANCEL })}
						>취소</button>
					</div>
				</div>
				<p className="mt-3">※ 문의 사항은 카카오플러스 CareU 검색,  친구 추가 시  상담을 통해 신속히 해결할 수 있습니다.</p>
				<Modal className='modalPopup w-45'
					show={this.state.terminationModal}
					onHide={() => this.handleChangeData({ terminationModal: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						{this.state.modalMessage}
					</div>
					<div className="action-footer text-center">
						<button
							className="btn btn-primary mr-3"
							onClick={this.handleCloseJoinHospital}
						>요청</button>
						<button
							className="btn btn-secondary"
							onClick={() => this.handleChangeData({ terminationModal: false })}
						>취소</button>
					</div>
				</Modal>
				<Modal className='modalPopup w-45'
					show={this.state.editProfileModal}
					onHide={() => this.handleChangeData({ editProfileModal: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						{this.state.modalMessage}
					</div>
					<div className="action-footer text-center">
						<button
							className="btn btn-secondary"
							onClick={() => this.handelModalEvent(this.state.modalEvent)}
						>확인</button>
					</div>
				</Modal>
			</div>
		);
	}
}

export default withRouter(EditProfile);
