import React, { Component } from 'react';
import moment from 'moment';
import RoomStatusTable from './roomStatusTable';
import { PAGESIZE, PAGESIZEMODAL, ROLE } from '../../config.json';
import { getRoomStatus, getHistoryById, getHistoryErrorById, getFinedAide, apiChangePrice, getHistoryAide, apiCloseRecruitment, getInfoAide, apiChangeNotice, apiChangeTimeRectuitment, apiChangePriceRectuitment, getRoomChangePatient } from "../../services/roomStatus";
import { getRoomById } from '../../services/roomService';
import HeaderSearch from '../common/headerSearch';
import ModalChangeStatus from './modalChangeStatus';
import ModalCarrerDetail from './modalCarrerDetail';
import ModalHistoryChange from './modalHistoryChange';
import ModalExit from './modalExit';
import ModalCurrentNumber from './modalCurrentNumber';
import ModalChangePrice from './modalChangePrice';
import { getRandomLetter, getPrefixWard, checkAuth } from '../../services/functionService';
import _ from "lodash";
import { connect } from 'react-redux';
import { toast } from "react-toastify";
import LoadingOverlay from 'react-loading-overlay';
import PulseLoader from 'react-spinners/PulseLoader'
import { loadPriceCurent, apiHistoryChange, apiHistoryChangeTime, apiNoticeUserRecruitment } from "../../services/roomStatus";
import {  withRouter } from 'react-router-dom';
import { setTimeout, setInterval } from 'timers';

const dataDefault = [
	{ name: "A동", room: "101호", value: "" },
	{ name: "B동", room: "102호", value: "" },
	{ name: "C동", room: "103호", value: "" },
	{ name: "D동", room: "101호", value: "" },
	{ name: "E동", room: "102호", value: "" },
	{ name: "A동", room: "106호", value: "" }
];

class RoomStatus extends Component {
	constructor(props) {
		super(props);

		checkAuth("rooms/status", this.props.user, ROLE.VIEW, true);

		this.state = {
			data: {
				body: []
			},
			startUserRecruitment: null,
			isClick: false,
			status: 0,
			dataStatus: {
				status: 0,
				data: {
					data: [],
					info: {}
				}
			},
			historyChange: [],
			timeHistory: [],
			price: {
				curent: 0,
				bonus: 0,
				aide: '',
				room: '',
				area: ''
			},
			isActive: true,
			recruitment: 0,
			valueSelect: [],
			totalRoom: 0,
			totalPatient: 0,
			flucTuations: 0,
			date: {
				day: "",
				month: "",
				year: "",
				hours: "",
				minutes: ""
			},
			dataTable: {
				body: [],
				totalPage: 0,
				page: 1,
				pageSz: PAGESIZE
			},
			dataInfo: {
				params: [
					{ title: "이름", value: "full_name", className: "text-center" },
					{ title: "성별", value: "gender", className: "text-center" },
					{ title: "나이", value: "ageName", className: "text-center" },
					{ title: "내/외국인", value: "is_foreigner", className: "text-center" },
					{ title: "휴대전화번호", value: "phone", className: "text-center" },
					{ title: "평점", value: "avgRating", renderer: this._renderReview, className: "text-center" },
					{ title: "사고", value: "countAccident", className: "text-center" },
					{ title: "패널티", value: "countPenatly", className: "text-center" }
				],
				body: [
					{
						id: 1,
						name: "이보영(대표)",
						gender: "여",
						age: 60,
						foreign: "외국인",
						phone: "010-2563-5784",
						review: 5,
						trouble: 1,
						punish: 1,
					}
				],
				page: 1,
				pageSz: PAGESIZE,
				totalPage: 0
			},
			dataHistory: {
				params: [
					{ title: "NO", value: "id", className: "w50 text-center" },
					{ title: "근무한 병원 명", value: "nameHospital", className: "text-center " },
					{ title: "동 호수", value: "departRoom", className: "text-center" },
					{ title: "근무 일시", value: "date", className: "text-center w300" },
					{ title: "병실", value: "room", className: "text-center " },
					{ title: "근무 형", value: "status", className: "text-center" }
				],
				body: [],
				page: 1,
				pageSz: PAGESIZEMODAL,
				totalPage: 0
			},
			dataHistoryError: {
				params: [
					{ title: "NO", value: "id", className: "w50 text-center" },
					{ title: "신청한 병원명", value: "nameHospital", className: "text-center w130" },
					{ title: "동 호수", value: "departRoom", className: "text-center w80" },
					{ title: "취소 일시", value: "date", className: "text-center w130" },
					{ title: "병실", value: "room", className: "text-center w80" },
					{ title: "근무 형태", value: "status", className: "text-center" },
					{ title: "하루 일당", value: "salary", className: "text-center" },
					{ title: "이유", value: "notes", className: "text-center" }
				],
				body: [],
				page: 1,
				pageSz: PAGESIZEMODAL,
				totalPage: 0
			},
			dataPopup: [],
			dataTmp: [],
			dataFilter: {
				departRoom: "",
				room_id: "",
				name: "",
				typeRoom: "",
				nameCareer: "",
				statusOff: "",
				dateSort: "",
			},
			selectRoom: getPrefixWard().prefixWard[0],
			dataCareer: {},
			caregiverId: "",
			openModalCurrentNumber: false,
			openModalDelete: false,
			openModalCarrerDetail: false,
			openModalChangeStatus: false,
			openModalExit: false,
			openModalHistoryChange: false,
			openModal: false
		}
	}

