import React, { Component } from 'react';
import TableRegister from './tableRegister';
import Modal from 'react-bootstrap-modal';
import { isCharacterValid, checkAuth } from '../../services/functionService';
import { Link } from 'react-router-dom';
import { } from '@babel/polyfill';
import rooms from "../../services/roomService";
import { connect } from 'react-redux';
import { toast } from "react-toastify";
import { getListArea } from '../../redux/actions/action';
import area from '../../services/areaService';
import { ROLE } from '../../config.json';
import { isBuffer } from 'util';
import _ from 'lodash';


const HANGUL = new RegExp("[0-9|\u1100-\u11FF|\u3130-\u318F|\uA960-\uA97F|\uAC00-\uD7AF|\uD7B0-\uD7FF]");

class Register extends Component {
	constructor(props) {
		super(props);

		checkAuth("rooms/register", this.props.user, ROLE.VIEW, true);

		this.state = {
			isClick: false,
			rowData: {
				area_name: "",
				name: "",
				type_id: this.props.listType.length !== 0 ? this.props.listType[0].value : 1,
				count_patient: 0,
				gender: 1,
				amount: "",
				isEdit: 0,
				status: 0
			},
			dataNew: [],
			isClick: false,
			isActive: true,
			data: {
				body: [],
				bodyTmp:[],
				page: 1,
				pageSz: 200,
				totalPage: 0
			},
			info: {
				synthetic: 0,
				special: 0,
				semiIntensive: 0,
				depth: 0,
				isolation: 0,
				count: 0
			},
			itemDelete: {},
			indexDelete: "",
			openModal: false,
			openModalDelete: false,
			openModalClose: false,
			message: "이미 입력된 병실과 병동입니다"
		}
	}

	async componentDidMount() {
		if (this.props.hospital_id) {
			this.getListRoom(this.props.hospital_id);
			this.getInfoRoomHospital(this.props.hospital_id);
		}
	}

	getListArea = async (id) => {
		let response = await area.getListArea(id);
		this.props.getListArea(response.data.data);
	}

	getInfoRoomHospital = async (id) => {
		try {
			let response = await rooms.getInfoRoomHospital(id);
			this.setState({
				info: {
					synthetic: response.data.data.synthetic,
					special: response.data.data.special,
					semiIntensive: response.data.data.semi_intensive || 0,
					depth: response.data.data.depth,
					isolation: response.data.data.isolation,
					count: response.data.data.count
				},
				isActive: false
			});
		} catch (ex) {
			console.log(ex);
		}
	}

	getListRoom = async (id) => {
		try {
			let response = await rooms.listRoom(id);
			let data = response.data.data.data;

			data.map((item) => {
				item.readOnly = true;
				item.isEdit = 1;
				item.area_name = item.area.name;
				return item;
			});
			this.setState({
				data: {
					...this.state.data,
					body: this.state.dataNew.concat(data),
					bodyTmp: data
				},
				isActive: false
			});
		} catch (ex) {
			console.log(ex);
		}
	}

