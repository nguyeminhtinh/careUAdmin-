import React, { Component } from 'react';
import { PAGESIZEMODAL, ROLE } from '../../config.json';
import { getTableRoomHistory, getAddRating } from "../../services/history";
import Modal from 'react-bootstrap-modal';
import { Link } from 'react-router-dom';
import _ from "lodash";
import Rating from "./rating/rating";
import { toast } from "react-toastify";
import Pagination from '../common/pagination';
import HeaderSearchHistory from '../common/headerSearchHistory';
import moment from 'moment';
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import PulseLoader from 'react-spinners/PulseLoader';
import { formatNumber, checkAuth } from '../../services/functionService';

class History extends Component {
	constructor(props) {
		super(props);

		checkAuth("rooms/history", this.props.user, ROLE.VIEW, true);

		this.state = {
			isClick: false,
			dataHistory: {
				body: [],
				page: 1,
				pageSz: 1,
				totalPage: 0
			},
			isActive: true,
			career: {},
			openModalConfirm: false,
			rating: 0,
			historyFilter: {
				area_id: "",
				careGiver_name: "",
				month: "",
				numberRegister: "",
				phoneEnd: "",
				phoneFirst: "",
				phoneSecond: "",
				room_id: "",
				year: ""
			},
			selectData: {
				year: '',
				month: ''
			},
		}
	}

	async componentWillMount() {
		const { page, pageSz } = this.state.dataHistory;
		this._renderdataHistory(this.state.historyFilter, page, pageSz);
	}

	_renderdataHistory = async (filter, page, pageSz) => {
		try {
			let dataResult = await getTableRoomHistory(this.props.hospital_id, filter, page, pageSz);
			this.setState({
				dataHistory: {
					...this.state.dataHistory,
					body: dataResult.data,
					totalPage: dataResult.total,
				},
				isActive: false
			});
		} catch (error) {

		}
	}

	calculatorRowSpan = (item) => {
		var rowSpanRoom = item.rooms.length,
			total = 0;
		for (var i = 0; i < rowSpanRoom; i++) {
			var room = item.rooms[i];
			var rowSpanCareerRoom = room.user_room_recruitments.length;
			total = total + rowSpanCareerRoom;
		}
		return total;
	}

	handleChangeData = (data) => {
		this.setState({
			...data
		});
	}

	handleChangeClose = () => {
		this.setState({
			...this.state,
			openModalConfirm: false
		})
	}

	handleChangePage = (page) => {

		this.setState({
			dataHistory: {
				...this.state.dataHistory,
				page: page
			},

		}, () => {
			this._renderdataHistory(this.state.historyFilter, page, this.state.dataHistory.pageSz);
		});
		window.scrollTo(0, 0)
	};

	_renderLinkButton = (careGiver) => {
		if(checkAuth("rooms/history", this.props.user, ROLE.ALL, false) === true)
		{
			return (
				<button
					className="btn btn-primary approved btn-sm btn-table m-0"
					onClick={() => this.onShowStarModal(careGiver)}
				>평점</button>
			)
		}
		return '-'
	};

	onShowStarModal = (careGiverId) => {
		this.setState({
			openModalConfirm: true,
			idRating: careGiverId,
			rating: 0,
		});
	}

	handleSaveStar = async () => {
		try {
			if(this.state.rating === 0) {
				this.setState({
					isClick: true
				})
				toast.error('확인하기 전에 별표를 선택하십시오!');
				setTimeout(() => {
					this.setState({
						isClick: false
					})
				}, 3000);
			} else {
				let response = await getAddRating(this.state.idRating, this.props.master_id, (this.state.rating === 0 ? 0 : (this.state.rating/2)));
				toast.success(response.data.message);
				this.setState({
					openModalConfirm: false,
					isActive: true
				}, () => {
					const { page, pageSz } = this.state.dataHistory;
					this._renderdataHistory(this.state.historyFilter, page, pageSz);
				});
			}
		} catch (ex) {
			console.log(ex);
		}
	}