	 _renderDataArea = async (id, ad= 0, area = '') => {
		let dataResult = await getRoomChangePatient(id, '', ad, area);
		let listareas = this.props.area_list;
		let select = [{ value: '', label: '선택' }], tmp1 = '';
		listareas.map((item, key) => {
			tmp1 = {
				value: item.name ? item.name : '',
				label: item.name ? item.name : '',
			}
			select[key+1] = tmp1;
			return item;
		})
		if(area === '') {
			this.setState({
				dataPopup: dataResult.table,
				dataTmp: dataResult.table,
				valueSelect: select,
				selectRoom: ''
			});
		} else {
			this.setState({
				dataPopup: dataResult.table,
				valueSelect: select,
				selectRoom: ''
			});
		}
		
		this.handleChange({ openModalCurrentNumber: true })
	}	

	_renderDataAreaModal = (id, data, area) => {
		this._renderDataArea(id, data, area)
	}
	
	componentWillMount() {
		const { page, pageSz } = this.state.dataTable;
		this._renderDate(new Date());
		if (this.props.hospital_id) { 
			this._renderDataTable(this.state.dataFilter, page, pageSz, this.props.hospital_id);
		}
		setInterval(() => {
			this._renderDate(new Date());
			this._refreshData();
		}, 1800000);
	}

	linkReccruitment = (id, recruitment) => {
		this.props.history.push("/rooms/notice/edit/" + recruitment+ "/0");
	}
	
	async componentDidMount() {
		if (this.props.id !== undefined) {
			this.setState({
				openModalCurrentNumber: true
			});

			let room = getRoomById(parseInt(this.props.id))[0];

			let dataResult = await getRoomChangePatient(this.props.hospital_id);
			let selectRoom = [dataResult.select];
			
			selectRoom = selectRoom.filter(x => x.value === room.departRoom);

			this.setState({
				selectRoom: selectRoom[0]
			}, () => {
				this.handleChangeFilter(selectRoom[0]);
			});
		}
	}

	_refreshData = async () => {
		// let dataResult = await getRoomStatus(this.state.dataFilter, this.state.dataTable.page, this.state.dataTable.pageSz, this.props.hospital_id);
		// console.log(dataResult);
		// dataResult.data.map((item) => {
		// 	// item.area = getRandomLetter() + "동";
		// 	// item.room = Math.floor(Math.random() * 100) + 200 + "호";
		// 	// item.patient = (Math.floor(Math.random() * 6) + 6) + "명";
		// 	item.area = item.area;
		// 	item.room = item.room;
		// 	item.patient = item.patient;
		// 	return item;
		// });
		// this.setState({
		// 	dataTable: {
		// 		...this.state.dataTable,
		// 		body: dataResult.data,
		// 		totalPage: dataResult.total
		// 	},
		// 	totalRoom: dataResult.total,
		// 	totalPatient: dataResult.patient,
		// 	flucTuations:dataResult.notice,
		// 	isActive: false
		// });
		this._renderDataTable(this.state.dataFilter, this.state.dataTable.page, this.state.dataTable.pageSz, this.props.hospital_id);
	}