	handleSaveData = async () => {
		let data = [...this.state.data.body];
		let { hospital_id } = this.props;
		let newData = [];
		let currentData = [];
		let isCheck = false;
		let isRemove = 0;
		let message = "이미 입력된 병실과 병동입니다";
		for (let i = 0; i < data.length - 1; i++) {
			for (let j = data.length - 1; j > i; j--) {
				if (data[i].area_name === data[j].area_name && data[i].name === data[j].name && data[j].area_name.length !== 0) {
					isCheck = true;
				} else {
					if (isCharacterValid(data[i].area_name, HANGUL) && isCharacterValid(data[i].name, HANGUL)) {
						isCheck = true;
						message = "최대 한글, 숫자 조합 15글자로 입력해주세요";
					} else {
						if (data[i].area_name.length > 15 || data[i].name.length > 15) {
							isCheck = true;
							message = "최대 한글, 숫자 조합 15글자로 입력해주세요";
						}

						if (data[j].area_name.length > 15 || data[j].name.length > 15) {
							isCheck = true;
							message = "최대 한글, 숫자 조합 15글자로 입력해주세요";
						}
					}
				}
			}
		}

		if (isCheck) {
			this.handleChangeData({ openModal: true, message: message });
			return;
		}

		for (let i = 0; i < data.length; i++) {
			if (data[i].isEdit === 0) {
				if (data[i].area_name.length === 0 && data[i].name.length === 0 && data[i].amount.length === 0) {
					isRemove += 1;
				}

				if (data[i].area_name.length === 0 || data[i].name.length === 0 || data[i].amount.length === 0) {
					isRemove -= 1;
					isCheck = true;
					message = "데이터를 입력해 주세요";
				}

				if (isCharacterValid(data[i].area_name, HANGUL) || isCharacterValid(data[i].name, HANGUL) || data[i].area_name.length > 15 || data[i].name.length > 15) {
					isRemove -= 1;
					isCheck = true;
					message = "최대 한글, 숫자 조합 15글자로 입력해주세요";
				}
			}
		}

		if (isRemove === 0) {
			isCheck = false;
		}

		if (isCheck) {
			this.handleChangeData({ openModal: true, message: message });
			return;
		}
		data.map((item) => {
			if (item.area_name.length !== 0 && item.name.length !== 0 && item.amount.length !== 0 && (item.isEdit === 3 || item.isEdit == 0)) {
				if (item.status === 2) {
					item.status = 2;
				} else {
					item.status = 1;
				}
				item.id = item.id || null;
				item.readOnly = true;
				item.hospital_id = hospital_id;
				item.master_id = 1;
				item.count_bed = 10;
				newData.push(item);
			}

			if (item.isEdit === 1) {
				currentData.push(item);
			}
			return item;
		});
		if (newData.length !== 0) {
			try {
				let response = await rooms.saveAllRoom(newData);
				toast.success(response.data.message);
				this.getListArea(this.props.hospital_id);
				if (hospital_id) {
					this.getListRoom(hospital_id);
					this.getInfoRoomHospital(hospital_id);
				}
			} catch (ex) {
				console.log(ex);
			}
		} else {
			this.setState({
				data: {
					...this.state.data,
					body: currentData
				}
			});
		}
	}

	handleChange = (name, value, item, index) => {
		let newData = [...this.state.data.body];
		let row = item;
		if(name === 'amount') {
			value = Number(value.split(',').join(''))
			if(!Number.isNaN( value)) {
				row[name] = value;
				newData[index] = row;
				this.setState({
					data: {
						...this.state.data,
						body: newData
					}
				});
			}
		} else {
			row[name] = value;
			newData[index] = row;
			this.setState({
				data: {
					...this.state.data,
					body: newData
				}
			});
		}
		
	}

	handleChangeData = (data) => {
		this.setState({
			...data
		});
	}

	handleCloseRoom = async (data) => {
		try {
			let response = await rooms.updateStatusRoom(data);
			if(response.data.data === 1) {
				toast.success(response.data.message);
				if (this.props.hospital_id) {
					this.getListRoom(this.props.hospital_id);
					this.getListArea(this.props.hospital_id);
				}
			} else {
				toast.error(response.data.message);
			}
			this.setState({
				openModalClose: false,
			})
		} catch (ex) {
			console.log(ex);
		}
	}

	changeStatus = async (item, index) => {
		let data = {
			id: item.id,
			status: item.status
		};
		if (data.status === 1) {
			data.status = 2;
		} else {
			data.status = 1;
		}
		if(data.status === 1) {
			this.setState({
				openModalClose: true,
				item: data
			})
		} else {
			this.handleCloseRoom(data)
		}
	}

	handleCloseRow = async (data) => {
		this.setState({
			isClick: true
		})
		this.handleCloseRoom(data)
		setTimeout(() => {
			this.setState({
				isClick: false
			})
		}, 3000);
	}

	handleRemoveRow = async (item, index) => {
		this.setState({
			isClick: true
		})
		if (item.isEdit === 0) {
			let data = [...this.state.data.body];
			data.splice(index, 1);

			this.setState({
				data: {
					...this.state.data,
					body: data
				}
			});
		} else {
			try {
				let response = await rooms.deleteRoom(item.id);
				console.log(response.data)
				if(response.data.data === 1) {
					toast.success(response.data.message);
					this.setState({
						openModalDelete: false,
						isActive: true
					}, () => {
						if (this.props.hospital_id) {
							this.getListRoom(this.props.hospital_id);
							this.getInfoRoomHospital(this.props.hospital_id);
						}
					});
				} else {
					toast.error(response.data.message);
					this.setState({
						openModalDelete: false,
					})
				} 	
			} catch (ex) {
				console.log(ex);
			}
		}
		setTimeout(() => {
			this.setState({
				isClick: false
			})
		}, 3000);
	}

