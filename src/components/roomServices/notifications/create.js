import React, { Component } from 'react';
import Datetime from 'react-datetime';
import { formatNumber, isNumberKey, getCaregiverNumber, getPrefixWard1, getPrefixRoom1, checkAuth, isOnPasteNumber } from '../../../services/functionService';
import { createNotification, getCountEmergency } from '../../../services/notification';
import ReactDOM from 'react-dom';
import { TYPE_ERROR, ROLE } from '../../../config.json';
import imgError from "../../../public/images/errors.png";
import imgSuccess from "../../../public/images/success.png";
import Modal from 'react-bootstrap-modal';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import Select from 'react-select';
import { connect } from 'react-redux';
import { getListArea } from '../../../services/areaService';
import { getTypes } from '../../../services/typeService';
import httpService from '../../../services/httpService';
import { toast } from 'react-toastify';

const apiEndpoint = process.env.REACT_APP_API_URL;
const TYPE_WORKING = {
	LONG: 1,
	SHORT: 2
};
const NOTICE_TYPE = {
	NORMAL: 1,
	EMERGENCY: 2
};
const TYPE_ROOM_OPTION = "type_id";
const NOTICE_TYPE_OPTION = "notice_type";
const WORK_TYPE_OPTION = "work_type"
const COUPLE_CAREGIVE_CHECKBOX = "countCoupleAide";
const IS_COUPLE_CAREGIVE = "0";
const BTN_SUBMIT_VALID = "btn-primary";
const BTN_SUBMIT_INVALID = "btn-secondary";
const BTN_SUBMIT_REGIS = "등록";