	_renderDataTable = async (data, page, pageSz, id) => {
		let dataResult = await getRoomStatus(data, page, pageSz, id);
		this.setState({
			dataTable: {
				...this.state.dataTable,
				body: dataResult.data,
				totalPage: dataResult.totalPage
			},
			totalRoom: dataResult.total,
			totalPatient: dataResult.patient,
			flucTuations:dataResult.notice,
			isActive: false,
		});
	}

	handleChangePageDataTable = (page) => {
		window.scrollTo(0, 0)
		this.setState({
			dataTable: {
				...this.state.dataTable,
				page: page
			}
		}, () => {
			this._renderDataTable(this.state.dataFilter, page, this.state.dataTable.pageSz, this.props.hospital_id);
		});
	}

	_renderDataHistory = async (id, page, pageSz) => {
		let dataResult = await getHistoryAide(id, page, pageSz);
		this.setState({
			dataHistory: {
				...this.state.dataHistory,
				body: dataResult.data,
				totalPage: dataResult.totalPage
			}
		});
	}

	handleCloseModalCarrerDetail = () => {
		this.setState({
			openModalCarrerDetail: false,
			dataHistory: {
				...this.state.dataHistory,
				page: 1,
				idHistory: ""
			}
		});
	}

	_renderDataHistoryError = async (id, page, pageSz) => {
		let dataResult = await getFinedAide(id, page, pageSz);
		this.setState({
			dataHistoryError: {
				...this.state.dataHistoryError,
				body: dataResult.data,
				totalPage: dataResult.totalPage
			}
		});
		this.handleChange({ openModalCarrerDetail: true });
	}

	_renderReview = (data, value) => {
		var starArr = [];
		if(data[value] !== '-') {
			let rating = data[value] || 0;
			if (Number.isInteger(rating)) {
				_.times(rating, (i) => {
					starArr.push(<span className="fa fa-star text-danger" key={i}></span>);
				})
			} else {
				var gradeResult = rating.toString().split(".");
				_.times(gradeResult[0], (i) => {
					starArr.push(<span className="fa fa-star text-danger" key={i}></span>);
				})
				starArr.push(<span className="fa fa-star-half-o text-danger" key={""}></span>);
			}
		} else {
			starArr.push(<span className="" key={""}>-</span>)
		}
		return starArr;
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
		this.setState({
			isActive: true
		})
		this._renderDate(new Date());
		this._refreshData();
	}

	renderTextDate = () => {
		const { day, month, year, hours, minutes } = this.state.date;
		return (
			<span>{year}년 {month}월 {day}일 {hours}:{minutes}</span>
		);
	}

	onViewDetail = async (item, index, id) => {
		let dataResult = await getInfoAide(id);
		this.setState({
			caregiverId: id,
			dataInfo: {
				...this.state.dataInfo,
				body: dataResult.data.data
			},
			dataHistory: {
				...this.state.dataHistory,
				page: 1
			},
			dataHistoryError: {
				...this.state.dataHistoryError,
				page: 1
			}
		}, () => {
			this._renderDataHistory(id, this.state.dataHistory.page, this.state.dataHistory.pageSz);
			this._renderDataHistoryError(id, this.state.dataHistoryError.page, this.state.dataHistoryError.pageSz);
			
		});
	}

	
	handleFilterData = (dataSearch) => {
		const { pageSz } = this.state.dataTable;

		let dataFilter = {}
		
		if (dataSearch.valueArea && dataSearch.valueArea.value) {
			dataFilter.departRoom = dataSearch.valueArea.value;
		}
		if (dataSearch.valueRoom && dataSearch.valueRoom.value) {
			dataFilter.room_id = dataSearch.valueRoom.value;
		}

		if (dataSearch.careGiver_name && dataSearch.careGiver_name) {
			dataFilter.nameCareer = dataSearch.careGiver_name;
		}

		if (dataSearch.statusOff && dataSearch.statusOff) {
			dataFilter.statusOff = dataSearch.statusOff.value;
		}

		if (dataSearch.dateSort && dataSearch.dateSort) {
			dataFilter.dateSort = dataSearch.dateSort.value;
		}

		if (dataSearch.valueTypeRoom && dataSearch.valueTypeRoom) {
			dataFilter.typeRoom = dataSearch.valueTypeRoom.value;
		}
		this.setState({
			dataTable: {
				...this.state.dataTable,
				page: 1
			},
			dataFilter,
			isActive: true
		}, () => {
			this._renderDataTable(this.state.dataFilter, 1, pageSz, this.props.hospital_id);
		});
	}

