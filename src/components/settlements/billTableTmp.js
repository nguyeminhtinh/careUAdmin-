import React, { Component } from "react";
import Table from "../common/table";
import { exportExcel } from '../../services/functionService';
import LoadingOverlay from 'react-loading-overlay';
import PulseLoader from 'react-spinners/PulseLoader'
import { formatNumber } from '../../services/functionService';

class TaxTable extends Component {
	columns = [
		{ path: "room", label: "병실", value: 'room', className: "text-center w80" },
		{ path: "careers", value: "full_name", label: "이름", rowspan: true, className: "text-center" },
		{ path: "", value:"", label: "총 일수", rowspan: true, className: "text-center" },
		{ path: "", label: "일당", rowspan: true, className: "text-center" },
		{ path: "", label: "청구금액", rowspan: true, className: "text-center" }
	];

	handleExportExcel = () => {
		let { year, month } = this.props.dataFilter;
		const file_name = year + ' 년 ' + month + '월 일산요양병원 간병료 원천징수 내역';
		exportExcel("tableA", "Example", file_name);
	}

	renderTitleTable = () => {
		const { year, month } = this.props.dataFilter;

		return (
			<tr>
				<th colSpan="5" className="title text-center" key={0}>{year}년 {month}월 일산요양병원 간병료 청구서</th>
			</tr>
		);
	}

	renderFooterTable = () => {
		return (
			<tr key={1}>
				<td colSpan="3" className="theadBill" align="center"><strong>총합계</strong></td>
				<td colSpan="2">{formatNumber(this.props.totalAmount)}</td>
			</tr>
		);
	}

	render() {
		const { body, pageSz, totalPage, page } = this.props.data;
		return (
			<div className="table-tax text-center">
				<div className="text-right">
					<button
						className="btn btn-primary mb-3"
						onClick={this.handleExportExcel}
					>엑셀 다운로드</button>
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

export default TaxTable;