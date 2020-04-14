import React, { Component } from 'react';
import moment from 'moment';
import HospitalRoomsTable from "./hospitalTable";
import { PAGESIZEMODAL } from '../../config.json';
import hospitals from '../../services/hospitals';
import HeaderSearch from '../common/headerSearch';
import { connect } from 'react-redux';

class IndexResult extends Component {
	constructor(props) {
		super(props);

		this.state = {
			date: {
				day: "",
				month: "",
				year: "",
				hours: "",
				minutes: ""
			},
			dataFilter: {
				departRoom: "",
				name: "",
				typeRoom: "",
				nameCareer: "",
				statusOff: ""
			},
			dataTable: {
				body: [],
				totalPage: 10,
				pageSz: PAGESIZEMODAL
			},
			value: ""
		}
	}

	componentWillMount() {
		if (this.props.hospital_id) {
			this._renderDataTable(this.props.hospital_id);
		}
		this._renderDate(new Date());

		setInterval(() => {
			this._renderDate(new Date());
			this._refreshData();
		}, 1800000);
	}

	_refreshData = () => {
		// let dataResult = getRooms(this.state.dataFilter, this.state.dataTable.page, this.state.dataTable.pageSz);

		// dataResult.data.map((item) => {
		// 	item.departRoom = getRandomLetter() + "동";
		// 	item.name = Math.floor(Math.random() * 100) + 200 + "호";
		// 	item.numberOfPatient = (Math.floor(Math.random() * 6) + 6) + "명";

		// 	return item;
		// });

		// this.setState({
		// 	dataTable: {
		// 		...this.state.dataTable,
		// 		body: dataResult.data,
		// 		totalPage: dataResult.totalPage
		// 	}
		// });
	}

	_renderDataTable = async (id) => {

		let dataResult = await hospitals.getListRoomById(id);

		this.setState({
			dataTable: {
				...this.state.dataTable,
				body: dataResult.data.data.rooms,
				totalPage: dataResult.data.data.total
			}
		});
	}

	handleChangePage = (page) => {
		this.setState({
			dataTable: {
				...this.state.dataTable,
				page: page
			}
		}, () => {
			this._renderDataTable(this.props.hospital_id);
		});
	}

	_renderDate = (date) => {
		this.setState({
			date: {
				day: moment(date).format('D'),
				month: moment(date).format('M'),
				year: moment(date).format('YY'),
				hours: moment(date).format('HH'),
				minutes: moment(date).format('mm')
			}
		});
	}

	handleRefresh = () => {
		this._renderDate(new Date());
		this._refreshData();
	}

	handleViewDetail = career => {
		console.log('career', career);
	}

	renderTextDate = () => {
		const { day, month, year, hours, minutes } = this.state.date;

		return (
			<span>{year}년 {month}월 {day}일 {hours}:{minutes}</span>
		);
	}

	onHandleChange = (data, name) => {
		var result = this.state.dataFilter;
		result[name] = data;

		this.setState({
			dataFilter: {
				...this.state.dataFilter,
				...data
			}
		});
	}

	handleFilterData = () => {
		this.setState({
			dataTable: {
				...this.state.dataTable,
				page: 1
			}
		}, () => {
			this._renderDataTable(this.props.hospital_id);
		});
	}

	render() {
		return (
			<div className="custom-table">
				<HeaderSearch
					dataFilter={this.state.dataFilter}
					onHandleChange={this.onHandleChange}
					handleFilterData={this.handleFilterData}
				/>
				<div className="d-flex justify-content-between mt-3">
					<div className="wrapp-left">
						<p>현재 병실 현황</p>
						<p>
							{this.renderTextDate()}
							<i
								onClick={this.handleRefresh}
								className="fa fa-repeat refresh"></i>
						</p>
						<p className="text-opacity">※마지막 데이터 갱신시간입니다.</p>
					</div>
					<div className="wrapp-right">
						<table className="table table-bordered text-center">
							<thead>
								<tr>
									<th>간병인수</th>
									<th>병실건수</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>0명</td>
									<td>0개</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<HospitalRoomsTable
					data={this.state.dataTable}
					handleChangePage={this.handleChangePage}
					onViewDetail={this.handleViewDetail} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		hospital_id: state.authReducer.user.user.hospital ? state.authReducer.user.user.hospital.id : null
	}
}

export default connect(mapStateToProps)(IndexResult);