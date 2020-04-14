import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { isNumberKey, isCharacterValid, getSuffixEmail, getPrefixPhoneNumber } from '../../services/functionService';
import imgError from "../../public/images/errors.png";
import imgSuccess from "../../public/images/success.png";
import { TYPE_USER, TYPE_ERROR } from '../../config.json';
import _ from 'lodash';
import Modal from 'react-bootstrap-modal';
import auth from '../../services/authService';
import {checkPhoneExists, checkMailExists} from '../../services/authService';
import { } from '@babel/polyfill';
import Select from 'react-select';
import { PAGESIZE } from "../../config.json";
import ModalFormResult from "../home/modalFormResult";
import httpService from '../../services/httpService';
import { getUnRegistereds } from '../../services/hospitals';
import HospitalModalSearch from './hospitalModalSearch';
import { ToastContainer, toast } from "react-toastify";

const HANGUL = new RegExp("[\u1100-\u11FF|\u3130-\u318F|\uA960-\uA97F|\uAC00-\uD7AF|\uD7B0-\uD7FF]");
const ALPHANUMERIC = /^[a-zA-Z0-9!@#$%^&*()]+$/i;
const EMAIL_CHARACTER = /^[a-zA-Z0-9_.\\-]+$/i;
const NUMBER_DIGIT = /^[0-9]+$/i;
const VALID_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const BTN_SUBMIT_VALID = "btn-primary";
const BTN_SUBMIT_INVALID = "btn-secondary";
const apiEndpoint = process.env.REACT_APP_API_URL + "signup";


class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorEmail: "",
			errorEmailUnique: "",
			errorPassword: "",
			errorConfirmPassword: "",
			errorName: "",
			errorPhoneNumber: "",
			errorPhoneUnique: "",
			errorHospitalName: "",
			errorNursingSign: "",
			errorBusinessNumber: "",
			errorUploadFile: "",
			//registerStatus: [],
			openModalCancelRegister: false,
			openModalJoin: false,
			openModalRegisterFail: false,
			email_suffixes: "naver.com",
			selectNumber: "",
			dataHospitals: {
				params: [
					{ title: "병원명", value: "name" },
					{ title: "병원", value: "type", renderer: this._renderContent, className: "text-center" },
					{ title: "전화번호", value: "phone", renderer: this._renderContent, className: "text-center" },
					{ title: "우편번호", value: "zip_code", renderer: this._renderContent, className: "text-center" },
					{ title: "주소", value: "address", renderer: this._renderContent, className: "text-center" },
					{ title: "홈페이지", value: "website", renderer: this._renderContent, className: "text-center" }
				],
				body: [],
				keyword: '',
				page: 1,
				pageSz: PAGESIZE,
				totalPage: 0
			},
			id_hospital: 0,
			dataItem: {},
			dataSearch: {},
			openModalFormResult: false,
			openModalRequest: false,
			openModalModalAlert: false,
			sizeModal: "",
			hospitalName: "",
			nursingSign: "",
			businessNumber01: "",
			businessNumber02: "",
			businessNumber03: "",
			businessImage: "",
		}
	}

	async componentWillMount() {
		
		const { page, pageSz, keyword } = this.state.dataHospitals;
		await this._renderDataHospital(keyword, page, pageSz);
	}

	_renderContent = (data, value) => {
		return <span>{data[value] || "-"}</span>;
	}

	renderDataOption = (option) => {
		let html = [];
		option.map((item, index) => {
			html.push(
				<option key={index} value={item.value}>{item.value}</option>
			);
			return item;
		});
		return html;
	}

	renderDataOptionNumber = (option) => {
		let html = [];
		option.map((item, index) => {
			html.push(
				<option key={index} value={item}>{item}</option>
			);
			return item;
		});
		return html;
	}

	getTextSuffixMail = (e) => {
		var emailPart02 = ReactDOM.findDOMNode(this.refs.emailPart02);
		emailPart02.value = e.value;
	}

	renderTitle = () => {
		if (this.props.type_user === TYPE_USER.MASTER) {
			return (
				<label className="title-register font-weight-light">원장(마스터) 정보</label>
			);
		}

		return (
			<label className="title-register font-weight-light">일반 정보</label>
		);
	}

	handleSubmitSearch = async (keyword = '') => {
		const { page, pageSz } = this.state.dataHospitals;
		await this._renderDataHospital(keyword, page, pageSz);
		
		this.setState({
			openModalFormResult: true,
			dataHospitals:{
				...this.state.dataHospitals,
				keyword: keyword
			}
		});
	};

	_renderDataHospital = async (keyword, page, pageSz) => {
		const { id } = this.state.dataItem;
		let response = await getUnRegistereds(keyword, page, pageSz);
		let dataResult = [];

		if (response.data.data.hospitals) {
			dataResult = [...response.data.data.hospitals];
		}
		let sizeModal = "";

		// if (dataResult.length === 0) {
		// 	sizeModal = "w-55";
		// }

		if (id !== undefined) {
			dataResult = dataResult.filter(item => item.id !== id);
		}

		this.setState({
			dataHospitals: {
				...this.state.dataHospitals,
				body: dataResult,
				page: page,
				totalPage: response.data.data.total
			},
			sizeModal
		});
	};

	handleChangePage = page => {
		let { keyword } = this.state.dataHospitals;
		this.setState(
			{
				dataHospitals: {
					...this.state.dataHospitals,
					page: page
				}
			}, () => {
				this._renderDataHospital(keyword, page, this.state.dataHospitals.pageSz);
			}
		);
	};

	onHandleChange = data => {
		this.setState({
			...data
		});
	};

	handleCloseModal = () => {
		this.setState({
			dataHospitals: {
				...this.state.dataHospitals,
				page: 1
			},
			openModalFormResult: false
		}, () => {
			this._renderDataHospital('', 1, this.state.dataHospitals.pageSz);
		});
	}

	handleClickRow = dataItem => {
		let data = JSON.stringify(this.state.dataHospitals.body);
		data = JSON.parse(data);

		data.map(item => {
			if (item.id === dataItem.id) {
				item.className = "active";
			} else {
				item.className = "";
			}

			return item;
		});

		this.setState({
			dataHospitals: {
				...this.state.dataHospitals,
				body: data
			},
			id_hospital: dataItem.id
		});
	};

	handleCheck = () => {
		let key = this.state.hospitalName;
		const { id_hospital } = this.state;
		const { body } = this.state.dataHospitals;

		let dataResult = {};
		dataResult = body.filter(item => item.id === id_hospital);

		if (dataResult.length !== 0) {
			dataResult = dataResult[0];
			dataResult.department_id = 1;
			key = dataResult.name;
		}

		if (key.length === 0) {
			this.onHandleChange({ openModalModalAlert: true });
		} else {
			let hospitalName, hospitalID = key;
			if (dataResult.name !== undefined) {
				hospitalName = dataResult.name;
				hospitalID = dataResult.id;
			}

			this.setState({
				dataItem: dataResult,
				key: "",
				openModalFormResult: false,
				hospitalID: hospitalID,
				hospitalName: hospitalName,
				errorHospitalName: TYPE_ERROR.VALID,
				// errorNursingSign: TYPE_ERROR.VALID,
				// errorBusinessNumber: TYPE_ERROR.VALID,
				// errorUploadFile: TYPE_ERROR.VALID
			}, () => {
				this.handleCloseModal();
			});
		}

	};

	handleChangeDepartment = data => {
		this.setState({
			dataItem: {
				...this.state.dataItem,
				...data
			}
		});
	};

	renderContentUserMaster = () => {
		const { hospitalName, nursingSign, businessNumber01, businessNumber02, businessNumber03, businessImage } = this.state;

		if (this.props.type_user === TYPE_USER.MASTER) {
			return (
				<div>
					<ToastContainer />
					<label className="title-register font-weight-light">병원 정보</label>
					<table className="table table-bordered">
						<tbody>
							<tr>
								<th>병원이름<span className="text-danger">*</span></th>
								<td className="position-relative">
									<input type="text"
										className="form-control border col-7 m-0 not-allowed black"
										disabled
										placeholder="병원이름을 입력해주세요"
										name="hospitalName" maxLength="100"
										ref="hospitalName"
										defaultValue={hospitalName}
									/>
									<button type="button" onClick={() => this.handleSubmitSearch('')} className="btn btn-secondary display-middle margin-right-x">병원검색</button>
									{this.renderError(this.state.errorHospitalName, "진행하기 전에 병원을 선택하십시오")}
								</td>
							</tr>
							<tr>
								<th>요양기관기호<span className="text-danger">*</span></th>
								<td className="position-relative">
									<input type="text"
										className="form-control border col-10 m-0"
										placeholder="요양기관기호를 입력해주세요"
										name="nursingSign" maxLength="8"
										ref="nursingSign"
										defaultValue={nursingSign}
										onBlur={this.checknursingSign} />
									{this.renderError(this.state.errorNursingSign, "숫자, 8자리만 입력 가능합니다.")}
								</td>
							</tr>
							<tr>
								<th>사업자등록증 번호<span className="text-danger">*</span></th>
								<td className="position-relative">
									<input type="text" className="form-control border col-2 m-0 float-left"
										name="businessNumber01" maxLength="3"
										onBlur={this.checkBusinessNumber}
										placeholder="000"
										defaultValue={businessNumber01}
										onKeyPress={(e) => isNumberKey(e)}
										ref="businessNumber01" />
									<span className="dash-letter col-1 float-left">-</span>
									<input type="text" className="form-control border col-2 m-0 float-left"
										name="businessNumber02" maxLength="2"
										onBlur={this.checkBusinessNumber}
										placeholder="00"
										defaultValue={businessNumber02}
										onKeyPress={(e) => isNumberKey(e)}
										ref="businessNumber02" />
									<span className="dash-letter col-1 float-left">-</span>
									<input type="text" className="form-control border col-2 m-0 float-left"
										name="businessNumber03" maxLength="5"
										onBlur={this.checkBusinessNumber}
										placeholder="00000"
										defaultValue={businessNumber03}
										onKeyPress={(e) => isNumberKey(e)}
										ref="businessNumber03" />
									{this.renderError(this.state.errorBusinessNumber, "숫자만 입력 가능합니다.")}
								</td>
							</tr>
							<tr>
								<th>사업자등록증<span className="text-danger">*</span></th>
								<td className="position-relative">
									<input type="text"
										className="form-control border col-7 m-0 not-allowed black"
										placeholder="파일 업로드 하세요"
										name="businessImage"
										defaultValue={businessImage}
										ref="businessImage"
										disabled
									/>
									<input type="file"
										name="uploadFile"
										id="uploadFile"
										accept="image/png, image/jpeg, image/jpg"
										className="d-none"
										onChange={(e) => this.getFileName(e.target)}
										ref="uploadFile" />
									<label htmlFor="uploadFile"
										className="btn-upload btn btn-secondary display-middle margin-right-x">
										업로드
                                    </label>
									{this.renderError(this.state.errorUploadFile, "PNG,JPEG,JPG 파일만 가능합니다.")}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			);
		}
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

	handleMasking = (refName) => {
		var masking;
		if (refName === "password") {
			masking = ReactDOM.findDOMNode(this.refs.password);
		} else {
			masking = ReactDOM.findDOMNode(this.refs.confirmPassword);
		}
		if (masking.type === "password") {
			masking.type = "text";
		} else {
			masking.type = "password";
		}
	}

	checkPassword = () => {
		var password = ReactDOM.findDOMNode(this.refs.password);
		var confirmPassword = ReactDOM.findDOMNode(this.refs.confirmPassword);
		// check name valid
		if (password.value.length < 6 || password.value.length > 16 || isCharacterValid(password.value, ALPHANUMERIC)) {
			this.setState({
				errorPassword: TYPE_ERROR.ERROR
			})
		} else {
			this.setState({
				errorPassword: TYPE_ERROR.VALID
			})

			if (confirmPassword.value !== '') {
				if (password.value === confirmPassword.value) {
					this.setState({
						errorConfirmPassword: TYPE_ERROR.VALID
					})
				} else {
					this.setState({
						errorConfirmPassword: TYPE_ERROR.ERROR
					})
				}
			}
		}
	}

	checkConfirmPassword = () => {
		var password = ReactDOM.findDOMNode(this.refs.password);
		var confirmPassword = ReactDOM.findDOMNode(this.refs.confirmPassword);

		//check maching password
		if (confirmPassword.value.length < 6 || confirmPassword.value.length > 16 || isCharacterValid(confirmPassword.value, ALPHANUMERIC)) {
			this.setState({
				errorConfirmPassword: TYPE_ERROR.ERROR
			})
		} else {
			if (password.value === confirmPassword.value) {
				this.setState({
					errorConfirmPassword: TYPE_ERROR.VALID
				})
			} else {
				this.setState({
					errorConfirmPassword: TYPE_ERROR.ERROR
				})
			}
		}
	}

	checkKoreaCharacter = () => {
		var name = ReactDOM.findDOMNode(this.refs.name);
		// check name valid
		if (name.value.length === 0 || name.value.length > 15 || isCharacterValid(name.value.trim(), HANGUL)) {
			this.setState({
				errorName: TYPE_ERROR.ERROR
			})
		} else {
			this.setState({
				errorName: TYPE_ERROR.VALID
			})
		}
	}



	checkHospitalName = () => {
		var hospitalName = ReactDOM.findDOMNode(this.refs.hospitalName);
		if (hospitalName.value === '') {
			this.setState({
				errorHospitalName: TYPE_ERROR.ERROR
			})
		} else {
			this.setState({
				errorHospitalName: TYPE_ERROR.VALID
			})
		}
	}

	checknursingSign = () => {
		var nursingSign = ReactDOM.findDOMNode(this.refs.nursingSign);
		if (nursingSign.value.length === 0 || nursingSign.value.length !== 8 || isCharacterValid(nursingSign.value, NUMBER_DIGIT)) {
			this.setState({
				errorNursingSign: TYPE_ERROR.ERROR
			})
		} else {
			this.setState({
				errorNursingSign: TYPE_ERROR.VALID
			})
		}
	}

	checkBusinessNumber = () => {
		var businessNumber01 = ReactDOM.findDOMNode(this.refs.businessNumber01);
		var businessNumber02 = ReactDOM.findDOMNode(this.refs.businessNumber02);
		var businessNumber03 = ReactDOM.findDOMNode(this.refs.businessNumber03);

		if (businessNumber01.value.length !== 3 || businessNumber02.value.length !== 2
			|| businessNumber03.value.length !== 5
			|| isCharacterValid(businessNumber01.value, NUMBER_DIGIT)
			|| isCharacterValid(businessNumber02.value, NUMBER_DIGIT)
			|| isCharacterValid(businessNumber03.value, NUMBER_DIGIT)) {
			this.setState({
				errorBusinessNumber: TYPE_ERROR.ERROR
			})
		} else {
			this.setState({
				errorBusinessNumber: TYPE_ERROR.VALID
			})
		}
	}


	getFileName = (oInput) => {
		if (_.isUndefined(oInput.files[0])) {
			return false;
		} else {
			var fileName = oInput.files[0].name;
			var businessImage = ReactDOM.findDOMNode(this.refs.businessImage);
			businessImage.value = fileName;
		}

		// check valid file type
		if (oInput.type === "file") {
			var sFileName = oInput.value;
			if (sFileName.length > 0) {
				var blnValid = false;
				for (var j = 0; j < VALID_FILE_EXTENSIONS.length; j++) {
					var sCurExtension = VALID_FILE_EXTENSIONS[j];
					if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() === sCurExtension.toLowerCase()) {
						blnValid = true;
						break;
					}
				}

				if (!blnValid) {
					oInput.value = "";
					this.setState({
						errorUploadFile: TYPE_ERROR.ERROR
					})
					return false;
				}
			}
		}

		this.setState({
			errorUploadFile: TYPE_ERROR.VALID
		})
		return true;
	}

	formValidate = () => {
		let emailPart01 = ReactDOM.findDOMNode(this.refs.emailPart01).value;
		if (emailPart01 === '') {
			this.checkEmail();
		}

		let password = ReactDOM.findDOMNode(this.refs.password).value;
		if (password === '') {
			this.checkPassword();
		}

		let confirmPassword = ReactDOM.findDOMNode(this.refs.confirmPassword).value;
		if (confirmPassword === '') {
			this.checkConfirmPassword();
		}

		let name = ReactDOM.findDOMNode(this.refs.name).value;
		if (name === '') {
			this.checkKoreaCharacter();
		}

		let phoneNumberPart02 = ReactDOM.findDOMNode(this.refs.phoneNumberPart02).value;
		let phoneNumberPart03 = ReactDOM.findDOMNode(this.refs.phoneNumberPart03).value;
		if (phoneNumberPart02 === '' && phoneNumberPart03 === '') {
			this.checkphoneNumber();
		}

		if (this.props.type_user === TYPE_USER.MASTER) {
			let hospitalName = ReactDOM.findDOMNode(this.refs.hospitalName).value;
			if (hospitalName === '') {
				this.checkHospitalName();
			}

			let nursingSign = ReactDOM.findDOMNode(this.refs.nursingSign).value;
			if (nursingSign === '') {
				this.checknursingSign();
			}

			let businessNumber01 = ReactDOM.findDOMNode(this.refs.businessNumber01).value;
			let businessNumber02 = ReactDOM.findDOMNode(this.refs.businessNumber02).value;
			let businessNumber03 = ReactDOM.findDOMNode(this.refs.businessNumber03).value;
			if (businessNumber01 === '' && businessNumber02 === '' && businessNumber03 === '') {
				this.checkBusinessNumber();
			}

			let businessImage = ReactDOM.findDOMNode(this.refs.businessImage).value;
			if (businessImage === '') {
				this.setState({
					errorUploadFile: TYPE_ERROR.ERROR
				})
			}
		}
	}

	isFormValid = () => {
		var chekFormValid = this.state.errorEmail === TYPE_ERROR.VALID
			&& this.state.errorPassword === TYPE_ERROR.VALID
			&& this.state.errorConfirmPassword === TYPE_ERROR.VALID
			&& this.state.errorName === TYPE_ERROR.VALID
			&& this.state.errorPhoneNumber === TYPE_ERROR.VALID;

		// check valid form master
		if (this.props.type_user === TYPE_USER.MASTER) {
			var chekFormValidMaster = this.state.errorHospitalName === TYPE_ERROR.VALID
				&& this.state.errorNursingSign === TYPE_ERROR.VALID
				&& this.state.errorBusinessNumber === TYPE_ERROR.VALID
				&& this.state.errorUploadFile === TYPE_ERROR.VALID;
			chekFormValid = chekFormValid && chekFormValidMaster;
		}

		return chekFormValid;
	}

	submitForm = () => {
		this.formValidate();

		// check valid
		if (this.isFormValid()) {
			this.handleChange({ openModalJoin: true });
		}
	}

	fileToBase64 = () => {
		return new Promise(resolve => {
			var inputFile = document.querySelector('input[type="file"]').files[0];
			var reader = new FileReader();
			reader.onload = function (event) {
				resolve(event.target.result);
			};

			reader.readAsDataURL(inputFile);
		});
	};

	handleChangeStep = async () => {
		let dataResult = {};
		let emailPart01 = ReactDOM.findDOMNode(this.refs.emailPart01).value;
		let emailPart02 = ReactDOM.findDOMNode(this.refs.emailPart02).value;
		let password = ReactDOM.findDOMNode(this.refs.password).value;
		let confirmPassword = ReactDOM.findDOMNode(this.refs.confirmPassword).value;
		let name = ReactDOM.findDOMNode(this.refs.name).value;
		let phoneNumberPart01 = ReactDOM.findDOMNode(this.refs.phoneNumberPart01).value;
		let phoneNumberPart02 = ReactDOM.findDOMNode(this.refs.phoneNumberPart02).value;
		let phoneNumberPart03 = ReactDOM.findDOMNode(this.refs.phoneNumberPart03).value;

		if (this.props.type_user === TYPE_USER.MASTER) {
			let hospitalName = ReactDOM.findDOMNode(this.refs.hospitalName).value;
			let nursingSign = ReactDOM.findDOMNode(this.refs.nursingSign).value;
			let businessNumber01 = ReactDOM.findDOMNode(this.refs.businessNumber01).value;
			let businessNumber02 = ReactDOM.findDOMNode(this.refs.businessNumber02).value;
			let businessNumber03 = ReactDOM.findDOMNode(this.refs.businessNumber03).value;
			let businessImage = await this.fileToBase64();

			
			dataResult = {
				type_role: 2,
				full_name: name,
				email: emailPart01 + '@' + emailPart02,
				password: password,
				password_confirmation: confirmPassword,
				name: name,
				phone: phoneNumberPart01 + '-' + phoneNumberPart02 + '-' + phoneNumberPart03,
				avatar: "",
				hospital_id: this.state.hospitalID,
				hospital_name: hospitalName,
				hospital_symbol: nursingSign,
				hospital_code: businessNumber01 + '-' + businessNumber02 + '-' + businessNumber03,
				hospital_image: businessImage
			}
			
			let response = await httpService.post(apiEndpoint,
				dataResult
			);
			if (response.data.data.access_token !== undefined) {
				this.handleChange({ openModalJoin: false });
				this.props.handleChange({
					step: 3,
					dataResult: dataResult
				});
			} else {
				toast.error('캄보디아 호텔!');
			}
		} else {
			dataResult = {
				type_role: 3,
				full_name: name,
				email: emailPart01 + '@' + emailPart02,
				password: password,
				password_confirmation: confirmPassword,
				name: name,
				phone: phoneNumberPart01 + '-' + phoneNumberPart02 + '-' + phoneNumberPart03,
			}

			let response = await httpService.post(apiEndpoint,
				dataResult
			);
			if (response.data.data.access_token !== undefined) {
				this.handleChange({ openModalJoin: false });
				this.props.handleChange({
					step: 3,
					dataResult: dataResult
				});
			} else {
				toast.error('캄보디아 호텔!');
			}
		}
	}

	navLoginPage = () => {
		auth.logout();
		window.location.href = "/login";
	}

	handleChange = (data) => {
		this.setState({
			...data
		});

	}

	handleChangeEmailSuffixes =async (emailPart02) => {
		var emailPart01 = ReactDOM.findDOMNode(this.refs.emailPart01);
		var emailPart02 = emailPart02;
		var valueEmail = emailPart01.value+'@'+emailPart02;
		let emailExists = await checkMailExists(valueEmail);
		if (emailExists.data.data === true) {
			this.setState({
				email_suffixes: emailPart02,
				errorEmail: TYPE_ERROR.ERROR,
				errorEmailUnique: true
			});
		} else if (emailPart01.value.length === 0 || isCharacterValid(emailPart01.value, EMAIL_CHARACTER)
			|| emailPart02.length === 0 || isCharacterValid(emailPart02, EMAIL_CHARACTER)) {
			this.setState({
				email_suffixes: emailPart02,
				errorEmail: TYPE_ERROR.ERROR,
				errorEmailUnique: false
			});
		} else {
			this.setState({
				email_suffixes: emailPart02,
				errorEmail: TYPE_ERROR.VALID,
				errorEmailUnique: false
			});
		}
	}

	checkEmail = async () => {
		var emailPart01 = ReactDOM.findDOMNode(this.refs.emailPart01);
		var emailPart02 = ReactDOM.findDOMNode(this.refs.emailPart02);
		var valueEmail = emailPart01.value+'@'+emailPart02.value
		let emailExists = await checkMailExists(valueEmail);

		// check email valid
		if (emailExists.data.data === true) {
			this.setState({
				errorEmail: TYPE_ERROR.ERROR,
				errorEmailUnique: true
			});
		}else if (emailPart01.value.length === 0 || isCharacterValid(emailPart01.value, EMAIL_CHARACTER)
			|| emailPart02.value.length === 0 || isCharacterValid(emailPart02.value, EMAIL_CHARACTER)) {
			this.setState({
				errorEmail: TYPE_ERROR.ERROR,
				errorEmailUnique: false
			});
		} else {
			this.setState({
				errorEmail: TYPE_ERROR.VALID,
				errorEmailUnique: false
			});
		}

	}

	checkphoneNumber = async () => {
		var phoneNumberPart01 = ReactDOM.findDOMNode(this.refs.phoneNumberPart01);
		var phoneNumberPart02 = ReactDOM.findDOMNode(this.refs.phoneNumberPart02);
		var phoneNumberPart03 = ReactDOM.findDOMNode(this.refs.phoneNumberPart03);
		var verifyPhoneNumber = ReactDOM.findDOMNode(this.refs.verifyPhoneNumber);
		
		var valuePhone = phoneNumberPart01.value+'-'+phoneNumberPart02.value+'-'+phoneNumberPart03.value;
		let phoneExists = await checkPhoneExists(valuePhone);

		if (phoneExists.data.data === true) {
			this.setState({
				errorPhoneUnique: true,
				errorPhoneNumber: TYPE_ERROR.ERROR
			})
		}else if (phoneNumberPart01.value.length >= 2 && phoneNumberPart02.value.length === 4 && phoneNumberPart03.value.length === 4) {
			verifyPhoneNumber.innerHTML = "인증완료";
			this.setState({
				errorPhoneUnique: false,
				errorPhoneNumber: TYPE_ERROR.VALID
			})
		} else {
			verifyPhoneNumber.innerHTML = "본인인증";
			this.setState({
				errorPhoneUnique: false,
				errorPhoneNumber: TYPE_ERROR.ERROR
			})
		}
	}

	handleChangePhoneSuffixes =async (phoneNumberPart01) => {
		var phoneNumberPart01 = phoneNumberPart01;
		var phoneNumberPart02 = ReactDOM.findDOMNode(this.refs.phoneNumberPart02);
		var phoneNumberPart03 = ReactDOM.findDOMNode(this.refs.phoneNumberPart03);
		var verifyPhoneNumber = ReactDOM.findDOMNode(this.refs.verifyPhoneNumber);
		
		var valuePhone = phoneNumberPart01+'-'+phoneNumberPart02.value+'-'+phoneNumberPart03.value;
		let phoneExists = await checkPhoneExists(valuePhone);

		if (phoneExists.data.data === true) {
			this.setState({
				selectNumber: phoneNumberPart01,
				errorPhoneUnique: true,
				errorPhoneNumber: TYPE_ERROR.ERROR
			})
		}else if (phoneNumberPart02.value.length === 4 && phoneNumberPart03.value.length === 4) {
			verifyPhoneNumber.innerHTML = "인증완료";
			this.setState({
				selectNumber: phoneNumberPart01,
				errorPhoneUnique: true,
				errorPhoneNumber: TYPE_ERROR.VALID
			})
		} else {
			verifyPhoneNumber.innerHTML = "본인인증";
			this.setState({
				selectNumber: phoneNumberPart01,
				errorPhoneUnique: true,
				errorPhoneNumber: TYPE_ERROR.ERROR
			})
		}
	}

	resetCloseModelSearch = async() => {
		let { pageSz } = this.state.dataHospitals;
		await this._renderDataHospital('', 1, pageSz);	
	}

	render() {
		const btnSumitStatus = (this.isFormValid() ? BTN_SUBMIT_VALID : BTN_SUBMIT_INVALID);
		const { openModalRequest, openModalModalAlert, openModalFormResult, sizeModal, dataItem, dataHospitals } = this.state;

		return (
			<div className="stage-register bg-white">
			<ToastContainer />

				<div>
					{this.renderTitle()}
					<table className="table table-bordered">
						<tbody>
							<tr>
								<th>이메일 아이디<span className="text-danger">*</span></th>
								<td className="position-relative input-email-custom">
									<div className="d-flex">
										<input type="text"
											className="form-control col-6 m-0 float-left"
											placeholder=" 이메일 아이디를 입력해주세요"
											onBlur={this.checkEmail}
											ref="emailPart01" />
										<span className="dash-letter col-1 float-left">@</span>
										<div className="position-relative d-inline-block custom-p">
											<Select
												value={this.state.email_suffixes}
												className="mail-suffix-sel float-left top-0"
												onChange={(e) => this.handleChangeEmailSuffixes(e.value)}
												options={getSuffixEmail().suffixes}
												blurInputOnSelect={false}
												isSearchable={false}
												promptText="My custom prompt"
											/>
											<input
												value={this.state.email_suffixes}
												type="text"
												className="form-control col-11 combo-input"
												ref="emailPart02"
												onChange={(e) => this.handleChange({ email_suffixes: e.target.value })}
												onBlur={this.checkEmail}
											/>
										</div>
									</div>
									{this.renderError(this.state.errorEmail, this.state.errorEmailUnique ? "이메일은 중복 될 수 없다." : "영문자, 숫자, ., -, _ 만 사용할 수 있습니다.")}
								</td>
							</tr>
							<tr>
								<th>비밀번호<span className="text-danger">*</span></th>
								<td className="position-relative">
									<div className="input-custom masking">
										<input
											type="password"
											className="form-control col-10 m-0 input-password"
											placeholder="비밀번호를 입력해주세요"
											name="password"
											onBlur={this.checkPassword}
											ref="password" />
										<i className="fa fa-eye" onClick={this.handleMasking.bind(this, "password")} />
									</div>
									{this.renderError(this.state.errorPassword, "6~16자리의 영문자, 숫자, 특수문자(!@#$%^&*()) 만 사용할 수 있습니다.")}
								</td>
							</tr>
							<tr>
								<th>비밀번호 확인<span className="text-danger">*</span></th>
								<td className="position-relative">
									<div className="input-custom masking">
										<input
											type="password"
											className="form-control col-10 m-0 input-password"
											placeholder="비밀번호를 다시 입력해주세요"
											name="confirmPassword"
											onBlur={this.checkConfirmPassword}
											ref="confirmPassword" />
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
										placeholder="이름을 입력해주세요"
										name="name"
										onBlur={this.checkKoreaCharacter}
										ref="name" />
									{this.renderError(this.state.errorName, "한글, 최대 15자를 사용할 수 있습니다.")}
								</td>
							</tr>
							<tr>
								<th>휴대전화번호<span className="text-danger">*</span></th>
								<td className="position-relative d-flex align-items-center select-fix border-none">
									<div className="d-flex justify-content-start handling-problem custom-slectoption w80">
										<Select
											value={this.state.selectNumber}
											name="phoneNumberPart01"
											ref="phoneNumberPart01"
											options={getPrefixPhoneNumber().prefix}
											onChange={(e) => this.handleChangePhoneSuffixes(e.value)}
											blurInputOnSelect={true}
											isSearchable={false}
											placeholder="000"
										/>
										<input
											type="text"
											className="form-control combo-input top4"
											value={this.state.selectNumber}
											placeholder="000"
											onKeyPress={(e) => isNumberKey(e)}
											maxLength="3"
											ref="phoneNumberPart01"
											onChange={(e) => this.handleChange({ selectNumber: e.target.value })}
											onBlur={this.checkphoneNumber}
										/>
									</div>
									<span className="dash-letter col-1 float-left">-</span>
									<input type="text" className="form-control border col-2 m-0 float-left"
										placeholder="0000" name="phoneNumberPart02" maxLength="4"
										onKeyPress={(e) => isNumberKey(e)}
										onBlur={this.checkphoneNumber}
										ref="phoneNumberPart02" />
									<span className="dash-letter col-1 float-left">-</span>
									<input type="text" className="form-control border col-2 m-0 float-left"
										placeholder="0000" name="phoneNumberPart03" maxLength="4"
										onKeyPress={(e) => isNumberKey(e)}
										onBlur={this.checkphoneNumber}
										ref="phoneNumberPart03" />
									<button type="button ml-auto"
										className="btn btn-secondary display-middle margin-right-x"
										ref="verifyPhoneNumber">
										본인인증
                                    </button>
									{this.renderError(this.state.errorPhoneNumber,this.state.errorPhoneUnique ? "전화 번호가 이미 있습니다." : "휴대전화번호를 정확히 입력해주세요.")}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				{this.renderContentUserMaster()}
				<div className="form-groups text-right">
					<button type="button"
						className={"btn btn-width-l mr-3 mt-0 " + btnSumitStatus}
						onClick={this.submitForm}>가입
                    </button>
					<button type="button"
						className="btn btn-secondary btn-width-l mt-0"
						onClick={() => this.handleChange({ openModalCancelRegister: true })}
					>
						취소
                    </button>
				</div>

				<div className="pt-3">※ 문의 사항은 카카오플러스 CareU 검색,  친구 추가 시  상담을 통해 신속히 해결할 수 있습니다.</div>

				<Modal className='modalPopup w-55'
					id="join"
					show={this.state.openModalJoin}
					onHide={() =>  this.handleChangeStep()}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						정상적으로 가입이 완료되었습니다.
					</div>
					<div className="action-footer text-center">
						<button
							className="btn btn-secondary"
							onClick={this.handleChangeStep}
						>아니오</button>
					</div>
				</Modal>
				<Modal className='modalPopup w-45'
					id="registerFail"
					show={this.state.openModalRegisterFail}
					onHide={() => this.handleChange({ openModalRegisterFail: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						올바른 값을 입력해주세요
					</div>
				</Modal>
				<Modal className='modalPopup w-45'
					id="cancel"
					show={this.state.openModalCancelRegister}
					onHide={() => this.handleChange({ openModalCancelRegister: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						취소하시겠습니까?
					</div>
					<div className="action-footer text-center">
						<button
							className="btn btn-secondary"
							data-dismiss="modal"
							onClick={this.navLoginPage}
						>아니오</button>
					</div>
				</Modal>

				<HospitalModalSearch
					dataItem={dataItem}
					dataHospitals={dataHospitals}
					handleChangePage={this.handleChangePage}
					handleClickRow={this.handleClickRow}
					handleCheck={this.handleCheck}
					handleChangeDepartment={this.handleChangeDepartment}
					handleSubmitConfirm={this.handleSubmitConfirm}
					openModalFormResult={openModalFormResult}
					openModalRequest={openModalRequest}
					openModalModalAlert={openModalModalAlert}
					onHandleChange={this.onHandleChange}
					sizeModal={sizeModal}
					isShowTableResult={false}
					handleCloseModal={this.handleCloseModal}
					handleSubmitSearch={this.handleSubmitSearch}
					resetCloseModelSearch={this.resetCloseModelSearch}
				/>
			</div>
		);
	}
}

export default Register;