	handleFilterData = (dataSearch) => {
		const { pageSz } = this.state.dataHistory;
		let historyFilter = {
			year: '',
			month: '',
			area_id: '',
			room_id: '',
			careGiver_name: '',
			phoneFirst: '',
			phoneEnd: '',
			phoneSecond: '',
			numberRegister: ''
		}

		if (dataSearch.year && dataSearch.year) {
			historyFilter.year = dataSearch.year;
		}

		if (dataSearch.month && dataSearch.month) {
			historyFilter.month = dataSearch.month;
		}

		if (dataSearch.valueArea && dataSearch.valueArea.value) {
			historyFilter.area_id = dataSearch.valueArea.value;
		}
		if (dataSearch.valueRoom && dataSearch.valueRoom.value) {
			historyFilter.room_id = dataSearch.valueRoom.value;
		}

		if (dataSearch.careGiver_name && dataSearch.careGiver_name) {
			historyFilter.careGiver_name = dataSearch.careGiver_name;
		}

		if (dataSearch.phoneFirst && dataSearch.phoneFirst) {
			historyFilter.phoneFirst = dataSearch.phoneFirst;
		}

		if (dataSearch.phoneEnd && dataSearch.phoneEnd) {
			historyFilter.phoneEnd = dataSearch.phoneEnd;
		}

		if (dataSearch.phoneSecond && dataSearch.phoneSecond) {
			historyFilter.phoneSecond = dataSearch.phoneSecond;
		}

		if (dataSearch.numberRegister && dataSearch.numberRegister) {
			historyFilter.numberRegister = dataSearch.numberRegister;
		}

		this.setState({
			dataHistory: {
				...this.state.dataHistory,
				page: 1,
			},
			isActive: true,
			historyFilter,
		}, () => {
			this._renderdataHistory(this.state.historyFilter, 1, pageSz);
		});
	}

	renderOptionYear = () => {
		let year = moment().format('YYYY');
		let html = [{
			value: "",
			label: "선택"
		}];

		for (let i = 0; i <= 1; i++) {
			html.push({
				value: year - i,
				label: year - i + '년'
			});
		}
		return html;
	}

	renderOptionMonth = () => {
		let year = this.state.selectData.year;
		let yearCurrent = moment().format('YYYY');
		let monthCurrent = moment().format('MM');
		let length = 12;
		let html = [{
			value: "",
			label: "선택"
		}];

		if (parseInt(year) === parseInt(yearCurrent)) {
			length = parseInt(monthCurrent);
		}

		for (let i = 1; i <= parseInt(length); i++) {
			html.push({
				value: i,
				label: i + '월'
			});
		}

		return html;
	}

	renderModal = () => {
		return (
			<Modal className='modalPopup w-45'
				id="ModalConfirm"
				show={this.state.openModalConfirm}
				onHide={() => this.handleChangeClose()}
			>
				<Modal.Title className="mt-0">평점 팝업</Modal.Title>
				<p className="text-center">(0.5점 단위)</p>
				<div className="text-center border-t">
					<p>평점</p>

					<div className="rateyo">
						<Rating
							rating={this.state.rating}
							handleChangeData={this.handleChangeData}
						/>
					</div>

					<p>일할 때의 성실도, 친절함, 책임감을 <br />
						생각한 후 별점을 선택해 주세요.</p>
				</div>
				<div className="button-footer text-center mt-3">
					<button
						className="btn btn-primary"
						disabled={this.state.isClick}
						onClick={() => this.handleSaveStar()}
					>확인</button>
					<button
						className="btn btn-secondary"
						onClick={() => this.handleChangeClose()}
					>취소</button>
				</div>

			</Modal>
		)
	}

	_renderStar = (grade) => {
		var starArr = [];
		if(grade !== 0) {
			if (Number.isInteger(grade)) {
				_.times(grade, (i) => {
					starArr.push(<span className="fa fa-star text-danger" key={i}></span>);
				})
	
			} else {
				var gradeResult = grade.toString().split(".");
				_.times(gradeResult[0], (i) => {
					starArr.push(<span className="fa fa-star text-danger" key={i}></span>);
				})
				starArr.push(<span className="fa fa-star-half-o text-danger" key={""}></span>);
			}
		} else {
			starArr.push(<span key={""}>-</span>);
		}
		
		return starArr;
	}
	renderDataNull  = () =>{
		return (
			<span>-</span>
		)
	}
	
	selectYear = (year) => {
		this.setState({
			selectData: {
				...this.state.selectData,
				year: year
			}
		});
	}

	renderCellCareGiversHitory = (careGiver) => {
		return (
			<React.Fragment>
				<td>{careGiver.user.full_name}</td>
				<td>{careGiver.works_day ? careGiver.works_day : this.renderDataNull()}</td>
				<td>{careGiver.user.phone === null ? this.renderDataNull() : careGiver.user.phone }</td>
				<td>{careGiver.user.symbol === null ? this.renderDataNull() : careGiver.user.symbol}</td>
				<td>{careGiver.start_day === null ? this.renderDataNull() : careGiver.start_day}</td>
				<td>{careGiver.end_day === null ? this.renderDataNull() : careGiver.end_day}</td>
				<td>{careGiver.recruitment.salary === null ? this.renderDataNull() : formatNumber(careGiver.recruitment.salary)}</td>
				<td>{careGiver.user.address === null ? this.renderDataNull() : careGiver.user.address}</td>
				<td>{careGiver.reason_for_leave === '' || careGiver.reason_for_leave === null ? this.renderDataNull() : careGiver.reason_for_leave}</td>
				<td className="text-center">
					{
						careGiver.rating === null ? this._renderLinkButton(careGiver.id) : this._renderStar(careGiver.rating.rating)
					}
				</td>
			</React.Fragment>
		);
	}

