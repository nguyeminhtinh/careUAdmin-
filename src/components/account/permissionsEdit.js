import React, { Component } from 'react';
import InputCheckbox from '../common/checkbox';
import Modal from 'react-bootstrap-modal';
import { Link } from 'react-router-dom';
import { checkAuth } from '../../services/functionService';
import permission from '../../services/permissions';
import { toast } from 'react-toastify';
import { ROLE } from '../../config.json';
import { connect } from 'react-redux';
import $ from 'jquery';

class PermissionsEdit extends Component {
	constructor(props) {
		super(props);
		if (checkAuth("accounts/permission", this.props.user, ROLE.VIEW, false) === false && checkAuth("accounts/permission", this.props.user, ROLE.EDIT_DELETE, false) === false) {
			checkAuth("accounts/permission", this.props.user, ROLE.EDIT_DELETE, true);
		}
		this.state = {
			dataSetPermisssions: [],
			listPermission: [],
			permissions: [],
			permissionsOld: [],
			checkboxAll: false,
			openModalConfirm: false,
			openModalNotChoose: false
		}
	}

	componentWillMount() {
		this._renderData(this.props.id);
		this._renderListPermission();
	}

	_renderListPermission = async () => {
		let response = await permission.getPermissions();

		this.setState({
			listPermission: response.data.data
		});
	}

	_renderData = async (id) => {
		let response = await permission.getPermissionById(parseInt(id));
		let dataResult = response.data.data;
		let permissions = [...response.data.data.permissions];

		permissions = permissions.sort(function (a, b) {
			return a.permission_id - b.permission_id;
		});

		permissions.map(item => {
			item.role_id.sort();
			return item;
		});

		dataResult.part_name = dataResult.part.name;
		dataResult.position_name = dataResult.position.name;

		this.setState({
			dataSetPermisssions: dataResult,
			permissions: JSON.parse(JSON.stringify(permissions)) || [],
			permissionsOld: JSON.parse(JSON.stringify(permissions)) || [],
			checkboxAll: this.setCheckAll(permissions)
		});
	}

	setCheckAll = (data) => {
		let count = 0;

		data.map(item => {
			item.role_id.map(role => {
				count = count + 1;
				return role;
			});
			return item;
		});

		if (count === 42) {
			return true;
		}

		return false;
	}

	handleSetCheckBox = (id, value, isChecked) => {
		let permissions = [...this.state.permissions];
		let isAdd = true;

		if (permissions.length === 0) {
			isAdd = true;
		} else {
			permissions.map((item, index) => {
				if (item.permission_id === id) {
					if (isChecked) {
						item.role_id.push(value);
					} else {
						let index = item.role_id.indexOf(value);
						item.role_id.splice(index, 1);
					}

					if (item.role_id.length === 0) {
						permissions.splice(index, 1);
					}

					isAdd = false;
				}
				return item;
			});
		}

		if (isAdd) {
			permissions.push({
				permission_id: id,
				role_id: [value]
			});
		}

		this.setState({
			permissions,
			checkboxAll: this.setCheckAll(permissions)
		});
	}

	handleCheckboxAll = (isChecked) => {
		let permissions = [];

		if (isChecked) {
			permissions = [];
			this.state.listPermission.map(item => {
				permissions.push({
					permission_id: item.id,
					role_id: [4, 5, 6]
				});
				return item;
			});
		}

		this.setState({
			permissions,
			checkboxAll: isChecked
		});
	}

	handleSaveData = async () => {
		let data = {
			permissions: this.state.permissions
		}

		try {
			let response = await permission.updatePermissionById(this.props.id, data);
			this.setState({
				openModalConfirm: false,
				permissionsOld: JSON.parse(JSON.stringify(this.state.permissions))
			}, () => {
				toast.success(response.data.message);
				$('input[name="check-item"]').each(function (item) {
					$(this).attr('disabled', true);
				})
				setTimeout(() => {
					window.location.href = '/accounts/permissions';
				}, 3000);
			});
		} catch (error) {
			console.log(error);
		}
	}

	handleChange = (data) => {
		this.setState({
			...data
		});
	}

