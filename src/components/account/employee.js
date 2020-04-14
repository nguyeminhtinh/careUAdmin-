import React, { Component } from 'react';
import { PAGESIZE, ROLE } from '../../config.json';
import { getListApprovedAccount, deleteAccounts, getUsersWokingInRoom } from '../../services/employeeAccount';
import Datatable from '../common/datatable';
import Modal from 'react-bootstrap-modal';
import { getPositionList, getPartList } from "../../services/manageAccounts";
import Select from 'react-select';
import { toast } from "react-toastify";
import { connect } from 'react-redux'
import LoadingOverlay from 'react-loading-overlay';
import PulseLoader from 'react-spinners/PulseLoader';
import { checkAuth } from '../../services/functionService';
import { BeatLoader } from 'react-spinners';
import "react-toastify/dist/ReactToastify.css";
import { css } from '@emotion/core';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;
class EmployeeAccount extends Component {
	constructor(props) {
		super(props);

		checkAuth("accounts/employee", this.props.user, ROLE.VIEW, true);
		let params = [
			{ title: "NO", value: "no", className: "text-center w80" },
			{ title: "아이디", value: "email" },
			{ title: "이름", value: "fullName", className: "text-center" },
			{ title: "휴대폰", value: "phone", className: "text-center" },
			{ title: "부서", value: "departName", className: "text-center" },
			{ title: "직책", value: "position", className: "text-center" },
		];

		let checkBox = {};

		if( checkAuth("accounts/employee", this.props.user, ROLE.EDIT_DELETE, false) === true)
		{
			params = [
				{ title: "", value: "check", renderer: this._renderdeChecked, className: "text-center w80 mr-0" },
				...params,
			];
		}

		this.state = {
			dataEmployee: {
				params: params,
				body: [],
				page: 1,
				pageSz: PAGESIZE,
				totalPage: 0,
			},
			parts: [],
			positions: [],
			isActive: true,
			arrayDelete: [],
			dataFilter: {
				keyword: "",
				part_id: '',
				position_id: '',
			},
			defaultType: '',
			defaultTitle: '',
			isOpen: false,
			openModalDelete: false,
			openModalNotifi: false,
			openModalWarningUserWorking: false,
			loading: false,
			isClick: false
		}
	}

	componentWillMount() {
		let params = {};
		params['page'] = this.state.dataEmployee.page;
		params['limit'] = this.state.dataEmployee.pageSz;
		params['position_id'] = this.state.dataFilter.position_id;
		params['part_id'] = this.state.dataFilter.part_id;
		params['keyword'] = this.state.dataFilter.keyword;

		this._renderData(this.props.hospital_id, params);
	}

	_renderData = async (hospitalId, paramsLoad) => {
		let params = {};
		params['page'] = this.state.dataEmployee.page;
		params['limit'] = this.state.dataEmployee.pageSz;
		params['position_id'] = this.state.dataFilter.position_id;
		params['part_id'] = this.state.dataFilter.part_id;
		params['keyword'] = this.state.dataFilter.keyword;
		let response = await getListApprovedAccount(this.props.hospital_id, params);
		var listApprovedAccounts = [];

		var accounts = response.data.data.accounts;
		accounts.map((account, index) => {
			let phone = (account.user && account.user.phone_head && account.user.phone_midle && account.user.phone_end) ? account.user.phone_head + '-' + account.user.phone_midle + '-' + account.user.phone_end : '-';
			let accountApproved = {
				"no": (params.page - 1) * params.limit + index + 1,
				"id": account.user ? account.user.id : 0,
				"email": account.user ? account.user.email : '-',
				"fullName": account.user ? account.user.full_name : '-',
				"phone": phone,
				"departName": account.part ? account.part.name : '-',
				"position": account.position ? account.position.name : '-'

			}
			listApprovedAccounts.push(accountApproved);

			return account;
		});
		let position = await getPositionList(hospitalId);
		let part = await getPartList(hospitalId);

		this.setState({
			dataEmployee: {
				...this.state.dataEmployee,
				body: listApprovedAccounts,
				totalPage: response.data.data.total
			},
			isActive: false,
			isChecked: false,
			parts: part.data.data.parts,
			positions: position.data.data.positions
		});
		this.handleChange({'isActive':false});
	}

	handleChangePage = async (page) => {
		let params = {};
		params['page'] = page;
		params['limit'] = this.state.dataEmployee.pageSz;
		params['position_id'] = this.state.dataFilter.position_id;
		params['part_id'] = this.state.dataFilter.part_id;
		params['keyword'] = this.state.dataFilter.keyword;
		this.setState({
			dataEmployee: {
				...this.state.dataEmployee,
				page: page
			}
		}, () => {
			this._renderData(this.props.hospital_id, params);
		});
		window.scrollTo(0, 0)
	}

