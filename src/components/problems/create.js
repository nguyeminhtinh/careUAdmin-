import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { isNumberKey, getPrefixPhoneNumber, isCharacterValid, isOnPasteNumber, checkAuth } from '../../services/functionService';
import { TYPE_ERROR, ROLE } from '../../config.json';
import imgError from "../../public/images/errors.png";
import imgSuccess from "../../public/images/success.png";
import Modal from 'react-bootstrap-modal';
import { getHandlingProblemById } from '../../services/handlingProblem';
import _ from 'lodash';
import { } from '@babel/polyfill';
import Select from 'react-select';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import {  withRouter } from 'react-router-dom';
import { getListArea } from '../../services/areaService';
import { getRoomsByArea } from '../../services/roomService';

const VALID_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const HANGUL = new RegExp("[\u1100-\u11FF|\u3130-\u318F|\uA960-\uA97F|\uAC00-\uD7AF|\uD7B0-\uD7FF]");
const UPLOAD_FILE01 = "uploadFile01";
const UPLOAD_FILE02 = "uploadFile02";

class ProblemCreate extends Component {
	constructor(props) {
		super(props);

		checkAuth("problems", this.props.user, ROLE.ALL, true);

		this.state = {
			errorAccidentLetter: "",
			errorPatientAgreement: "",
			errorArea: "",
			errorRoom: "",
			errorPatientName: "",
			errorPhoneNumber: "",
			errorProtectorName: "",
			errorCaregiverName: "",
			selectNumber: "",
			dataRegister: {
				accident_letter: "",
				agreement_letter: "",
				patient_name: "",
				phone: "",
				protection_name: "",
				aide_name: "",
				area: '',
				room: ''
			},
			openModalCancel: false,
			listArea: [],
			listRoom: [],
			isDisable: false
		}
	}

	componentWillMount() {
		this._renderListArea();
	}

	_renderListArea = async () => {
		//let listArea = [...this.props.listArea];
		
		let responseAreas = await getListArea(this.props.hospital_id);
		let listArea = responseAreas.data.data;

		listArea.map((item) => {
			item.value = item.id;
			item.label = item.name;

			return item;
		});

		listArea= [{ value: '', label: '선택' }, ...listArea]

		// let listRoom = [...this.props.listRoom];
		// if (listArea[0]) {
		// 	listRoom = listRoom.filter(item => item.area_id === listArea[0].id);
		// }

		// listRoom.map(item => {
		// 	item.label = item.name;
		// 	item.value = item.id

		// 	return item;
		// });

		let listRoom= [{ value: '', label: '선택' }]

		this.setState({
			listArea,
			listRoom,
			dataRegister: {
				...this.state.dataRegister,
				area: listArea[0],
				room: listRoom[0]
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
		}

		if (result === TYPE_ERROR.VALID) {
			return (
				<img src={imgSuccess} alt="" className="display-middle message-icon" />
			);
		}
	}

	uploadFileState = (index, state) => {
		if (index === 0) {
			this.setState({
				errorAccidentLetter: state
			});
		} else {
			this.setState({
				errorPatientAgreement: state
			});
		}
	}

	getFileName = async (oInput, index) => {
		let accident_file = ReactDOM.findDOMNode(this.refs.accident_file);
		let agreement_file = ReactDOM.findDOMNode(this.refs.agreement_file);

		if (accident_file.value.length !== 0) {
			accident_file = await this.fileToBase64(accident_file);

			this.setState({
				dataRegister: {
					...this.state.dataRegister,
					accident_letter: accident_file
				}
			});
		}

		if (agreement_file.value.length !== 0) {
			agreement_file = await this.fileToBase64(agreement_file);

			this.setState({
				dataRegister: {
					...this.state.dataRegister,
					agreement_letter: agreement_file
				}
			});
		}

		if (_.isUndefined(oInput.files[0])) {
			if (index === 0) {
				let accident_letter = ReactDOM.findDOMNode(this.refs.accident_letter).value;
				if (accident_letter.length === 0) {
					this.uploadFileState(index, TYPE_ERROR.ERROR);
					return false;
				}
			}
			if (index === 1) {
				let agreement_letter = ReactDOM.findDOMNode(this.refs.agreement_letter).value;
				if (agreement_letter.length === 0) {
					this.uploadFileState(index, TYPE_ERROR.ERROR);
					return false;
				}
			}
		} else {
			var fileName = oInput.files[0].name;
			if (index === 0) {
				var accident_letter = ReactDOM.findDOMNode(this.refs.accident_letter);
				accident_letter.value = fileName;
			} else {
				var agreement_letter = ReactDOM.findDOMNode(this.refs.agreement_letter);
				agreement_letter.value = fileName;
			}
		}

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
					this.uploadFileState(index, TYPE_ERROR.ERROR);
					return false;
				}
			}
		}