	renderDataTable = () => {
		let html = [];
		let permissions = [...this.state.permissions];
		let roleEditDelete = checkAuth("accounts/permission", this.props.user, ROLE.EDIT_DELETE, false) === true ? true : false;

		this.state.listPermission.map((item, index) => {
			let checkItem = permissions.filter(ite => ite.permission_id === item.id);
			let check3 = -1;
			let check4 = -1;
			let check5 = -1;

			if (checkItem[0] !== undefined) {
				check3 = checkItem[0].role_id.indexOf(4);
				check4 = checkItem[0].role_id.indexOf(5);
				check5 = checkItem[0].role_id.indexOf(6);
			}

			html.push(
				<tr key={index}>
					<td className={item.parent !== 0 ? 'sub' : ''}>{item.name}</td>
					<td className="text-center">
						<InputCheckbox
							name="check-item"
							onCheck={(e) => this.handleSetCheckBox(item.id, 4, e.target.checked)}
							checked={check3 !== -1 ? true : false}
							disabled={roleEditDelete === false ? true : ''}
						/>
					</td>
					<td className="text-center">
						<InputCheckbox
							name="check-item"
							onCheck={(e) => this.handleSetCheckBox(item.id, 5, e.target.checked)}
							checked={check4 !== -1 ? true : false}
							disabled={roleEditDelete === false ? true : ''}
						/>
					</td>
					<td className="text-center">
						<InputCheckbox
							name="check-item"
							onCheck={(e) => this.handleSetCheckBox(item.id, 6, e.target.checked)}
							checked={check5 !== -1 ? true : false}
							disabled={roleEditDelete === false ? true : ''}
						/>
					</td>
				</tr>
			);
			return item;
		});
		return html;
	}

	render() {
		const { part_name, position_name } = this.state.dataSetPermisssions;
		let roleEditDelete = checkAuth("accounts/permission", this.props.user, ROLE.EDIT_DELETE, false) === true ? true : false;

		return (
			<div>
				<div className="groupselect d-flex">
<<<<<<< HEAD
					<div className="group1 d-flex w-25">
						<label className="align-items-center d-flex w-25 mt-2 mr-2">부서</label>
						<input className="form-control h-auto" disabled defaultValue={part_name} />
					</div>
					<div className="group2 ml-5 d-flex w-25">
						<label className="align-items-center d-flex w-25 mt-2 mr-2">직책</label>
						<input className="form-control h-auto" disabled defaultValue={position_name} />
=======
					<div className="group1 d-flex">
						<label className="align-items-center d-flex w-25 mt-2 label-w">부서</label>
						<input className="form-control" disabled defaultValue={part_name} />
					</div>
					<div className="group2 ml-5 d-flex">
						<label className="align-items-center d-flex w-25 mt-2 label-w">직책</label>
						<input className="form-control" disabled defaultValue={position_name} />
>>>>>>> 4c0022c7f2d3cbd139c3d7dca33304e5636661a7
					</div>
				</div>
				<div className="wrapp-right mt-4">
					<table className="table table-bordered table-setpermission">
						<thead>
							<tr>
								<th>메뉴이름</th>
								<th>전체</th>
								<th>보기 가능</th>
								<th>수정/삭제가능</th>
							</tr>
						</thead>
						<tbody>
							{this.renderDataTable()}
						</tbody>
					</table>
					<label className="checkbox-wrapper">
						<input
							type="checkbox"
							name="checkboxAll"
							id="checkboxAll"
							checked={this.state.checkboxAll}
							onChange={(e) => this.handleCheckboxAll(e.target.checked)}
							disabled={roleEditDelete === false ? true : ''}
						/>
						<span className="checkmark"></span>
						<span>모든 권한 부여하기</span>
					</label>
					<div className="d-flex justify-content-end">
						{roleEditDelete === true ?
							<button
								onClick={() => this.handleChange({ openModalConfirm: true })}
								className=" btn btn-primary approved btn-sm mw-100"
							>등록
						</button>
							: ''}
						<Link to={"/accounts/permissions"}>
							<button
								className="btn btn-secondary approved btn-sm btn-table"
							>목록으로 이동
							</button>
						</Link>
					</div>
				</div>
				<Modal className='modalPopup w-45'
					id="ModalConfirm"
					show={this.state.openModalConfirm}
					onHide={() => this.handleChange({ openModalConfirm: true })}
				>
					<div>
						<p className="text-center">변경하겠습니까?</p>
						<div className="button-footer text-center">
							<button
								className="btn btn-primary"
								onClick={this.handleSaveData}
							>예</button>
							<button
								className="btn btn-secondary"
								onClick={() => this.handleChange({ openModalConfirm: false })}
							>아니오</button>
						</div>
					</div>
				</Modal>
				<Modal className='modalPopup w-45'
					id="ModalConfirmNotChoose"
					show={this.state.openModalNotChoose}
					onHide={() => this.handleChange({ openModalNotChoose: false })}
				>
					<div>
						<p className="text-center">관한을 선택하세요!</p>
						<div className="button-footer text-center">
							<button
								className="btn btn-secondary"
								onClick={() => this.handleChange({ openModalNotChoose: false })}
							>확인</button>
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		hospital_id: state.authReducer.user.user ? state.authReducer.user.user.hospital ? state.authReducer.user.user.hospital.id : null : null,
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user
	}
}
export default connect(mapStateToProps)(PermissionsEdit);
