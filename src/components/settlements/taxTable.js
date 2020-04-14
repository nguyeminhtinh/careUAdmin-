import React, { Component } from "react";
import Table from "../common/table";
import { exportExcel, checkAuth } from '../../services/functionService';
import LoadingOverlay from 'react-loading-overlay';
import PulseLoader from 'react-spinners/PulseLoader'
import { toast } from "react-toastify";
import { connect } from 'react-redux';
import { ROLE } from '../../config.json';

class TaxTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isClick: false
		}
	}
	columns = [
		{ path: "room", label: "병실", value: 'room', className: "text-center wd130" },
		{ path: "careers", value: "full_name", label: "이름", rowspan: true, className: "text-center" },
		{ path: "", value:"", label: "청구금액", rowspan: true, className: "text-center" },
		{ path: "", label: "합계", rowspan: true, className: "text-center" },
		{ path: "", label: "원천징수", rowspan: true, className: "text-center" },
		{ path: "", label: "등록증", rowspan: true, className: "text-center" },
		{ path: "", label: "주소", rowspan: true, className: "text-center" }
	];

	handleExportExcel = () => {
		let { year, month } = this.props.dataFilter;
		if(month < 10 ) month = '0' + month;
		const file_name = year + '년 ' + month + '월 일산요양병원 간병료 원천징수 내역';
		// exportExcel("tableA", "Example", file_name);
		window.location.href = process.env.REACT_APP_API_URL + this.props.hospital_id + "/tax-export?name=" + file_name + "&year=" + year + "&month=" + month;
	}

	renderTitleTable = () => {
		const { year, month } = this.props.dataFilter;
		return (
			<tr>
				<th colSpan="7" className="title text-center">{year}년 {month}월 일산요양병원 간병료 원천징수 내역</th>
			</tr>
		);
	}

	handleExportExcelNull = () => {
		this.setState({
			isClick: true
		})
		toast.error('표시 할 데이터가 없습니다..');
		setTimeout(() => {
			this.setState({
				isClick: false
			})
		}, 5000);
	}

	_renderExcel = () => {
		return <button
				className="btn btn-primary mb-3"
				onClick={this.handleExportExcel}
			>엑셀 다운로드</button>
	}
	_renderExcelNull = () => {
		return <button
				className="btn btn-primary mb-3"
				disabled={this.state.isClick}
				onClick={this.handleExportExcelNull}
			>엑셀 다운로드</button>
	}
	
	render() {
		const { body, pageSz, totalPage, page } = this.props.data;
		var download = checkAuth("settlements/tax", this.props.user, ROLE.ALL, false) ? true : false;
		return (
			<div className="table-tax text-center">
				<div className="text-right">
					{this.props.showExcel ? this._renderExcel() : this._renderExcelNull()}
				</div>
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
					page={page}
					handleChangePage={this.props.handleChangePage}
					renderFooterTable={this.props.renderFooterTable}
					pageSz={pageSz}
					totalPage={totalPage}
					renderTitleTable={this.renderTitleTable}
				/>
				</LoadingOverlay>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		hospital_id: state.authReducer.user.user.hospital === null ? null : state.authReducer.user.user.hospital.id,
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user
	}
}
export default connect(mapStateToProps)(TaxTable);
