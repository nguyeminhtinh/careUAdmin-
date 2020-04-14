import React, { Component } from "react";
import Modal from "react-bootstrap-modal";
import _ from "lodash";
import Datatable from "../common/datatable";
import '../../public/css/hospitalModalSearch.css';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { isNumberKey, isOnPasteNumber, getPrefixPhoneNumber } from '../../services/functionService';
import { getAllTypeHospital, getAllHospitalAddress, createHospital, checkPhoneExists } from '../../services/hospitals';
import { TYPE_ERROR } from '../../config.json';
import { isEmpty } from "lodash";
import ReactDOM from 'react-dom';

const FORMAT_URL = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=\u3131-\uD79D]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/gi

class HospitalModalSearch extends Component {
	constructor(props) {
		super(props)
		this.state = {
			hasSingup: false,
			hospitalTypes: [],
			dataResult: [],
			dataSearch: [],
			errorName: "",
			errorType: "",
			errorPhone: "",
			errorZipCode: "",
			errorAddress: "",
			errorWebsite: "",
			phone_1: "",
			phone_2: "",
			phone_3: "",
			inpAddress:"",
			popUpDataSearch: true,
			success: false
		}
	}

	componentWillMount() {
		this.getData()
	}

	getData() {
		Promise.all([getAllTypeHospital(), getAllHospitalAddress()]).then(result => {
			const [types, address] = result
			let hospitalTypes = this.mapListToSelectData(types.data.data)

			this.setState({
				hospitalTypes,
				dataResult: address.data.data
			})
		}).catch(err => {
			console.log(err);
		})
	}