	handleAddNewRow = (item, index) => {
		let data = [...this.state.data.body];
		let dataOld = [...this.state.data.bodyTmp];
		let dataNew = data.slice(0, Number(data.length) - Number(dataOld.length));
		if (this.validationSubmit(item, index)) {
			this.handleAddItem(item, index, dataNew);
		}
		setTimeout(() => {
			this.setState({
				isClick: false
			})
		}, 4000);
	}

	validationSubmit = (item, index) => {
		let newData = [...this.state.data.body];
		let isAdd = true;
		let message = "이미 입력된 병실과 병동입니다";

		if (item.area_name.length !== 0 && item.name.length !== 0 && item.amount.length !== 0) {
			let isCheck = newData.filter((value) => value.status !== 0);
			if (isCheck.length !== 0) {
				newData.map((ite, idx) => {
					if (ite.status !== 0) {
						if (item.area_name === ite.area_name && item.name === ite.name && index !== idx) {
							isAdd = false;
						} else {
							if (isCharacterValid(item.area_name, HANGUL) || isCharacterValid(item.name, HANGUL)) {
								isAdd = false;
								message = "최대 한글, 숫자 조합 15글자로 입력해주세요";
							} else {
								if (item.area_name.length > 15 || item.name.length > 15) {
									isAdd = false;
									message = "최대 한글, 숫자 조합 15글자로 입력해주세요";
								}
							}
						}
					}
					return item;
				});
			} else {
				if (isCharacterValid(item.area_name, HANGUL) || isCharacterValid(item.name, HANGUL)) {
					isAdd = false;
					message = "최대 한글, 숫자 조합 15글자로 입력해주세요";
				} else {
					if (item.area_name.length > 15 || item.name.length > 15) {
						isAdd = false;
						message = "최대 한글, 숫자 조합 15글자로 입력해주세요";
					}
				}
			}

		} else {
			if (item.area_name.length === 0 || item.name.length === 0 || item.amount.length === 0) {
				isAdd = false;
				message = "데이터를 입력해 주세요";
			}
		}

		if (!isAdd) {
			this.handleChangeData({ openModal: true, message: message });
		}
		return isAdd;
	}

	handleAddItem = async (item, index, dataNew) => {
		
		const { hospital_id } = this.props;
		let dataSubmit = {
			hospital_id: hospital_id,
			area_name: item.area_name,
			master_id: 1,
			type_id: item.type_id,
			name: item.name,
			count_bed: 6,
			gender: item.gender,
			amount: item.amount,
			count_patient: item.count_patient
		}
		try {
			let response = await rooms.createRoom(dataSubmit);
			dataNew.splice(index, 1);
			this.setState({
				dataNew: dataNew	
			})
			toast.success('새 데이터가 추가되었습니다');
			this.getListArea(this.props.hospital_id);
			if (hospital_id) {
				this.getListRoom(hospital_id);
				this.getInfoRoomHospital(hospital_id);
			}
			return response;
		} catch (ex) {
			toast.error("부정확 한 데이터");
		}
		
	}

	handleClick = () => {
		let newData = { ...this.state.rowData };
		let rows = [...this.state.data.body];
		rows.unshift(newData);

		this.setState({
			data: {
				...this.state.data,
				body: rows
			}
		});
	}

	handleEditRow = (item, index) => {
		if(item.status === 2) {
			let newData = [...this.state.data.body];
			let row = item;

			row.isEdit = 3;
			row.readOnly = false;

			newData[index] = row;

			this.setState({
				data: {
					...this.state.data,
					body: newData
				}
			});
		}
	}

	handleSubmitEdit = (item, index) => {
		if (this.validationSubmit(item, index)) {
			this.handleEdit(item, index);
		}
	}

	handleEdit = async (item, index) => {
		const { hospital_id } = this.props;

		let data = {
			hospital_id: hospital_id,
			area_name: item.area_name,
			master_id: 1,
			type_id: item.type_id,
			name: item.name,
			count_bed: 6,
			gender: item.gender,
			amount: item.amount,
			count_patient: item.count_patient
		}

		try {
			let response = await rooms.updateRoom(data, item.id);
			toast.success('데이터가 업데이트 되었습니다');
			this.getListArea(this.props.hospital_id);
			if (hospital_id) {
				this.getListRoom(hospital_id);
				this.getInfoRoomHospital(hospital_id);
			}
			return response;
		} catch (ex) {
			console.log(ex);
		}
	}