	handleChangePage = (page) => {
		this.setState({
			dataHistory: {
				...this.state.dataHistory,
				page: page
			}
		}, () => {
			this._renderDataHistory(this.state.caregiverId, page, this.state.dataHistory.pageSz);
		});
	}

	handleChangePageHistoryError = (page) => {
		this.setState({
			dataHistoryError: {
				...this.state.dataHistoryError,
				page: page
			}
		}, () => {
			this._renderDataHistoryError(this.state.caregiverId, page, this.state.dataHistoryError.pageSz);
		});
	}

	setContentPopup = async (item, rec, status) => {
		let data = {
			data: [],
			info: {}
		};
		if(status === 2) {
			let response = await apiNoticeUserRecruitment(item);
			data = response;
		}
		this.setState({
			dataCareer: item,
			recruitment: rec,
			openModalChangeStatus: true,
			dataStatus:{
				data: data,
				status: status
			}
		});
	}

	onViewExit = (item, start) => {
		this.setState({
			...this.state,
			dataCareer: item,
			startUserRecruitment: start,
			openModalExit: true
		});
	}
	
	closeRecruitment = async (content) => {
		try {
			let data = this.state.dataTable.body;
			let response = await apiCloseRecruitment(this.state.dataCareer, content);
			toast.success(response.data.message);
			this.setState({
				openModalExit: false,
				isActive: true
			}, () => {
				let { page, pageSz } = this.state.dataTable;
				if(data.length === 1 && data[0].careers.length === 1 && this.state.dataTable.page !== 1) {
					this.setState({
						dataTable: {
							...this.state.dataTable,
							page: this.state.dataTable.page - 1 
						}
					});
					page = page - 1;
				}
				this._renderDataTable(this.state.dataFilter, page, pageSz, this.props.hospital_id);
			});
		} catch (ex) {
			console.log(ex);
		}	
	}

	handleChange = (data) => {
		this.setState({
			...data,
			data: {
				body: []
			}
		});
	}

	// updateValue = (e, name) => {
	// 	this.onHandleChange(e, name);
	// }

	// onHandleChange = (data, name) => {
	// 	var result = this.state.dataFilter;
	// 	result[name] = data;

	// 	this.setState({
	// 		dataFilter: {
	// 			...this.state.dataFilter,
	// 			...data
	// 		}
	// 	});
	// }

	optionModelCuren = () => {
		this._renderDataArea(this.props.hospital_id);
	}

	handleChangeIndex = (name, value, item, index) => {
		if(!isNaN(value)){
			let newData = [...this.state.data.body];
			let row = item;
			row[name] = value;
			newData[index] = row;
			this.setState({
				data: {
					body: newData
				}
			});
		}

	}