		this.uploadFileState(index, TYPE_ERROR.VALID);

		return true;
	}

	checkPatientName = () => {
		let patient_name = ReactDOM.findDOMNode(this.refs.patient_name).value;
		let errorPatientName = TYPE_ERROR.VALID;
		patient_name = patient_name.split(' ').join('')
		// ReactDOM.findDOMNode(this.refs.patient_name).value = patient_name;
		if (patient_name.length === 0 || patient_name.length > 15 || isCharacterValid(patient_name, HANGUL)) {
			errorPatientName = TYPE_ERROR.ERROR;
		}

		this.setState({
			errorPatientName
		});
	}

	checkRoom = (room) => {
		let errorRoom = TYPE_ERROR.VALID;

		if (_.isEmpty(room) || room.value === "") {
			errorRoom = TYPE_ERROR.ERROR;
		}

		this.setState({
			errorRoom
		});
	}

	checkArea = (area) => {
		let errorArea = TYPE_ERROR.VALID;

		if (_.isEmpty(area) || area.value === "") {
			errorArea = TYPE_ERROR.ERROR;
		}
		this.setState({
			errorArea
		});
	}

	checkPhoneNumber = () => {
		let phoneNumberPart01 = ReactDOM.findDOMNode(this.refs.phoneNumberPart01);
		let phoneNumberPart02 = ReactDOM.findDOMNode(this.refs.phoneNumberPart02);
		let phoneNumberPart03 = ReactDOM.findDOMNode(this.refs.phoneNumberPart03);
		let errorPhoneNumber = TYPE_ERROR.ERROR;

		if(isNaN(phoneNumberPart01.value) || isNaN(phoneNumberPart02.value) || isNaN(phoneNumberPart03.value))
		{
			errorPhoneNumber = TYPE_ERROR.ERROR;
		}else {
			if (phoneNumberPart01.value.length >= 2 && phoneNumberPart01.value.length <= 4
				&& phoneNumberPart02.value.length === 4
				&& phoneNumberPart03.value.length === 4) {
				errorPhoneNumber = TYPE_ERROR.VALID;
			}
		}

		this.setState({
			errorPhoneNumber
		})
	}

	checkProtectorName = () => {
		let protection_name = ReactDOM.findDOMNode(this.refs.protection_name).value;
		let errorProtectorName = TYPE_ERROR.VALID;
		protection_name = protection_name.split(' ').join('')
		// ReactDOM.findDOMNode(this.refs.protection_name).value = protection_name.trim();

		if (protection_name.length === 0 || protection_name.length > 15 || isCharacterValid(protection_name, HANGUL)) {
			errorProtectorName = TYPE_ERROR.ERROR;
		}

		this.setState({
			errorProtectorName
		});
	}

	checkCaregiverName = () => {
		let aide_name = ReactDOM.findDOMNode(this.refs.aide_name).value;
		let errorCaregiverName = TYPE_ERROR.VALID;
		aide_name = aide_name.split(' ').join('')
		// ReactDOM.findDOMNode(this.refs.aide_name).value = aide_name.trim();

		if (aide_name.length === 0 || aide_name.length > 15 || isCharacterValid(aide_name, HANGUL)) {
			errorCaregiverName = TYPE_ERROR.ERROR;
		}

		this.setState({
			errorCaregiverName
		});
	}

	isFormRegisterValid = () => {
		let chekFormValid = true && this.state.errorAccidentLetter === TYPE_ERROR.VALID
			&& this.state.errorPatientAgreement === TYPE_ERROR.VALID
			&& this.state.errorPatientName === TYPE_ERROR.VALID
			&& this.state.errorPhoneNumber === TYPE_ERROR.VALID
			&& this.state.errorProtectorName === TYPE_ERROR.VALID
			&& this.state.errorCaregiverName === TYPE_ERROR.VALID
			&& this.state.errorRoom === TYPE_ERROR.VALID
			&& this.state.errorArea === TYPE_ERROR.VALID;

		return chekFormValid;
	}

	formValidate = () => {

		// 사고경위서
		if (this.state.errorAccidentLetter === '') {
			this.setState({
				errorAccidentLetter: TYPE_ERROR.ERROR
			});
		}

		// 환자동의서
		if (this.state.errorPatientAgreement === '') {
			this.setState({
				errorPatientAgreement: TYPE_ERROR.ERROR
			});
		}

		// 환자명
		if (this.state.errorPatientName === '') {
			this.checkPatientName();
		}

		// 보호자 연락처
		if (this.state.errorPhoneNumber === '') {
			this.checkPhoneNumber();
		}

		// 보호자 이름
		if (this.state.errorProtectorName === '') {
			this.checkProtectorName();
		}

		// 간병인 이름
		if (this.state.errorCaregiverName === '') {
			this.checkCaregiverName();
		}

		this.checkRoom(this.state.dataRegister.room);
		this.checkArea(this.state.dataRegister.area)
	}

	saveData = async () => {
		let accident_letter = ReactDOM.findDOMNode(this.refs.accident_file);
		let agreement_letter = ReactDOM.findDOMNode(this.refs.agreement_file);

		if (accident_letter.value.length !== 0) {
			accident_letter = await this.fileToBase64(accident_letter);

			this.setState({
				dataRegister: {
					...this.state.dataRegister,
					accident_letter
				}
			});
		}

		if (agreement_letter.value.length !== 0) {
			agreement_letter = await this.fileToBase64(agreement_letter);

			this.setState({
				dataRegister: {
					...this.state.dataRegister,
					agreement_letter,
				}
			});
		}

		// 병동
		let area_id = this.state.dataRegister.area.id;

		// 호실
		let room_id = this.state.dataRegister.room.id;

		// 환자명
		let patient_name = ReactDOM.findDOMNode(this.refs.patient_name).value;

		// 보호자 연락처
		let phoneNumberPart01 = ReactDOM.findDOMNode(this.refs.phoneNumberPart01).value;
		let phoneNumberPart02 = ReactDOM.findDOMNode(this.refs.phoneNumberPart02).value;
		let phoneNumberPart03 = ReactDOM.findDOMNode(this.refs.phoneNumberPart03).value;
		let phone = phoneNumberPart01 + '-' + phoneNumberPart02 + '-' + phoneNumberPart03;

		// 보호자 이름
		let protection_name = ReactDOM.findDOMNode(this.refs.protection_name).value;

		// 간병인 이름
		let aide_name = ReactDOM.findDOMNode(this.refs.aide_name).value;

		this.setState({
			dataRegister: {
				...this.state.dataRegister,
				master_id: 2,
				area_id,
				room_id,
				patient_name,
				phone,
				protection_name,
				aide_name
			}
		});
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

	handleChange = (data) => {
		this.setState({
			...data
		});
	}

	handleChangeData = (data) => {
		this.setState({
			dataRegister: {
				...this.state.dataRegister,
				...data
			}
		});
	}

	submitForm = async () => {
		await this.formValidate();

		if (this.isFormRegisterValid()) {
			this.setState({
				isDisable: true
			});

			await this.saveData();

			try {
				let response = await getHandlingProblemById(this.state.dataRegister);
				toast.success(response.data.message);
				setTimeout(() => {
					this.props.history.push("/problems");
				}, 4000);
			} catch (error) {
				console.log(error);
				this.setState({
					isDisable: false
				});
			}
		}
	}

	navHandleIncident = () => {
		this.props.history.push("/problems");
	}

	checkSelectPhoneNumber = (data) => {
		let phoneNumberPart01 = ReactDOM.findDOMNode(this.refs.phoneNumberPart01);
		phoneNumberPart01.value = data.selectNumber;
		this.checkPhoneNumber();
	}

	handleChangeArea = async (data) => {
		let area = { value: '', label: '선택' };
		let room = { value: '', label: '선택' };
		if (_.isEmpty(data) || data.value === "")
		{
			this.setState({
				errorArea: TYPE_ERROR.ERROR,
				errorRoom: TYPE_ERROR.ERROR,
				listRoom: [],
				dataRegister: {
					...this.state.dataRegister,
					room
				}
			},() => {
				this.handleChangeData({ area: area });
				this.checkRoom(room);
				this.checkArea(data);
			});
		}else {
			let responseRoom = await getRoomsByArea(data.value);
			let listRoom = responseRoom.data.data;

			listRoom.map(item => {
				item.label = item.name;
				item.value = item.id

				return item;
			});

			listRoom= [{ value: '', label: '선택' }, ...listRoom]

			this.setState({
				listRoom
			}, () => {
				this.handleChangeData({ area: data });
			});


			if (listRoom.length !== 0) {
				room = listRoom[0];
			}

			this.setState({
				dataRegister: {
					...this.state.dataRegister,
					room
				}
			}, () => {
				this.checkRoom(room);
				this.checkArea(data);
			});
		}		
	}

	handleChangeRoom = async (data) => {
		let errorRoom = TYPE_ERROR.VALID;

		if (_.isEmpty(data) || data.value === "") {
			errorRoom = TYPE_ERROR.ERROR;
		}

		this.setState({
			errorRoom
		});
		this.handleChangeData({ room: data });
	}

	render() {
		return (
			<div className="handling-problem">
				<p className="font-weight-bold mb-2">사고 수정하기</p>
				<table className="table table-bordered">
					<tbody>
						<tr>
							<th>사고경위서<span className="text-danger pl-1">*</span></th>
							<td className="position-relative">
								<div className="d-flex">
									<input type="text"
										className="form-control border col-3 m-0"
										placeholder="파일 업로드 하세요"
										name="accident_letter"
										ref="accident_letter"
										defaultValue={this.state.dataRegister.accident_letter}
										disabled
									/>
									<input type="file"
										name={UPLOAD_FILE01}
										id={UPLOAD_FILE01}
										ref="accident_file"
										accept="image/png, image/jpeg, image/jpg"
										className="d-none"
										onChange={(e) => this.getFileName(e.target, 0)}
									/>
									<label htmlFor={UPLOAD_FILE01}
										className="btn btn-secondary m-0-auto">
										업로드
                                    </label>
								</div>
								{this.renderError(this.state.errorAccidentLetter, "PNG,JPEG,JPG 파일만 가능합니다.")}
							</td>
						</tr>
						<tr>
							<th>환자동의서<span className="text-danger pl-1">*</span></th>
							<td className="position-relative">
								<div className="d-flex">
									<input type="text"
										className="form-control border col-3 m-0"
										placeholder="파일 업로드 하세요"
										name="agreement_letter"
										ref="agreement_letter"
										defaultValue={this.state.dataRegister.agreement_letter}
										disabled
									/>
									<input type="file"
										name={UPLOAD_FILE02}
										id={UPLOAD_FILE02}
										ref="agreement_file"
										accept="image/png, image/jpeg, image/jpg"
										className="d-none"
										onChange={(e) => this.getFileName(e.target, 1)}
									/>
									<label htmlFor={UPLOAD_FILE02}
										className="btn btn-secondary m-0-auto">
										업로드
                                    </label>
								</div>
								{this.renderError(this.state.errorPatientAgreement, "PNG,JPEG,JPG 파일만 가능합니다.")}
							</td>
						</tr>
						<tr>
							<th>병동<span className="text-danger pl-1">*</span></th>
							<td className="position-relative">
								<Select
									ref="area_id"
									placeholder="선택"
									blurInputOnSelect={true}
									isSearchable={false}
									onChange={(e) => this.handleChangeArea(e)}
									options={this.state.listArea}
									value={this.state.dataRegister.area}
								/>
								{this.renderError(this.state.errorArea, "지역을 선택하십시오")}
							</td>
						</tr>
						<tr>
							<th>호실<span className="text-danger pl-1">*</span></th>
							<td className="position-relative">
								<Select
									ref="room_id"
									placeholder="선택"
									blurInputOnSelect={true}
									isSearchable={false}
									onChange={(e) => this.handleChangeRoom(e)}
									options={this.state.listRoom}
									value={this.state.dataRegister.room}
								/>
								{this.renderError(this.state.errorRoom, "방을 선택하십시오")}
							</td>
						</tr>
						<tr>
							<th>환자명<span className="text-danger pl-1">*</span></th>
							<td className="position-relative">
								<input type="text"
									className="form-control border col-3 m-0"
									placeholder="환자 이름을 입력하십시오"
									name="patient_name"
									ref="patient_name"
									maxLength="15"
									defaultValue={this.state.dataRegister.patient_name}
									onBlur={this.checkPatientName}
								/>
								{this.renderError(this.state.errorPatientName, "한글, 최대 15자를 사용할 수 있습니다")}
							</td>
						</tr>
						<tr>
							<th>보호자 연락처<span className="text-danger pl-1">*</span></th>
							<td className="position-relative  ">
								<div className="d-flex justify-content-start w-35 border-none">
									<Select
										className="d-inline-block"
										ref="phoneNumberPart01"
										options={getPrefixPhoneNumber().prefix}
										onChange={(e) => this.checkSelectPhoneNumber({ selectNumber: e.value })}
										blurInputOnSelect={true}
										isSearchable={false}
										placeholder="000"
									/>
									<input
										type="text"
										className="form-control col-11 combo-input"
										placeholder="000"
										maxLength="3"
										ref="phoneNumberPart01"
										onKeyPress={(e) => isNumberKey(e)}
										onBlur={this.checkPhoneNumber}
										defaultValue={this.state.dataRegister.phoneFirst}
										onPaste={(e) => isOnPasteNumber(e)}
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
										defaultValue={this.state.dataRegister.phoneSecond}
										onPaste={(e) => isOnPasteNumber(e)}
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
										defaultValue={this.state.dataRegister.phoneEnd}
										onPaste={(e) => isOnPasteNumber(e)}
									/>
								</div>
								{this.renderError(this.state.errorPhoneNumber, "휴대전화번호를 정확히 입력해주세요.")}
							</td>
						</tr>
						<tr>
							<th>보호자 이름<span className="text-danger pl-1">*</span></th>
							<td className="position-relative">
								<input type="text"
									className="form-control border col-3 m-0"
									placeholder="보호자 이름을 입력하십시오"
									name="protection_name"
									ref="protection_name"
									maxLength="15"
									defaultValue={this.state.dataRegister.protection_name}
									onBlur={this.checkProtectorName}
								/>
								{this.renderError(this.state.errorProtectorName, "한글, 최대 15자를 사용할 수 있습니다")}
							</td>
						</tr>
						<tr>
							<th>간병인 이름<span className="text-danger pl-1">*</span></th>
							<td className="position-relative">
								<input type="text"
									className="form-control border col-3 m-0"
									placeholder="간병인 이름을 입력하십시오"
									name="aide_name"
									ref="aide_name"
									maxLength="15"
									defaultValue={this.state.dataRegister.aide_name}
									onBlur={this.checkCaregiverName}
								/>
								{this.renderError(this.state.errorCaregiverName, "한글, 최대 15자를 사용할 수 있습니다")}
							</td>
						</tr>
					</tbody>
				</table>
				<div className="action text-right">
					<button
						className="btn btn-primary"
						onClick={this.submitForm}
						disabled={this.state.isDisable}
					>등록</button>
					<button
						className="btn btn-secondary ml-3"
						onClick={() => this.handleChange({ openModalCancel: true })}
						disabled={this.state.isDisable}
					>취소</button>
				</div>
				<Modal className='modalPopup w-45'
					id="cancel"
					show={this.state.openModalCancel}
					onHide={() => this.handleChange({ openModalCancel: false })}
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
							onClick={this.navHandleIncident}
						>확인</button>
					</div>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		// listArea: state.areaReducer.listArea,
		// listRoom: state.roomReducer.listRoom,
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user,
		hospital_id: state.authReducer.user.user.hospital == null ? null : state.authReducer.user.user.hospital.id
	}
}

export default withRouter(connect(mapStateToProps)(ProblemCreate));