	renderButtonSaveAll = () => {
		const { body } = this.state.data;

		if (body.length !== 0) {
			return (
				<div className="text-right">
					<button
						className="btn btn-primary"
						onClick={this.handleSaveData}
					>
						전체 저장
						</button>
				</div>
			);
		}
	}

	render() {
		const { synthetic, special, semiIntensive, depth, isolation, count } = this.state.info;
		var allPermission = checkAuth("rooms/register", this.props.user, ROLE.ALL, false) === true ? true : false;
		var editDeletePermission = checkAuth("rooms/register", this.props.user, ROLE.EDIT_DELETE, false) === true ? true : false;

		return (
			<div className="page-register-room">
				<div className="header-search">
					<h5>병실 정보</h5>
					<div className="row">
						<div className="col">
							<label>상급병실 : {synthetic} 개실 </label>
						</div>
						<div className="col">
							<label>일반실 : {special} 개실 </label>
						</div>
						<div className="col">
							<label>준중환자실 : {semiIntensive} 개실 </label>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<label>중환자실 : {depth} 개실 </label>
						</div>
						<div className="col">
							<label>격리병실 : {isolation} 개실 </label>
						</div>
						<div className="col">
							<label>총 병실 : {count} 개실 </label>
						</div>
					</div>
				</div>

				{allPermission === true ?
				<div className="mt-3 mb-3 text-right">
					<span>※변동금액이 아닌 경우 기준금액 입력의 버튼을 사용할 필요가 없습니다.</span>
					<Link to={"/rooms/sickroomRegister"}>
						<button className="btn btn-primary ml-2">
							간병비 기준표 수정
						</button>
					</Link>
				</div>
				: <div className="mt-3 mb-3 text-right"></div>}

				<TableRegister
					isActive={this.state.isActive}
					data={this.state.data}
					handleClick={this.handleClick}
					handleChange={this.handleChange}
					handleRemoveRow={this.handleRemoveRow}
					changeStatus={this.changeStatus}
					handleAddNewRow={this.handleAddNewRow}
					isClick={this.state.isClick}
					handleEditRow={this.handleEditRow}
					handleChangeData={this.handleChangeData}
					handleSubmitEdit={this.handleSubmitEdit}
					listType={this.props.listType}
				/>

				{editDeletePermission === true ? this.renderButtonSaveAll() : ''}

				<Modal
					className='modalPopup w-45'
					id="ModalError"
					show={this.state.openModal}
					onHide={() => this.handleChangeData({ openModal: true })}
				>
					<div>
						<p className="text-center">{this.state.message}</p>
						<div className="button-footer text-center">
							<button
								className="btn btn-secondary"
								onClick={() => this.handleChangeData({ openModal: false })}
							>확인</button>
						</div>
					</div>
				</Modal>

				<Modal
					className='modalPopup w-45'
					id="ModalConfirm"
					show={this.state.openModalDelete}
					onHide={() => this.handleChangeData({ openModalDelete: true })}
				>
					<div>
						<p className="text-center">삭제하시겠습니까?</p>
						<div className="button-footer text-center">
							<button
								className="btn btn-primary"
								disabled={this.state.isClick}
								onClick={() => this.handleRemoveRow(this.state.itemDelete, this.state.indexDelete)}
							>예</button>
							<button
								className="btn btn-secondary"
								onClick={() => this.handleChangeData({ openModalDelete: false })}
							>아니오</button>
						</div>
					</div>
				</Modal>

				<Modal
					className='modalPopup w-45'
					id="ModalConfirm"
					show={this.state.openModalClose}
					onHide={() => this.handleChangeData({ openModalClose: true })}
				>
					<div>
						<p className="text-center">닫으시겠습니까?</p>
						<div className="button-footer text-center">
							<button
								className="btn btn-primary"
								disabled={this.state.isClick}
								onClick={() => this.handleCloseRow(this.state.item)}
							>예</button>
							<button
								className="btn btn-secondary"
								onClick={() => this.handleChangeData({ openModalClose: false })}
							>아니오</button>
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		listType: state.typeReducer.listType,
		hospital_id: state.authReducer.user.user.hospital === null ? null : state.authReducer.user.user.hospital.id,
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user
	}
}
const mapDispatchToProps = dispatch => {
	return {
		getListArea: data => {
			dispatch(getListArea(data))
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);