	handleChangeDelete = async (id, isChecked) => {
		let result = await getUsersWokingInRoom(id);
		if (result.data.data.length > 0) {
			this.handleChange({ openModalWarningUserWorking: true });
		} else {
			let arrayDelete = this.state.arrayDelete;
			if (isChecked) {
				arrayDelete.push(id);
			} else {
				arrayDelete = arrayDelete.filter((item) => {
					return item !== id;
				});
			}

			this.setState({
				arrayDelete: arrayDelete
			});
		}
	}

	handleDeleteItem = async () => {
		this.setState({
			isClick: true
		})
		let params = {};
		params['page'] = this.state.dataEmployee.page;
		params['limit'] = this.state.dataEmployee.pageSz;
		params['position_id'] = this.state.dataFilter.position_id;
		params['part_id'] = this.state.dataFilter.part_id;
		params['keyword'] = this.state.dataFilter.keyword;
		let dataDelete = await deleteAccounts(this.props.hospital_id, this.state.arrayDelete);
		this.setState({
			openModalDelete: false
		}, () => {
			setTimeout(() => {
				this.setState({
					arrayDelete: [],
				});
			}, 1000);
			toast.success(dataDelete.data.message);
			this.handleFilterData();
		});
			
		setTimeout(() => {
			this.setState({
				isClick: false
			})
		}, 3000);
	}

	_renderdeChecked = (data) => {
		return (
			<label className="checkbox-wrapper" key={"checked_" + data.id}>
				<input
					type="checkbox"
					name="hospitalFacility00"
					className="hospitalFacility"
					onChange={(e) => this.handleChangeDelete(data.id, e.target.checked)}
					checked={this.state.arrayDelete.indexOf(data.id) > -1}
				/>
				<span className="checkmark">
				</span>
			</label>
		);
	}

	handleChangeData = (data, name) => {
		var result = this.state.dataFilter;
		result[name] = data;

		this.setState({
			dataFilter: {
				...this.state.dataFilter,
				...data
			}
		});
	}

	handleFilterData = () => {
		this.handleChange({'isActive':true,'arrayDelete':[]});
		this.handleChangePage(1);
	}

	renderButtonDelete = () => {
		const { dataEmployee, arrayDelete } = this.state;

		if (dataEmployee.body.length !== 0) {
			if (arrayDelete.length !== 0) {
				return (
					<div className="text-right action-delete">
						<button
							className="btn btn-secondary"
							onClick={() => this.handleChange({ openModalDelete: true })}
						>삭제</button>
					</div>
				);
			}

			return (
				<div className="text-right action-delete">
					<button
						className="btn btn-secondary"
						onClick={() => this.handleChange({ openModalNotifi: true })}
					>삭제</button>
				</div>
			);
		}
	}

	handleChange = (data) => {
		this.setState({
			...data
		});
	}

	renderBodyModal = () => {
		if (this.state.arrayDelete.length !== 0) {
			return (
				<div>
					<p className="text-center pt-16">총 {this.state.arrayDelete.length}개 계정을 삭제하시겠습니까?</p>
					<div className="button-footer text-center">
						<button
							className="btn btn-primary"
							onClick={this.handleDeleteItem}							
						>예</button>
						<button
							className="btn btn-secondary"
							onClick={() => this.handleChange({ openModalDelete: false })}
						>아니오</button>
					</div>
				</div>
			);
		}

		return (
			<div>
				<p className="text-center pt-16">삭제하실 행을 선택하세요</p>
				<div className="button-footer text-center">
					<button
						className="btn btn-primary"
						onClick={() => this.handleChange({ openModalDelete: false })}
					>예</button>
				</div>
			</div>
		);
	}