	handleClickSave = async () => {
		this.setState({
			isClick: true
		})
		const {body} = this.state.data
		const {dataPopup} = this.state
		let result = [], tmp = '', i = 0, j = 0;
		body.map((item) => {
			if(item !== undefined && item.value !== ''){
				tmp = {
					room_id: item.room_id,
					patient: item.value
				}
				result[i] = tmp;
				i++;
			}
			return item;
		})
		dataPopup.map((item) => {
			if(item !== undefined && item.value !== '') {
				j++;
			}
			return item;
		})

		try {
			if(i === 0 && j === 0) {
				toast.error('데이터를 입력하십시오');
				setTimeout(() => {
					this.setState({
						isClick: false
					})	
				}, 4000);
			} else {
				let response = await apiChangePrice(result);
				if (response.status === 200) {
					toast.success(response.data.message);
					this.setState({
						openModalCurrentNumber: false,
						isActive: true
					});
					const { page, pageSz } = this.state.dataTable;
					let t = this;
					setTimeout(() => {
						t._renderDataTable(this.state.dataFilter, page, pageSz, this.props.hospital_id);
						t.setState({
							isClick: false
						})
					}, 2000);
				}
			}
		} catch (ex) {
			console.log(ex);
		}	
	}	

	handleClickChangePrice = async (item, index, id, room, start) => {
		item.careers.map((career) => {
			if (career.id === id) {
				item.nameCareer = career.name;
			}
			return career;
		});
		let response = await loadPriceCurent(id);
		let responseHistory = await apiHistoryChange(room);
		let timeHistory = await apiHistoryChangeTime(id);
		this.setState({
			startUserRecruitment: start,
			historyChange: responseHistory.data.data,
			timeHistory: timeHistory.data.data,
			price: {
				curent: response.data.data.curent,
				bonus: response.data.data.bonus,
				aide: response.data.data.aide,
				room: response.data.data.room,
				area: response.data.data.area
			},
			openModal: true,
			dataCareer: room,
			dataCareerId: id,
		});
	}

	handleChangeFilter = async (data) => {
		// let dataPopup = [...dataDefault];
		let dataPopup = this.state.dataTmp;
		if (data.value !== "") {
			dataPopup = dataPopup.filter(item => item.name === data.value);
		}

		this.setState({
			dataPopup
		});
	}

	handleChangeNotice = async (content) => {
		try {
			let response = await apiChangeNotice(this.state.dataCareer, this.props.master_id, content);
			toast.success(response.data.message);
			this.setState({
				openModalChangeStatus: false,
				isActive: true
			}, () => {
				const { page, pageSz } = this.state.dataTable;
				this._renderDataTable(this.state.dataFilter, page, pageSz, this.props.hospital_id);
			});
		} catch (ex) {
			console.log(ex);
		}		
	}

	changePriceRecruitment = async (data) => {
		try {
			let response = await apiChangeTimeRectuitment(this.state.dataCareerId, data);
			if(response.data.data.length === 0) {
				toast.error(response.data.message)
			} else {
				toast.success(response.data.message);
				this.setState({
					openModal: false,
					isActive: true
				}, () => {
					const { page, pageSz } = this.state.dataTable;
					this._renderDataTable(this.state.dataFilter, page, pageSz, this.props.hospital_id);
				});
			}
		} catch (ex) {
			console.log(ex);
		}
	}

	sendTimeCheck = async (time, ad, area) => {
		try {	
			let dataResult = await getRoomChangePatient(this.props.hospital_id, time, ad, area);
			let dataPopup = dataResult.table;
			let dataTmp = dataResult.table;
			this.setState({
				dataPopup, 
				dataTmp
			});
		} catch (ex) {
			console.log(ex);
		}
	}

	changeSlaryBonus =  async (data) => {
		try {
			let response = await apiChangePriceRectuitment(data);
			toast.success(response.data.message);
			this.setState({
				openModal: false,
				changePrice:{},
				isActive: true
			}, () => {
				const { page, pageSz } = this.state.dataTable;
				this._renderDataTable(this.state.dataFilter, page, pageSz, this.props.hospital_id);
			});
		} catch (ex) {
			console.log(ex);
		}
	}

