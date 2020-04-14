import React, { Component } from "react";
import Table from "../common/table";
import _ from 'lodash';

class HospitalRoomsTable extends Component {

	columns = [
		{ path: "area_name", label: "병동" },
		{ path: "room_name", label: "호실" },
		{ path: "type_name", label: "병실 유형" },
		{
			path: "id",
			label: "오늘환자수",
			content: (item, index) => {
				if (_.isNumber(item.id)) {
					return (
						<span>{item.id} 명</span>
					);
				}

				return (
					<span
						className="text-danger cursor-pointer"
						onClick={() => window.location.href = `rooms/status?id=${item.id}`}
					><u>{item.id}</u></span>
				);
			}
		},
		{ path: "user_room_recruitments", label: "간병인", rowspan: true },
		{ path: "", label: "종료 예약일", rowspan: true },
		{ path: "", label: "휴가일", rowspan: true },
		{ path: "", label: "휴가상태", rowspan: true }
	];

	onHandleChange = (data) => {
		this.setState({
			...data
		});
	}

	render() {
		const { body, page, pageSz, totalPage } = this.props.data;

		return (
			<div className="table-home">
				<Table
					columns={this.columns}
					data={body}
					handleChangePage={this.props.handleChangePage}
					page={page}
					pageSz={pageSz}
					totalPage={totalPage}
				/>
			</div>
		);
	}
}

export default HospitalRoomsTable;