	getCareGiverRowSpan = (item) => {
		if(item.rooms.length < 1 || item.rooms === undefined){
			return;
		}
		return (item.rooms[0].user_room_recruitments).length;
	}
	renderRowCareGiversHistory = (item, index) => {
		var arrRowCareGivers = [],
			room = item.rooms[index];
		if (!room)
			return;
		var spanCareGiver = this.getCareGiverRowSpan(item),
			careGivers = room.user_room_recruitments;
		for (var i = 1; i < spanCareGiver; i++) {
			arrRowCareGivers.push(
				<tr key={i}>
					{this.renderCellCareGiversHitory(careGivers[i])}
				</tr>
			);
		}
		return arrRowCareGivers;
	}

	renderRowRoomHistory = (rooms) => {
		var arrRowRooms = [];
		for (var i = 1; i < rooms.length; i++) {
			var room = rooms[i];
			let careGivers = room.user_room_recruitments;
			arrRowRooms.push(
				<tr key={i}>
					<td className="text-center s" rowSpan={careGivers.length}>
						<Link to={"/rooms/history/" + room.id} className="link-detail" >
							{room.name}호
						</Link>
					</td>
					{this.renderCellCareGiversHitory(room.user_room_recruitments[0])}
				</tr>
			);
			if (careGivers.length > 1) {
				for (var j = 1; j < careGivers.length; j++) {
					arrRowRooms.push(
						<tr key={j + j + i}>
							{this.renderCellCareGiversHitory(careGivers[j])}
						</tr>
					);
				}
			}
		}
		return arrRowRooms;
	}

	_renderPaging = () => {
		const { page, pageSz, totalPage } = this.state.dataHistory;

		if (totalPage > 0) {
			return (
				<Pagination
					totalPage={totalPage}
					handleChangePage={this.handleChangePage}
					page={page}
					pageSz={pageSz}
				/>
			);
		}
	}

	renderTableHistoryNoData = () => {
		const dataHistories = this.state.dataHistory.body;
		if (dataHistories.length === 0) {
			return (
				<tr key={0}>
					<td colSpan={12} className="bg-white text-center">데이터가 없습니다</td>
				</tr>
			);
		}
	}

	render() {
		const dataHistories = this.state.dataHistory.body;
		return (
			<div>
				<HeaderSearchHistory
					historyFilter={this.state.historyFilter}
					handleFilterData={this.handleFilterData}
					renderOptionYear={this.renderOptionYear}
					renderOptionMonth={this.renderOptionMonth}
					selectYear={this.selectYear}
				/>
				<LoadingOverlay 
					active={this.state.isActive}
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
				<div className="mt-5">
					<table className="table table-bordered align-middle text-center">
						<thead>
							<tr>
								<th>병동</th>
								<th>호실</th>
								<th>간병인</th>
								<th>근무일수</th>
								<th>휴대전화번호</th>
								<th>등록증번호</th>
								<th>시작일</th>
								<th>종료일</th>
								<th>금액</th>
								<th>주소</th>
								<th className="w140">종료 이유</th>
								<th>평점</th>
							</tr>
						</thead>
						<tbody>
							{
								dataHistories.length === 0 ?
									this.renderTableHistoryNoData() :dataHistories.map((item, index) => {
										return (
											<React.Fragment key={index}>
												<tr key={item.id}>
													<td className="text-center" rowSpan={this.calculatorRowSpan(item)}>{item.area_name}동</td>
													<td className="text-center" rowSpan={this.getCareGiverRowSpan(item)}>
														<Link to={"/rooms/history/" + item.rooms[0].id} className="link-detail">
															{item.rooms[0].name}호
														</Link>
													</td>
													{this.renderCellCareGiversHitory(item.rooms[0].user_room_recruitments[0])}
												</tr>
												{this.renderRowCareGiversHistory(item, 0)}
												
												{item.rooms.length > 1 && (this.renderRowRoomHistory(item.rooms))}
											</React.Fragment>
										)
									})
							}

						</tbody>
					</table>
				</div>
				</LoadingOverlay>
				{this._renderPaging()}
				{this.renderModal()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		master_id: state.authReducer.user.user.id === null ? null : state.authReducer.user.user.id,
		hospital_id: state.authReducer.user.user.hospital ? state.authReducer.user.user.hospital.id : state.authReducer.user.user.hospital,
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user
	}
}

export default connect(mapStateToProps)(History);