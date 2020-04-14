import React, { Component } from 'react';
import '../../public/css/sickroom.css';
import { isNumberKey } from '../../services/functionService';
import imgError from "../../public/images/errors.png";
import imgSuccess from "../../public/images/success.png";
import ReactDOM from 'react-dom';
import { TYPE_ERROR } from '../../config.json';
import { isCharacterValid } from '../../services/functionService';
import { Link } from 'react-router-dom';
import _ from "lodash";
import Modal from 'react-bootstrap-modal';

const HANGUL = new RegExp("[\u1100-\u11FF|\u3130-\u318F|\uA960-\uA97F|\uAC00-\uD7AF|\uD7B0-\uD7FF]");
const BTN_SUBMIT_VALID = "btn-primary";
const BTN_SUBMIT_INVALID = "btn-secondary";

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorTab: "",
			errorBedNumber: "",
			errorCaregiver: "",
			errorPatientNumber: "",
			errorBaseAmount: "",
			errorIncreaseAmount: "",
			dataId: "",
			openModalEditData: false,
			openModalDeleteData: false,
			editId: "",
			sickroom: []
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

	renderTabError = (result, messageError) => {
		if (result === TYPE_ERROR.ERROR) {
			return (
				<div>
					<img src={imgError} alt="" className="display-middle display-middle-m message-icon" />
					<p className="display-bottom-left display-bottom-left-m m-0 text-danger">{messageError}</p>
				</div>
			);
		} else if (result === TYPE_ERROR.VALID) {
			return (
				<img src={imgSuccess} alt="" className="display-middle display-middle-m message-icon" />
			);
		}
	}

	handleChange = (data) => {
		this.setState({
			...data
		});
	}

	renderEditButton = (id) => {
		let indexObjectEdit = _.findIndex(this.state.sickroom, item => item.id === id);
		let obj = this.state.sickroom[indexObjectEdit];
		if(obj.isDisplaySaveButton) {
			if (obj.errorTab !== TYPE_ERROR.ERROR
				&& obj.errorBedNumber !== TYPE_ERROR.ERROR
				&& obj.errorCaregiver !== TYPE_ERROR.ERROR
				&& obj.errorPatientNumber !== TYPE_ERROR.ERROR
				&& obj.errorBaseAmount !== TYPE_ERROR.ERROR
				&& obj.errorIncreaseAmount !== TYPE_ERROR.ERROR) {
				return (
					<button className="btn btn-primary" onClick={() => this.confirmEditData(id)}>저장하다</button>
				);
			} else {
				return (
					<button className="btn btn-secondary">저장하다</button>
				);
			}
		}	
	}

	checkTypeRoom = () => {
		let tab01 = ReactDOM.findDOMNode(this.refs.tab01);
		let tab02 = ReactDOM.findDOMNode(this.refs.tab02);
		let tab03 = ReactDOM.findDOMNode(this.refs.tab03);
		let tab04 = ReactDOM.findDOMNode(this.refs.tab04);
		let tab05 = ReactDOM.findDOMNode(this.refs.tab05);

		if ((tab01.value.length === 0 || isCharacterValid(tab01.value, HANGUL))
			|| (tab02.value.length === 0 || isCharacterValid(tab02.value, HANGUL))
			|| (tab03.value.length === 0 || isCharacterValid(tab03.value, HANGUL))
			|| (tab04.value.length === 0 || isCharacterValid(tab04.value, HANGUL))
			|| (tab05.value.length === 0 || isCharacterValid(tab05.value, HANGUL))) {
			this.changeMessageErrorStatus({ errorTab: TYPE_ERROR.ERROR });
		} else {
			this.changeMessageErrorStatus({ errorTab: TYPE_ERROR.VALID });
		}
	}

	checkEditTypeRoom = (id) => {
		let indexObjectEdit = _.findIndex(this.state.sickroom, item => item.id === id);
		let obj = this.state.sickroom[indexObjectEdit];
		let jsTabSelected = document.getElementsByClassName("js-tabSelected" + id);

		for (let i = 0; i < jsTabSelected.length; i++) {
			let tabContent = jsTabSelected.item(i).value;
			if (tabContent.length === 0 || isCharacterValid(tabContent, HANGUL)) {
				obj.errorTab = TYPE_ERROR.ERROR;
				this.setState({
					...this.state
				})
				return false;
			}
		}

		obj.errorTab = TYPE_ERROR.VALID;
		this.setState({
			...this.state
		})
		return true;
	}

	selectTab = (e) => {
		let jsTabSelected = document.getElementsByClassName("js-tabSelected");
		for (let i = 0; i < jsTabSelected.length; i++) {
			jsTabSelected.item(i).classList.remove("isSelected");
		}
		e.classList.add("isSelected");
	}

	selectEditTab = (e, id) => {
		let jsTabSelected = document.getElementsByClassName("js-tabSelected" + id);
		for (let i = 0; i < jsTabSelected.length; i++) {
			jsTabSelected.item(i).classList.remove("isSelected");
		}
		e.classList.add("isSelected");
	}

	resetSelectTab = () => {
		let jsTabSelected = document.getElementsByClassName("js-tabSelected");
		for (let i = 0; i < jsTabSelected.length; i++) {
			jsTabSelected.item(i).classList.remove("isSelected");
		}
		jsTabSelected[0].classList.add("isSelected");
	}

	getSelectTab = () => {
		let jsTabSelected = document.getElementsByClassName("js-tabSelected");
		for (let i = 0; i < jsTabSelected.length; i++) {
			if (jsTabSelected.item(i).classList.contains("isSelected")) {
				return i;
			}
		}
	}

	getEditSelectTab = (id) => {
		let jsTabSelected = document.getElementsByClassName("js-tabSelected" + id);
		for (let i = 0; i < jsTabSelected.length; i++) {
			if (jsTabSelected.item(i).classList.contains("isSelected")) {
				return i;
			}
		}
	}

	formatCurrency = (currency) => {
		let pattern = /(-?\d+)(\d{3})/;
		while (pattern.test(currency)) {
			currency = currency.replace(pattern, "$1,$2");
		}
		return currency;
	}

	removeComma = (currencyInput) => {
		currencyInput.value = currencyInput.value.replace(/,/gi, "");
	}

	isAmountValid = (number) => {
		if (number === "") {
			return false
		}
		let num = Number(number);
		if (num >= 0 && num <= 1000) {
			return true;
		} else {
			return false;
		}
	}

	changeMessageErrorStatus = (data) => {
		this.setState({
			...data
		})
	}

	checkBedNumber = () => {
		let bedNumber = ReactDOM.findDOMNode(this.refs.bedNumber);
		if (this.isAmountValid(bedNumber.value)) {
			this.changeMessageErrorStatus({ errorBedNumber: TYPE_ERROR.VALID });
		} else {
			this.changeMessageErrorStatus({ errorBedNumber: TYPE_ERROR.ERROR });
		}
	}

	checkEditBedNumber = (e, id) => {
		let indexObjectEdit = _.findIndex(this.state.sickroom, item => item.id === id);
		let obj = this.state.sickroom[indexObjectEdit];

		if (this.isAmountValid(e.value)) {
			obj.errorBedNumber = TYPE_ERROR.VALID;
		} else {
			obj.errorBedNumber = TYPE_ERROR.ERROR;
		}

		this.setState({
			...this.state
		})
	}

	checkCaregiver = () => {
		let caregiver = ReactDOM.findDOMNode(this.refs.caregiver);
		if (this.isAmountValid(caregiver.value)) {
			this.changeMessageErrorStatus({ errorCaregiver: TYPE_ERROR.VALID });
		} else {
			this.changeMessageErrorStatus({ errorCaregiver: TYPE_ERROR.ERROR });
		}
	}

	checkEditCaregiver = (e, id) => {
		let indexObjectEdit = _.findIndex(this.state.sickroom, item => item.id === id);
		let obj = this.state.sickroom[indexObjectEdit];

		if (this.isAmountValid(e.value)) {
			obj.errorCaregiver = TYPE_ERROR.VALID;
		} else {
			obj.errorCaregiver = TYPE_ERROR.ERROR;
		}

		this.setState({
			...this.state
		})
	}

	checkPatientNumber = () => {
		let patientNumber = ReactDOM.findDOMNode(this.refs.patientNumber);
		if (this.isAmountValid(patientNumber.value)) {
			this.changeMessageErrorStatus({ errorPatientNumber: TYPE_ERROR.VALID });
		} else {
			this.changeMessageErrorStatus({ errorPatientNumber: TYPE_ERROR.ERROR });
		}
	}

	checkEditPatientNumber = (e, id) => {
		let indexObjectEdit = _.findIndex(this.state.sickroom, item => item.id === id);
		let obj = this.state.sickroom[indexObjectEdit];

		if (this.isAmountValid(e.value)) {
			obj.errorPatientNumber = TYPE_ERROR.VALID;
		} else {
			obj.errorPatientNumber = TYPE_ERROR.ERROR;
		}

		this.setState({
			...this.state
		})
	}

	isMoneyValid = (number) => {
		if (number === "") {
			return false
		}
		let num = Number(number);
		if (num >= 0 && num <= 1000000000) {
			return true;
		} else {
			return false;
		}
	}

	checkBaseAmount = () => {
		let baseAmount = ReactDOM.findDOMNode(this.refs.baseAmount);
		let currency = baseAmount.value.replace(/,/gi, "");

		if (this.isMoneyValid(currency)) {
			this.changeMessageErrorStatus({ errorBaseAmount: TYPE_ERROR.VALID });
		} else {
			this.changeMessageErrorStatus({ errorBaseAmount: TYPE_ERROR.ERROR });
		}
		baseAmount.value = this.formatCurrency(baseAmount.value);
	}

	checkEditBaseAmount = (e, id) => {
		let indexObjectEdit = _.findIndex(this.state.sickroom, item => item.id === id);
		let obj = this.state.sickroom[indexObjectEdit];
		let currency = e.value.replace(/,/gi, "");

		if (this.isMoneyValid(currency)) {
			obj.errorBaseAmount = TYPE_ERROR.VALID;
		} else {
			obj.errorBaseAmount = TYPE_ERROR.ERROR;
		}
		e.value = this.formatCurrency(e.value);

		this.setState({
			...this.state
		})
	}

	checkIncreaseAmount = () => {
		let increaseAmount = ReactDOM.findDOMNode(this.refs.increaseAmount);
		if (this.isMoneyValid(Number(increaseAmount.value.split(',').join('')))) {
			this.changeMessageErrorStatus({ errorIncreaseAmount: TYPE_ERROR.VALID });
		} else {
			this.changeMessageErrorStatus({ errorIncreaseAmount: TYPE_ERROR.ERROR });
		}
		increaseAmount.value = this.formatCurrency(increaseAmount.value);
	}

	checkEditIncreaseAmount = (e, id) => {
		let indexObjectEdit = _.findIndex(this.state.sickroom, item => item.id === id);
		let obj = this.state.sickroom[indexObjectEdit];
		let currency = e.value.replace(/,/gi, "");

		if (this.isMoneyValid(currency)) {
			obj.errorIncreaseAmount = TYPE_ERROR.VALID;
		} else {
			obj.errorIncreaseAmount = TYPE_ERROR.ERROR;
		}
		e.value = this.formatCurrency(e.value);

		this.setState({
			...this.state
		})
	}

	isCreateDataValid = () => {
		let chekFormValid = this.state.errorTab !== TYPE_ERROR.ERROR
			&& this.state.errorBedNumber === TYPE_ERROR.VALID
			&& this.state.errorCaregiver === TYPE_ERROR.VALID
			&& this.state.errorPatientNumber === TYPE_ERROR.VALID
			&& this.state.errorBaseAmount === TYPE_ERROR.VALID
			&& this.state.errorIncreaseAmount === TYPE_ERROR.VALID;

		return chekFormValid;
	}

	createDataValidate = () => {
		// 병상 수
		if (this.state.errorBedNumber === "") {
			this.checkBedNumber();
		}

		// 간병인수
		if (this.state.errorCaregiver === "") {
			this.checkCaregiver();
		}

		// 기준환자수
		if (this.state.errorPatientNumber === "") {
			this.checkPatientNumber();
		}

		// 기준금액
		if (this.state.errorBaseAmount === "") {
			this.checkBaseAmount();
		}

		// 증가금액
		if (this.state.errorIncreaseAmount === "") {
			this.checkIncreaseAmount();
		}
	}

	resetCreateDate = () => {
		// 병실 유형
		let tab01 = ReactDOM.findDOMNode(this.refs.tab01);
		tab01.value = "일반실";
		let tab02 = ReactDOM.findDOMNode(this.refs.tab02);
		tab02.value = "중환자실";
		let tab03 = ReactDOM.findDOMNode(this.refs.tab03);
		tab03.value = "준중환자실";
		let tab04 = ReactDOM.findDOMNode(this.refs.tab04);
		tab04.value = "격리환자실";
		let tab05 = ReactDOM.findDOMNode(this.refs.tab05);
		tab05.value = "상급병실";

		// 병상 수
		let bedNumber = ReactDOM.findDOMNode(this.refs.bedNumber);
		bedNumber.value = "";

		// 간병인수
		let caregiver = ReactDOM.findDOMNode(this.refs.caregiver);
		caregiver.value = "";

		// 기준환자수
		let patientNumber = ReactDOM.findDOMNode(this.refs.patientNumber);
		patientNumber.value = "";

		// 기준금액
		let baseAmount = ReactDOM.findDOMNode(this.refs.baseAmount);
		baseAmount.value = "";

		// 증가금액
		let increaseAmount = ReactDOM.findDOMNode(this.refs.increaseAmount);
		increaseAmount.value = "";

		// reset tab selected
		this.resetSelectTab();

		// reset error state
		this.setState({
			errorTab: "",
			errorBedNumber: "",
			errorCaregiver: "",
			errorPatientNumber: "",
			errorBaseAmount: "",
			errorIncreaseAmount: "",
		})
	}

	activeCarouselItem = () => {
		let carouselItem = document.getElementsByClassName("carousel-item");
		for (let i = 0; i < carouselItem.length; i++) {
			carouselItem.item(i).classList.remove("active");
		}
	}

	showPrevNexIcon = (editDatalength) => {
		let prevIcon = document.getElementsByClassName("fa-chevron-left");
		let nexIcon = document.getElementsByClassName("fa-chevron-right");
		if (editDatalength >= 2) {
			prevIcon[0].classList.remove("d-none");
			nexIcon[0].classList.remove("d-none");
		} else {
			prevIcon[0].classList.add("d-none");
			nexIcon[0].classList.add("d-none");
		}
	}

	addNewEditData = () => {
		// 병실 유형
		let tab01 = ReactDOM.findDOMNode(this.refs.tab01);
		let tab02 = ReactDOM.findDOMNode(this.refs.tab02);
		let tab03 = ReactDOM.findDOMNode(this.refs.tab03);
		let tab04 = ReactDOM.findDOMNode(this.refs.tab04);
		let tab05 = ReactDOM.findDOMNode(this.refs.tab05);

		// 병상 수
		let bedNumber = ReactDOM.findDOMNode(this.refs.bedNumber);

		// 간병인수
		let caregiver = ReactDOM.findDOMNode(this.refs.caregiver);

		// 기준환자수
		let patientNumber = ReactDOM.findDOMNode(this.refs.patientNumber);

		// 기준금액
		let baseAmount = ReactDOM.findDOMNode(this.refs.baseAmount);

		// 증가금액
		let increaseAmount = ReactDOM.findDOMNode(this.refs.increaseAmount);

		// get selected tab
		let selectTabId = this.getSelectTab();

		// increase id
		let id = this.state.dataId;
		if (id === "") {
			id = 1;
		} else {
			id += 1;
		}

		// create new object
		let objectEditData = {
			id: id,
			tab01: tab01.value,
			tab02: tab02.value,
			tab03: tab03.value,
			tab04: tab04.value,
			tab05: tab05.value,
			tab_selected: selectTabId,
			bed_number: bedNumber.value,
			caregiver: caregiver.value,
			patient_number: patientNumber.value,
			base_amount: Number(baseAmount.value.split(',').join('')),
			increase_amount: Number(increaseAmount.value.split(',').join('')),
			errorTab: "",
			errorBedNumber: "",
			errorCaregiver: "",
			errorPatientNumber: "",
			errorBaseAmount: "",
			errorIncreaseAmount: "",
			isDisplaySaveButton: false
		}

		let sickroom = this.state.sickroom;
		sickroom.push(objectEditData);

		this.setState({
			...this.state,
			sickroom: sickroom,
			dataId: id
		})
		this.activeCarouselItem();
		this.showPrevNexIcon(this.state.sickroom.length);
	}

	createData = () => {
		if (this.isCreateDataValid()) {
			this.addNewEditData();
			this.resetCreateDate();
		} else {
			this.createDataValidate();
		}
	}

	confirmEditData = (id) => {
		this.setState({
			editId: id,
			openModalEditData: true
		})
	}

	editData = (id) => {
		let indexObjectEdit = _.findIndex(this.state.sickroom, item => item.id === id);
		let obj = this.state.sickroom[indexObjectEdit];

		// 병실 유형
		let jsTabSelected = document.getElementsByClassName("js-tabSelected" + id);
		obj.tab01 = jsTabSelected[0].value;
		obj.tab02 = jsTabSelected[1].value;
		obj.tab03 = jsTabSelected[2].value;
		obj.tab04 = jsTabSelected[3].value;
		obj.tab05 = jsTabSelected[4].value;
		obj.tab_selected = this.getEditSelectTab(id);

		// 병상 수
		let jsBedNumber = document.getElementsByClassName("js-bedNumber" + id);
		obj.bed_number = jsBedNumber[0].value

		// 간병인수
		let jsCaregiver = document.getElementsByClassName("js-caregiver" + id);
		obj.caregiver = jsCaregiver[0].value;

		// 기준환자수
		let jsPatientNumber = document.getElementsByClassName("js-patientNumber" + id);
		obj.patient_number = jsPatientNumber[0].value;

		// 기준금액
		let jsBaseAmount = document.getElementsByClassName("js-baseAmount" + id);
		obj.base_amount = jsBaseAmount[0].value;

		// 증가금액
		let jsIncreaseAmount = document.getElementsByClassName("js-increaseAmount" + id);
		obj.increase_amount = jsIncreaseAmount[0].value;

		// reset error state
		obj.errorTab = "";
		obj.errorBedNumber = "";
		obj.errorCaregiver = "";
		obj.errorPatientNumber = "";
		obj.errorBaseAmount = "";
		obj.errorIncreaseAmount = "";

		// disable save button
		obj.isDisplaySaveButton = false;

		//disable tab
		let enableTabSelected = document.getElementsByClassName("js-tabSelected" + id);
		for (let i = 0; i < enableTabSelected.length; i++) {
			enableTabSelected.item(i).disabled = true;
		}

		//disable input
		let jsInput = document.getElementsByClassName("js-input" + id);
		for (let i = 0; i < jsInput.length; i++) {
			jsInput.item(i).disabled = true;
		}

		// display edit button
		let jsEditButton = document.getElementsByClassName("js-editButton" + id);
		jsEditButton[0].classList.remove("d-none");

		this.setState({
			...this.state,
			openModalEditData: false
		})
	}

	enabelEditData = (e, id) => {
		let indexObjectEdit = _.findIndex(this.state.sickroom, item => item.id === id);

		// display edit button
		let obj = this.state.sickroom[indexObjectEdit];
		obj.isDisplaySaveButton = true;
		this.setState({
			...this.state
		})

		// enable tab
		let jsTabSelected = document.getElementsByClassName("js-tabSelected" + id);
		for (let i = 0; i < jsTabSelected.length; i++) {
			jsTabSelected.item(i).removeAttribute("disabled");
		}

		// enable input
		let jsInput = document.getElementsByClassName("js-input" + id);
		for (let i = 0; i < jsInput.length; i++) {
			jsInput.item(i).removeAttribute("disabled");
		}

		e.classList.add("d-none");
	}

	confirmDeleteEditData = (id) => {
		this.setState({
			editId: id,
			openModalDeleteData: true
		})
	}

	findActiveCarouselItem = () => {
		let jsCarouselItem = document.getElementsByClassName("carousel-item");
		if (jsCarouselItem.length > 1) {
			for (let i = 0; i < jsCarouselItem.length; i++) {
				if (jsCarouselItem.item(i).classList.contains("active")) {
					jsCarouselItem.item(i).classList.remove("active");
					if (i === 0) {
						jsCarouselItem.item(i).classList.add("active");
						return;
					} else {
						jsCarouselItem.item(i - 1).classList.add("active");
						return;
					}
				}
			}
		}
	}

	deleteEditData = (id) => {
		this.findActiveCarouselItem();
		let result = _.reject(this.state.sickroom, item => item.id === id);
		this.setState({
			...this.state,
			sickroom: result,
			openModalDeleteData: false
		});
		this.showPrevNexIcon(this.state.sickroom.length - 1);
	}

	renderEditData = () => {
		let html = [];
		this.state.sickroom.map((item, index) => {
			html.push(
				<div key={index} className="carousel-item active">
					<div className="sickroom-border mt-5">
						<div className="sickroom-row d-flex">
							<div className="sickroom-heading">
								<span className="font-weight-bold">병실 유형</span>
							</div>
							<div className="position-relative">
								<input key={"generalRoom" + item.id}
									type="text"
									name="generalRoom"
									className={"form-control sickroom-tab-w m-0 sickroom-tab-border wid15P" + (item.tab_selected === 0 ? " isSelected" : "") + " js-tabSelected" + (item.id)}
									maxLength={15}
									defaultValue={item.tab01}
									disabled
									onBlur={() => this.checkEditTypeRoom(item.id)}
									onSelect={(e) => this.selectEditTab(e.currentTarget, item.id)}
								/>
								<input key={"intensiveCare" + item.id}
									type="text"
									name="intensiveCare"
									className={"form-control sickroom-tab-w m-0 sickroom-tab-border wid15P" + (item.tab_selected === 1 ? " isSelected" : "") + " js-tabSelected" + (item.id)}
									maxLength={15}
									defaultValue={item.tab02}
									disabled
									onBlur={() => this.checkEditTypeRoom(item.id)}
									onSelect={(e) => this.selectEditTab(e.currentTarget, item.id)}
								/>
								<input key={"semiIntensiveCare" + item.id}
									type="text"
									name="semiIntensiveCare"
									className={"form-control sickroom-tab-w m-0 sickroom-tab-border wid15P" + (item.tab_selected === 2 ? " isSelected" : "") + " js-tabSelected" + (item.id)}
									maxLength={15}
									defaultValue={item.tab03}
									disabled
									onBlur={() => this.checkEditTypeRoom(item.id)}
									onSelect={(e) => this.selectEditTab(e.currentTarget, item.id)}
								/>
								<input key={"isolatedPatientRoom" + item.id}
									type="text"
									name="isolatedPatientRoom"
									className={"form-control sickroom-tab-w m-0 sickroom-tab-border wid15P" + (item.tab_selected === 3 ? " isSelected" : "") + " js-tabSelected" + (item.id)}
									maxLength={15}
									defaultValue={item.tab04}
									disabled
									onBlur={() => this.checkEditTypeRoom(item.id)}
									onSelect={(e) => this.selectEditTab(e.currentTarget, item.id)}
								/>
								<input key={"seniorWard" + item.id}
									type="text"
									name="seniorWard"
									className={"form-control sickroom-tab-w sickroom-tab-w-m m-0 sickroom-tab-border wid15P" + (item.tab_selected === 4 ? " isSelected" : "") + " js-tabSelected" + (item.id)}
									maxLength={15}
									defaultValue={item.tab05}
									disabled
									onBlur={() => this.checkEditTypeRoom(item.id)}
									onSelect={(e) => this.selectEditTab(e.currentTarget, item.id)}
								/>
								{this.renderTabError(item.errorTab, "한글로 입력해주세요.")}
							</div>
						</div>
						<div className="sickroom-row d-flex">
							<div className="sickroom-heading d-flex align-items-center">
								<span className="font-weight-bold">병상 수</span>
							</div>
							<div className="sickroom-bed d-flex align-items-center position-relative">
								<input key={"bedNumber" + item.id}
									type="text"
									name="bedNumber"
									className={"form-control sickroom-input-w-l m-0 sickroom-input-h js-bedNumber" + (item.id) + " js-input" + (item.id)}
									placeholder="000"
									maxLength="4"
									defaultValue={item.bed_number}
									disabled
									onKeyPress={(e) => isNumberKey(e)}
									onBlur={(e) => this.checkEditBedNumber(e.currentTarget, item.id)}
									autoComplete="off"
								/>
								<label className="ml-3 mb-0">인실</label>
								{this.renderError(item.errorBedNumber, "0~1000 숫자만 입력가능합니다.")}
							</div>
							<div className="sickroom-heading d-flex align-items-center">
								<span className="font-weight-bold">간병인수</span>
							</div>
							<div className="sickroom-caregiver position-relative">
								<input key={"caregiver" + item.id}
									type="text"
									name="caregiver"
									className={"form-control sickroom-input-w-l m-0 sickroom-input-h js-caregiver" + (item.id) + " js-input" + (item.id)}
									placeholder="000"
									maxLength="4"
									defaultValue={item.caregiver}
									disabled
									onKeyPress={(e) => isNumberKey(e)}
									onBlur={(e) => this.checkEditCaregiver(e.currentTarget, item.id)}
									autoComplete="off"
								/>
								<label className="ml-3 mb-0">명</label>
								{this.renderError(item.errorCaregiver, "0~1000 숫자만 입력가능합니다.")}
							</div>
						</div>
						<div className="d-flex position-relative">
							<div className="sickroom-heading d-flex align-items-center style-middle">
								<span className="font-weight-bold">기준환자수</span>
							</div>
							<div className="sickroom-patient d-flex align-items-center position-relative">
								<div className="style-input-middle">
									<input key={"patientNumber" + item.id}
										type="text"
										name="patientNumber"
										className={"form-control sickroom-input-w-l m-0 sickroom-input-h js-patientNumber" + (item.id) + " js-input" + (item.id)}
										placeholder="000"
										maxLength="4"
										defaultValue={item.patient_number}
										disabled
										onKeyPress={(e) => isNumberKey(e)}
										onBlur={(e) => this.checkEditPatientNumber(e.currentTarget, item.id)}
										autoComplete="off"
									/>
									<label className="ml-3 mb-0">명</label>
									{this.renderError(item.errorPatientNumber, "0~1000 숫자만 입력가능합니다.")}
								</div>
							</div>
							<div className="sickroom-heading d-flex align-items-center border-b">
								<span className="font-weight-bold">기준금액</span>
							</div>
							<div className="sickroom-rest border-b position-relative">
								<input key={"baseAmount" + item.id}
									type="text"
									name="baseAmount"
									className={"form-control sickroom-input-w-x m-0 sickroom-input-h js-baseAmount" + (item.id) + " js-input" + (item.id)}
									placeholder="000"
									maxLength="13"
									defaultValue={item.base_amount}
									disabled
									onKeyPress={(e) => isNumberKey(e)}
									onBlur={(e) => this.checkEditBaseAmount(e.currentTarget, item.id)}
									onChange={(e) => this.removeComma(e.currentTarget)}
									autoComplete="off"
								/>
								<label className="ml-3 mb-0">원</label>
								{this.renderError(item.errorBaseAmount, "0~1,000,000,000 숫자만 입력가능합니다.")}
							</div>
						</div>
						<div className="d-flex">
							<div className="sickroom-heading d-flex align-items-center"></div>
							<div className="sickroom-patient d-flex align-items-center"></div>
							<div className="sickroom-heading d-flex align-items-center">
								<span className="font-weight-bold">증가금액</span>
							</div>
							<div className="sickroom-rest position-relative check-none">
								<input key={"increaseAmount" + item.id}
									type="text"
									name="increaseAmount"
									className={"form-control sickroom-input-w-x m-0 sickroom-input-h js-increaseAmount" + (item.id) + " js-input" + (item.id)}
									placeholder="000"
									maxLength="13"
									defaultValue={item.increase_amount}
									disabled
									onKeyPress={(e) => isNumberKey(e)}
									onBlur={(e) => this.checkEditIncreaseAmount(e.currentTarget, item.id)}
									onChange={(e) => this.removeComma(e.currentTarget)}
									autoComplete="off"
								/>
								<label className="ml-3 mb-0">원</label>
								{this.renderError(item.errorIncreaseAmount, "0~1,000,000,000 숫자만 입력가능합니다.")}
							</div>
						</div>
					</div>
					<div className="mt-3 clearfix">
						<p className="float-left">※ 등록한 병실에 대한 금액은 오른쪽, 왼쪽의 화살표를 눌러 상세히 볼 수 있습니다.
                            <br />병실에 대한 금액을 모두 입력했다면 병실등록 버튼을 눌러 병실 정보를 입력해주세요
                        </p>
						<div className="float-right">
							{this.renderEditButton(item.id)}
							<button className={"btn btn-primary js-editButton" + (item.id)}
								onClick={(e) => this.enabelEditData(e.currentTarget, item.id)}
							>
								수정
							</button>
							<button className="btn btn-secondary ml-2"
								onClick={() => this.confirmDeleteEditData(item.id)}
							>
								삭제
                            </button>
						</div>
					</div>
				</div>
			);
			return item;
		});
		return html;
	}

	render() {
		const btnCreateDataStatus = this.isCreateDataValid() ? BTN_SUBMIT_VALID : BTN_SUBMIT_INVALID;
		const editId = this.state.editId;

		return (
			<div className="sickroom">
				<div className="font-weight-bold mb-3">금액 변동</div>
				<div className="sickroom-border">
					<div className="sickroom-row d-flex">
						<div className="sickroom-heading">
							<span className="font-weight-bold">병실 유형</span>
						</div>
						<div className="position-relative">
							<input type="text"
								name="generalRoom"
								ref="tab01"
								className="form-control sickroom-tab-w m-0 sickroom-tab-border js-tabSelected isSelected"
								defaultValue="일반실"
								maxLength={15}
								autoComplete="off"
								onBlur={this.checkTypeRoom}
								onClick={(e) => this.selectTab(e.currentTarget)}
							/>
							<input type="text"
								name="intensiveCare"
								ref="tab02"
								autoComplete="off"
								className="form-control sickroom-tab-w m-0 sickroom-tab-border js-tabSelected"
								defaultValue="중환자실"
								maxLength={15}
								onBlur={this.checkTypeRoom}
								onClick={(e) => this.selectTab(e.currentTarget)}
							/>
							<input type="text"
								name="semiIntensiveCare"
								ref="tab03"
								autoComplete="off"
								className="form-control sickroom-tab-w m-0 sickroom-tab-border js-tabSelected"
								defaultValue="준중환자실"
								maxLength={15}
								onBlur={this.checkTypeRoom}
								onClick={(e) => this.selectTab(e.currentTarget)}
							/>
							<input type="text"
								name="isolatedPatientRoom"
								ref="tab04"
								autoComplete="off"
								className="form-control sickroom-tab-w m-0 sickroom-tab-border js-tabSelected"
								defaultValue="격리환자실"
								maxLength={15}
								onBlur={this.checkTypeRoom}
								onClick={(e) => this.selectTab(e.currentTarget)}
							/>
							<input type="text"
								name="seniorWard"
								ref="tab05"
								autoComplete="off"
								className="form-control sickroom-tab-w sickroom-tab-w-m m-0 sickroom-tab-border js-tabSelected"
								defaultValue="상급병실"
								maxLength={15}
								onBlur={this.checkTypeRoom}
								onClick={(e) => this.selectTab(e.currentTarget)}
							/>
							{this.renderTabError(this.state.errorTab, "한글로 입력해주세요.")}
						</div>
					</div>
					<div className="sickroom-row d-flex">
						<div className="sickroom-heading d-flex align-items-center">
							<span className="font-weight-bold">병상 수</span>
						</div>
						<div className="sickroom-bed d-flex align-items-center position-relative">
							<input type="text"
								name="bedNumber"
								className="form-control sickroom-input-w-l m-0 sickroom-input-h"
								placeholder="000"
								maxLength="3"
								ref="bedNumber"
								onKeyPress={(e) => isNumberKey(e)}
								onBlur={this.checkBedNumber}
								autoComplete="off"
							/>
							<label className="ml-3 mb-0">인실</label>
							{this.renderError(this.state.errorBedNumber, "숫자만 입력가능합니다.")}
						</div>
						<div className="sickroom-heading d-flex align-items-center">
							<span className="font-weight-bold">간병인수</span>
						</div>
						<div className="sickroom-caregiver position-relative">
							<input type="text"
								name="caregiver"
								className="form-control sickroom-input-w-l m-0 sickroom-input-h"
								placeholder="000"
								maxLength="3"
								ref="caregiver"
								onKeyPress={(e) => isNumberKey(e)}
								onBlur={this.checkCaregiver}
								autoComplete="off"
							/>
							<label className="ml-3 mb-0">명</label>
							{this.renderError(this.state.errorCaregiver, "숫자만 입력가능합니다.")}
						</div>
					</div>
					<div className="d-flex position-relative">
						<div className="sickroom-heading d-flex align-items-center style-middle">
							<span className="font-weight-bold">기준환자수</span>
						</div>
						<div className="sickroom-patient d-flex align-items-center position-relative">
							<div className="style-input-middle">
								<input type="text"
									name="patientNumber"
									className="form-control sickroom-input-w-l m-0 sickroom-input-h"
									placeholder="000"
									maxLength="4"
									ref="patientNumber"
									onKeyPress={(e) => isNumberKey(e)}
									onBlur={this.checkPatientNumber}
									autoComplete="off"
								/>
								<label className="ml-3 mb-0">명</label>
								{this.renderError(this.state.errorPatientNumber, "숫자만 입력가능합니다.")}
							</div>
						</div>
						<div className="sickroom-heading d-flex align-items-center border-b">
							<span className="font-weight-bold">기준금액</span>
						</div>
						<div className="sickroom-rest border-b position-relative">
							<input type="text"
								name="baseAmount"
								className="form-control sickroom-input-w-x m-0 sickroom-input-h"
								placeholder="000"
								maxLength="13"
								ref="baseAmount"
								onKeyPress={(e) => isNumberKey(e)}
								onBlur={this.checkBaseAmount}
								onChange={(e) => this.removeComma(e.currentTarget)}
								autoComplete="off"
							/>
							<label className="ml-3 mb-0">원</label>
							{/* 0~1,000,000,000 */}
							{this.renderError(this.state.errorBaseAmount, "숫자만 입력가능합니다.")}
						</div>
					</div>
					<div className="d-flex">
						<div className="sickroom-heading d-flex align-items-center"></div>
						<div className="sickroom-patient d-flex align-items-center"></div>
						<div className="sickroom-heading d-flex align-items-center">
							<span className="font-weight-bold">증가금액</span>
						</div>
						<div className="sickroom-rest position-relative check-none">
							<input type="text"
								name="increaseAmount"
								className="form-control sickroom-input-w-x m-0 sickroom-input-h"
								placeholder="000"
								maxLength="13"
								ref="increaseAmount"
								onKeyPress={(e) => isNumberKey(e)}
								onBlur={this.checkIncreaseAmount}
								onChange={(e) => this.removeComma(e.currentTarget)}
								autoComplete="off"
							/>
							<label className="ml-3 mb-0">원</label>
							{this.renderError(this.state.errorIncreaseAmount, "숫자만 입력가능합니다.")}
						</div>
					</div>
				</div>
				<div className="mt-3 clearfix">
					<p className="float-left">※ 예) 기준환자수 3명일 때, 70,000원이고<br />환자수가 1명씩 증가할 때마다 기준금액 70,000에서 2,000원을 더해 일당이 계산됩니다.</p>
					<button className={"btn float-right " + btnCreateDataStatus} onClick={this.createData}>등록</button>
				</div>
				<hr />
				<div className="text-right">
					<Link to={"/rooms/register"}>
						<button className="btn btn-primary">병실등록</button>
					</Link>
				</div>
				<div id="editDataSline" className="carousel slide" data-ride="carousel" data-interval="false">
					<div className="carousel-inner">
						{this.renderEditData()}
					</div>
					<a className="carousel-control-prev" href="#editDataSline" data-slide="prev">
						<span className="fa fa-chevron-left d-none" />
					</a>
					<a className="carousel-control-next" href="#editDataSline" data-slide="next">
						<span className="fa fa-chevron-right d-none" />
					</a>
				</div>

				<Modal className='modalPopup w-45'
					id="confirmEditData"
					show={this.state.openModalEditData}
					onHide={() => this.handleChange({ openModalEditData: false })}
				>
					<Modal.Header closeButton></Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						수정하시겠습니까?
                    </div>
					<div className="action-footer text-center">
						<button
							className="btn btn-secondary"
							data-dismiss="modal"
							onClick={() => this.editData(editId)}
						>확인</button>
					</div>
				</Modal>
				<Modal className='modalPopup w-45'
					id="confirmDeleteEditData"
					show={this.state.openModalDeleteData}
					onHide={() => this.handleChange({ openModalDeleteData: false })}
				>
					<Modal.Header closeButton></Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						삭제하시겠습니까?
                    </div>
					<div className="action-footer text-center">
						<button
							className="btn btn-secondary"
							data-dismiss="modal"
							onClick={() => this.deleteEditData(editId)}
						>확인</button>
					</div>
				</Modal>
			</div>
		);
	}
}

export default Register;