	mapListToSelectData(data, suffixLable) {
		let dataSelect = []
		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				const value = data[key];
				dataSelect.push({ value: key, label: value })
			}
		}
		return [...dataSelect]
	}

	clickToggleClass = () => {
		this.setState({
			hasSingup: !this.state.hasSingup
		}, () => {
			this.hasSingup.classList.add('toogle')
			if (this.hasSingup.classList.contains('arrow-up')) {
				this.hasSingup.classList.remove('arrow-up')
			} else {
				this.hasSingup.classList.add('arrow-up')
			}
		})

	}

	handleChange = (nameControl, value) => {
		switch (nameControl) {
			case 'phone_1':
				this.phone_1.value = value
				break;
			case 'type':
				this.type.value = value
				break;
			default:
				break;
		}
	}

	submitForm = async () => {
		if (this.validForm())
		{
			let headPhone = ReactDOM.findDOMNode(this.refs.headPhone).value;
			let midlePhone = ReactDOM.findDOMNode(this.refs.midlePhone).value;
			let endPhone = ReactDOM.findDOMNode(this.refs.endPhone).value;

			let data = {
				name: this.name.value,
				type: this.type.value,
				phone: headPhone + '-' + midlePhone + '-' + endPhone,
				zip_code: this.zip_code.value,
				address: this.address.value,
				website: this.website.value || ''
			}
			try {
				let response = await createHospital(data);
				
				if (response.errors === undefined) {	
					toast.success(response.data.message);
					setTimeout(() => { this.navMainPage(); }, 3000);
				} else {
					this.setState({
						success: false
					});
					toast.error(response.errors.message);
				}
			} catch (err) {
				this.setState({
					success: false
				});
				toast.error(err.data.errors.mesages.website[0])
			}
		}
	}

	navMainPage = () => {		
		window.location.href = "/login";
	}

	renderDataAutoComplete = () => {
		const { dataSearch, popUpDataSearch } = this.state;
		if (popUpDataSearch === true) {
			if (this.state.inpAddress != "") {
				if (dataSearch.length > 0) {
					return (
						<div className="result-hospital-popup">
							<ul className="result-list">
								{dataSearch.map((item, index) => (
									<li
										key={index}
										onClick={() => this.handleSubmitAutoComplete(item)}
										className="item-hospital"
									>
										{item}
									</li>
								))}
							</ul>
						</div>
					);
				}
			}
		}
	}

	onChangeAutoComplete = value => {
		let dataResult = [];
		let hospitalAdress = [...this.state.dataResult];
		this.address.value = value;

		if (value.length !== 0 ) {
			dataResult = hospitalAdress.filter((item) => item.indexOf(value) !== -1).slice(0, 10);
		} 

		this.setState({
			dataSearch: dataResult || [],
			inpAddress: value,
			popUpDataSearch: true
		});
	}

	handleSubmitAutoComplete = value => {
		this.address.value = value;
		this.setState({
			popUpDataSearch: false
		});
	}

	renderError = (result, messageError) => {
		if (result === TYPE_ERROR.ERROR) {
			return (
				<div>
					{/* <img src={imgError} alt="" className="display-middle message-icon" /> */}
					<span className="display-error text-danger">{messageError}</span>
				</div>
			);
		}
	}

	closeFormSeachHospital = () => {
		this.setState({
			errorName: "",
			errorType: "",
			errorPhone: "",
			errorZipCode: "",
			errorAddress: "",
			errorWebsite: "",
			phone_1: "",
			phone_2: "",
			phone_3: "",
		});
		this.props.onHandleChange({ openModalFormResult: false });
		this.props.resetCloseModelSearch();
	}

	validForm = () => {
		if(!this.state.success)
		{
			let headPhone = ReactDOM.findDOMNode(this.refs.headPhone).value;
			let midlePhone = ReactDOM.findDOMNode(this.refs.midlePhone).value;
			let endPhone = ReactDOM.findDOMNode(this.refs.endPhone).value;
			let errorName, errorType, errorPhone, errorZipCode, errorAddress, errorWebsite;
			let valid = true;

			if (isEmpty(this.name.value)) {
				errorName = "필수 입력 사항입니다";
				valid = false;
			}
			if (isEmpty(this.type.value)) {
				errorType = "필수 입력 사항입니다";
				valid = false;
			}
			
			if (isEmpty(headPhone) || midlePhone.length !== 4 || endPhone.length !== 4) {
				errorPhone = "휴대전화번호를 정확히 입력해주세요 (000-0000-0000)";
				valid = false;
			}else {
				this.checkPhoneNumber();
			}

			if (isEmpty(this.zip_code.value)) {
				errorZipCode = "필수 입력 사항입니다";
				valid = false;
			}else {
				if(this.zip_code.value.length < 5)
				{
					errorZipCode = "우편 번호는 5 자 여야합니다.";
					valid = false;
				}
			}

			if (!this.address.value) {
				errorAddress = "필수 입력 사항입니다";
				valid = false;
			}
			if (this.address.value.length === 0) {
				errorAddress = " 주소가 존재하지 않습니다.";
				valid = false;
			}

			if (!isEmpty(this.website.value)) {
				if (!this.website.value.match(FORMAT_URL)) {
					errorWebsite = "홈페이지 주소를 입력하십시오.";
					valid = false;
				}
			}else {
				errorWebsite = "필수 입력 사항입니다";
				valid = false;
			}

			this.setState({
				...this.state,
				errorName,
				errorType,
				errorPhone,
				errorZipCode,
				errorAddress,
				errorWebsite
			})

			if(this.state.errorPhone !== '')
			{
				return false;
			}else {
				this.setState({
					...this.state,
					success: true
				});
				return valid;
			}
		}
	}

	handleChangeNumber = (value, name) => {
		const re = /[\u3131-\uD79D]/ugi;
		let text = value.match(re);

		if (!_.isArray(text)) {
			let item = {};
			item[name] = value;

			this.setState({
				...item
			});
		}
	}

	checkPhoneNumber = async () => {
		var headPhone = ReactDOM.findDOMNode(this.refs.headPhone).value;
		var midlePhone = ReactDOM.findDOMNode(this.refs.midlePhone).value;
		var endPhone = ReactDOM.findDOMNode(this.refs.endPhone).value;
		var errorPhone = "";
		let check = true;
		
		var phone = headPhone + '-' + midlePhone +'-' + endPhone;

		let phoneExists = await checkPhoneExists(phone);
		if (phoneExists.data.data === true) {
			errorPhone = "전화 번호가 이미 있습니다";
			check = false;
		}else {
			if (isEmpty(headPhone) || midlePhone.length !== 4 || endPhone.length !== 4) {
				errorPhone = "휴대전화번호를 정확히 입력해주세요 (000-0000-0000)";
				check = false;
			}else{
				errorPhone = "";
			}
		}

		this.setState({
			errorPhone: errorPhone,
		})
		return check;
	}

	renderDataBodyResult = () => {
		const { body, params, page, pageSz, totalPage } = this.props.dataHospitals;
		const { hasSingup, hospitalTypes } = this.state;

		if (body.length === 0) {
			return (
				<div className="mt-4">
					<p>병원이름 검색결과</p>
					<div className="pl-3">
						<p>검색 결과가 없습니다.</p>
						<p>병원 정보를 입력하시겠습니까?  <u ref={e => this.hasSingup = e} onClick={() => this.clickToggleClass()}>병원등록</u> <span ref={e => this.hasSingup = e} className="arrow-register" onClick={() => this.clickToggleClass()}> <i>&#x25B2;</i></span> </p>
					</div>
					{!hasSingup && <div>
						<p className="mb-0">병원등록</p>
						<p>병원 등록 후 가입할 수 있습니다.</p>
						<table className="table table-bordered insert-hospital-form">
							<thead>
								<tr>
									<th className="w-17-percent">병원명<span className="text-danger"> *</span></th>
									<th>병원<span className="text-danger"> *</span></th>
									<th>전화번호<span className="text-danger"> *</span></th>
									<th>우편번호<span className="text-danger"> *</span></th>
									<th className="w-26-percent">주소<span className="text-danger"> *</span></th>
									<th className="w-15-percent">홈페이지<span className="text-danger"> *</span></th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<input
											type="text"
											className="form-control"
											placeholder="병원명"
											ref={(name) => this.name = name}
										/>
										{this.state.errorName && this.renderError(TYPE_ERROR.ERROR, this.state.errorName)}
									</td>
									<td>
										<div className="slect-type">
											<Select
												name="type"
												options={hospitalTypes}
												onChange={(e) => this.handleChange('type', e.value)}
												blurInputOnSelect={true}
												isSearchable={false}
												placeholder="선택"
												ref={(type) => this.type = type}
											/>
											{this.state.errorType && this.renderError(TYPE_ERROR.ERROR, this.state.errorType)}
										</div>
									</td>
									<td>
										<div className="d-flex">
											<div className="d-flex justify-content-start handling-problem custom-slectoption margin-top-10">
												<Select
													value=""
													name="phone_1"
													options={getPrefixPhoneNumber().prefix}
													onChange={(e) => this.handleChangeNumber(e.value, 'phone_1')}
													blurInputOnSelect={true}
													isSearchable={false}
													placeholder="000"
												/>
												<input
													type="text"
													className="form-control combo-input top4"
													value={this.state.phone_1}
													onChange={(e) => this.handleChangeNumber(e.target.value, 'phone_1')}
													placeholder="000"
													onKeyPress={(e) => isNumberKey(e)}
													onPaste={(e) => isOnPasteNumber(e)}
													maxLength="3"
													ref={(phone_1) => this.phone_1 = phone_1}
													onBlur={this.checkPhoneNumber}
													ref="headPhone"
												/>
											</div>
											<div className="align-self-center">
												<span className="dash-letter float-left" style={{ marginLeft: '2px' }}>-</span>
											</div>
											<input
												type="text"
												className="form-control ml-1 mr-1 mt-2 hospital-form-input margin-top-10"
												placeholder="0000"
												maxLength="4"
												value={this.state.phone_2}
												onChange={(e) => this.handleChangeNumber(e.target.value, 'phone_2')}
												onKeyPress={(e) => isNumberKey(e)}
												onPaste={(e) => isOnPasteNumber(e)}
												ref={(phone_2) => this.phone_2 = phone_2}
												onBlur={this.checkPhoneNumber}
												ref="midlePhone"
											/>
											<div className="align-self-center">
												<span className="dash-letter float-left">-</span>
											</div>

											<input
												type="text"
												className="form-control ml-1 mr-1 mt-2 hospital-form-input margin-top-10"
												placeholder="0000"
												maxLength="4"
												value={this.state.phone_3}
												onChange={(e) => this.handleChangeNumber(e.target.value, 'phone_3')}
												onKeyPress={(e) => isNumberKey(e)}
												onPaste={(e) => isOnPasteNumber(e)}
												ref={(phone_3) => this.phone_3 = phone_3}
												onBlur={this.checkPhoneNumber}
												ref="endPhone"
											/>
										</div>
										<div style={{ 'marginTop': '-5px' }}>
											{this.state.errorPhone && this.renderError(TYPE_ERROR.ERROR, this.state.errorPhone)}
										</div>
									</td>
									<td>
										<input
											type="text"
											className="form-control hospital-code"
											placeholder="선택"
											maxLength="5"
											onKeyPress={(e) => isNumberKey(e)}
											onPaste={(e) => isOnPasteNumber(e)}
											ref={(zip_code) => this.zip_code = zip_code}
										/>
										{this.state.errorZipCode && this.renderError(TYPE_ERROR.ERROR, this.state.errorZipCode)}

									</td>
									<td>
										<div className="d-flex justify-content-start autoCompleteHospital">
											<input
												type="text"
												className="form-control hospital-form-input"
												placeholder="도로명주소,건물명 또는 지번을 입력하세요"
												ref={(address) => this.address = address}
												onChange={e => this.onChangeAutoComplete(e.target.value)}

											/>
											<span className="fa fa-search icon-search"></span>

											{this.renderDataAutoComplete()}

										</div>
										{this.state.errorAddress && this.renderError(TYPE_ERROR.ERROR, this.state.errorAddress)}

									</td>
									<td>
										<input
											type="text"
											className="form-control"
											placeholder="홈페이지주소"
											ref={(website) => this.website = website}
										/>
										{this.state.errorWebsite && this.renderError(TYPE_ERROR.ERROR, this.state.errorWebsite)}
									</td>
								</tr>

							</tbody>

						</table>
						<div className="result-not pull-right">
							<button
								className="btn btn-primary mr-2"
								onClick={this.submitForm}
							>
								확인
						</button>

							<button
								className="btn btn-secondary"
								onClick={() => this.closeFormSeachHospital()}
							>
								취소
						</button>
						</div>

					</div>
					}
				</div>
			);
		}

		return (
			<div>
				<h6 className="pull-right">
					<button
						className="btn btn-primary"
						onClick={this.props.handleCheck}
					>확인</button>
				</h6>
				<Datatable
					body={body}
					params={params}
					page={page}
					pageSz={pageSz}
					totalPage={totalPage}
					handleChangePage={this.props.handleChangePage}
					handleClickRow={this.props.handleClickRow}
				/>
			</div>
		);
	}

	handleSubmitSearchHospital = () => {
		this.props.handleSubmitSearch(this.hospitalName.value)
	}

	render() {
		const { sizeModal } = this.props;

		return (
			<div>
				<Modal className={"modalPopup " + sizeModal}
					id="FormResult"
					show={this.props.openModalFormResult}
					onHide={() => this.closeFormSeachHospital()}
				>
					<Modal.Header closeButton />
					<Modal.Title>병원이름 검색결과</Modal.Title>

					<div className="d-flex align-items-center pl-2 col-md-8 mt-5">
						<span className="min-60">병원이름</span><span className="text-danger">*</span>
						<div className="box-search d-flex popup-search">
							<input
								type="text"
								className="form-control"
								placeholder="한아름"
								ref={(input) => this.hospitalName = input}
							/>
							<button
								className="btn btn-primary btn-popup-search ml-3"
								onClick={this.handleSubmitSearchHospital}
							>
								검색
            			</button>
						</div>
					</div>
					<div className="mt-3 pt-ie-35">
						<label className="mb-0"> ※ 이 정보는 심평원에 등록되어 있는 데이터 입니다.</label><br></br>
						<label> 검색 후 원하는 병원 정보가 없다면 병원등록 버튼을 이용해 정보를 입력해주세요.</label>
					</div>
					{this.renderDataBodyResult()}
				</Modal>
				<Modal
					className="modalPopup w-45"
					id="ModalAlert"
					show={this.props.openModalModalAlert}
					onHide={() => this.props.onHandleChange({ openModalModalAlert: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						병원을 선택하세요
					</div>
					<div className="action-footer text-center">
						<button
							className="btn btn-secondary"
							onClick={() => this.props.onHandleChange({ openModalModalAlert: false })}
						>확인</button>
					</div>
				</Modal>
			</div>
		)
	}
}

export default HospitalModalSearch;
