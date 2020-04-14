import React, { Component } from "react";
import Table from "../common/table";
import { Link } from 'react-router-dom';
const url = process.env.REACT_APP_IMG_URL;

class HandlingTable extends Component {
	columns = [
		{ path: "no", label: "NO", className: "text-center w50" },
		{ path: "area_name", label: "병동", className: "text-center" },
		{ path: "room_name", label: "호실", className: "text-center" },
		{ path: "room_type", label: "병실 ", className: "text-center" },
		{ path: "patient_name", label: "환자이름", className: "text-center" },
		{ path: "phone", label: "보호자연락처", className: "text-center" },
		{ path: "aide_name", label: "간병인", className: "text-center" },
		{ path: "certificate", label: "등록증", className: "text-center" },
		{
			path: "accident_letter",
			label: "사고경위서",
			content: handling => (
				<div className="text-center custom-img" onClick={() => {
					this.props.handleChange({ openModalViewLetter: true });
					this.props.handleChange({ imgPopup: url + handling.accident_letter });
				}}>
					<img src={url + handling.accident_letter} alt="" />
				</div>
			)
		},
		{
			path: "agreement_letter",
			label: "환자동의서",
			content: handling => (
				<div className="text-center custom-img" onClick={() => {
					this.props.handleChange({ openModalViewLetter: true });
					this.props.handleChange({ imgPopup: url + handling.agreement_letter });
				}}>
					<img src={url + handling.agreement_letter} alt="" />
				</div>
			)
		},
		{
			key: "Modified",
			label: "수정",
			path: "",
			content: handling => (
				<div className="text-center">
					<Link to={"/problems/update/" + handling.id}>
						<button
							className="btn btn-secondary btn-pass btn-sidebar btn-sm btn-table"
						>수정</button>
					</Link>
				</div>
			)
		},
		{ path: "insurrance", label: "상태", rowspan: true },
	];

	render() {
		const { body, page, pageSz, totalPage } = this.props.data;

		return (
			<div className="table-hadling">
				<Table
					columns={this.columns}
					data={body}
					handleChangePage={this.props.handleChangePage}
					handleChange={this.props.handleChange}
					page={page}
					pageSz={pageSz}
					totalPage={totalPage}
				/>
			</div>
		);
	}
}

export default HandlingTable;