import React, { Component } from 'react';
import { PAGESIZE } from '../../config.json';
import { getCareGiversHistory } from '../../services/history';
import Datatable from '../common/datatable';
import { exportExcel } from '../../services/functionService';
// import { SSL_OP_SINGLE_DH_USE } from 'constants';
import { connect } from 'react-redux';

class HistoyrDetail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dataHistory: {
				params: [
					{ title: "간병인", value: "full_name", className: "text-center" },
					{ title: "근무일수", value: "works_day", className: "text-center" },
					{ title: "휴대전화번호", value: "phone", className: "text-center" },
					{ title: "등록증번호", value: "symbol", className: "text-center" },
					{ title: "시작일", value: "start_day_user", className: "text-center" },
					{ title: "종료일", value: "end_day_user", className: "text-center" },
					{ title: "금액", value: "salary", className: "text-right" },
					{ title: "주소", value: "address", className: "text-center" },
					{ title: "변동내역", value: "changeHistory", className: "text-center" },
					{ title: "변동원인", value: "reason_for_leave", className: "text-center" },
					{ title: "종료", value: "type_close", className: "text-center" }
				],
				ward:[],
				room: [],
				body: [],
				roomType: [],
				number: [],
				page: 1,
				pageSz: PAGESIZE,
				total: 0
			}
		}
	}

 	async componentWillMount() {
		let dataResultRoom =  await getCareGiversHistory(this.props.hospital_id, this.state.dataHistory.page, this.state.dataHistory.pageSz, parseInt(this.props.idRoom));
		console.log(dataResultRoom.data)
		let data = dataResultRoom.roomHistoryinfo;
		this.setState({
			dataHistory: {
				...this.state.dataHistory,
				ward: data.area ? data.area.name : '' ,
				room: data.name,
				roomType: data.type.name === null ? "-" : data.type.name,
				number: dataResultRoom.total,
				body: dataResultRoom.data,
				total: dataResultRoom.total
			}
		});
	}

	_renderData = async () => {
		let dataResult = await getCareGiversHistory(this.props.hospital_id, this.state.dataHistory.page, this.state.dataHistory.pageSz, parseInt(this.props.idRoom));
		this.setState({
			dataHistory: {
				...this.state.dataHistory,
				body: dataResult.data,
				total: dataResult.total
			}
		});
	}

	exportExcel = () => {
		// exportExcel("tableA", "Example", '병실 과거상세내역' + this.state.dataHistory.room);
		let id = parseInt(this.props.idRoom);
		let name = '병실 과거상세내역' + this.state.dataHistory.room;
		window.location.href = process.env.REACT_APP_API_URL + id + "/aide-export?name=" + name;
	}

	handleChangePage = (page) => {
		this.setState({
			dataHistory: {
				...this.state.dataHistory,
				page: page
			}
		}, () => {
			this._renderData(page, this.state.dataHistory.pageSz);
		});
	}

	render() {

		const { params, body, page, pageSz, ward, room, roomType, number, total } = this.state.dataHistory;

		return (
			<div className="history-room">
				<div className="header-search">
					<h5>정보</h5>
					<div className="d-flex align-items-center justify-content-between">
						<div className="d-flex w-75 align-items-center justify-content-between mt-3">
							<label className="align-items-center justify-content-between">병동 : {ward}동</label>
							<label className="align-items-center justify-content-between">호실 : {room}호</label>
							<label className="align-items-center justify-content-between">병실 : {roomType}</label>
							<label className="align-items-center justify-content-between">최대수용환자수 : {number}인</label>
						</div>
						<div className="text-right">
							<button
								className="btn btn-primary"
								onClick={this.exportExcel}
							>엑셀로 다운받기</button>
						</div>
					</div>
				</div>

				<Datatable
					body={body}
					params={params}
					page={page}
					pageSz={pageSz}
					totalPage={total}
					handleChangePage={this.handleChangePage}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		hospital_id: state.authReducer.user.user.hospital ? state.authReducer.user.user.hospital.id : null
	}
}

export default connect(mapStateToProps)(HistoyrDetail);
