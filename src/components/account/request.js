import React, { Component } from 'react';
import { PAGESIZE, ROLE } from '../../config.json';
import { getListWaitingAccount, getRefuseAccount, getApprovedAccount, getPositionList, getPartList } from "../../services/manageAccounts";
import ModalManageAccounts from './modalRequest';
import Datatable from "../common/datatable";
import Select from 'react-select';
import { toast } from "react-toastify";
import { connect } from 'react-redux';
import { checkAuth } from '../../services/functionService';

class ManageNewAccounts extends Component {
	constructor(props) {
		super(props);

		checkAuth("accounts/request", this.props.user, ROLE.VIEW, true);

		var params = [
			{ title: "NO", value: "no", className: "text-center w80" },
			{ title: "아이디", value: "email" },
			{ title: "이름", value: "fullName" },
			{ title: "휴대폰", value: "phone", className: "text-center"},
			{ title: "부서", value: "partName", renderer: this._renderPart, className: "text-center" },
			{ title: "직책", value: "positionName", renderer: this._renderPosition, className: "text-center" },
		];
		if(checkAuth("accounts/request", this.props.user, ROLE.ALL, false) === true)
		{
			params = [...params, { title: "계정 승인", value: "action", renderer: this._renderProved }]
		}

		this.state = {
			isClick: false,
			dataHistory: {
				params,
				body: [],
				page: 1,
				pageSz: PAGESIZE,
				totalPage: 0
			},
			type: 1,
			parts: [],
			positions: [],
			titlePopup: "",
			dataPopup: {},
			openModalRequest: false
		}
	}

	componentWillMount() {
		const { page, pageSz } = this.state.dataHistory;
		this._renderDataHistory(this.props.hospital_id, page, pageSz);
		this._renderDataPartAndPosition(this.props.hospital_id);
	}
	_renderDataPartAndPosition = async (hospital_id) => {
		let position = await getPositionList(hospital_id);
		let part = await getPartList(hospital_id);
		this.setState({
			parts: part.data.data.parts,
			positions: position.data.data.positions
		});
	}

	_renderDataHistory = async (hospital_id, page, pageSz) => {
		let response = await getListWaitingAccount(hospital_id, page, pageSz);

		var listWaitingAccount = [];
		var accounts = response.data.data.accounts;
		accounts.map((account, index) => {
			let phone = (account.user && account.user.phone_head && account.user.phone_midle && account.user.phone_end) ? account.user.phone_head + '-' + account.user.phone_midle + '-' + account.user.phone_end : '-';
			let accountApproved = {
				"no": (page - 1) * pageSz + index + 1,
				"id": account.user.id,
				"email": account.user.email,
				"fullName": account.user.full_name,
				"phone": phone,
				"partName": account.part ? account.part.name : '',
				"partId": account.part_id ? account.part_id : '',
				"positionName": account.position ? account.position.name : '',
				"positionId": account.position_id ? account.position_id : '',
			}
			listWaitingAccount.push(accountApproved);
			return account;
		});
		this.setState({
			dataHistory: {
				...this.state.dataHistory,
				body: listWaitingAccount,
				totalPage: response.data.data.total,
			}
		});
	}

	handleChangePage = async (page) => {
		let params = {};
		params['page'] = page;
		params['limit'] = this.state.dataHistory.pageSz;
		this.setState({
			dataHistory: {
				...this.state.dataHistory,
				page: page
			}
		}, () => {
			this._renderDataHistory(this.props.hospital_id, page, this.state.dataHistory.pageSz);
		});
		window.scrollTo(0, 0);
	}

	handleChangeType = (dataPopup, data) => {
		this.setState({
			...data,
			dataPopup,
		});
	}

	updateValue = (nameOne, nameTwo, valueOne, valueTwo, index, sData) => {
		let data = [...this.state.dataHistory.body];

		data[index][nameOne] = valueOne;
		data[index][nameTwo] = valueTwo;

		this.setState({
			dataHistory: {
				...this.state.dataHistory,
				body: data
			}
		});
	}

