import React, { Component } from 'react';
import { isNumberKey, getPrefixPhoneNumberHospital, getPrefixFaxNumber, getDayOfMonth, getHourInDay, checkAuth, isOnPasteNumber } from '../../services/functionService';
import { checkPhoneExists } from '../../services/authService';
import { checkFaxExists } from '../../services/hospitals';

import Modal from 'react-bootstrap-modal';
import ReactDOM from 'react-dom';
import { TYPE_ERROR, ROLE } from '../../config.json';
import imgError from "../../public/images/errors.png";
import imgSuccess from "../../public/images/success.png";
import _ from 'lodash';
import Select from 'react-select';
import DaumPostcode from 'react-daum-postcode';
import { connect } from 'react-redux';
import hospital from '../../services/hospitals';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';

const FORMAT_URL = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/gi;
const VALID_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const SICK_LEAV_COSTS_OPTION = "sickLeaveCosts";
const TAX_SUPPORT_OPTION = "taxSupport";
const MODAL_SUBJECT = "modalSubject";
const JS_MEDICALSUBJECT = "js-medicalSubject";
const MODALEQUIPMENTS = "modalEquipments";

class UpdateHospital extends Component {
	constructor(props) {
		super(props);

		checkAuth("hospitals", this.props.user, ROLE.VIEW, true);

		this.state = {
			errorMedicalSubject: "",
			errorMedicalEquipment: "",
			errorPhoneNumber: "",
			errorFaxNumber: "",
			errorHomepageAddress: "",
			errorPaymentDate: "",
			errorSickLeaveCosts: "",
			errorTaxSupport: "",
			errorTimeApply: "",
			errorFacility: "",
			errorHospitalImage: "",
			errorHospitalLogo: "",
			errorPhoneUnique: "",
			errorFaxUnique: "",
			updateHospitalModal: [],
			selectNumber: "",
			selectPrefixFaxNumber: "",
			dataHospitalInfor: {
				name: "",
				courses: [],
				medicals: [],
				hospital_postcode: "472-808",
				address: "경기 남양주시 경춘로 924-10 (금곡동, KIA MORTORS AUTO Q)",
				phone: "",
				phoneNumberPart01: '',
				phoneNumberPart02: '',
				phoneNumberPart03: '',
				faxNumberPart01: '',
				faxNumberPart02: '',
				faxNumberPart03: '',
				fax: "",
				website: "",
				date_of_payment: 1,
				cost_of_sick: 1,
				tax_support: 1,
				application_time: 9,
				devices: [],
				image: "",
				logo: "",
				note: "",
				guide: ""
			},
			dataOption: {
				courses: [],
				medicals: []
			},
			openModalSubject: false,
			openModalEquipments: false,
			openModalRegisterSuccess: false,
			openModalCancleRegis: false,
			openModalMap: false,
			isClick: false
		}
	}

	componentDidMount() {
		this.getDataHospitalById(this.props.hospital_id);
	}

