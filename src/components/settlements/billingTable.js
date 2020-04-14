import React, { Component } from "react";
import { getRoomById, getBillingAmount } from '../../services/bill';
import { formatNumber } from '../../services/functionService';
import Pagination from '../common/pagination';
import LoadingOverlay from 'react-loading-overlay';
import PulseLoader from 'react-spinners/PulseLoader'

class BillingTable extends Component {

	calculatorRowSpan = (item) => {
		var rowSpanRoom = item.model.length,
			total = 0;
		for (var i = 0; i < rowSpanRoom; i++) {
			// var room = item.model[i];
			// var rowSpanCareerRoom = getRoomById(room.id).length;
			total = total + 1;
		}
		return total;
	}

	getCareers = (room) => {
		// let careers = getRoomById(room.id);
		let careers = room;
		return careers;
	}

	renderRowRoomHistory = (item) => {
		var arrRowRooms = [];
		for (var i = 1; i < item.model.length; i++) {
			var room = item.model[i];
			let careGivers = item;
			arrRowRooms.push(
				<tr key={i}>
					<td rowSpan={room.length} className="text-center">{room.full_name}</td>
					{this.renderCell(this.getCareers(room))}
					<td rowSpan={careGivers.length} className="text-center">{formatNumber(item.model[i].total)}</td>
				</tr>
			);
			if (careGivers.length > 1) {
				for (var j = 1; j < careGivers.length; j++) {
					arrRowRooms.push(
						<tr key={j + j + i}>
							{this.renderCell(careGivers[j])}
						</tr>
					);
				}
			}
		}

		return arrRowRooms;
	}

	getCareGiverRowSpan = (item) => {
		// return this.getCareers(item.rooms[0]).length;
		return item.model[0].length;
	}

	renderCell = (bill) => {	
		let vagT = Number(bill.date_works) - Number(bill.count_day_off);
		return (
			<React.Fragment>
				<td className="text-center">{vagT}</td>
				<td className="text-center">{formatNumber(bill.amount)}</td>
				{/* <td align="center">{bill.count_day_off}</td>
				<td align="center">{formatNumber(bill.salary_bonus)}</td>
				<td align="center">{vagT}</td>
				<td align="center"></td> */}
			</React.Fragment>
		);
	}

	renderRowCareGiversHistory = (item, index) => {
		var arrRowCareGivers = [],
			room = item.model[index];
		if (!room)
			return;
		var careGivers = item.model[index];

		for (var i = 1; i < careGivers.length; i++) {

			arrRowCareGivers.push(
				<tr key={i}>
					{this.renderCell(careGivers[i])}
				</tr>
			);
		}
		return arrRowCareGivers;
	}

	_renderPaging = () => {
		const { totalPage, pageSz, page } = this.props.data;
		if (totalPage > 0) {
			return (
				<Pagination
					totalPage={totalPage}
					handleChangePage={this.props.handleChangePage}
					pageSz={pageSz}
					page = {this.props.page}
				/>
			);
		}

		return;
	}

	renderContentTable = () => {
		// const { body } = this.props.data;
		const  body  = this.props.data['body'];
		let html = [];
		body.map((item, i) => {
			html.push(
			<React.Fragment key={i}>
				<tr key={item.id}>
					<td rowSpan={this.calculatorRowSpan(item)} className="text-center w80">{item.room}</td>
					<td rowSpan={this.getCareGiverRowSpan(item)} className="text-center">{item.model[0].full_name}</td>
					{this.renderCell(item.model[0])}
					<td rowSpan={this.getCareGiverRowSpan(item)} className="text-center">{formatNumber(item.model[0].total)}</td> 
				</tr>
				{this.renderRowCareGiversHistory(item, 0)}
				{item.model.length > 1 && (this.renderRowRoomHistory(item))} 
			</React.Fragment>
			)

			return item;
		});

		if (body.length === 0) {
			html.push(
				<tr key={0}>
					<td colSpan={5} className="bg-white text-center">데이터가 없습니다</td>
				</tr>
			);
		}

		return html;
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
			<tfoot>
				<tr>
					<td colSpan="3" className="theadBill" align="center"><strong>총합계</strong></td>
					<td colSpan="2" className="text-center">{formatNumber(this.props.totalAmount)}</td>
				</tr>
			</tfoot>
		);
	}

	render() {
		return (
			<div>
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
				<table className="table table-bordered align-middle"  id="tableA">
					<thead>
						{this.renderTitleTable()}
						<tr className="theadBill">
							<th width="15%">병실</th>
							<th width="15%">이름</th>
							<th width="15%">총 일수</th>
							<th width="15%">일당</th>
							<th>청구금액</th>
						</tr>
					</thead>
					<tbody>
						{this.renderContentTable()}
					</tbody>
					{this.renderFooterTable()}
				</table>
				</LoadingOverlay>
				{this._renderPaging()}
			</div>
		);
	}
}

export default BillingTable;