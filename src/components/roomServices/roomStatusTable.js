import React, { Component } from "react";
import Table from "../common/tableRoom";

import { checkAuth } from '../../services/functionService';
import { ROLE } from '../../config.json';
import { connect } from 'react-redux';
class RoomStatusTable extends Component {

	constructor(props) {
		super(props);

		var columns = [
			{ path: "area", label: "병동" },
			{ path: "name", label: "호실" },
			{ path: "type", label: "병실 유형" },
			{ path: "patient", label: "오늘환자수" },
			{ path: "careers", label: "금액", rowspan: true },
			{ path: "", label: "간병인", rowspan: true },
			{ path: "", label: "업무시작일", rowspan: true },
			{ path: "", label: "종료예약일", rowspan: true },
			{ path: "", label: "휴가일", rowspan: true },
			{ path: "", label: "휴가상태", rowspan: true },			
		];

		if(checkAuth("rooms/status", this.props.user, ROLE.VIEW, false) === true)
		{
			columns = [...columns, {
				key: "View Detail",
				label: "간병인상세",
				path: "",
				rowspan: true,
				content: (item, index, id, type, recruitment, room, start) => (
					<button
						onClick={() => this.props.onViewDetail(item, index, id)}
						className="btn btn-primary btn-sm btn-table"
					>상세</button>
				)
			}];
		}

		if(checkAuth("rooms/status", this.props.user, ROLE.ALL, false) === true)
		{
			columns = [...columns, 
				{
					key: "Change Price",
					label: "변동",
					path: "",
					rowspan: true,
					content: (item, index, id, type, recruitment, room, start) => (
						<button
							className="btn btn-primary btn-sm btn-table"
							onClick={() => this.props.handleClickChangePrice(item, index, id, room, start)}
						>변동</button>
					)
				},
				{
					label: "경고",
					path: "",
					rowspan: true,
					content: (item, index, id, type, recruitment, room, start) => {
						let text = "경고";
						if (type === 1) {
							text = "경고1";
						}

						if (type === 2) {
							text = "경고2";
						}

						if (type === 3) {
							text = "교체";
						}

						if (type === 3) {
							return (
								<button
									className="btn btn-primary btn-sm btn-table"
									onClick={() => this.props.linkReccruitment(id, recruitment)}
								>{text}</button>
							)
						}
						return (
							<button
								onClick={() => this.props.setContentPopup(id, recruitment, type)}
								className="btn btn-primary btn-sm btn-table"
							>{text}</button>
						)
					}
				},
				{
					key: "Exit",
					label: "종료",
					path: "",
					rowspan: true,
					content: (item, index, id, type, recruitment, room, start) => (
						<button
							onClick={() => this.props.onViewExit(id, start)}
							className="btn btn-primary btn-sm btn-table"
							// onClick={() => this.props.handleChange({ openModalExit: true })}
						>종료</button>
					)
				}
			];
		}		

		this.state = {
			columns
		}
	}

	render() {
		const { body, page, pageSz, totalPage } = this.props.data;
		return (
			<Table
				columns={this.state.columns}
				data={body}
				handleChangePage={this.props.handleChangePage}
				page={page}
				pageSz={pageSz}
				totalPage={totalPage}
			/>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user
	}
}

export default connect(mapStateToProps)(RoomStatusTable);