	render() {
		const { params, body, page, pageSz, totalPage } = this.state.dataEmployee;
		let { parts, positions } = this.state;
		let eNull = { id: '', name: '선택' };
		let roleEditDelete = checkAuth("accounts/employee", this.props.user, ROLE.EDIT_DELETE, false) === true ? true : false;

		if (parts.filter(x => x.name === '선택').length == 0) {
			parts.unshift(eNull);
		}

		parts.map((item, key) => {
			item.value = item.id;
			item.label = item.name;
			return item;
		});

		if (positions.filter(x => x.name === '선택').length == 0) {
			positions.unshift(eNull);
		}

		positions.map((item) => {
			item.value = item.id;
			item.label = item.name;
			return item;
		});

		return (
			<div>
				<div className="header-search">
					<h5>검색</h5>
					<div className="select-fix d-flex align-items-center justify-content-start">
						<div className="d-flex align-items-center justify-content-between mr-4">
							<label>이름 :</label>
							<div>
								<input
									type="text"
									className="form-control"
									placeholder="이름을 입력하세요"
									onChange={(e) => this.handleChangeData({ keyword: e.target.value })}
								/>
							</div>
						</div>
						<div className="d-flex align-items-center justify-content-between mr-3">
							<label>부서 :</label>
							<div>
								<Select
									placeholder="선택"
									options={parts}
									blurInputOnSelect={true}
									isSearchable={false}
									defaultValue={parts[parts.findIndex(x => x.id === this.state.dataFilter.part_id)]}
									onChange={(e) => this.handleChangeData({ part_id: e.value })}
								/>
							</div>
						</div>
						<div className="d-flex align-items-center justify-content-between">
							<label className="pl-2">직책 :</label>
							<div>
								<Select
									placeholder="선택"
									options={positions}
									blurInputOnSelect={true}
									isSearchable={false}
									defaultValue={positions[positions.findIndex(x => x.id === this.state.dataFilter.position_id)]}
									onChange={(e) => this.handleChangeData({ position_id: e.value })}
								/>
							</div>
						</div>
						<div className="text-right ml-auto">
							<button
								className="btn btn-primary"
								onClick={this.handleFilterData}
							>검색</button>
						</div>
					</div>
					<BeatLoader
			          	css={override}
			          	sizeUnit={"px"}
			          	size={10}
			          	color={'#123abc'}
			          	loading={this.state.loading}
			        />
				</div>
				<div className="wrapp-right custom-paniga mt-4">
					<LoadingOverlay
						active={this.state.isActive}
						spinner={<PulseLoader />}
						text='로딩...'
						styles={{
							spinner: (base) => ({
								...base,
								top: '0',
								background: '#4288ce'
							}),
							overlay: (base) => ({
								...base,
								background: 'rgba(66, 136, 206, 0.28)'
							})
						}}
					>
						<Datatable
							body={body}
							params={params}
							page={page}
							pageSz={pageSz}
							totalPage={totalPage}
							handleChangePage={this.handleChangePage}
						/>
					</LoadingOverlay>
					{roleEditDelete === true ? this.renderButtonDelete() : ''}
				</div>
				<Modal className='modalPopup w-45'
					id="ModalDelete"
					show={this.state.openModalDelete}
					onHide={() => this.handleChange({ openModalDelete: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>계정 삭제</Modal.Title>
					<div>
						<p className="text-center pt-16">총 {this.state.arrayDelete.length}개 계정을 삭제하시겠습니까?</p>
						<div className="button-footer text-center">
							<button
								className="btn btn-primary"
								onClick={this.handleDeleteItem}
								disabled={this.state.isClick}
							>예</button>
							<button
								className="btn btn-secondary"
								onClick={() => this.handleChange({ openModalDelete: false })}
							>아니오</button>
						</div>
					</div>
				</Modal>

				<Modal className='modalPopup w-45'
					id="openModalWarningUserWorking"
					show={this.state.openModalWarningUserWorking}
					onHide={() => this.handleChange({ openModalWarningUserWorking: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>웹 사이트로부터의 통지</Modal.Title>
					<div>
						<p className="text-center pt-16">현재 작업중인 사용자는 선택할 수 없습니다.</p>
						<div className="button-footer text-center">
							<button
								className="btn btn-secondary"
								onClick={() => this.handleChange({ openModalWarningUserWorking: false })}
							>확인</button>
						</div>
					</div>
				</Modal>

				<Modal className='modalPopup w-45'
					id="ModalNotifi"
					show={this.state.openModalNotifi}
					onHide={() => this.handleChange({ openModalNotifi: false })}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>계정 삭제</Modal.Title>
					<div>
						<p className="text-center pt-16">삭제하실 행을 선택하세요</p>
						<div className="button-footer text-center">
							<button
								className="btn btn-primary"
								onClick={() => this.handleChange({ openModalNotifi: false })}
							>예</button>
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		master_id: state.authReducer.user.user.id === null ? null : state.authReducer.user.user.id,
		hospital_id: state.authReducer.user.user.hospital === null ? null : state.authReducer.user.user.hospital.id,
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user
	}
}

export default connect(mapStateToProps)(EmployeeAccount);
