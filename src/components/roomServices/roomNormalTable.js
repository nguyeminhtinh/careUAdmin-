import React, { Component } from "react";
import Table from "../common/tableRoom";
class RoomNormalTable extends Component {
	columns = [
		{ path: "area", label: "병동" },
		{ path: "name", label: "호실" },
		{ path: "type", label: "병실 유형" },
		{ path: "patient", label: "오늘환자수" },
		{ path: "careers", label: "간병인", rowspan: true },
		// { path: "", label: "간병인", rowspan: true },
		// { path: "", label: "업무시작일", rowspan: true },
		{ path: "", label: "종료예약일", rowspan: true },
		{ path: "", label: "휴가일", rowspan: true },
		{ path: "", label: "휴가상태", rowspan: true },
	];

	render() {
		const { body, page, pageSz, totalPage } = this.props.data;
		return (
			<Table
				columns={this.columns}
				data={body}
				handleChangePage={this.props.handleChangePage}
				page={page}
				pageSz={pageSz}
				totalPage={totalPage}
			/>
		);
	}
}

export default RoomNormalTable;