	render() {
		const { dataInfo, dataHistory, dataHistoryError, dataPopup, dataCareer, selectRoom, valueSelect, isActive } = this.state;
		var allPermission = checkAuth("rooms/status", this.props.user, ROLE.ALL, false) === true ? true : false;
		return (
			
				<div>
				<HeaderSearch
					// onHandleChange={this.onHandleChange}
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
							{allPermission === true ?
							<span
								className="btn btn-secondary btn-status"
								onClick={() => this.optionModelCuren()}
							>오늘환자수 </span>
							: ''}
						</p>
						<p className="text-opacity">※마지막 데이터 갱신시간입니다.</p>
					</div>
					<div className="wrapp-right">
						<table className="table table-bordered text-center">
							<thead>
								<tr>
									<th>운영 병실</th>
									<th>간병인수</th>
									<th>변동 요청</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{this.state.totalRoom}개</td>
									<td>{this.state.totalPatient}명</td>
									<td>{this.state.flucTuations}건</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div className="custom-table">
				<LoadingOverlay 
					active={isActive}
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
					<RoomStatusTable
						linkReccruitment={this.linkReccruitment}
						onViewDetail={this.onViewDetail}
						setContentPopup={this.setContentPopup}
						recruitment={this.state.recruitment}
						onViewExit={this.onViewExit}
						handleChangePage={this.handleChangePageDataTable}
						data={this.state.dataTable}
						openModalCarrerDetail={this.state.openModalCarrerDetail}
						openModalChangeStatus={this.state.openModalChangeStatus}
						openModalExit={this.state.openModalExit}
						openModalHistoryChange={this.state.openModalHistoryChange}
						handleChange={this.handleChange}
						handleClickChangePrice={this.handleClickChangePrice}
					/>
					</LoadingOverlay>
					<ModalCurrentNumber
						dataPopup={dataPopup}
						handleChangeIndex={this.handleChangeIndex}
						handleClickSave={this.handleClickSave}
						sendTimeCheck={this.sendTimeCheck}
						openModalCurrentNumber={this.state.openModalCurrentNumber}
						openModalDelete={this.state.openModalDelete}
						handleChange={this.handleChange}
						handleChangeFilter={this.handleChangeFilter}
						selectRoom={selectRoom}
						valueSelect={valueSelect}
						renderDataCode={this._renderDataAreaModal}
						id={this.props.hospital_id}
						isClick={this.state.isClick}
					/>
					<ModalChangePrice
						handleChange={this.handleChange}
						changePriceRecruitment={this.changePriceRecruitment}
						price={this.state.price}
						openModal={this.state.openModal}
						changeSlaryBonus={this.changeSlaryBonus}
						dataCareer={dataCareer}
						dataCareerId={this.state.dataCareerId}
						historyChange={this.state.historyChange}
						timeHistory={this.state.timeHistory}
						startUserRecruitment={this.state.startUserRecruitment}
					/>
					<ModalChangeStatus
						dataCareer={dataCareer}
						dataStatus={this.state.dataStatus}
						handleChange={this.handleChange}
						openModalChangeStatus={this.state.openModalChangeStatus}
						handleChangeNotice={this.handleChangeNotice}
						recruitment={this.state.recruitment}
					/>
					<ModalCarrerDetail
						dataInfo={dataInfo}
						dataHistoryError={dataHistoryError}
						dataHistory={dataHistory}
						handleChangePage={this.handleChangePage}
						handleChangePageHistoryError={this.handleChangePageHistoryError}
						openModalCarrerDetail={this.state.openModalCarrerDetail}
						handleChange={this.handleChange}
						handleCloseModalCarrerDetail={this.handleCloseModalCarrerDetail}
					/>
					<ModalExit
						handleChange={this.handleChange}
						openModalExit={this.state.openModalExit}
						closeRecruitment={this.closeRecruitment}
						startUserRecruitment={this.state.startUserRecruitment}
					/>
					<ModalHistoryChange
					/>
				</div>
				</div>
			
		);
	}
}

const mapStateToProps = (state) => {
	return {
		area_list: state.areaReducer.listArea === null ? null : state.areaReducer.listArea,
		master_id: state.authReducer.user.user.id === null ? null : state.authReducer.user.user.id,
		hospital_id: state.authReducer.user.user.hospital === null ? null : state.authReducer.user.user.hospital.id,
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user
	}
}

export default withRouter(connect(mapStateToProps)(RoomStatus));