import React, { Component } from 'react';
import Table from "../common/table";
import Select from 'react-select';
import { isNumberKey, formatNumber, checkAuth } from '../../services/functionService';
import LoadingOverlay from 'react-loading-overlay';
import PulseLoader from 'react-spinners/PulseLoader';
import { ROLE } from '../../config.json';
import { connect } from 'react-redux';

const listMaxNumber = 30;
const listGender = [
	{ value: 1, label: '여' },
	{ value: 2, label: '남' },
	{ value: 3, label: '무관' },
]



class TableRegister extends Component {
	columns = [
		{
			path: "departRoom",
			label: "병동",
			content: (item, index) => (
				<input
					type="text"
					className="form-control"
					name="area_name"
					placeholder="병동"
					autoComplete="off"
					value={item.area_name}
					readOnly={item.readOnly}
					onChange={(e) => this.props.handleChange("area_name", e.target.value, item, index)}
				/>
			)
		},
		{
			path: "name",
			label: "호실",
			content: (item, index) => (
				<input
					type="text"
					className="form-control"
					name="name"
					placeholder="호실"
					autoComplete="off"
					value={item.name}
					readOnly={item.readOnly}
					onChange={(e) => this.props.handleChange("name", e.target.value, item, index)}
				/>
			)
		},
		{
			path: "typeRoom",
			label: "병실",
			content: (item, index) => {
				let listType = [...this.props.listType];
				let typeRoom = listType.filter(ite => ite.value === item.type_id);

				return (
					<Select
						placeholder="선택"
						isDisabled={item.readOnly}
						value={typeRoom}
						onChange={(e) => this.props.handleChange("type_id", e.value, item, index)}
						options={this.props.listType}
						blurInputOnSelect={true}
						isSearchable={false}
					/>
				)
			}
		},
		{
			path: "maxNumber",
			label: "최대수용환자수",
			content: (item, index) => {
				return (
					<Select
						placeholder="선택하다"
						isDisabled={item.readOnly}
						value={{ value: item.count_patient, label: item.count_patient !== 0 ? item.count_patient + '인실' : '선택하다' }}
						onChange={(e) => this.props.handleChange("count_patient", e.value, item, index)}
						options={this.renderListMaxNumber()}
						blurInputOnSelect={true}
						isSearchable={false}
					/>
				)
			}
		},
		{
			path: "gender",
			label: "성별",
			content: (item, index) => {
				let gender = listGender.filter(ite => ite.value === item.gender);

				return (
					<Select
						placeholder="여"
						isDisabled={item.readOnly}
						value={gender}
						onChange={(e) => this.props.handleChange("gender", e.value, item, index)}
						options={this.renderListGender()}
						blurInputOnSelect={true}
						isSearchable={false}
					/>
				)
			}
		},
		{
			path: "amount",
			label: "기준금액",
			content: (item, index) => (
				<input
					type="text"
					className="form-control"
					name="amount"
					placeholder="기준금액"
					autoComplete="off"
					maxLength="13"
					value={Number(item.amount) === 0 ? '' : formatNumber(item.amount)}
					readOnly={item.readOnly}
					onKeyPress={(e) => isNumberKey(e)}
					onChange={(e) => this.props.handleChange("amount", e.target.value, item, index)}
				/>
			)
		}
	];
	constructor(props) {
		super(props);
		var btnCreate = checkAuth("rooms/register", this.props.user, ROLE.ALL, false) === true ? true  : false;
		var btnEdit = checkAuth("rooms/register", this.props.user, ROLE.EDIT_DELETE, false) === true ? true : false;
		var btnClose = checkAuth("rooms/register", this.props.user, ROLE.ALL, false) === true ? true : false;

		if(btnCreate || btnEdit || btnClose)
		{
			this.columns = [...this.columns, {
				key: "View Detail",
				label: btnCreate ? <button className="btn btn-primary btn-sm btn-table" onClick={this.props.handleClick}>추가</button> : '',
				path: "",
				content: (item, index) => (
					<div className="group-btn">
						{btnEdit ? this.renderButton(item, index) : ''}
						{btnEdit ? this.renderButtonRemove(item, index) : ''}
						{btnClose ? this.renderButtonStatus(item, index) : ''}
					</div>
				)
			}]
		}

	}
	

	renderButtonRemove = (item, index) => {
		if (item.isEdit === 1 || item.isEdit === 2 || item.isEdit === 3) {
			return (
				<button
					onClick={() => this.props.handleChangeData({ openModalDelete: true, itemDelete: item, indexDelete: index })}
					className="btn btn-danger btn-sm btn-table"
				>삭제</button>
			);
		}

		return (
			<button
				onClick={() => this.props.handleRemoveRow(item, index)}
				className="btn btn-danger btn-sm btn-table"
			>삭제</button>
		);
	}

	renderButtonStatus = (item, index) => {
		if (item.status === 1 || item.status === 2) {
			return (
				<button
					onClick={() => this.props.changeStatus(item, index)}
					className="btn btn-secondary btn-sm btn-table"
				>{item.status === 1 ? "Close" : "Open"}</button>
			);
		}
	}

	renderButton = (item, index) => {
		if (item.isEdit === 0) {
			return (
				<button
					onClick={() => this.props.handleAddNewRow(item, index)}
					disabled={this.props.isClick}
					className="btn btn-primary btn-sm btn-table"
				>저장</button>
			);
		}

		if (item.isEdit === 3) {
			return (
				<button
					onClick={() => this.props.handleSubmitEdit(item, index)}
					className="btn btn-primary btn-sm btn-table"
				>저장</button>
			);
		}

		if (item.isEdit === 2) {
			return;
		}

		return (
			<button
				onClick={() => this.props.handleEditRow(item, index)}
				className="btn btn-primary btn-sm btn-table"
			>수정</button>
		);
	}

	renderSelect = (data) => {
		let html = [];

		data.map((item) => {
			html.push(
				{
					label: item,
					value: item
				}
			);

			return item;
		});

		return html;
	}

	renderListMaxNumber = () => {
		let html = [{value: 0, label: "선택하다"}];

		for (let i = 1; i <= listMaxNumber; i++) {
			html.push(
				{
					value: i,
					label: i + "인실"
				}
			);
		}

		return html;
	}

	renderListGender = () => {
		let html = [];

		listGender.map((item) => {
			html.push(
				{
					value: item.value,
					label: item.label
				}
			);

			return item;
		});

		return html;
	}

	render() {
		const { body, totalPage, pageSz } = this.props.data;

		return (
			<div className="table-room-register">
				<LoadingOverlay 
					active={this.props.isActive}
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
				<Table
					columns={this.columns}
					data={body}
					pageSz={pageSz}
					totalPage={totalPage}
				/>
				</LoadingOverlay>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user
	}
}
export default connect(mapStateToProps)(TableRegister);
