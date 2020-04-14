import React, { Component } from "react";
import { getListHospitals, getListWaiting, postRegistHospital, removedApplyHospital, getStatusUserHospital } from '../../services/hospitals';
import { PAGESIZE } from "../../config.json";
import ModalFormResult from './modalFormResult';
import Modal from "react-bootstrap-modal";
import { connect } from 'react-redux';
import { userRegisterHospital } from '../../services/userService';
import { toast } from "react-toastify";
import _ from "lodash";
import auth from "../../services/authService";
import { doLogin, getHospital, getListHospital, getListType, getListArea, getListCourses, getListMedicals, getListRoom, getListTypes } from '../../redux/actions/action';
import types from '../../services/typeService';
import area from '../../services/areaService';
import room from '../../services/roomService';
import hospitals from '../../services/hospitals';
class Index extends Component {
	constructor(props) {
		super(props);

		this.state = {
			key: "",
			id_hospital: "",
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
				page: 1,
				pageSz: PAGESIZE,
				totalPage: 0
			},
			dataWaitings: {
				body: [],
			},
			dataItem: {},
			dataSearch: {},
			openModalFormResult: false,
			openModalRequest: false,
			openModalModalAlert: false,
			sizeModal: "",
			openModal: false,
			openModalConfirmDelete: false,
			openModalApplySuccess: false,
			openModalDeleteSuccess: false,
			statusApply: false,
			dataIdActive:''
		};
	}
	getListType = async (id) => {
		let response = await types.getListType(id);

		this.props.getListType(response);
	}

	getListCourses = async () => {
		let response = await hospitals.getListCourses();

		this.props.getListCourses(response.data.data);
	}

	getListTypes = async () => {
		let response = await hospitals.getListTypes();
		this.props.getListTypes(response.data.data);
	}

	getListMedicals = async () => {
		let response = await hospitals.getListMedicals();

		this.props.getListMedicals(response.data.data);
	}

	getListArea = async (id) => {
		let response = await area.getListArea(id);

		this.props.getListArea(response.data.data);
	}

	getListRoom = async (id) => {
		let response = await room.listRoom(id);

		this.props.getListRoom(response.data.data.data);
	}

	async componentWillMount() {
		const { user } = this.props;
		var arrTypes = this.props.listTypes;
		let dataHospital = {
			name: user.hospital !== null ? user.hospital.name : '',
			type: user.hospital !== null ? arrTypes[user.hospital.type]: ''
		}
		const { page, pageSz } = this.state.dataHospitals;
		await this._renderDataHospital(this.state.key, page, pageSz);
		let response = await auth.info(this.props.user.id);
		if (response.data.data.user.hospital !== null) {
			this.getListType(response.data.data.user.hospital.id);
			this.getListArea(response.data.data.user.hospital.id);
			this.getListRoom(response.data.data.user.hospital.id);
		}
		//this.props.doLogin(response.data.data);
		this.props.getHospital(dataHospital);
		this.getListCourses();
		this.getListMedicals();
		this.getListTypes();
		let hospitals = await getListHospitals('', 1, 100);
		this.props.getListHospital(hospitals.data.data.hospitals);
	}

	onHandleChange = data => {
		this.setState({
			...data
		});
	}

	_renderContent = (data, value) => {
		return <span>{data[value] || "-"}</span>;
	}

	_renderDataHospital = async (key, page, pageSz) => {
		const { id } = this.state.dataItem;
		let response = await getListHospitals(key, page, pageSz);
		let waiting = await getListWaiting(this.props.user.id);
		let statusUserHospital = await getStatusUserHospital(this.props.user.id);
		let dataResult = [];
		let dataWaiting = {};

		if (response.data.data.hospitals) {
			dataResult = [...response.data.data.hospitals];
		}

		if (!_.isEmpty(waiting.data.data)) {
			dataWaiting['name'] = waiting.data.data.hospital.name;
			dataWaiting['address'] = waiting.data.data.hospital.address;
			dataWaiting['parts'] = waiting.data.data.hospital.parts;
			dataWaiting['part_id'] = waiting.data.data.part_id;
			dataWaiting['positions'] = waiting.data.data.hospital.positions;
			dataWaiting['position_id'] = waiting.data.data.position_id;
			dataWaiting['status'] = 1;
			this.setState({
				dataItem: dataWaiting,
			});
		}
		if (!_.isEmpty(statusUserHospital.data.data)) {
			this.setState({
				statusApply: statusUserHospital.data.data.status == 1 || statusUserHospital.data.data.status == 3 ? false : true,
			});
		}

		let sizeModal = "";

		if (dataResult.length === 0) {
			sizeModal = "w-55";
		}

		if (id !== undefined) {
			dataResult = dataResult.filter(item => item.id !== id);
		}
		
		this.setState({
			dataHospitals: {
				...this.state.dataHospitals,
				body: dataResult,
				totalPage: response.data.data.total
			},
			dataWaitings: {
				...this.state.dataWaitings,
				body: dataWaiting,
			},
			sizeModal
		});
	}

	handleSubmitSearch = async () => {
		this.setState({
			dataIdActive: ''
		})
		const { page, pageSz } = this.state.dataHospitals;

		await this._renderDataHospital(this.state.key, page, pageSz);

		this.setState({
			dataSearch: [],
			openModalFormResult: true
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
			id_hospital: dataItem.id,
			dataIdActive:dataItem.id
		});
	}

	handleCheck = async () => {
		const { id_hospital } = this.state;
		const { body } = this.state.dataHospitals;

		let dataResult = {};
		dataResult = body.filter(item => item.id === id_hospital);

		if (dataResult.length !== 0) {
			dataResult = dataResult[0];
			dataResult.department_id = 1;
		}

		if (dataResult.length === 0) {
			this.onHandleChange({ openModalModalAlert: true });
			this.setState({
				key: ""
			});
		} else {
			this.setState({
				dataItem: dataResult,
				key: "",
				openModalFormResult: false
			});
			this.handleCloseModal();
		}
	}

	handleChangeData = data => {
		this.setState({
			dataItem: {
				...this.state.dataItem,
				...data
			}
		});
	}

	handleChangePage = page => {
		this.setState(
			{
				dataHospitals: {
					...this.state.dataHospitals,
					page: page
				}
			}, () => {
				this._renderDataHospital(this.state.key, page, this.state.dataHospitals.pageSz);
			}
		);
	}

	handleSubmitConfirm = () => {
		this.onHandleChange({ openModalRequest: false });
		this.props.handleActiveUser(this.state.dataItem);
	}

	onChangeAutoComplete = value => {
		let dataResult = [];
		const { id } = this.state.dataItem;

		if (value.length !== 0) {
			dataResult = this.props.listHospital.filter((item) => item.name.indexOf(value) !== -1);
			dataResult = dataResult.slice(0, 10);
		}

		if (dataResult.length !== 0) {
			if (id !== undefined) {
				dataResult = dataResult.filter(item => item.id !== id);
			}
		}

		this.setState({
			key: value,
			dataSearch: dataResult || []
		});
	}

	handleSubmitAutoComplete = value => {
		this.setState({
			key: value,
			dataSearch: []
		});
	}

	handleSubmitRequest = async () => {
		const { dataItem } = this.state;
		let data = {
			hospital_id: this.props.hospital_id
		}

		if (dataItem.part_id !== undefined) {
			data.part_id = dataItem.part_id;
		} else {
			data.part_id = dataItem.parts[0].id;
		}

		if (dataItem.position_id !== undefined) {
			data.position_id = dataItem.position_id;
		} else {
			data.position_id = dataItem.positions[0].id;
		}

		try {
			let response = await userRegisterHospital(dataItem.id, data);
			toast.success(response.data.message);

			this.setState({
				openModalRequest: false
			});
		} catch (error) {
			console.log(error);
		}
	}

	renderDataAutoComplete = () => {
		const { dataSearch } = this.state;

		if (dataSearch.length > 0) {
			return (
				<div className="result-hospital">
					<ul className="result-list">
						{dataSearch.map((item, index) => (
							<li
								key={index}
								onClick={() => this.handleSubmitAutoComplete(item.name)}
								className="item-hospital"
							>
								{item.name}
							</li>
						))}
					</ul>
				</div>
			);
		}
	}

	handleCloseModal = () => {
		this.setState({
			dataHospitals: {
				...this.state.dataHospitals,
				page: 1
			},
			openModalFormResult: false
		}, () => {
			this._renderDataHospital(this.state.key, 1, this.state.dataHospitals.pageSz);
		});
	}

	handleShowModal = () => {
		this.onHandleChange({ openModal: true });
	}

	onHandleSubmitApply = async data => {
		let userId = this.props.user.id;
		let postData = {};
		if (!_.isEmpty(data)) {
			postData['hospital_id'] = data.hospital_id;
			postData['part_id'] =  data.part_id;
			postData['position_id'] = data.position_id;
		}
		let response = await postRegistHospital(userId, postData);

		if (!_.isEmpty(response.data)) {
			this.onHandleChange({ openModalApplySuccess: true });
			this.setState({
				dataItem: {
					...this.state.dataItem,
					status: 1
				},
			});
		}
	}

	onHandleDeleteApply = async (id, e) => {
		try {
			let response = await removedApplyHospital(id);
			this.onHandleChange({ openModalConfirmDelete:false,openModalDeleteSuccess:true })
			this.setState({
				dataItem: ''
			});
		} catch (e) {
			console.log(e);
		}
	}

	render() {
		const { key, 
			openModalDeleteSuccess, 
			openModalRequest, 
			openModalModalAlert, 
			openModalFormResult, 
			sizeModal, 
			dataItem, 
			dataHospitals, 
			openModal, 
			dataWaitings, 
			openModalConfirmDelete, 
			openModalApplySuccess,
			dataIdActive } = this.state;
		return (
			<div>
				<h5 className="title-page">
					근무를 원하시는 병원을 검색 후 계정 승인요청을 해주세요.
				</h5>
				<div className="form-research d-flex align-items-center pl-2">
					<span className="title min-60">병원이름</span>
					<div className="box-search d-flex w-100">
						<input
							type="text"
							className="form-control"
							placeholder="병원이름을 입력해주세요"
							value={key}
							disabled={dataItem.status === 1 ? true : false}
							onChange={e => this.onChangeAutoComplete(e.target.value)}
						/>

						{this.renderDataAutoComplete()}

						<button
							className="btn btn-primary btn-search"
							onClick={dataItem.status === 1 ? this.handleShowModal : this.handleSubmitSearch}
						>
							병원검색
						</button>
					</div>
				</div>

				<Modal
					className="modalPopup w-45"
					id="ModalAlert"
					show={openModal}
					onHide={() => this.onHandleChange({ openModal: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 페이지 메시지</Modal.Title>
					<div className="text-center pt-16">
						병원승인 요청대기중에서는 다른 병원을 검색할 수 없습니다
					</div>
					<div className="action-footer text-center">
						<button
							className="btn btn-secondary"
							onClick={() => this.onHandleChange({ openModal: false })}
						>확인</button>
					</div>
				</Modal>

				<ModalFormResult
					dataItem={dataItem}
					userId={this.props ? this.props.user.id : ''}
					dataHospitals={dataHospitals}
					dataWaitings={dataWaitings}
					handleChangePage={this.handleChangePage}
					handleClickRow={this.handleClickRow}
					handleCheck={this.handleCheck}
					handleChangeData={this.handleChangeData}
					handleSubmitConfirm={this.handleSubmitConfirm}
					openModalFormResult={openModalFormResult}
					openModalRequest={openModalRequest}
					openModalModalAlert={openModalModalAlert}
					onHandleChange={this.onHandleChange}
					sizeModal={sizeModal}
					isShowTableResult={true}
					handleCloseModal={this.handleCloseModal}
					handleSubmitRequest={this.handleSubmitRequest}
					onHandleSubmitApply={this.onHandleSubmitApply}
					onHandleDeleteApply={this.onHandleDeleteApply}
					openModalConfirmDelete={openModalConfirmDelete}
					openModalApplySuccess={openModalApplySuccess}
					openModalDeleteSuccess={openModalDeleteSuccess}
					dataIdActive={dataIdActive}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		hospital: state.hospitalReducer,
		listTypes: state.hospitalReducer.listTypes,
		listHospital: state.hospitalReducer.listHospital,
		user: state.authReducer.user.user,
		hospital_id: state.authReducer.user.user ? state.authReducer.user.user.hospital ? state.authReducer.user.user.hospital.id : null : null
	}
}

const mapDispatchToProps = dispatch => {
	return {
		doLogin: data => {
			dispatch(doLogin(data))
		},
		getHospital: data => {
			dispatch(getHospital(data))
		},
		getListHospital: data => {
			dispatch(getListHospital(data))
		},
		getListType: data => {
			dispatch(getListType(data))
		},
		getListArea: data => {
			dispatch(getListArea(data))
		},
		getListCourses: data => {
			dispatch(getListCourses(data))
		},
		getListTypes: data => {
			dispatch(getListTypes(data))
		},
		getListMedicals: data => {
			dispatch(getListMedicals(data))
		},
		getListRoom: data => {
			dispatch(getListRoom(data))
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);