	getDataHospitalById = async (id) => {
		let response = await hospital.getHospitalById(id);
		let data = response.data.data;

		let courses = [];
		let medicals = [];
		let devices = [];

		data.courses.map((item) => {
			courses.push(item.id + '. ' + item.name);
			return item;
		});

		data.medicals.map((item) => {
			medicals.push(item.id + '. ' + item.name);
			return item;
		});

		data.devices.map((item) => {
			devices.push(item.id);
			return item;
		});

		this.setState({
			dataHospitalInfor: {
				name: data.name || '',
				courses: courses || '',
				medicals: medicals || '',
				hospital_postcode: data.zip_code,
				address: data.address,
				phoneNumberPart01: data.phone ? data.phone.split("-")[0] : '',
				phoneNumberPart02: data.phone ? data.phone.split("-")[1] : '',
				phoneNumberPart03: data.phone ? data.phone.split("-")[2] : '',
				faxNumberPart01: data.fax ? data.fax.split("-")[0] : '',
				faxNumberPart02: data.fax ? data.fax.split("-")[1] : '',
				faxNumberPart03: data.fax ? data.fax.split("-")[2] : '',
				website: data.website || '',
				date_of_payment: data.date_of_payment || 1,
				cost_of_sick: data.cost_of_sick,
				tax_support: data.tax_support,
				application_time: data.application_time || '',
				devices: devices || [],
				image: data.image || '',
				logo: data.logo || '',
				note: data.note || '',
				guide: data.guide || '',
				phone: data.phone,
				fax: data.fax
			},
			dataOption: {
				courses: courses,
				medicals: medicals
			}
		});
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

	checkMedicalSubject = () => {
		var medicalSubject = ReactDOM.findDOMNode(this.refs.medicalSubject);
		if (medicalSubject.value === '') {
			this.setState({
				errorMedicalSubject: TYPE_ERROR.ERROR
			})
		} else {
			this.setState({
				errorMedicalSubject: TYPE_ERROR.VALID
			})
		}
	}

	checkMedicalEquipment = () => {
		var medicalEquipment = ReactDOM.findDOMNode(this.refs.medicalEquipment).value;
		if (medicalEquipment === '') {
			this.setState({
				errorMedicalEquipment: TYPE_ERROR.ERROR
			})
		} else {
			this.setState({
				errorMedicalEquipment: TYPE_ERROR.VALID
			})
		}
	}

	fileToBase64 = (inputFile) => {
		return new Promise(resolve => {
			var file = inputFile.files[0];
			var reader = new FileReader();
			reader.onload = function (event) {
				resolve(event.target.result);
			};

			reader.readAsDataURL(file);
		});
	};

	handleChangeNumber = (value, name, type) => {
		const re = /[\u3131-\uD79D]/ugi;
		let text = value.match(re);

		if (!_.isArray(text)) {
			let item = {};
			item[name] = value;
			this.setState({
				dataHospitalInfor: {
					...this.state.dataHospitalInfor,
					...item
				}
			});
		}
		if(type === 'phone')
		{
			this.checkPhoneNumber();
		}else {
			this.checkFaxNumber();
		}		
	}

	checkPhoneNumber = async() => {
		var phoneNumberPart01 = ReactDOM.findDOMNode(this.refs.phoneNumberPart01);
		var phoneNumberPart02 = ReactDOM.findDOMNode(this.refs.phoneNumberPart02);
		var phoneNumberPart03 = ReactDOM.findDOMNode(this.refs.phoneNumberPart03);
		var valuePhone = phoneNumberPart01.value+'-'+phoneNumberPart02.value+'-'+phoneNumberPart03.value;

		if(this.state.dataHospitalInfor.phone !== valuePhone)
		{
			let phoneExists = await checkPhoneExists(valuePhone);
			if (phoneExists.data.data === true) {
				this.setState({
					errorPhoneUnique: true,
					errorPhoneNumber: TYPE_ERROR.ERROR
				})
			}else if ((phoneNumberPart01.value.length >= 2 && phoneNumberPart01.value.length <= 4)
				&& phoneNumberPart02.value.length === 4
				&& phoneNumberPart03.value.length === 4) {
				this.setState({
					errorPhoneUnique: false,
					errorPhoneNumber: TYPE_ERROR.VALID
				})
			} else {
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

	checkFaxNumber = async() => {
		var faxNumberPart01 = ReactDOM.findDOMNode(this.refs.faxNumberPart01);
		var faxNumberPart02 = ReactDOM.findDOMNode(this.refs.faxNumberPart02);
		var faxNumberPart03 = ReactDOM.findDOMNode(this.refs.faxNumberPart03);
		var valueFax = faxNumberPart01.value+'-'+faxNumberPart02.value+'-'+faxNumberPart03.value;

		if(this.state.dataHospitalInfor.fax !== valueFax)
		{
			let faxExists = await checkFaxExists(valueFax);
			if (faxExists.data.data === true) {
				this.setState({
					errorFaxUnique: true,
					errorFaxNumber: TYPE_ERROR.ERROR
				})
			}else if ((faxNumberPart01.value.length >= 2 && faxNumberPart01.value.length <= 4)
				&& faxNumberPart02.value.length === 4
				&& faxNumberPart03.value.length === 4) {
				this.setState({
					errorFaxUnique: false,
					errorFaxNumber: TYPE_ERROR.VALID
				})
			} else {
				this.setState({
					errorFaxUnique: false,
					errorFaxNumber: TYPE_ERROR.ERROR
				})
			}
		}else {
			this.setState({
				errorFaxUnique: false,
				errorFaxNumber: TYPE_ERROR.VALID
			})
		}
	}

	getValueOfOption = (optionName) => {
		var radios = document.getElementsByName(optionName);
		for (var i = 0, length = radios.length; i < length; i++) {
			if (radios[i].checked) {
				return radios[i].value;
			}
		}
		return '';
	}

	getSickLeaveCosts = () => {
		var sickLeaveCosts = this.getValueOfOption(SICK_LEAV_COSTS_OPTION);
		return sickLeaveCosts;
	}

	getTaxSupport = () => {
		var taxSupport = this.getValueOfOption(TAX_SUPPORT_OPTION);
		return taxSupport;
	}

	checkHomepageAddress = () => {
		var homepageAddress = ReactDOM.findDOMNode(this.refs.homepageAddress);
		if (homepageAddress.value.match(FORMAT_URL)) {
			this.setState({
				errorHomepageAddress: TYPE_ERROR.VALID
			})
		} else {
			this.setState({
				errorHomepageAddress: TYPE_ERROR.ERROR
			})
		}
	}

	checkFacility = (value, isChecked) => {
		let data = [...this.state.dataHospitalInfor.devices];

		if (isChecked) {
			data.push(value);
		} else {
			let index = data.indexOf(value);
			data.splice(index, 1);
		}

		this.setState({
			dataHospitalInfor: {
				...this.state.dataHospitalInfor,
				devices: data
			}
		});

		var inputElements = document.getElementsByClassName('facilityCheckbox');
		for (var i = 0; inputElements[i]; i++) {
			if (inputElements[i].checked) {
				this.setState({
					errorFacility: TYPE_ERROR.VALID
				})
				return true;
			}
		}
		this.setState({
			errorFacility: TYPE_ERROR.ERROR
		})
		return false;
	}

	getFacility = () => {
		var facility = [];
		var inputElements = document.getElementsByClassName('facilityCheckbox');
		for (var i = 0; inputElements[i]; i++) {
			if (inputElements[i].checked) {
				facility.push(inputElements[i].value);
			}
		}

		return facility;
	}

	getFileName = (oInput, index) => {
		if (_.isUndefined(oInput.files[0])) {
			return false;
		} else {
			var fileName = oInput.files[0].name;
			if (index === 0) {
				var hospitalImage = ReactDOM.findDOMNode(this.refs.hospitalImage);
				hospitalImage.value = fileName;
				this.setState({
					dataHospitalInfor: {
						...this.state.dataHospitalInfor,
						image: fileName
					}
				});
			} else {
				var hospitalLogo = ReactDOM.findDOMNode(this.refs.hospitalLogo);
				hospitalLogo.value = fileName;
				this.setState({
					dataHospitalInfor: {
						...this.state.dataHospitalInfor,
						logo: fileName
					}
				});
			}
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
					if (index === 0) {
						this.setState({
							errorHospitalImage: TYPE_ERROR.ERROR
						})
					} else {
						this.setState({
							errorHospitalLogo: TYPE_ERROR.ERROR
						})
					}
					return false;
				}
			}
		}

		if (index === 0) {
			this.setState({
				errorHospitalImage: TYPE_ERROR.VALID
			})
		} else {
			this.setState({
				errorHospitalLogo: TYPE_ERROR.VALID
			})
		}

		return true;
	}

	cancleUpdateHospital = () => {
		let updateHospitalModal = [];
		updateHospitalModal = {
			name: "cancle register hospital",
			msg: "취소하시겠습니까?"
		};
		this.setState({
			updateHospitalModal: updateHospitalModal
		});
		this.handleChange({ openModalCancleRegis: true });
		return updateHospitalModal;
	}

	navMainPage = () => {
		this.props.history.push("/");
	}

	formValidate = () => {
		// 진료과목
		var medicalSubject = ReactDOM.findDOMNode(this.refs.medicalSubject).value;
		this.checkMedicalSubject();

		// 의료장비
		var medicalEquipment = ReactDOM.findDOMNode(this.refs.medicalEquipment).value;
		if (medicalEquipment === '') {
			this.checkMedicalEquipment();
		}

		// 병원 전화번호
		var phoneNumberPart01 = ReactDOM.findDOMNode(this.refs.phoneNumberPart01).value;
		var phoneNumberPart02 = ReactDOM.findDOMNode(this.refs.phoneNumberPart02).value;
		var phoneNumberPart03 = ReactDOM.findDOMNode(this.refs.phoneNumberPart03).value;
		var phoneNumber = phoneNumberPart01 + phoneNumberPart02 + phoneNumberPart03;
		this.checkPhoneNumber();

		// 병원 fax번호
		var faxNumberPart01 = ReactDOM.findDOMNode(this.refs.faxNumberPart01).value;
		var faxNumberPart02 = ReactDOM.findDOMNode(this.refs.faxNumberPart02).value;
		var faxNumberPart03 = ReactDOM.findDOMNode(this.refs.faxNumberPart03).value;
		var faxNumberPart = faxNumberPart01 + faxNumberPart02 + faxNumberPart03;
		this.checkFaxNumber();

		// 홈페이지 주소
		var homepageAddress = ReactDOM.findDOMNode(this.refs.homepageAddress).value;
		this.checkHomepageAddress();

		//병원 내 부대시설(공동)
		var facility = this.getFacility();
		if (facility === undefined || facility.length === 0) {
			this.checkFacility();
		}
	}

	saveData = async () => {
		// 병원 전화번호
		let phoneNumberPart01 = ReactDOM.findDOMNode(this.refs.phoneNumberPart01).value;
		let phoneNumberPart02 = ReactDOM.findDOMNode(this.refs.phoneNumberPart02).value;
		let phoneNumberPart03 = ReactDOM.findDOMNode(this.refs.phoneNumberPart03).value;
		let phoneNumber = phoneNumberPart01 + '-' + phoneNumberPart02 + '-' + phoneNumberPart03;

		// 병원 fax번호
		let faxNumberPart01 = ReactDOM.findDOMNode(this.refs.faxNumberPart01).value;
		let faxNumberPart02 = ReactDOM.findDOMNode(this.refs.faxNumberPart02).value;
		let faxNumberPart03 = ReactDOM.findDOMNode(this.refs.faxNumberPart03).value;
		let faxNumber = faxNumberPart01 + '-' + faxNumberPart02 + '-' + faxNumberPart03;

		// 홈페이지 주소
		let homepageAddress = ReactDOM.findDOMNode(this.refs.homepageAddress).value;

		// 간병비 지급일
		let paymentDate = ReactDOM.findDOMNode(this.refs.paymentDate).children[1].value;

		// 병원 이미지
		let hospitalImage = ReactDOM.findDOMNode(this.refs.image);
		let hospitalLogo = ReactDOM.findDOMNode(this.refs.logo);

		if (hospitalImage.value.length !== 0) {
			hospitalImage = await this.fileToBase64(hospitalImage);
		} else {
			hospitalImage = this.state.dataHospitalInfor.image;
		}

		if (hospitalLogo.value.length !== 0) {
			hospitalLogo = await this.fileToBase64(hospitalLogo);
		} else {
			hospitalLogo = this.state.dataHospitalInfor.logo;
		}

		// 대표 태그	
		let representativeTags = ReactDOM.findDOMNode(this.refs.representativeTags).value;

		let courses = [];
		let medicals = [];

		this.state.dataHospitalInfor.courses.map((item) => {
			if (String(item).indexOf('.') !== -1) {
				courses.push(item.substr(0, item.indexOf('.')).trim());
			} else {
				courses.push(item);
			}

			return item;
		});

		this.state.dataHospitalInfor.medicals.map((item) => {
			if (String(item).indexOf('.') !== -1) {
				medicals.push(item.substr(0, item.indexOf('.')).trim());
			} else {
				medicals.push(item);
			}

			return item;
		});

		this.setState({
			dataHospitalInfor: {
				...this.state.dataHospitalInfor,
				phone: phoneNumber,
				fax: faxNumber,
				website: homepageAddress,
				date_of_payment: paymentDate,
				courses: courses,
				medicals: medicals,
				image: hospitalImage,
				logo: hospitalLogo,
				note: representativeTags
			}
		});
	}

	isFormUpdateValid = () => {
		let checkFormValid = this.state.errorMedicalSubject !== TYPE_ERROR.ERROR
			&& this.state.errorMedicalEquipment !== TYPE_ERROR.ERROR
			&& this.state.errorPhoneNumber !== TYPE_ERROR.ERROR
			&& this.state.errorFaxNumber !== TYPE_ERROR.ERROR
			&& this.state.errorHomepageAddress !== TYPE_ERROR.ERROR
			&& this.state.errorFacility !== TYPE_ERROR.ERROR
			&& this.state.errorHospitalImage !== TYPE_ERROR.ERROR
			&& this.state.errorHospitalLogo !== TYPE_ERROR.ERROR;

		return checkFormValid;
	}

	submitForm = async () => {
		this.setState({
			isClick: true
		})
		await this.formValidate();

		if (this.isFormUpdateValid()) {
			await this.saveData();
			try {
				let response = await hospital.updateHospital(this.props.hospital_id, this.state.dataHospitalInfor);
				let courses = [];
				let medicals = [];

				response.data.data.courses.map((item) => {
					courses.push(item.id + '. ' + item.name);
					return item;
				});

				response.data.data.medicals.map((item) => {
					medicals.push(item.id + '. ' + item.name);
					return item;
				});

				this.setState({
					dataHospitalInfor: {
						...this.state.dataHospitalInfor,
						image: response.data.data.image,
						logo: response.data.data.logo,
						courses: courses,
						medicals: medicals
					},
					errorMedicalSubject: "",
					errorMedicalEquipment: "",
					errorPhoneNumber: "",
					errorFaxNumber: "",
					errorHomepageAddress: "",
					errorPaymentDate: "",
					errorSickLeaveCosts: "",
					errorTaxSupport: "",
					errorTimeApply: "",
					errorFacility: "",
					errorHospitalImage: "",
					errorHospitalLogo: ""
				});

				toast.success('성공적인 병원 업데이트!');
				setTimeout(() => {
					window.location.href = '/';
				}, 3000);				
			} catch (error) {
				if(error.data && error.data.errors && error.data.errors.mesages) {
					console.log(error.data);
					toast.error(error.data.errors.mesages.website[0])
				}
			}
			setTimeout(() => {
				this.setState({
					isClick: false
				})
			}, 3000);
		}else {
			this.setState({
				isClick: false
			})
		}
	}

	handleClickTextArea = () => {
		let hospitalDirection = ReactDOM.findDOMNode(this.refs.hospitalDirection);
		hospitalDirection.focus();
	}

	renderPlaceHolderTextArea = () => {
		let text = this.state.dataHospitalInfor.guide;
		if (text.length === 0) {
			return (
				<ul className="display-left ml-2 text-secondary" onClick={this.handleClickTextArea}>
					<li>병원의 약도를 간병인에게 문자로 전송할 내용입니다.</li>
					<li>병원 찾아오는 길을 상세히 입력해주세요</li>
					<li>예) 버스 : 서울 200번 하자 군자역 네거리 3번 출구 오른쪽으로 10m 직진(10분거리)</li>
					<li>지하철 : 5호선 군자역 3번 출구 </li>
				</ul>
			);
		}
	}

	showModalMedical = (className) => {
		var medicalContent;
		if (className === JS_MEDICALSUBJECT) {
			medicalContent = ReactDOM.findDOMNode(this.refs.medicalSubject).value;
			this.handleChange({ openModalSubject: true })
		} else {
			medicalContent = ReactDOM.findDOMNode(this.refs.medicalEquipment).value;
			this.handleChange({ openModalEquipments: true })
		}

		// get all values and contents of checkbox
		var checkboxValues = medicalContent.split(",");

		// get all value of check box
		for (let i = 0; checkboxValues[i]; i++) {
			checkboxValues[i] = checkboxValues[i].substr(0, checkboxValues[i].indexOf('.')).trim();
		}

		setTimeout(function () {
			var inputElements = document.getElementsByClassName(className);
			//checked for checkbox
			for (var i = 0; inputElements[i]; i++) {
				for (var j = 0; checkboxValues[j]; j++) {
					if (checkboxValues[j] === inputElements[i].value) {
						inputElements[i].checked = true;
						break;
					} else {
						inputElements[i].checked = false;
					}
				}
			}
		}, 0);
	}

	getMedicalContent = (className) => {
		var medical = [];
		var inputElements = document.getElementsByClassName(className);

		for (var i = 0; inputElements[i]; i++) {
			if (inputElements[i].checked) {
				medical.push(inputElements[i].value + '. ' + inputElements[i].name);
			}
		}

		var medicalContent;
		if (className === JS_MEDICALSUBJECT) {
			medicalContent = ReactDOM.findDOMNode(this.refs.medicalSubject);
		} else {
			medicalContent = ReactDOM.findDOMNode(this.refs.medicalEquipment);
		}

		medicalContent.value = medical.join(', ');

		if (medical === undefined || medical.length === 0) {
			if (className === JS_MEDICALSUBJECT) {
				this.setState({
					errorMedicalSubject: TYPE_ERROR.ERROR
				})
			} else {
				this.setState({
					errorMedicalEquipment: TYPE_ERROR.ERROR
				})
			}
		} else {
			if (className === JS_MEDICALSUBJECT) {
				this.setState({
					errorMedicalSubject: TYPE_ERROR.VALID,
					dataHospitalInfor: {
						...this.state.dataHospitalInfor,
						courses: this.state.dataOption.courses,
					}
				});
			} else {
				this.setState({
					errorMedicalEquipment: TYPE_ERROR.VALID,
					dataHospitalInfor: {
						...this.state.dataHospitalInfor,
						medicals: this.state.dataOption.medicals
					}
				});
			}
		}

		this.handleChange({ openModalSubject: false });
		this.handleChange({ openModalEquipments: false });
	}

	handleChangeObject = (isChecked, id, name) => {
		let data = [];

		if (name === JS_MEDICALSUBJECT) {
			data = [...this.state.dataOption.courses];

			if (isChecked) {
				data.push(id);
			} else {
				let index = data.indexOf(id);
				data.splice(index, 1);
			}

			this.setState({
				dataOption: {
					...this.state.dataOption,
					courses: data
				}
			});
		} else {
			data = [...this.state.dataOption.medicals];

			if (isChecked) {
				data.push(id);
			} else {
				let index = data.indexOf(id);
				data.splice(index, 1);
			}

			this.setState({
				dataOption: {
					...this.state.dataOption,
					medicals: data
				}
			});
		}
	}

	renderMedicalCheckbox = (datas, className, styleClass) => {
		let html = [];

		datas.map((item, index) => {
			html.push(
				<div className="w-50 d-inline-block" key={index}>
					<label className={"checkbox-wrapper " + styleClass}>
						<input
							type="checkbox"
							defaultValue={item.id}
							name={item.name}
							className={className}
							onChange={(e) => this.handleChangeObject(e.target.checked, item.id, className)}
						/>
						<span className="checkmark"></span>
						<span className="text">{index + 1}. {item.name}</span>
					</label>
				</div>
			);

			return item;
		});

		return html;
	}

	handleChangeData = (data) => {
		this.setState({
			dataHospitalInfor: {
				...this.state.dataHospitalInfor,
				...data
			}
		});
	}

	checkSelectPhoneNumber = (data) => {
		var phoneNumberPart01 = ReactDOM.findDOMNode(this.refs.phoneNumberPart01);
		phoneNumberPart01.value = data.selectNumber;
		this.checkPhoneNumber();
	}

	checkSelectFaxNumber = (data) => {
		var faxNumberPart01 = ReactDOM.findDOMNode(this.refs.faxNumberPart01);
		faxNumberPart01.value = data.selectPrefixFaxNumber;
		this.checkFaxNumber();
	}

	handleChange = (data) => {
		this.setState({
			...data
		});
	}

	render() {
		var roleEditDelete = checkAuth("hospitals", this.props.user, ROLE.EDIT_DELETE, false) === true ? true : false;
		var nonePoiter = roleEditDelete === false ? 'none-poiter' : '';
		return (
			<div className="form-register">
				<table className="table table-bordered">
					<tbody>
						<tr>
							<th>병원이름<span className="text-danger">*</span></th>
							<td colSpan="3">
								{this.state.dataHospitalInfor.name}
							</td>
						</tr>
						<tr>
							<th>진료과목<span className="text-danger">*</span></th>
							<td className="position-relative">
								<div className="d-flex">
									<input
										type="text"
										name="medicalSubject"
										ref="medicalSubject"
										className="form-control col-9 black"
										placeholder="진료과목을 선택해주세요"
										defaultValue={this.state.dataHospitalInfor.courses}
										readOnly
									/>
									{roleEditDelete === true ?
										<button
											className="btn btn-secondary btn-choose"
											onClick={this.showModalMedical.bind(this, JS_MEDICALSUBJECT)}
										>선택</button>
										: ''}
								</div>
								{this.renderError(this.state.errorMedicalSubject, "의학 주제를 선택하십시오.")}
							</td>
							<th>의료장비<span className="text-danger">*</span></th>
							<td className="position-relative">
								<div className="d-flex">
									<input
										type="text"
										name="medicalEquipment"
										ref="medicalEquipment"
										className="form-control col-9 black"
										placeholder="의료장비를 선택해주세요"
										defaultValue={this.state.dataHospitalInfor.medicals}
										readOnly
									/>
									{roleEditDelete === true ?
										<button
											className="btn btn-secondary btn-choose"
											onClick={this.showModalMedical.bind(this, "js-medicalEquipment")}
										>선택</button>
										: ''}
								</div>
								{this.renderError(this.state.errorMedicalEquipment, "의료 기기를 선택하십시오.")}
							</td>
						</tr>
						<tr>
							<th>병원 주소<span className="text-danger">*</span></th>
							<td colSpan="3">
								<span ref="hospitalAddress">{this.state.dataHospitalInfor.hospital_postcode}&nbsp;&nbsp;</span>
								{/* <button
									className="btn btn-secondary m-0-auto" onClick={() => { this.setState({ openModalMap: true }) }}
								>주소 검색</button> */}
								<span>{this.state.dataHospitalInfor.address}</span>
							</td>
						</tr>
						<tr>
							<th>병원 전화번호<span className="text-danger">*</span></th>
							<td className="position-relative">
								<div className="d-flex justify-content-start handling-problem custom-slectoption">
									<div className={nonePoiter}>
									<Select
										className="d-inline-block"
										ref="phoneNumberPart01"
										options={roleEditDelete === true ? getPrefixPhoneNumberHospital().prefixPhoneNumberHospital : []}
										onChange={(e) => this.handleChangeNumber(e.value, 'phoneNumberPart01', 'phone')}
										blurInputOnSelect={true}
										isSearchable={false}
										placeholder="000"
									/>
									</div>
									<input
										type="text"
										className="form-control col-11 combo-input top4"
										placeholder="000"
										ref="phoneNumberPart01"
										onKeyPress={(e) => isNumberKey(e)}
										maxLength="3"
										onBlur={this.checkPhoneNumber}
										onChange={(e) => this.handleChangeNumber(e.target.value, 'phoneNumberPart01', 'phone')}
										value={this.state.dataHospitalInfor.phoneNumberPart01}
										onPaste={(e) => isOnPasteNumber(e)}
										disabled = {roleEditDelete === false ? true : ''}
									/>
									<span className="dash-letter">-</span>
									<input
										type="text"
										className="form-control w100"
										placeholder="0000"
										name="phoneNumberPart02"
										ref="phoneNumberPart02"
										maxLength="4"
										onKeyPress={(e) => isNumberKey(e)}
										onBlur={this.checkPhoneNumber}
										onChange={(e) => this.handleChangeNumber(e.target.value, 'phoneNumberPart02', 'phone')}
										value={this.state.dataHospitalInfor.phoneNumberPart02}
										onPaste={(e) => isOnPasteNumber(e)}
										disabled = {roleEditDelete === false ? true : ''}
									/>
									<span className="dash-letter">-</span>
									<input
										type="text"
										className="form-control w100"
										placeholder="0000"
										name="phoneNumberPart03"
										ref="phoneNumberPart03"
										maxLength="4"
										onKeyPress={(e) => isNumberKey(e)}
										onBlur={this.checkPhoneNumber}
										onChange={(e) => this.handleChangeNumber(e.target.value, 'phoneNumberPart03', 'phone')}
										value={this.state.dataHospitalInfor.phoneNumberPart03}
										onPaste={(e) => isOnPasteNumber(e)}
										disabled = {roleEditDelete === false ? true : ''}
									/>									
								</div>
								{this.renderError(this.state.errorPhoneNumber, this.state.errorPhoneUnique ? "전화 번호가 이미 있습니다." : "휴대전화번호를 정확히 입력해주세요.")}
							</td>
							<th>병원 fax번호<span className="text-danger">*</span></th>
							<td className="position-relative">
								<div className="d-flex justify-content-start handling-problem custom-slectoption">
									<div className={nonePoiter}>
										<Select
											className="d-inline-block"
											ref="faxNumberPart01"
											options={roleEditDelete === true ? getPrefixFaxNumber().prefixFaxNumber : []}
											onChange={(e) => this.handleChangeNumber(e.value, 'faxNumberPart01', 'fax')}
											blurInputOnSelect={true}
											isSearchable={false}
											placeholder="00"
										/>
									</div>
									<input
										type="text"
										className="form-control col-11 combo-input top4"
										placeholder="00"
										ref="faxNumberPart01"
										maxLength="3"
										onKeyPress={(e) => isNumberKey(e)}
										onBlur={this.checkFaxNumber}
										onChange={(e) => this.handleChangeNumber(e.target.value, 'faxNumberPart01', 'fax')}
										value={this.state.dataHospitalInfor.faxNumberPart01}
										onPaste={(e) => isOnPasteNumber(e)}
										disabled = {roleEditDelete === false ? true : ''}
									/>
									<span className="dash-letter">-</span>
									<input
										type="text"
										className="form-control w100"
										placeholder="0000"
										name="faxNumberPart02"
										ref="faxNumberPart02"
										maxLength="4"
										onKeyPress={(e) => isNumberKey(e)}
										onBlur={this.checkFaxNumber}
										onChange={(e) => this.handleChangeNumber(e.target.value, 'faxNumberPart02', 'fax')}
										value={this.state.dataHospitalInfor.faxNumberPart02}
										onPaste={(e) => isOnPasteNumber(e)}
										disabled = {roleEditDelete === false ? true : ''}
									/>
									<span className="dash-letter">-</span>
									<input
										type="text"
										className="form-control w100"
										placeholder="0000"
										name="faxNumberPart03"
										ref="faxNumberPart03"
										maxLength="4"
										onKeyPress={(e) => isNumberKey(e)}
										onBlur={this.checkFaxNumber}
										onChange={(e) => this.handleChangeNumber(e.target.value, 'faxNumberPart03', 'fax')}
										value={this.state.dataHospitalInfor.faxNumberPart03}
										onPaste={(e) => isOnPasteNumber(e)}
										disabled = {roleEditDelete === false ? true : ''}
									/>									
								</div>
								{this.renderError(this.state.errorFaxNumber, this.state.errorPhoneUnique ? "팩스 번호가 이미 있습니다." : "팩스 번호를 정확하게 입력하십시오.")}
							</td>
						</tr>
						<tr>
							<th>홈페이지 주소<span className="text-danger">*</span></th>
							<td colSpan="3" className="position-relative">
								<input
									type="text"
									className="form-control col-5"
									placeholder="홈페이지 주소를 입력해주세요"
									ref="homepageAddress"
									onBlur={this.checkHomepageAddress}
									defaultValue={this.state.dataHospitalInfor.website}
									disabled = {roleEditDelete === false ? true : ''}
								/>
								{this.renderError(this.state.errorHomepageAddress, "홈페이지 주소를 입력하십시오.")}
							</td>
						</tr>
						<tr>
							<th>간병비 지급일<span className="text-danger">*</span></th>
							<td className="position-relative d-flex align-items-center border-none">
								<div className={nonePoiter}>
									<Select
										value={{ value: this.state.dataHospitalInfor.date_of_payment, label: this.state.dataHospitalInfor.date_of_payment }}
										name="paymentDate"
										ref="paymentDate"
										options={roleEditDelete === true ? getDayOfMonth().dayOfMonth : []}
										onChange={(e) => this.handleChangeData({ date_of_payment: e.value })}
										blurInputOnSelect={true}
										isSearchable={false}
										placeholder="0"
										className="selectbill"
									/>
								</div>
								<span className="dash-letter">일</span>
								{this.renderError(this.state.errorPaymentDate, "개호 지불 일을 선택하십시오.")}
							</td>
							<th>간병비 변동<span className="text-danger">*</span></th>
							<td className="position-relative">
								<div className="d-flex">
									<div className="custom-radio">
										<label className="radio-wrapper">
											<input
												type="radio"
												name={SICK_LEAV_COSTS_OPTION}
												ref="sickLeaveCosts"
												checked={this.state.dataHospitalInfor.cost_of_sick === 1 ? true : false}
												onChange={() => this.handleChangeData({ cost_of_sick: 1 })}
												disabled = {roleEditDelete === false ? true : ''}
											/>
											<span className="checkradio" />
											<span className="text">있음</span>
										</label>
										<label className="radio-wrapper">
											<input
												type="radio"
												name={SICK_LEAV_COSTS_OPTION}
												ref="sickLeaveCosts"
												checked={this.state.dataHospitalInfor.cost_of_sick === 0 ? true : false}
												onChange={() => this.handleChangeData({ cost_of_sick: 0 })}
												disabled = {roleEditDelete === false ? true : ''}
											/>
											<span className="checkradio" />
											<span className="text">없음</span>
										</label>
									</div>
									<span className="text-span">※ 환자수에 따라 간병비가 다른 경우</span>
								</div>
								{this.renderError(this.state.errorSickLeaveCosts, "병가 비용을 선택하십시오.")}
							</td>
						</tr>
						<tr>
							<th>세금 지원<span className="text-danger">*</span></th>
							<td className="position-relative">
								<div className="d-flex">
									<div className="custom-radio">
										<label className="radio-wrapper">
											<input
												type="radio"
												name={TAX_SUPPORT_OPTION}
												ref="taxSupport"
												checked={this.state.dataHospitalInfor.tax_support === 1 ? true : false}
												onChange={() => this.handleChangeData({ tax_support: 1 })}
												disabled = {roleEditDelete === false ? true : ''}
											/>
											<span className="checkradio" />
											<span className="text">있음</span>
										</label>
										<label className="radio-wrapper">
											<input
												type="radio"
												name={TAX_SUPPORT_OPTION}
												ref="taxSupport"
												checked={this.state.dataHospitalInfor.tax_support === 0 ? true : false}
												onChange={() => this.handleChangeData({ tax_support: 0 })}
												disabled = {roleEditDelete === false ? true : ''}
											/>
											<span className="checkradio" />
											<span className="text">없음</span>
										</label>
									</div>
									<span className="text-span">※있음 : 3.3% 세율로 자동 계산</span>
								</div>
								{this.renderError(this.state.errorTaxSupport, "세금 지원을 선택하십시오.")}
							</td>
							<th>환자수<br />적용시간<span className="text-danger">*</span></th>
							<td className="position-relative">
								<div className="d-flex align-items-center">
									<div className={nonePoiter}>
										<Select
											value={{ value: this.state.dataHospitalInfor.application_time, label: parseInt(this.state.dataHospitalInfor.application_time) + "시" }}
											name="timeApply"
											ref="timeApply"
											options={roleEditDelete === true ? getHourInDay().hourInDay : []}
											blurInputOnSelect={true}
											isSearchable={false}
											placeholder="0시"
											className="selectbill"
											onChange={(e) => this.handleChangeData({ application_time: e.value })}
										/>
									</div>
									<span className="dash-letter">※ 환자수에 따라 일 간병비가 다른 경우,<br /> 기본값은 아침 9시로 설정되어 있습니다.</span>
								</div>
								{this.renderError(this.state.errorTimeApply, "신청 시간을 선택하십시오.")}
							</td>
						</tr>
						<tr>
							<th>병원 내 부대시설(공동)<span className="text-danger">*</span></th>
							<td colSpan="3" className="position-relative">
								<div className="wrapper-checkbox">
									<label className="checkbox-wrapper">
										<input
											type="checkbox"
											name="facility00"
											className="facilityCheckbox"
											defaultValue="1"
											ref="facility"
											onChange={(e) => this.checkFacility(1, e.target.checked)}
											checked={this.state.dataHospitalInfor.devices.indexOf(1) !== -1 ? true : false}
											disabled = {roleEditDelete === false ? true : ''}
										/>
										<span className="checkmark"></span>
										<span className="text">싱크대</span>
									</label>
									<label className="checkbox-wrapper">
										<input
											type="checkbox"
											name="facility01"
											className="facilityCheckbox"
											defaultValue="2"
											onChange={(e) => this.checkFacility(2, e.target.checked)}
											checked={this.state.dataHospitalInfor.devices.indexOf(2) !== -1 ? true : false}
											disabled = {roleEditDelete === false ? true : ''}
										/>
										<span className="checkmark"></span>
										<span className="text">전자레인지</span>
									</label>
									<label className="checkbox-wrapper">
										<input
											type="checkbox"
											name="facility02"
											className="facilityCheckbox"
											defaultValue="3"
											onChange={(e) => this.checkFacility(3, e.target.checked)}
											checked={this.state.dataHospitalInfor.devices.indexOf(3) !== -1 ? true : false}
											disabled = {roleEditDelete === false ? true : ''}
										/>
										<span className="checkmark"></span>
										<span className="text">세탁기</span>
									</label>
									<label className="checkbox-wrapper">
										<input
											type="checkbox"
											name="facility03"
											className="facilityCheckbox"
											defaultValue="4"
											onChange={(e) => this.checkFacility(4, e.target.checked)}
											checked={this.state.dataHospitalInfor.devices.indexOf(4) !== -1 ? true : false}
											disabled = {roleEditDelete === false ? true : ''}
										/>
										<span className="checkmark"></span>
										<span className="text">식당 사용</span>
									</label>
								</div>
								{this.renderError(this.state.errorFacility, "병원에서 추가 시설을 선택하십시오.")}
							</td>
						</tr>
						<tr>
							<th>병원 이미지</th>
							<td colSpan="3" className="position-relative">
								<div className="d-flex">
									<input
										type="text"
										className="form-control col-5 black"
										placeholder="병원이미지를 업로드해주세요"
										disabled
										ref="hospitalImage"
										value={this.state.dataHospitalInfor.image}
									/>
									<input type="file"
										id="uploadFileHospitalImage"
										className="d-none"
										ref="image"
										accept="image/png, image/jpeg, image/jpg"
										onChange={(e) => this.getFileName(e.target, 0)}
									/>
									{roleEditDelete === true ?
										<label
											htmlFor="uploadFileHospitalImage"
											className="btn btn-secondary m-0-auto"
										>업로드</label>
										: ''}
									<span className="ml-4">※고화질이미지를 선호합니다.<br />이미지를 업로드 하지 않으면 기본이미지가 사용됩니다.</span>
									{this.renderError(this.state.errorHospitalImage, "PNG,JPEG,JPG 파일만 가능합니다.")}
								</div>
							</td>
						</tr>
						<tr>
							<th>병원 로고</th>
							<td colSpan="3" className="position-relative">
								<div className="d-flex">
									<input
										type="text"
										className="form-control col-5 black"
										placeholder="병원로고를 업로드해주세요"
										disabled
										ref="hospitalLogo"
										defaultValue={this.state.dataHospitalInfor.logo}
									/>
									<input type="file"
										id="uploadFileHospitalLogo"
										className="d-none"
										ref="logo"
										accept="image/png, image/jpeg, image/jpg"
										onChange={(e) => this.getFileName(e.target, 1)} />
									{roleEditDelete === true ?
										<label
											htmlFor="uploadFileHospitalLogo"
											className="btn btn-secondary m-0-auto"
										>업로드</label>
										: ''}
									<span className="ml-4">※고화질이미지를 선호합니다.<br />이미지를 업로드 하지 않으면 기본이미지가 사용됩니다.</span>
									{this.renderError(this.state.errorHospitalLogo, "PNG,JPEG,JPG 파일만 가능합니다.")}
								</div>
							</td>
						</tr>
						<tr>
							<th>대표 태그</th>
							<td className="position-relative" colSpan="3">
								<input
									type="text"
									name="representativeTags"
									ref="representativeTags"
									className="form-control"
									maxLength="20"
									placeholder="주위의 건물이나 지하철역을 입력해주세요 간병인이 병원위치를 찾을 때 참고용입니다. 예)  군자역 5호선, 어린이대공원역"
									defaultValue={this.state.dataHospitalInfor.note}
									disabled = {roleEditDelete === false ? true : ''}
								/>
							</td>
						</tr>
						<tr>
							<th>병원길 안내</th>
							<td className="position-relative" colSpan="3">
								<textarea
									name="hospitalDirection"
									ref="hospitalDirection"
									className="form-control"
									rows="5"
									value={this.state.dataHospitalInfor.guide}
									onChange={(e) => this.handleChangeData({ guide: e.target.value })}
									disabled = {roleEditDelete === false ? true : ''}
								/>
								{this.renderPlaceHolderTextArea()}
							</td>
						</tr>
					</tbody>
				</table>
				<div className="text-right action">
					{roleEditDelete === true ?
						<button className="btn btn-primary" onClick={this.submitForm} disabled={this.state.isClick}>수정</button>
					: ''}
					{roleEditDelete === true ?
						<button className="btn btn-secondary" onClick={this.cancleUpdateHospital}>취소</button>
					: ''}
				</div>

				<Modal className='modalPopup w-55'
					id={MODAL_SUBJECT}
					show={this.state.openModalSubject}
					onHide={() => this.handleChange({ openModalSubject: true })}
				>
					<div className="content-modal">
						<h5 className="mb-4">진료과목을 선택해주세요 </h5>

						<div className="wrapper-checkbox">
							<div className="">
								{this.renderMedicalCheckbox(this.props.listCourses, JS_MEDICALSUBJECT, "")}
							</div>
						</div>

						<div className="action text-center mb-0">
							<button className="btn btn-primary"
								onClick={this.getMedicalContent.bind(this, JS_MEDICALSUBJECT, MODAL_SUBJECT)}
							>확인</button>
							<button
								className="btn btn-secondary ml-2"
								onClick={() => this.handleChange({ openModalSubject: false })}
							>취소</button>
						</div>
					</div>
				</Modal>

				<Modal className='modalPopup w-55'
					id={MODALEQUIPMENTS}
					show={this.state.openModalEquipments}
					onHide={() => this.handleChange({ openModalEquipments: true })}
				>
					<div className="content-modal">
						<h5 className="mb-4">의료장비를 선택해주세요</h5>
						<div className="wrapper-checkbox">
							{this.renderMedicalCheckbox(this.props.listMedicals, "js-medicalEquipment")}
						</div>
						<div className="action text-center mb-0">
							<button className="btn btn-primary"
								onClick={this.getMedicalContent.bind(this, "js-medicalEquipment", MODALEQUIPMENTS)}>확인</button>
							<button
								className="btn btn-secondary ml-2"
								onClick={() => this.handleChange({ openModalEquipments: false })}
							>취소</button>
						</div>
					</div>
				</Modal>

				<Modal className='modalPopup w-45'
					id="registerSuccess"
					show={this.state.openModalRegisterSuccess}
					onHide={() => this.handleChange({ openModalRegisterSuccess: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						{this.state.updateHospitalModal.msg}
					</div>
					<div className="action-footer text-center">
						<button
							className="btn btn-secondary"
							onClick={this.saveData}
						>확인</button>
					</div>
				</Modal>
				<Modal className='modalPopup w-45'
					id="cancleRegis"
					show={this.state.openModalCancleRegis}
					onHide={() => this.handleChange({ openModalCancleRegis: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						{this.state.updateHospitalModal.msg}
					</div>
					<div className="action-footer text-center">
						<button
							className="btn btn-secondary"
							onClick={this.navMainPage}
						>확인</button>
					</div>
				</Modal>
				<Modal className='modalPopup w-45'
					id="cancleRegis"
					show={this.state.openModalMap}
					onHide={() => this.handleChange({ openModalMap: false })}
				>
					<DaumPostcode
						onComplete={this.handleAddress}
					/>
				</Modal>

			</div>
		);
	}

	handleAddress = (data) => {
		let fullAddress = data.address;
		let extraAddress = '';

		if (data.addressType === 'R') {
			if (data.bname !== '') {
				extraAddress += data.bname;
			}
			if (data.buildingName !== '') {
				extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
			}
			fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
		}

		this.setState({
			dataHospitalInfor: {
				...this.state.dataHospitalInfor,
				hospital_postcode: data.postcode,
				address: fullAddress
			},
			openModalMap: false
		})

		console.log(data);  // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
		console.log('fullAddress', fullAddress);  // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
		console.log(1111, this.state)
	}
}

const mapStateToProps = (state) => {
	return {
		listTypes: state.hospitalReducer.listTypes,
		listCourses: state.hospitalReducer.listCourses,
		listMedicals: state.hospitalReducer.listMedicals,
		hospital_id: state.authReducer.user.user.hospital === null ? null : state.authReducer.user.user.hospital.id,
		hospital: state.authReducer.user.user.hospital,
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user
	}
}

export default withRouter(connect(mapStateToProps)(UpdateHospital));