	handleChange = (data) => {
		this.setState({
			...data
		});
	}

	handleChangeDelete = async (data) => {
		try {
			this.setState({
				isClick: true,
			})
			let response = await getRefuseAccount(this.props.hospital_id, this.state.dataPopup);
			this._renderDataHistory(this.props.hospital_id, this.state.dataHistory.page, this.state.dataHistory.pageSz);
			this.setState({
				openModalRequest: false
			})
			this.handleChangePage(1);
			toast.success(response.data.message);
			setTimeout(() => {
				this.setState({
					isClick: false,
				})
			}, 4000);
		} catch (ex) {
			console.log(ex);
		}
	}

	handleChangeApproved = async (data) => {
		try {
			this.setState({
				isClick: true,
			})
			let response = await getApprovedAccount(this.props.hospital_id, this.state.dataPopup);
			this._renderDataHistory(this.props.hospital_id, this.state.dataHistory.page, this.state.dataHistory.pageSz);
			this.setState({
				openModalRequest: false
			})
			this.handleChangePage(1);
			toast.success(response.data.message);
			setTimeout(() => {
				this.setState({
					isClick: false,
				})
			}, 4000);
		} catch (ex) {
			console.log(ex);
		}
	}

	_renderPart = (data, value, index) => {
		let roleEditDelete = checkAuth("accounts/request", this.props.user, ROLE.EDIT_DELETE, false) === true ? true : false;
		let { parts } = this.state;
		parts.map((item) => {
			item.value = item.id;
			item.label = item.name;
			return item;
		});
		return (
			<Select
				placeholder={'선택'}
				options={roleEditDelete === true ? parts : []}
				blurInputOnSelect={true}
				isSearchable={false}
				onChange={(e) => this.updateValue("partId", "partName", e.value, e.label, index, data)}
				value={{ value: data.partId, label: data.partName }}
			/>
		);
	}

	_renderPosition = (data, value, index) => {
		let roleEditDelete = checkAuth("accounts/request", this.props.user, ROLE.EDIT_DELETE, false) === true ? true : false;
		let { positions } = this.state;

		positions.map((item) => {
			item.value = item.id;
			item.label = item.name;
			return item;
		});

		return (
			<Select
				placeholder={'선택'}
				options={roleEditDelete === true ? positions : []}
				blurInputOnSelect={true}
				isSearchable={false}
				onChange={(e) => this.updateValue("positionId", "positionName", e.value, e.label, index, data)}
				value={{ value: data.positionId, label: data.positionName }}
			/>
		);
	}

	_renderProved = (data) => {
		return (

			<div className="d-flex">
				<button
					className="btn btn-secondary btn-pass btn-sidebar approved btn-sm btn-table"
					onClick={() => this.handleChangeType(data, { type: 1, title: "계정 승인", openModalRequest: true })}
				>승인</button>
				<button
					className="btn btn-secondary btn-sidebar btn-sm btn-table"
					onClick={() => this.handleChangeType(data, { type: 2, title: "계정 거절", openModalRequest: true })}
				>거절</button>
			</div>
		);
	}

	render() {
		const { body, params, page, pageSz, totalPage } = this.state.dataHistory;

		return (
			<div className="page-request">
				<div className="wrapp-right">
					<Datatable
						body={body}
						params={params}
						page={page}
						pageSz={pageSz}
						totalPage={totalPage}
						handleChangePage={this.handleChangePage}
					/>
					<ModalManageAccounts
						type={this.state.type}
						title={this.state.title}
						dataPopup={this.state.dataPopup}
						openModalRequest={this.state.openModalRequest}
						handleChange={this.handleChange}
						handleChangeDelete={this.handleChangeDelete}
						handleChangeApproved={this.handleChangeApproved}
						isClick={this.state.isClick}
					/>
				</div>
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

export default connect(mapStateToProps)(ManageNewAccounts);