class CreateNotification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			roomModal: [],
			isDisable: true,
			data: {
				type_working: 1
			},

			defaultNotification: {
				master_id: "",
				room_id: "",
				notice_type: 1,
				salary: "0",
				salary_bonus: "0",
				count_patient: "0",
				count_patient_plus: "0",
				work_type: 1,
				start_day: "",
				end_day: "",
				count_male_aide: 0,
				count_female_aide: 0,
				count_other_aide: 0,
				count_couple_aide: false,
				care_suction: 0,
				care_feeding: 0,
				care_physiotherapy: 0,
				care_dialysis: 0,
				care_respiratory: 0,
				material_tv: false,
				material_wifi: false,
				material_electric_bed: false,
				material_care_bed: false,
				material_locker: false,
				material_restroom: false,
				facility_sank: false,
				facility_washing: false,
				facility_microwave: false,
				facility_restaurant: false,
				note: "",
			},
			openModalRegSuccess: false,
			areas: [],
			rooms: [],
			areaSelected: '',
			roomSelected: '',
			types: [],
			room: [],
			radioTypes: '',
			displayByRoom: false,
			valueRoom: { value: '', label: '선택' },
			errorAreaRoom: '',
			messageAreaRoom: '',
			errorWorkingDate: "",
			messageWorkingDate: '',
			errorCaregiver: '',
			errorCareWork: '',
			countEmergency: 0
		}
	}

	componentDidMount() {
		this.initWorkingDate();
		this._renderData();

		this.setState({
			defaultNotification: {
				...this.state.defaultNotification,
				master_id: this.props.user.id
			}
		});
	}

	_renderData = async (id) => {
		let responseAreas = await getListArea(this.props.hospital_id);
		let responseTypes = await getTypes();
		let countEmergency = await getCountEmergency(this.props.user.id);

		this.setState({
			areas: this.mapListToSelectData(responseAreas.data.data),
			types: responseTypes.data.data,
			countEmergency: countEmergency < 5 ? countEmergency : 5
		});
	}

	mapListToSelectData(data, suffixLable) {
		let dataSelect = data.map(item => {
			let label = item.name + (suffixLable || '')
			return { value: item.id, label: label }
		})
		return [{ value: '', label: '선택' }, ...dataSelect]
	}

	renderError = (result, messageError) => {
		if (result == TYPE_ERROR.ERROR) {
			return (
				<div>
					<img src={imgError} alt="" className="display-middle message-icon" />
					<p className="display-bottom-left m-0 text-danger">{messageError}</p>
				</div>
			);
		} else if (result == TYPE_ERROR.VALID) {
			return (
				<img src={imgSuccess} alt="" className="display-middle message-icon" />
			);
		}
	}

	renderDataOption = (option) => {
		let html = [];
		option.map((item, index) => {
			html.push(
				<option key={index} value={item}>{item}</option>
			);
			return item;
		});
		return html;
	}

	initWorkingDate = () => {
		var workType = this.getWorkType();
		if (workType == TYPE_WORKING.SHORT) {
			this.setState({
				data: {
					type_working: TYPE_WORKING.SHORT
				}
			});
		} else {
			this.setState({
				data: {
					type_working: TYPE_WORKING.LONG
				}
			});
		}
	}

	handleChange = (data) => {
		this.setState({
			data: {
				...this.state.data,
				...data
			}
		});
	}

	changeNoticeType = (value) => {
		this.setState({
			defaultNotification: {
				...this.state.defaultNotification,
				notice_type: value
			}
		});
	}

	handleChangeCheckbox = (type, target) => {
		const value = target.type == 'checkbox' ? target.checked : target.value;
		switch (type) {
			case "count_couple_aide":
				this.setState({
					defaultNotification: {
						...this.state.defaultNotification,
						count_couple_aide: value
					}
				});
				var countCoupleAide = ReactDOM.findDOMNode(this.refs.countCoupleAide);
				countCoupleAide.value = value;
				this.checkCaregiver();
				break;
			case "material_tv":
				this.setState({
					defaultNotification: {
						...this.state.defaultNotification,
						material_tv: value
					}
				});
				break;
			case "material_wifi":
				this.setState({
					defaultNotification: {
						...this.state.defaultNotification,
						material_wifi: value
					}
				});
				break;
			case "material_electric_bed":
				this.setState({
					defaultNotification: {
						...this.state.defaultNotification,
						material_electric_bed: value
					}
				});
				break;
			case "material_care_bed":
				this.setState({
					defaultNotification: {
						...this.state.defaultNotification,
						material_care_bed: value
					}
				});
				break;
			case "material_locker":
				this.setState({
					defaultNotification: {
						...this.state.defaultNotification,
						material_locker: value
					}
				});
				break;
			case "material_restroom":
				this.setState({
					defaultNotification: {
						...this.state.defaultNotification,
						material_restroom: value
					}
				});
				break;
			case "facility_sank":
				this.setState({
					defaultNotification: {
						...this.state.defaultNotification,
						facility_sank: value
					}
				});
				break;
			case "facility_microwave":
				this.setState({
					defaultNotification: {
						...this.state.defaultNotification,
						facility_microwave: value
					}
				});
				break;
			case "facility_washing":
				this.setState({
					defaultNotification: {
						...this.state.defaultNotification,
						facility_washing: value
					}
				});
				break;
			case "facility_restaurant":
				this.setState({
					defaultNotification: {
						...this.state.defaultNotification,
						facility_restaurant: value
					}
				});
				break;
		}
	}

	handleChangeDisable = (value) => {
		let isDisable = true;

		if (value == 0) {
			isDisable = false;
		}

		this.setState({
			isDisable
		});
	}

	changeSelect = async (id, name) => {
		switch (name) {
			case "area":
				let areas = [...this.state.areas];
				let areaSelected = areas.filter(item => item.value == id)[0]
				await this.setState({
					...this.state,
					areaSelected,
					roomSelected: null,
					displayByRoom: false,

				}, async () => {
					this.setState({
						valueRoom: { value: '', label: '선택' },
						rooms: [],
						defaultNotification: {
							...this.state.defaultNotification
						}
					});

					if (id != '') {
						let response = await httpService.get(apiEndpoint + "rooms/" + id + "/area");
						this.setState({
							rooms: this.mapListToSelectData(response.data.data),
							errorAreaRoom: TYPE_ERROR.ERROR,
							messageAreaRoom: "방을 선택하십시오."
						});
					} else {
						this.setState({
							errorAreaRoom: TYPE_ERROR.ERROR,
							messageAreaRoom: "지역을 선택하십시오.",
							valueRoom: { value: '', label: '선택' }
						})
					}
				})
				break;
			case "room":
				let rooms = [...this.state.rooms];
				let roomSelected = rooms.filter(item => item.value == id)[0]
				await this.setState({
					...this.state,
					roomSelected,
				}, async () => {
					this.setState({
						valueRoom: roomSelected,
						defaultNotification: {
							...this.state.defaultNotification,
							room_id: id
						}
					});
					if (id != '') {
						let responseRoom = await httpService.get(apiEndpoint + "rooms/" + id);
						let room = responseRoom.data.data;
						this.setState({
							room: room,
							defaultNotification: {
								...this.state.defaultNotification,
								count_patient: room.count_patient,
								salary: room.amount,
								salary_bonus: 0,
								count_patient_plus: 0
							},
							errorAreaRoom: TYPE_ERROR.VALID,
						});

						// if (responseRoom.data.data.roomChange != null) {
						// 	let roomChange = responseRoom.data.data.roomChange;
						// 	this.setState({
						// 		defaultNotification: {
						// 			...this.state.defaultNotification,
						// 			salary_bonus: roomChange.salary_bonus,
						// 			count_patient_plus: roomChange.count_patient,
						// 		}
						// 	});
						// }

						this.setState({
							radioTypes: []
						});
						if (responseRoom != undefined) {
							let radioTypes = [];
							this.state.types.map((item, index) => {
								radioTypes.push(
									<label key={index} className="radio-wrapper not-allowed">
										<input
											type="radio"
											disabled
											name={TYPE_ROOM_OPTION}
											value={item.id}
											defaultChecked={item.id == this.state.room.type_id
												? true : false}
											onChange={() => this.handleChangeDisable(1)}

										/>
										<span className="checkradio" />
										<span className="text">{item.name}</span>
									</label>
								);
								return item;
							});
							this.setState({
								radioTypes: radioTypes,
								displayByRoom: true
							});
						}
					} else {
						this.setState({
							displayByRoom: false,
							errorAreaRoom: TYPE_ERROR.ERROR,
							messageAreaRoom: "방을 선택하십시오."
						});
					}
				})
				break;
			default:
				break;
		}
	}

	handleChangeData = (data) => {
		this.setState({
			...data
		});
	}

	changeCaregiver = (type, value) => {
		if(isNaN(value))
		{
			value = '';
		}
		
		switch (type) {
				case "count_male_aide":
				var countMaleAide = ReactDOM.findDOMNode(this.refs.countMaleAide);
				countMaleAide.value = value;
				this.state.defaultNotification.count_male_aide = value
				break;
			case "count_female_aide":
				var countFemaleAide = ReactDOM.findDOMNode(this.refs.countFemaleAide);
				countFemaleAide.value = value;
				this.state.defaultNotification.count_female_aide = value
				break;
			case "count_other_aide":
				var countOtherAide = ReactDOM.findDOMNode(this.refs.countOtherAide);
				countOtherAide.value = value;
				this.state.defaultNotification.count_other_aide = value
				break;
		}
		this.checkCaregiver();
	}

	checkCaregiver = () => {
		var countMaleAide = Number(ReactDOM.findDOMNode(this.refs.countMaleAide).value);
		var countFemaleAide = Number(ReactDOM.findDOMNode(this.refs.countFemaleAide).value);
		var countOtherAide = Number(ReactDOM.findDOMNode(this.refs.countOtherAide).value);
		var countCoupleAide = ReactDOM.findDOMNode(this.refs.countCoupleAide).value;

		if (countMaleAide > 20 || countFemaleAide > 20 || countOtherAide > 20) {
			this.setState({
				errorCaregiver: TYPE_ERROR.ERROR
			})
		} else {
			if (countMaleAide == 0 && countFemaleAide == 0 && countOtherAide == 0 && countCoupleAide == 'false') {
				this.setState({
					errorCaregiver: TYPE_ERROR.ERROR
				})
			} else {
				this.setState({
					errorCaregiver: TYPE_ERROR.VALID
				})
			}
		}
	}

	changeCareWork = (type, value) => {
		if(isNaN(value))
		{
			value = '';
		}

		switch (type) {
			case "care_suction":
				var careSuction = ReactDOM.findDOMNode(this.refs.careSuction);
				careSuction.value = value;
				this.state.defaultNotification.care_suction = value
				break;
			case "care_feeding":
				var careFeeding = ReactDOM.findDOMNode(this.refs.careFeeding);
				careFeeding.value = value;
				this.state.defaultNotification.care_feeding = value
				break;
			case "care_physiotherapy":
				var carePhysiotherapy = ReactDOM.findDOMNode(this.refs.carePhysiotherapy);
				carePhysiotherapy.value = value;
				this.state.defaultNotification.care_physiotherapy = value
				break;
			case "care_dialysis":
				var careDialysis = ReactDOM.findDOMNode(this.refs.careDialysis);
				careDialysis.value = value;
				this.state.defaultNotification.care_dialysis = value
				break;
			case "care_respiratory":
				var careRespiratory = ReactDOM.findDOMNode(this.refs.careRespiratory);
				careRespiratory.value = value;
				this.state.defaultNotification.care_respiratory = value
				break;

		}
		this.checkCareWork();
	}

	checkCareWork = () => {
		var careSuction = Number(ReactDOM.findDOMNode(this.refs.careSuction).value);
		var careFeeding = Number(ReactDOM.findDOMNode(this.refs.careFeeding).value);
		var carePhysiotherapy = Number(ReactDOM.findDOMNode(this.refs.carePhysiotherapy).value);
		var careDialysis = Number(ReactDOM.findDOMNode(this.refs.careDialysis).value);
		var careRespiratory = Number(ReactDOM.findDOMNode(this.refs.careRespiratory).value);

		if (careSuction == 0 && careFeeding == 0 && carePhysiotherapy == 0 && careDialysis == 0 && careRespiratory == 0) {
			this.setState({
				errorCareWork: TYPE_ERROR.ERROR
			})
		} else {
			this.setState({
				errorCareWork: TYPE_ERROR.VALID
			})
		}
	}

	checkArea = () => {
		var areaId = ReactDOM.findDOMNode(this.refs.areaId).value;
		if (areaId == undefined || areaId == '') {
			this.setState({
				errorAreaRoom: TYPE_ERROR.ERROR,
				messageAreaRoom: "방을 선택하십시오."
			})
		} else {
			this.setState({
				errorAreaRoom: TYPE_ERROR.VALID
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

	getRoomType = () => {
		var roomType = this.getValueOfOption(TYPE_ROOM_OPTION);
		return roomType;
	}

	getNoticeType = () => {
		var noticeType = this.getValueOfOption(NOTICE_TYPE_OPTION);
		return noticeType;
	}

	getWorkType = () => {
		var workType = this.getValueOfOption(WORK_TYPE_OPTION);
		return workType;
	}

	formatCurrency = (currencyInput) => {
		var currency = currencyInput.value;
		var pattern = /(-?\d+)(\d{3})/;
		while (pattern.test(currency)) {
			currency = currency.replace(pattern, "$1,$2");
		}
		currencyInput.value = currency;
	}

	removeComma = (type, value) => {
		switch (type) {
			case "salary_bonus":
				this.setState({
					defaultNotification: {
						...this.state.defaultNotification,
						salary_bonus: value.replace(/,/gi, "")
					}
				});
				break;
			case "count_patient_plus":
				this.setState({
					defaultNotification: {
						...this.state.defaultNotification,
						count_patient_plus: value
					}
				});
				break;
		}
	}

	compareDateTime = (startDate, endDate) => {
		if (startDate < endDate) {
			this.setState({
				errorWorkingDate: TYPE_ERROR.VALID
			})
		} else {
			this.setState({
				errorWorkingDate: TYPE_ERROR.ERROR
			})
		}
	}

	checkWokingDates = (workingType) => {
		this.setState({
			defaultNotification: {
				...this.state.defaultNotification,
				work_type: workingType
			}
		});

		// if (this.state.defaultNotification.start_day.length === 0 || this.state.defaultNotification.end_day.length === 0) {
		// 	this.setState({
		// 		errorWorkingDate: TYPE_ERROR.ERROR,
		// 		messageWorkingDate: '필수 입력 사항입니다'
		// 	})
		// }
	}

	checkWorkingLongTerm = (date) => {
		if (date == undefined || date == '') {
			this.setState({
				errorWorkingDate: TYPE_ERROR.ERROR
			})
		} else {
			this.setState({
				errorWorkingDate: TYPE_ERROR.VALID
			})
		}
	}

	checkTermDate = (name, data, workingType) => {
		if (workingType == TYPE_WORKING.LONG) {
			this.checkWorkingLongTerm(data.start_day);
		} else {
			if (name == TYPE_WORKING.LONG) {
				var endDate = this.state.defaultNotification.end_day;
				this.checkWorkingLongTerm(data.start_day, endDate);
			} else {
				var startDate = this.state.defaultNotification.start_day;
				this.compareDateTime(startDate, data.end_day);
			}
		}

		this.setState({
			defaultNotification: {
				...this.state.defaultNotification,
				...data
			}
		});
	}

	checkValidateWorkTime() {
		var startDate = this.state.defaultNotification.start_day != null && this.state.defaultNotification.start_day.length != 0 ? moment(this.state.defaultNotification.start_day).format("YYYY-MM-DD HH:mm") : undefined;

		//moment.tz.setDefault(momentTimezone.tz.guess());
		moment.tz.setDefault('Asia/Seoul');
		let now = moment(new Date()).format("YYYY-MM-DD HH:mm");

		let workType = this.state.defaultNotification.work_type;
		if (workType == TYPE_WORKING.LONG) {
			if (startDate == undefined || startDate <= now) {
				let messageWorkingDate = startDate != undefined ? '시작일은 현재보다 켜야합니다' : '필수 입력 사항입니다';
				this.setState({
					errorWorkingDate: TYPE_ERROR.ERROR,
					messageWorkingDate: messageWorkingDate
				})
			} else {
				this.setState({
					errorWorkingDate: TYPE_ERROR.VALID
				})
			}
		} else {
			var endDate = this.state.defaultNotification.end_day != null && this.state.defaultNotification.end_day.length != 0 ? moment(this.state.defaultNotification.end_day).format("YYYY-MM-DD HH:mm") : undefined;

			if (startDate == undefined || endDate == undefined || startDate <= now || endDate <= now || startDate >= endDate) {
				let messageWorkingDate = '';
				if (startDate == undefined || endDate == undefined) {
					messageWorkingDate = '필수 입력 사항입니다';
				} else if (startDate <= now || endDate <= now) {
					messageWorkingDate = (startDate <= now) ? '시작일은 현재보다 켜야합니다' : '종료일은 시작일보다 켜야합니다';
				} else {
					messageWorkingDate = '종료일은 시작일보다 켜야합니다';
				}
				this.setState({
					errorWorkingDate: TYPE_ERROR.ERROR,
					messageWorkingDate: messageWorkingDate
				})
			} else {
				this.setState({
					errorWorkingDate: TYPE_ERROR.VALID
				})
			}
		}
	}

	changeStartDay(datetime) {
		// var momentTimezone = require('moment-timezone');
		// moment.tz.setDefault(momentTimezone.tz.guess());
		// this.setState({
		// 	defaultNotification: {
		// 		...this.state.defaultNotification,
		// 		start_day: datetime != null ? moment(datetime).format("YYYY-MM-DD HH:mm") : ''
		// 	}
		// });
		// moment.tz.setDefault('Asia/Seoul');
		this.setState({
			defaultNotification: {
				...this.state.defaultNotification,
				start_day: datetime != null ? moment(datetime).format("YYYY-MM-DD HH:mm") : ''
			}
		});
	}

	changeEndDay(datetime) {
		this.setState({
			defaultNotification: {
				...this.state.defaultNotification,
				end_day: datetime != null ? moment(datetime).format("YYYY-MM-DD HH:mm") : ''
			}
		});
	}

	handleChangeDatetime = (event, type) => {
		let startDay = '', endDay = '';

		switch (type) {
			case 1:
				startDay = event.format('YYYY-MM-DD HH:mm');
				this.setState({
					defaultNotification: {
						...this.state.defaultNotification,
						start_day: startDay != null ? startDay : ''
					}
				});
				break;
			case 2:
				endDay = event.format('YYYY-MM-DD HH:mm');
				this.setState({
					defaultNotification: {
						...this.state.defaultNotification,
						end_day: endDay != null ? endDay : ''
					}
				});
				break;
		}
	}

	changeNote(value) {
		this.setState({
			defaultNotification: {
				...this.state.defaultNotification,
				note: value
			}
		});
	}


	getCheckBoxValues = (className) => {
		var checkBoxValues = [];
		var inputElements = document.getElementsByClassName(className);
		for (var i = 0; inputElements[i]; i++) {
			if (inputElements[i].checked) {
				checkBoxValues.push(inputElements[i].value);
			}
		}
		return checkBoxValues;
	}

	getcountCoupleAide = () => {
		var countCoupleAide = this.getCheckBoxValues(COUPLE_CAREGIVE_CHECKBOX);

		if (countCoupleAide[0] == IS_COUPLE_CAREGIVE) {
			return true;
		} else {
			return false;
		}
	}

	getCurrentDateTime = () => {
		var date = new Date().getDate(); //Current Date
		var month = new Date().getMonth() + 1; //Current Month
		var year = new Date().getFullYear(); //Current Year
		var hours = new Date().getHours(); //Current Hours
		var min = new Date().getMinutes(); //Current Minutes
		var sec = new Date().getSeconds(); //Current Seconds
		var CurrentDateTime = year + "-" + ('0' + month).slice(-2) + "-" + ('0' + date).slice(-2) + " "
			+ ('0' + hours).slice(-2) + ":" + ('0' + min).slice(-2) + ":" + ('0' + sec).slice(-2);

		return (CurrentDateTime);
	}

	saveData = () => {
		this.handleChangeData({ openModalRegSuccess: false });
		this.navMainPage();
	}

	isFormRegisterValid = () => {
		var chekFormValid = this.state.errorAreaRoom == TYPE_ERROR.VALID && this.state.errorWorkingDate == TYPE_ERROR.VALID
			&& this.state.errorCaregiver == TYPE_ERROR.VALID
			&& this.state.errorCareWork == TYPE_ERROR.VALID;

		return (chekFormValid);
	}

	handleChangeRefreshPage = () => {
		window.location.href = "/rooms/notice";
	}

	reCheckWorkingDates = () => {
		var startDate = this.state.defaultNotification.start_day;
		var endDate = this.state.defaultNotification.end_day;
		var workType = this.getWorkType();
		if (workType == TYPE_WORKING.LONG) {
			this.checkWorkingLongTerm(startDate);
		} else {
			this.compareDateTime(startDate, endDate);
		}
	}

	formValidate = () => {
		if (this.state.errorWorkingDate == '') {
			this.checkValidateWorkTime();
		}

		// 성별/간병인 수
		if (this.state.errorCaregiver == '') {
			this.checkCaregiver();
		}

		// 간병업무
		if (this.state.errorCareWork == '') {
			this.checkCareWork();
		}

		// // 병실 내 편의시설
		if (this.state.errorAreaRoom == '') {
			this.checkArea();
		}
	}

	submitForm = async (e) => {
		let roomModal = [];
		if (this.isFormRegisterValid()) {
			roomModal = {
				name: "register successfully",
				msg: "정상적으로 등록되었습니다."
			};
			this.setState({
				roomModal: roomModal
			});
			this.handleChangeData({ openModalRegSuccess: true });

			let response = await createNotification(this.state.defaultNotification);
			if (response.errors == undefined) {
				return roomModal;
				//toast.success(response.data.message);	
			} else {
				toast.error(response.errors.message);
			}
		} else {
			// error message
			this.formValidate();
		}
	}

	navMainPage = () => {
		window.location.href = "/rooms/notice";
		//this.props.history.push("/rooms/notice");
	}

	render() {
		const btnSumitStatus = this.isFormRegisterValid() ? BTN_SUBMIT_VALID : BTN_SUBMIT_INVALID;
		const btnSubmitName = BTN_SUBMIT_REGIS;
		const shortTermDisplay = this.state.data.type_working == TYPE_WORKING.LONG ? "d-none" : "d-inline-block";
		const displayByRoom = this.state.displayByRoom == false ? "d-none" : "";

		// var salary = this.state.defaultNotification.salary.toString().replace(/(-?\d+)(\d{3})/, "$1,$2");
		var salary = 0;
		if(this.state.defaultNotification.salary.toString() !== '0') {
			salary = formatNumber(this.state.defaultNotification.salary)
		}
		// if (this.state.defaultNotification.salary.toString().length >= 7) {
		// 	salary = this.state.defaultNotification.salary.toString().replace(/(-?\d+)(\d{3})(\d{3})/, "$1,$2,$3");
		// }


		moment.tz.setDefault(momentTimezone.tz.guess());
		return (
			<div className="notification">
				<div className="form-register">
					<table className="table table-bordered">
						<tbody>
							<tr>
								<th>병실/동 호수<span className="text-danger">*</span></th>
								<td className='position-relative d-flex justify-content-start border-bottom-0'>
									<Select
										ref="areaId"
										className="mr-2"
										placeholder=""
										onChange={(e) => this.changeSelect(e.value, "area")}
										options={this.state.areas}
										blurInputOnSelect={true}
										isSearchable={false}
										defaultValue={{ value: '', label: '선택' }}
									/>

									<Select
										ref="room_id"
										placeholder=""
										onChange={(e) => this.changeSelect(e.value, "room")}
										options={this.state.rooms}
										blurInputOnSelect={true}
										isSearchable={false}
										value={this.state.valueRoom}
									/>
									{this.renderError(this.state.errorAreaRoom, this.state.messageAreaRoom)}
								</td>

							</tr>
							<tr className={displayByRoom}>
								<th>병실종류</th>
								<td>
									<div className="custom-radio custom-radio-m d-inline-block">
										{this.state.radioTypes}
									</div>
								</td>
							</tr>
							<tr className={displayByRoom}>
								<th>환자수</th>
								<td>
									병실최대인원 <span>{this.state.defaultNotification.count_patient}</span>인실
								</td>
							</tr>
							<tr>
								<th>공고유형<span className="text-danger">*</span></th>
								<td>
									<div className="custom-radio">
										<label className="radio-wrapper">
											<input
												type="radio"
												name={NOTICE_TYPE_OPTION}
												defaultValue={NOTICE_TYPE.NORMAL}
												defaultChecked={this.state.defaultNotification.notice_type == NOTICE_TYPE.NORMAL ? true : false}
												onChange={() => this.changeNoticeType(NOTICE_TYPE.NORMAL)}
											/>
											<span className="checkradio" />
											<span className="text">일반</span>
										</label>
										<label className={this.state.countEmergency >= 5 ? 'radio-wrapper not-allowed' : "radio-wrapper"}>
											<input
												type="radio"
												disabled={this.state.countEmergency >= 5 ? true : false}
												name={NOTICE_TYPE_OPTION}
												defaultValue={NOTICE_TYPE.EMERGENCY}
												defaultChecked={this.state.defaultNotification.notice_type == NOTICE_TYPE.EMERGENCY ? true : false}
												onChange={() => this.changeNoticeType(NOTICE_TYPE.EMERGENCY)}
											/>
											<span className="checkradio" />
											<span className="text">긴급({this.state.countEmergency}/5)</span>
										</label>
									</div>
								</td>
							</tr>
							<tr className={displayByRoom}>
								<th>하루 일당<span className="text-danger">*</span></th>
								<td>
									<label className="custom-label">
										<span>일당</span>
										<input
											type="text"
											className="form-control salary"
											placeholder="0"
											ref="salary"
											value={salary}
											disabled
										/>
										<span>원</span>
									</label>
									<label className="custom-label">
										<span>추가일당</span>
										<input
											type="text"
											className="form-control"
											placeholder="0"
											ref="salaryBonus"
											value={this.state.defaultNotification.salary_bonus}
											onKeyPress={(e) => isNumberKey(e)}
											onBlur={(e) => this.formatCurrency(e.currentTarget)}
											onChange={(e) => this.removeComma('salary_bonus', e.currentTarget.value)}
											onPaste={(e) => isOnPasteNumber(e)}
										/>
										<span>원</span>
									</label>
									<label className="custom-label">
										<input
											type="text"
											className="form-control col-5 m-0 mr-2"
											placeholder="0"
											ref="countPatientPlus"
											value={this.state.defaultNotification.count_patient_plus}
											onKeyPress={(e) => isNumberKey(e)}
											onBlur={(e) => e.currentTarget}
											onChange={(e) => this.removeComma('count_patient_plus', e.currentTarget.value)}
											onPaste={(e) => isOnPasteNumber(e)}
										/>
										<span>일 동안</span>
									</label>
									<p className="mb-0">※ 추가일당 : 병원에서 일정기간  돈을 더 지급하는 것</p>
								</td>
							</tr>
							<tr>
								<th>근무 형태<span className="text-danger">*</span></th>
								<td>
									<div className="custom-radio">
										<label className="radio-wrapper">
											<input
												type="radio"
												name={WORK_TYPE_OPTION}
												defaultValue={1}
												defaultChecked={this.state.defaultNotification.work_type == 1 ? true : false}
												onChange={() => this.handleChange({ type_working: TYPE_WORKING.LONG })}
												onClick={(e) => this.checkWokingDates(e.currentTarget.value)}
											/>
											<span className="checkradio" />
											<span className="text">장기</span>
										</label>
										<label className="radio-wrapper">
											<input
												type="radio"
												name={WORK_TYPE_OPTION}
												defaultValue={2}
												defaultChecked={this.state.defaultNotification.work_type == 2 ? true : false}
												onChange={() => this.handleChange({ type_working: TYPE_WORKING.SHORT })}
												onClick={(e) => this.checkWokingDates(e.currentTarget.value)}
											/>
											<span className="checkradio" />
											<span className="text">단기</span>
										</label>
									</div>
								</td>
							</tr>
							<tr>
								<th>근무 일시<span className="text-danger">*</span></th>
								<td className="custom-datetime position-relative d-flex align-items-center border-none">
									<i className="fa fa-calendar" />
									<Datetime
										className="input-date"
										ref="startDate"
										inputProps={{ placeholder: '시 자동 입력됩니다', readOnly: true }}
										defaultValue={this.state.defaultNotification.start_day}
										onBlur={(e) => this.checkValidateWorkTime()}
										//onChange={(e) => this.changeStartDay(e._d)}
										onChange={e => this.handleChangeDatetime(e, 1)}
										timeFormat="HH:mm"
									/>
									<Datetime
										className={"input-date " + shortTermDisplay}
										ref="endDate"
										inputProps={{ placeholder: '시 자동 입력됩니다', readOnly: true }}
										defaultValue={this.state.defaultNotification.end_day}
										onBlur={(e) => this.checkValidateWorkTime()}
										//onChange={(e) => this.changeEndDay(e._d)}
										onChange={e => this.handleChangeDatetime(e, 2)}
										timeFormat="HH:mm"
									/>
									{this.renderError(this.state.errorWorkingDate, this.state.messageWorkingDate)}
								</td>
							</tr>
							<tr>
								<th>성별/간병인 수<span className="text-danger">*</span></th>
								<td className="position-relative d-flex justify-content-start border-bottom-0 ">
									<div className="handling-problem custom-slectoption w-35 w-12 border-bottom-0">
										<span className="text mr-1 col-2 p-0">남자</span>
										<Select
											className="d-inline-block"
											options={getCaregiverNumber().caregiverNumber}
											onChange={(e) => this.changeCaregiver("count_male_aide", e.value)}
											blurInputOnSelect={true}
											isSearchable={false}
											placeholder="00"
										/>
										<input
											type="text"
											className="form-control col-11 combo-input top"
											placeholder="00"
											ref="countMaleAide"
											onKeyPress={(e) => isNumberKey(e)}
											maxLength="2"
											onBlur={(e) => this.changeCaregiver("count_male_aide", e.target.value)}
											defaultValue={this.state.defaultNotification.count_male_aide != 0 ? this.state.defaultNotification.count_male_aide : ""}
										/>
										<span className="text pl-1">명</span>
									</div>
									<div className="handling-problem custom-slectoption w-35 w-12 border-bottom-0">
										<span className="text mr-1 ml-1 col-2 p-0">여자</span>
										<Select
											className="d-inline-block"
											options={getCaregiverNumber().caregiverNumber}
											onChange={(e) => this.changeCaregiver("count_female_aide", e.value)}
											blurInputOnSelect={true}
											isSearchable={false}
											placeholder="00"
										/>
										<input
											type="text"
											className="form-control col-11 combo-input top"
											placeholder="00"
											ref="countFemaleAide"
											onKeyPress={(e) => isNumberKey(e)}
											maxLength="2"
											onBlur={(e) => this.changeCaregiver("count_female_aide", e.target.value)}
											defaultValue={this.state.defaultNotification.count_female_aide != 0 ? this.state.defaultNotification.count_female_aide : ""}
										/>
										<span className="text pl-1">명</span>
									</div>
									<div className="handling-problem custom-slectoption w-35 w-12 border-bottom-0">
										<span className="text mr-1 ml-1 col-2 p-0">무관</span>
										<Select
											className="d-inline-block"
											options={getCaregiverNumber().caregiverNumber}
											onChange={(e) => this.changeCaregiver("count_other_aide", e.value)}
											blurInputOnSelect={true}
											isSearchable={false}
											placeholder="00"
										/>
										<input
											type="text"
											className="form-control col-11 combo-input top"
											placeholder="00"
											ref="countOtherAide"
											onKeyPress={(e) => isNumberKey(e)}
											maxLength="2"
											onBlur={(e) => this.changeCaregiver("count_other_aide", e.target.value)}
											defaultValue={this.state.defaultNotification.count_other_aide != 0 ? this.state.defaultNotification.count_other_aide : ""}
										/>
										<span className="text pl-1">명</span>
									</div>
									<div className="handling-problem d-flex align-items-center">
										<label className="checkbox-wrapper ml-4">
											<input
												type="checkbox"
												ref="countCoupleAide"
												defaultValue={this.state.defaultNotification.count_couple_aide}
												defaultChecked={this.state.defaultNotification.count_couple_aide}
												onChange={(e) => this.handleChangeCheckbox("count_couple_aide", e.target)}
											/>
											<span className="checkmark"></span>
											<span className="text">부부</span>
										</label>
									</div>

									{this.renderError(this.state.errorCaregiver, "필수 입력 사항이며 값이 20보다 작이나 20만큼 됩니다")}
								</td>
							</tr>
							<tr>
								<th>간병업무<span className="text-danger">*</span></th>
								<td className="position-relative d-flex justify-content-start border-bottom-0 ">
									<div className="handling-problem custom-slectoption w-35 w-12 border-bottom-0">
										<span className="text mr-1 col-2 p-0">석션</span>
										<Select
											className="d-inline-block"
											options={getCaregiverNumber().caregiverNumber}
											onChange={(e) => this.changeCareWork("care_suction", e.value)}
											blurInputOnSelect={true}
											isSearchable={false}
											placeholder="00"
										/>
										<input
											type="text mr-1 ml-1"
											className="form-control col-11 combo-input top"
											placeholder="00"
											ref="careSuction"
											onKeyPress={(e) => isNumberKey(e)}
											maxLength="2"
											onBlur={(e) => this.changeCareWork("care_suction", e.target.value)}
										/>
										<span className="text pl-1">명</span>
									</div>
									<div className="handling-problem custom-slectoption w-35 w-12 border-bottom-0">
										<span className="text mr-1 ml-1 col-2 p-0">피딩</span>
										<Select
											className="d-inline-block"
											options={getCaregiverNumber().caregiverNumber}
											onChange={(e) => this.changeCareWork("care_feeding", e.value)}
											blurInputOnSelect={true}
											isSearchable={false}
											placeholder="00"
										/>
										<input
											type="text"
											className="form-control col-11 combo-input top"
											placeholder="00"
											ref="careFeeding"
											onKeyPress={(e) => isNumberKey(e)}
											maxLength="2"
											onBlur={(e) => this.changeCareWork("care_feeding", e.target.value)}
											defaultValue=""
										/>
										<span className="text pl-1">명</span>
									</div>
									<div className="handling-problem custom-slectoption w-35 w-12 border-bottom-0">
										<span className="text mr-1 ml-1 col-4 p-0">물리치료</span>
										<Select
											className="d-inline-block"
											options={getCaregiverNumber().caregiverNumber}
											onChange={(e) => this.changeCareWork("care_physiotherapy", e.value)}
											blurInputOnSelect={true}
											isSearchable={false}
											placeholder="00"
										/>
										<input
											type="text"
											className="form-control col-11 combo-input top1"
											placeholder="00"
											ref="carePhysiotherapy"
											onKeyPress={(e) => isNumberKey(e)}
											maxLength="2"
											onBlur={(e) => this.changeCareWork("care_physiotherapy", e.target.value)}
											defaultValue=""
										/>
										<span className="text pl-1">명</span>
									</div>
									<div className="handling-problem custom-slectoption w-35 w-12 border-bottom-0">
										<span className="text mr-1 ml-1 col-2 p-0">투석</span>
										<Select
											className="d-inline-block"
											options={getCaregiverNumber().caregiverNumber}
											onChange={(e) => this.changeCareWork("care_dialysis", e.value)}
											blurInputOnSelect={true}
											isSearchable={false}
											placeholder="00"
										/>
										<input
											type="text"
											className="form-control col-11 combo-input top"
											placeholder="00"
											ref="careDialysis"
											onKeyPress={(e) => isNumberKey(e)}
											maxLength="2"
											onBlur={(e) => this.changeCareWork("care_dialysis", e.target.value)}
											defaultValue=""
										/>
										<span className="text pl-1">명</span>
									</div>
									<div className="handling-problem custom-slectoption w-35 w-12 border-bottom-0">
										<span className="text mr-1 col-3 p-0">호흡기</span>
										<Select
											className="d-inline-block"
											options={getCaregiverNumber().caregiverNumber}
											onChange={(e) => this.changeCareWork("care_respiratory", e.value)}
											blurInputOnSelect={true}
											isSearchable={false}
											placeholder="00"
										/>
										<input
											type="text"
											className="form-control col-11 combo-input top2"
											placeholder="00"
											ref="careRespiratory"
											onKeyPress={(e) => isNumberKey(e)}
											maxLength="2"
											onBlur={(e) => this.changeCareWork("care_respiratory", e.target.value)}
											defaultValue=""
										/>
										<span className="text pl-1">명</span>
									</div>
									{this.renderError(this.state.errorCareWork, "필수 입력 사항이며 값이 ")}
								</td>
							</tr>
							<tr>
								<th>병실 내 편의시설</th>
								<td className="custom-checkbox position-relative">
									<label className="checkbox-wrapper">
										<input
											type="checkbox"
											ref="materialTv"
											defaultValue={this.state.defaultNotification.material_tv}
											className="roomFacility"
											defaultChecked={this.state.defaultNotification.material_tv}
											onChange={(e) => this.handleChangeCheckbox("material_tv", e.target)}
										/>
										<span className="checkmark"></span>
										<span className="text">TV</span>
									</label>
									<label className="checkbox-wrapper">
										<input
											type="checkbox"
											ref="materialWifi"
											defaultValue={this.state.defaultNotification.material_wifi}
											className="roomFacility"
											defaultChecked={this.state.defaultNotification.material_wifi}
											onChange={(e) => this.handleChangeCheckbox("material_wifi", e.target)}
										/>
										<span className="checkmark"></span>
										<span className="text">와이파이</span>
									</label>
									<label className="checkbox-wrapper">
										<input
											type="checkbox"
											ref="materialElectricBed"
											defaultValue={this.state.defaultNotification.material_electric_bed}
											className="roomFacility"
											defaultChecked={this.state.defaultNotification.material_electric_bed}
											onChange={(e) => this.handleChangeCheckbox("material_electric_bed", e.target)}
										/>
										<span className="checkmark"></span>
										<span className="text">전동침대</span>
									</label>
									<label className="checkbox-wrapper">
										<input
											type="checkbox"
											ref="materialCareBed"
											defaultValue={this.state.defaultNotification.material_care_bed}
											className="roomFacility"
											defaultChecked={this.state.defaultNotification.material_care_bed}
											onChange={(e) => this.handleChangeCheckbox("material_care_bed", e.target)}
										/>
										<span className="checkmark"></span>
										<span className="text">간병인 침대</span>
									</label>
									<label className="checkbox-wrapper">
										<input
											type="checkbox"
											ref="materialLocker"
											defaultValue={this.state.defaultNotification.material_locker}
											className="roomFacility"
											defaultChecked={this.state.defaultNotification.material_locker}
											onChange={(e) => this.handleChangeCheckbox("material_locker", e.target)}
										/>
										<span className="checkmark"></span>
										<span className="text">사물함</span>
									</label>
									<label className="checkbox-wrapper">
										<input
											type="checkbox"
											ref="materialRestroom"
											defaultValue={this.state.defaultNotification.material_restroom}
											className="roomFacility"
											defaultChecked={this.state.defaultNotification.material_restroom}
											onChange={(e) => this.handleChangeCheckbox("material_restroom", e.target)}
										/>
										<span className="checkmark"></span>
										<span className="text">화장실</span>
									</label>
								</td>
							</tr>
							<tr>
								<th>병원 내 부대시설(공동)</th>
								<td className="custom-checkbox">
									<label className="checkbox-wrapper">
										<input
											type="checkbox"
											ref="facilitySank"
											defaultValue={this.state.defaultNotification.facility_sank}
											className="hospitalFacility"
											defaultChecked={this.state.defaultNotification.facility_sank}
											onChange={(e) => this.handleChangeCheckbox("facility_sank", e.target)}
										/>
										<span className="checkmark"></span>
										<span className="text">싱크대</span>
									</label>
									<label className="checkbox-wrapper">
										<input
											type="checkbox"
											ref="facilityMicrowave"
											defaultValue={this.state.defaultNotification.facility_microwave}
											className="hospitalFacility"
											defaultChecked={this.state.defaultNotification.facility_microwave}
											onChange={(e) => this.handleChangeCheckbox("facility_microwave", e.target)}
										/>
										<span className="checkmark"></span>
										<span className="text">전자레인지</span>
									</label>
									<label className="checkbox-wrapper">
										<input
											type="checkbox"
											ref="facilityWashing"
											defaultValue={this.state.defaultNotification.facility_washing}
											className="hospitalFacility"
											defaultChecked={this.state.defaultNotification.facility_washing}
											onChange={(e) => this.handleChangeCheckbox("facility_washing", e.target)}
										/>
										<span className="checkmark"></span>
										<span className="text">세탁기</span>
									</label>
									<label className="checkbox-wrapper">
										<input
											type="checkbox"
											ref="facilityRestaurant"
											defaultValue={this.state.defaultNotification.facility_restaurant}
											className="hospitalFacility"
											defaultChecked={this.state.defaultNotification.facility_restaurant}
											onChange={(e) => this.handleChangeCheckbox("facility_restaurant", e.target)}
										/>
										<span className="checkmark"></span>
										<span className="text">식당 사용</span>
									</label>
								</td>
							</tr>
							<tr>
								<th>등록 일시</th>
								<td className="position-relative">
									<input type="text"
										className="form-control col-2 m-0"
										name="regisDateTime"
										ref="regisDateTime"
										placeholder="일시를 선택해주세요"
										disabled
										defaultValue=""
									/>
								</td>
							</tr>
							<tr>
								<th>작성자</th>
								<td>
									{this.props.user.full_name}
								</td>
							</tr>
							<tr>
								<th>참고사항</th>
								<td>
									<p className="mb-1">※ 메모는 간호사들만 볼 수 있으며, 간병인 앱에는 보여지지 않습니다.</p>
									<textarea
										className="form-control"
										ref="note"
										rows="3"
										defaultValue={this.state.defaultNotification.note}
										onChange={(e) => this.changeNote(e.currentTarget.value)}
									/>
								</td>
							</tr>
						</tbody>
					</table>
					<div className="action">
						<div className="text-right d-inline-block float-right">
							<button className={"btn " + btnSumitStatus} onClick={this.submitForm}>{btnSubmitName}</button>
							<button className="btn btn-secondary" onClick={this.navMainPage}>취소</button>
						</div>
					</div>
				</div>

				<Modal className='modalPopup w-45'
					id="registerSuccess"
					show={this.state.openModalRegSuccess}
					onHide={this.handleChangeRefreshPage}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						{this.state.roomModal.msg}
					</div>
					<div className="action-footer text-center">
						<button
							className="btn btn-secondary"
							onClick={this.saveData}
						>확인</button>
					</div>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.authReducer.user.user == null ? null : state.authReducer.user.user,
		hospital_id: state.authReducer.user.user.hospital == null ? null : state.authReducer.user.user.hospital.id
	}
}

export default connect(mapStateToProps)(CreateNotification);
