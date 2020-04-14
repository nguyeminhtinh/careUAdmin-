import _, { orderBy, sumBy } from "lodash";
import moment from 'moment';
import React, { Component } from 'react';
import Modal from 'react-bootstrap-modal';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import ModalPopup from '../../../components/common/modalPopup';
import Root from '../../../components/layout/root';
import SearchNotification from '../../../components/roomServices/notifications/search';
import ModalCarrerDetail from '../../../components/roomServices/modalCarrerDetail';
import TableNotification from '../../../components/roomServices/notifications/table';
import { getListNotification } from '../../../redux/actions/action';
import notificationService from '../../../services/notification';

import WithLoading from "../../../helpers/withLoading";
import { enhance } from "../../../helpers/enhance";

import { ROLE } from '../../../config.json';
import { checkAuth } from '../../../services/functionService';
import $ from 'jquery';
import ReactDOM from 'react-dom';

const ALL = 0;
const EMERGENCY = 1;
const LONGTIME = 2;
const SHORTTIME = 3;
const PAGESIZEMODAL = 5;
const STATUS_ACTIVE = 2;
const STATUS_EXPIRED = 4;

const notificationWithLoading = WithLoading(TableNotification)
class ListNotification extends Component {
	constructor(props) {
		super(props);

		checkAuth("rooms/notice", this.props.user, ROLE.VIEW, true);

		let paramsRequest = [
			{ title: "NO", value: "id", isHide: true, className: "d-none text-center" },
			{ title: "지원자", value: "name", className: "text-center" },
			{ title: "성별", value: "gender", className: "text-center" },
			{ title: "나이", value: "age", className: "text-center" },
			{ title: "평점", value: "grade", renderer: this._renderReview, className: "text-center" },
			{ title: "개인/그룹", value: "individualOrGroup", className: "text-center" },
			{ title: "상세정보", value: "", renderer: this._renderLinkDetailRequest, className: "text-center" }

		]

		let paramsRequest_1 = [...paramsRequest]
		let paramsRequest_2 = [...paramsRequest]
		let paramsRequest_3 = [...paramsRequest]
		

		let paramsApprove = [
			{ title: "NO", value: "id", isHide: true, className: "d-none text-center" },
			{ title: "지원자", value: "name", className: "text-center" },
			{ title: "성별", value: "gender", className: "text-center" },
			{ title: "나이", value: "age", className: "text-center" },
			{ title: "평점", value: "grade", renderer: this._renderReview, className: "text-center" },
			{ title: "개인/그룹", value: "individualOrGroup", className: "text-center" },
			{ title: "상세정보", value: "", renderer: this._renderLinkDetailApprove, className: "text-center" },

		]

		let paramsApprove_1 = [...paramsApprove]
		let paramsApprove_2 = [...paramsApprove]
		let paramsApprove_3 = [...paramsApprove]


		if(checkAuth("accounts/notice", this.props.user, ROLE.ALL, false) === true)
		{
			paramsRequest_1 = [...paramsRequest, { title: "승인", value: "", renderer: this._renderApprove_1_Button }]
			paramsRequest_2 = [...paramsRequest, { title: "승인", value: "", renderer: this._renderApprove_2_Button }]
			paramsRequest_3 = [...paramsRequest, { title: "승인", value: "", renderer: this._renderApprove_3_Button }]

			paramsApprove_1 = [...paramsApprove, { title: "승인", value: "", renderer: this._renderCancel_1_Button }, { title: "업무", value: "", renderer: this._renderStart_1_Button }]
			paramsApprove_2 = [...paramsApprove, { title: "승인", value: "", renderer: this._renderCancel_2_Button }, { title: "업무", value: "", renderer: this._renderStart_2_Button }]
			paramsApprove_3 = [...paramsApprove, { title: "승인", value: "", renderer: this._renderCancel_3_Button }, { title: "업무", value: "", renderer: this._renderStart_3_Button }]
		}

		let paramsdataHistory = [
			{ title: "NO", value: "id", className: "text-center" },
			{ title: "근무한 병원 명", value: "nameHospital", className: "text-center" },
			{ title: "동 호수", value: "departRoom", className: "text-center" },
			{ title: "근무 일시", value: "date", className: "text-center" },
			{ title: "병실", value: "room", className: "text-center" },
			{ title: "근무 형태", value: "status", className: "text-center" }
		]

		let paramsdataHistoryError = [
			{ title: "NO", value: "id", className: "w50 text-center" },
			{ title: "신청한 병원명", value: "nameHospital", className: "text-center w130" },
			{ title: "동 호수", value: "departRoom", className: "text-center w80" },
			{ title: "취소 일시", value: "date", className: "text-center w130" },
			{ title: "병실", value: "room", className: "text-center w60" },
			{ title: "근무 형태", value: "status", className: "text-center" },
			{ title: "하루 일당", value: "salary", className: "text-right" },
			{ title: "이유", value: "notes", className: "text-center" }
		]

		// let paramsdataInfor = [
		// 	{ title: "이름", value: "full_name", className: "text-center" },
		// 	{ title: "개인/그룹", value: "nameGroup", className: "text-center" },
		// 	{ title: "성별", value: "gender", className: "text-center" },
		// 	{ title: "나이", value: "ageName", className: "text-center" },
		// 	{ title: "내/외국인", value: "is_foreigner", className: "text-center" },
		// 	// { title: "휴대전화번호", value: "phone", className: "text-center" },
		// 	{ title: "평점", value: "avgRating", renderer: this._renderReview, className: "text-center" },
		// 	{ title: "사고", value: "countPenatly", className: "text-center" },
		// 	{ title: "패널티", value: "countAccident", className: "text-center" }
		// ]
		let paramsdataInfor = [
			{ title: "이름", value: "full_name", className: "text-center" },
			{ title: "성별", value: "gender", className: "text-center" },
			{ title: "나이", value: "ageName", className: "text-center" },
			{ title: "내/외국인", value: "is_foreigner", className: "text-center" },
			{ title: "휴대전화번호", value: "phone", className: "text-center" },
			{ title: "평점", value: "avgRating", renderer: this._renderReview, className: "text-center" },
			{ title: "사고", value: "countAccident", className: "text-center" },
			{ title: "패널티", value: "countPenatly", className: "text-center" }
		]

		this.state = {
			title: "병실공고",
			activeUser: true,
			listTab: [
				// { type: 0, name: "전체", value: notificationService.getTotalByType(ALL), active: true, prfix: "건" },
				// { type: 1, name: "긴급", value: notificationService.getTotalByType(EMERGENCY), active: false },
				// { type: 2, name: "장기", value: notificationService.getTotalByType(LONGTIME), active: false },
				// { type: 3, name: "단기(대근자)", value: notificationService.getTotalByType(SHORTTIME), active: false },
				{ type: 0, name: "전체", value: 0, active: true, prfix: "건" },
				{ type: 1, name: "긴급", value: 0, active: false },
				{ type: 2, name: "장기", value: 0, active: false },
				{ type: 3, name: "단기(대근자)", value: 0, active: false },

			],
			totalTypeNumber: [0, 0, 0, 0],
			listStatus: [
				{ name: "자세히 보기", isDetails: true, active: false },
				{ name: "|" },
				{ name: "간단히 보기", isDetails: false, active: true }
			],
			isDetails: false,
			listNotApprove_1: {
				params: paramsRequest_1,
				body: [],
				page: 1,
				pageSz: PAGESIZEMODAL,
				totalPage: 0
			},
			listApprove_1: {
				params: paramsApprove_1,
				body: [],
				page: 1,
				pageSz: PAGESIZEMODAL,
				totalPage: 0
			},
			listNotApprove_2: {
				params: paramsRequest_2,
				body: [],
				page: 1,
				pageSz: PAGESIZEMODAL,
				totalPage: 0
			},
			listApprove_2: {
				params: paramsApprove_2,
				body: [],
				page: 1,
				pageSz: PAGESIZEMODAL,
				totalPage: 0
			},
			listNotApprove_3: {
				params: paramsRequest_3,
				body: [],
				page: 1,
				pageSz: PAGESIZEMODAL,
				totalPage: 0
			},
			listApprove_3: {
				params: paramsApprove_3,
				body: [],
				page: 1,
				pageSz: PAGESIZEMODAL,
				totalPage: 0
			},
			openModalCarrerDetail: false,
			caregiverIdDetail: "",
			dataInfo: {
				params: paramsdataInfor,
				body: [],
				page: 1,
				pageSz: PAGESIZEMODAL,
				totalPage: 0
			},
			dataHistory: {
				params: paramsdataHistory,
				body: [],
				page: 1,
				pageSz: PAGESIZEMODAL,
				totalPage: 0
			},
			dataHistoryError: {
				params: paramsdataHistoryError,
				body: [],
				page: 1,
				pageSz: PAGESIZEMODAL,
				totalPage: 0
			},
			dataModalPopup: { isOpenModal: false, titleModal: "", messageModal: "" },
			data: {
				body: [],
				page: 1,
				pageSz: 3,
				totalPage: 0,
				totalDefault: 0
			},
			dataFilter: {
				area_id: "",
				room_id: "",
				type_id: "",
				start_day: "",
				emergency: "",
				work_type: "",
				//type: 0
			},
			openModalConfirm: false,
			dataCaregiverStart: {},
			indexNotificationStart: [],
			hospitalId: 0,
			isLoading: true,
			startClick: false
		}
	}

	componentWillMount() {
		const { page, pageSz } = this.state.data;
		let hospitalId = this.props.user.hospital.id || 1

		this.setState({
			...this.state,
			hospitalId,
			isLoading: true
		}, () => {
			this._renderData('', page, pageSz);
		})
	}

	_renderData = async (dataFilter, page, pageSz) => {
		let masterId = this.props.user.id;
		let dataResult = await notificationService.getNotifications(masterId, dataFilter, page, pageSz);
		let totalTypeNumber = [dataResult.totalDefault, dataResult.countEmergency, dataResult.countWorkLong, dataResult.countWorkShort]

		await this.setState({
			...this.state,
			data: {
				...this.state.data,
				body: dataResult.data,
				page: page,
				pageSz: pageSz,
				totalPage: dataResult.totalPage,
				totalDefault: dataResult.totalDefault
			},
			totalTypeNumber,
			isLoading: false
		}, () => {
		});
	}

	renderTab = () => {
		let html = [];

		this.state.listTab.map((item, index) => {
			html.push(
				<li
					key={index}
					className={item.active ? "active" : ""}
					onClick={() => this.handleClickTab(index, { type: item.type })}
				>
					{item.prfix === "건" ? item.name + " " + this.state.totalTypeNumber[index] + item.prfix : item.name + "(" + this.state.totalTypeNumber[index] + ")"}
				</li>
			);

			return item;
		});

		return html;
	}

	_renderReview = (data, value) => {
		var starArr = [];
		if(data[value] !== undefined && data[value] !== '-') {
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

	_renderLinkDetailRequest = (data, value) => {
		return (
			<div className="text-center">
				<span style={{ cursor: "pointer" }} onClick={() => this.handleLinkDetailRequest(data)}> 상세정보&#9660;</span>
			</div>
		)
	}

	_renderLinkDetailApprove = (data, value) => {
		return (
			<div className="text-center">
				<span style={{ cursor: "pointer" }} onClick={() => this.handleLinkDetailApprove(data)}> 상세정보&#9660;</span>
			</div>
		)
	}

	_renderApprove_1_Button = (data, value) => {
		if(data.statusOfRecruitment === STATUS_ACTIVE)
		{
			return (
				<div className="text-center">
					<button
						className="btn btn-primary"
						onClick={() => this.handleApprove_1_Button(data)}
					>승인</button>

				</div>
			);
		}
	}

	_renderApprove_2_Button = (data, value) => {
		if(data.statusOfRecruitment === STATUS_ACTIVE)
		{
			return (
				<div className="text-center">
					<button
						className="btn btn-primary"
						onClick={() => this.handleApprove_2_Button(data)}
					>승인</button>

				</div>
			);
		}
	}

	_renderApprove_3_Button = (data, value) => {
		if(data.statusOfRecruitment === STATUS_ACTIVE)
		{
			return (
				<div className="text-center">
					<button
						className="btn btn-primary"
						onClick={() => this.handleApprove_3_Button(data)}
					>승인</button>

				</div>
			);
		}
	}

	_renderCancel_1_Button = (data, value) => {
		if(data.statusOfRecruitment === STATUS_ACTIVE || data.statusOfRecruitment === STATUS_EXPIRED)
		{
			if (data.startTime) {
				return (
					<div className="text-center">
						<button
							disabled
							className="btn btn-primary not-allowed"
							onClick={() => this.handleCancel_1_Button(data)}
						>취소</button>

					</div>
				);
			}

			return (
				<div className="text-center">
					<button
						className="btn btn-primary"
						onClick={() => this.handleCancel_1_Button(data)}
					>취소</button>

				</div>
			);
		}
	}

	_renderCancel_2_Button = (data, value) => {
		if(data.statusOfRecruitment === STATUS_ACTIVE || data.statusOfRecruitment === STATUS_EXPIRED)
		{
			if (data.startTime) {
				return (
					<div className="text-center">
						<button
							disabled
							className="btn btn-primary not-allowed"
							onClick={() => this.handleCancel_2_Button(data)}
						>취소</button>

					</div>
				);
			}

			return (
				<div className="text-center">
					<button
						className="btn btn-primary"
						onClick={() => this.handleCancel_2_Button(data)}
					>취소</button>

				</div>
			);
		}
	}
	_renderCancel_3_Button = (data, value) => {
		if(data.statusOfRecruitment === STATUS_ACTIVE || data.statusOfRecruitment === STATUS_EXPIRED)
		{
			if (data.startTime) {
				return (
					<div className="text-center">
						<button
							disabled
							className="btn btn-primary not-allowed"
							onClick={() => this.handleCancel_3_Button(data)}
						>취소</button>

					</div>
				);
			}

			return (
				<div className="text-center">
					<button
						className="btn btn-primary"
						onClick={() => this.handleCancel_3_Button(data)}
					>취소</button>

				</div>
			);
		}
	}

	_renderStart_1_Button = (data, value) => {
		if(data.statusOfRecruitment === STATUS_ACTIVE || data.statusOfRecruitment === STATUS_EXPIRED)
		{
			if (data.startTime) {
				return (
					<time className="d-block text-center">{data.startTime}</time>
				)
			}

			return (
				<div className="text-center">
					<button
						className="btn btn-primary"
						onClick={() => this.handleStart_1_Button(data)}
					>시작</button>

				</div>
			);
		}
	}

	_renderStart_2_Button = (data, value) => {
		if(data.statusOfRecruitment === STATUS_ACTIVE || data.statusOfRecruitment === STATUS_EXPIRED)
		{
			if (data.startTime) {
				return (
					<time className="d-block text-center">{data.startTime}</time>
				)
			}

			return (
				<div className="text-center">
					<button
						className="btn btn-primary"
						onClick={() => this.handleStart_2_Button(data)}
					>시작</button>

				</div>
			);
		}
	}
	_renderStart_3_Button = (data, value) => {
		if(data.statusOfRecruitment === STATUS_ACTIVE || data.statusOfRecruitment === STATUS_EXPIRED)
		{
			if (data.startTime) {
				return (
					<time className="d-block text-center">{data.startTime}</time>
				)
			}

			return (
				<div className="text-center">
					<button
						className="btn btn-primary"
						onClick={() => this.handleStart_3_Button(data)}
					>시작</button>

				</div>
			);
		}
	}

	handleApprove_1_Button = async (data) => {
		let notification = this.state.data.body[0];
		let numberCaregiver = notification.count_female_aide + notification.count_male_aide;

		if (!this.validateNumberCaregiverApprove(numberCaregiver, this.state.listApprove_1)) {
			return;
		}

		if (!this.validateGenderCaregiverApprove(data, notification, this.state.listApprove_1.body)) {
			return;
		}

		this.setState({
			...this.state,
			isLoading: true
		}, async () => {
			let response = await notificationService.approveCaregiver(notification.id, data.id)

			if (response.status === 200 && response.data.data != '') {
				let { listNotApprove_1, listApprove_1 } = await this.renderListDetail_1();
				this.setState({
					...this.state,
					listNotApprove_1: {
						...this.state.listNotApprove_1,
						body: listNotApprove_1.data,
						page: 1,
						totalPage: listNotApprove_1.totalPage
					},
					listApprove_1: {
						...this.state.listApprove_1,
						body: listApprove_1.data,
						page: 1,
						totalPage: listApprove_1.totalPage
					},
					startClick: false
				})

				let total = listApprove_1.totalPage > 0 ? listApprove_1.totalPage : listNotApprove_1.totalPage;
				$('.number_1').text(total)

				toast.success('데이터가 업데이트 되었습니다', { autoClose: 3000 });
			}else {
				toast.error(response.data.message, { autoClose: 3000 });
			}

			this.setState({
				...this.state,
				isLoading: false
			})
		})
	}

	handleApprove_2_Button = async (data) => {
		let notification = this.state.data.body[1];
		let numberCaregiver = notification.count_female_aide + notification.count_male_aide;

		if (!this.validateNumberCaregiverApprove(numberCaregiver, this.state.listApprove_2)) {
			return;
		}

		if (!this.validateGenderCaregiverApprove(data, notification, this.state.listApprove_2.body)) {
			return;
		}

		this.setState({
			...this.state,
			isLoading: true
		}, async () => {
			let response = await notificationService.approveCaregiver(notification.id, data.id)

			if (response.status === 200 && response.data.data != '') {
				let { listNotApprove_2, listApprove_2 } = await this.renderListDetail_2();
				this.setState({
					...this.state,
					listNotApprove_2: {
						...this.state.listNotApprove_2,
						body: listNotApprove_2.data,
						totalPage: listNotApprove_2.totalPage
					},
					listApprove_2: {
						...this.state.listApprove_2,
						body: listApprove_2.data,
						totalPage: listApprove_2.totalPage
					},
					startClick: false
				})

				let total = listApprove_2.totalPage > 0 ? listApprove_2.totalPage : listNotApprove_2.totalPage;
				$('.number_2').text(total)

				toast.success('데이터가 업데이트 되었습니다', { autoClose: 3000 });
			}else {
				toast.error(response.data.message, { autoClose: 3000 });
			}

			this.setState({
				...this.state,
				isLoading: false
			})
		});
	}

	handleApprove_3_Button = async (data) => {
		let notification = this.state.data.body[2];
		let numberCaregiver = notification.count_female_aide + notification.count_male_aide;

		if (!this.validateNumberCaregiverApprove(numberCaregiver, this.state.listApprove_3)) {
			return;
		}

		if (!this.validateGenderCaregiverApprove(data, notification, this.state.listApprove_3.body)) {
			return;
		}
		this.setState({
			...this.state,
			isLoading: true
		}, async () => {
			let response = await notificationService.approveCaregiver(notification.id, data.id)

			if (response.status === 200 && response.data.data != '') {
				let { listNotApprove_3, listApprove_3 } = await this.renderListDetail_3();
				this.setState({
					...this.state,
					listNotApprove_3: {
						...this.state.listNotApprove_3,
						body: listNotApprove_3.data,
						totalPage: listNotApprove_3.totalPage
					},
					listApprove_3: {
						...this.state.listApprove_3,
						body: listApprove_3.data,
						totalPage: listApprove_3.totalPage
					},
					startClick: false
				})

				let total = listApprove_3.totalPage > 0 ? listApprove_3.totalPage : listNotApprove_3.totalPage;
				$('.number_3').text(total)

				toast.success('데이터가 업데이트 되었습니다', { autoClose: 3000 });
			}else {
				toast.error(response.data.message, { autoClose: 3000 });
			}

			this.setState({
				...this.state,
				isLoading: false
			})
		})
	}

	validateNumberCaregiverApprove = (numberCaregiver, listApprove) => {
		// let numberCaregiver = sumBy(dataCaregiverNofication, "value")
		if (numberCaregiver === listApprove.totalPage) {
			this.setState({
				...this.state,
				dataModalPopup: {
					isOpenModal: true,
					titleModal: "인원이 맞지 않을 때",
					messageModal: "인원이 맞지 않습니다. 확인 후 다시 승인해주세요"
				}
			})
			return false;
		}

		return true;
	}

	validateGenderCaregiverApprove = (dataCaregiverRequest, dataCaregiverNofication, listApprove) => {
		let numberCaregiverMale = dataCaregiverNofication.count_male_aide;
		let numberCaregiverFemale = dataCaregiverNofication.count_female_aide;

		let numberCaregiverMaleApprove = sumBy(listApprove, item => { return item.gender === "남자" })
		let numberCaregiverFemaleApprove = sumBy(listApprove, item => { return item.gender === "여자" })

		//Validate number cadidate Female approve
		let isCheckGender = true;
		let gender = "여자";
		if (dataCaregiverRequest.gender === "여자") {
			if (numberCaregiverFemale === numberCaregiverFemaleApprove) {
				isCheckGender = false;
			}
		} else if (numberCaregiverMale === numberCaregiverMaleApprove) {
			isCheckGender = false;
			gender = "남자"
		}
		if (!isCheckGender) {

			this.setState({
				...this.state,
				dataModalPopup: {
					isOpenModal: true,
					titleModal: "성별이 맞지 않을 때",
					messageModal: gender + "간병인은 여자병실에 지원할 수 없습니다. 확인 후 다시 승인해주세요"
				}
			})
			return false;
		}

		return true;

	}

	handleCancel_1_Button = async (data) => {

		let notification = this.state.data.body[0];
		this.setState({
			...this.state,
			isLoading: true
		}, async () => {
			let response = await notificationService.cancelCaregiver(notification.id, data.id)

			if (response.status === 200) {
				let { listNotApprove_1, listApprove_1 } = await this.renderListDetail_1();
				this.setState({
					...this.state,
					listNotApprove_1: {
						...this.state.listNotApprove_1,
						body: listNotApprove_1.data,
						page: 1,
						totalPage: listNotApprove_1.totalPage
					},
					listApprove_1: {
						...this.state.listApprove_1,
						body: listApprove_1.data,
						page: 1,
						totalPage: listApprove_1.totalPage
					},
					isLoading: false,
					startClick: false
				})

				let total = listApprove_1.totalPage > 0 ? listApprove_1.totalPage : listNotApprove_1.totalPage;
				$('.number_1').text(total)

				toast.success('데이터가 업데이트 되었습니다', { autoClose: 3000 });
			}

		})
	}

	handleCancel_2_Button = async (data) => {
		let notification = this.state.data.body[1];
		let response = await notificationService.cancelCaregiver(notification.id, data.id)

		if (response.status === 200) {
			let { listNotApprove_2, listApprove_2 } = await this.renderListDetail_2();
			this.setState({
				...this.state,
				listNotApprove_2: {
					...this.state.listNotApprove_2,
					body: listNotApprove_2.data,
					totalPage: listNotApprove_2.totalPage
				},
				listApprove_2: {
					...this.state.listApprove_2,
					body: listApprove_2.data,
					totalPage: listApprove_2.totalPage
				},
				startClick: false
			})

			let total = listApprove_2.totalPage > 0 ? listApprove_2.totalPage : listNotApprove_2.totalPage;
			$('.number_2').text(total)

			toast.success('데이터가 업데이트 되었습니다', { autoClose: 3000 });
		}
	}
	handleCancel_3_Button = async (data) => {
		let notification = this.state.data.body[2];
		let response = await notificationService.cancelCaregiver(notification.id, data.id)

		if (response.status === 200) {
			let { listNotApprove_3, listApprove_3 } = await this.renderListDetail_3();
			this.setState({
				...this.state,
				listNotApprove_3: {
					...this.state.listNotApprove_3,
					body: listNotApprove_3.data,
					totalPage: listNotApprove_3.totalPage
				},
				listApprove_3: {
					...this.state.listApprove_3,
					body: listApprove_3.data,
					totalPage: listApprove_3.totalPage
				},
				startClick: false
			})

			let total = listApprove_3.totalPage > 0 ? listApprove_3.totalPage : listNotApprove_3.totalPage;
			$('.number_3').text(total)

			toast.success('데이터가 업데이트 되었습니다', { autoClose: 3000 });
		}
	}

	handleStart_1_Button = (data) => {
		this.setState({
			...this.state,
			dataCaregiverStart: data,
			openModalConfirm: true,
			indexNotificationStart: 0,
			startClick: true
		})
	}

	handleStart_2_Button = (data) => {
		this.setState({
			...this.state,
			dataCaregiverStart: data,
			openModalConfirm: true,
			indexNotificationStart: 1,
			startClick: true
		})
	}

	handleStart_3_Button = (data) => {
		this.setState({
			dataCaregiverStart: data,
			openModalConfirm: true,
			indexNotificationStart: 2,
			startClick: true
		})
	}

	handleRenderDetail = async (data) =>{
		let dataResult = await notificationService.getDetailAide(data);
		this.setState({
			dataInfo: {
				...this.state.dataInfo,
				body: dataResult
			}
		})
	}

	handleLinkDetailRequest = (data) => {
		this.handleRenderDetail(data.id);
		this.handleChangePageHistory(data.id);
		this.handleChangePageHistoryError(data.id);
		this.setState({
			...this.state,
			caregiverIdDetail: data.id,
			openModalCarrerDetail: true
		})
	}

	handleLinkDetailApprove = (data) => {
		this.handleRenderDetail(data.id);
		this.handleChangePageHistory(data.id);
		this.handleChangePageHistoryError(data.id);
		this.setState({
			...this.state,
			caregiverIdDetail: data.id,
			openModalCarrerDetail: true
		})
	}

	renderStatus = () => {
		let html = [];

		this.state.listStatus.map((item, index) => {
			if (item.hasOwnProperty("isDetails")) {
				html.push(
					<li
						key={index}
						className={item.active ? "active" : ""}
						onClick={() => this.handleClickStatus(index, item.isDetails)}
					>{item.name}</li>
				);

			} else {
				html.push(
					<li
						key={index}
					>{item.name}</li>
				);

			}

			return item;
		});

		return html;
	}

	handleClickTab = (index, data) => {
		let listTab = this.state.listTab;

		listTab.map((item, key) => {
			item.active = false;

			if (index === key) {
				item.active = true;
			}

			return item;
		});

		switch(data.type) {
			case 1:
				this.state.dataFilter.emergency = 2;
				this.state.dataFilter.work_type = '';
				break;
			case 2:
				this.state.dataFilter.work_type = 1;
				this.state.dataFilter.emergency = '';
				break;
			case 3:
				this.state.dataFilter.work_type = 2;
				this.state.dataFilter.emergency = '';
				break;
			default:
				this.state.dataFilter.emergency = '';
				this.state.dataFilter.work_type = '';
				break;
		}

		this.setState({
			listTab,
			dataFilter: {
				...this.state.dataFilter,
				...data
			}
		}, () => {
			this._renderData(this.state.dataFilter, 1, this.state.data.pageSz);
			if(this.state.isDetails)
			{
				this.renderListDetail();
			}else{
				$('.arrow-up').each(function(item){
					$(this).removeClass('arrow-up');
				});
			}
		});
	}

	handleClickStatus = (index, isDetails) => {
		let listStatus = this.state.listStatus;

		listStatus.map((item, key) => {
			item.active = false;

			if (index === key) {
				item.active = true;
			}

			return item;
		});

		this.setState({
			...this.state,
			listStatus,
			isDetails
		}, () => {
			if (isDetails) {
				this.renderListDetail();
			}else {
				$('.arrow-up').each(function(item){
					$(this).removeClass('arrow-up');
				});
			}

			//this._renderData(this.state.dataFilter, this.state.data.page, this.state.data.pageSz);
		});
	}

	renderListDetail = async () => {

		let listNotApprove_1 = [];
		let listApprove_1 = [];
		let listNotApprove_2 = [];
		let listApprove_2 = [];
		let listNotApprove_3 = [];
		let listApprove_3 = [];

		({ listNotApprove_1, listApprove_1 } = await this.renderListDetail_1());
		({ listNotApprove_2, listApprove_2 } = await this.renderListDetail_2());
		({ listNotApprove_3, listApprove_3 } = await this.renderListDetail_3());

		this.setState({
			...this.state,
			listNotApprove_1: {
				...this.state.listNotApprove_1,
				body: listNotApprove_1.data,
				totalPage: listNotApprove_1.totalPage
			},
			listApprove_1: {
				...this.state.listApprove_1,
				body: listApprove_1.data,
				totalPage: listApprove_1.totalPage
			},
			listNotApprove_2: {
				...this.state.listNotApprove_2,
				body: listNotApprove_2.data,
				totalPage: listNotApprove_2.totalPage
			},
			listApprove_2: {
				...this.state.listApprove_2,
				body: listApprove_2.data,
				totalPage: listApprove_2.totalPage
			},
			listNotApprove_3: {
				...this.state.listNotApprove_3,
				body: listNotApprove_3.data,
				totalPage: listNotApprove_3.totalPage
			},
			listApprove_3: {
				...this.state.listApprove_3,
				body: listApprove_3.data,
				totalPage: listApprove_3.totalPage
			},
		});
	}

	handleChangePage = (page) => {
		this.setState({
			data: {
				...this.state.data,
				page
			},
			listNotApprove_1: {
				...this.state.listNotApprove_1,
				page: 1
			},
			listNotApprove_2: {
				...this.state.listNotApprove_2,
				page: 1
			},
			listNotApprove_3: {
				...this.state.listNotApprove_3,
				page: 1
			}
		}, () => {
			this._renderData(this.state.dataFilter, page, this.state.data.pageSz);
		});
		window.scrollTo(0, 0);
	}

	handleChangeDataFilter = (data, name) => {
		var result = this.state.dataFilter;
		result[name] = data;
		this.setState({
			dataFilter: {
				...this.state.dataFilter,
				...data
			}
		});
	}

	handleSubmitFilter = (dataSearch) => {
		const { pageSz } = this.state.data;
		let dataFilter = {}

		if (dataSearch.valueArea && dataSearch.valueArea.value) {
			dataFilter.area_id = dataSearch.valueArea.value;
		}
		if (dataSearch.valueRoom && dataSearch.valueRoom.value) {
			dataFilter.room_id = dataSearch.valueRoom.value;
		}
		if (dataSearch.endDaySort && dataSearch.endDaySort.value) {
			dataFilter.start_day = dataSearch.endDaySort.value;
		}
		if (dataSearch.valueTypeRoom && dataSearch.valueTypeRoom.value) {
			dataFilter.type_id = dataSearch.valueTypeRoom.value;
		}

		this.setState({
			data: {
				...this.state.data,
				page: 1
			},
			dataFilter
		}, () => {
			this._renderData(this.state.dataFilter, 1, pageSz);
		});
	}

	handleChangePageListNotApprove_1 = async (page) => {
		let dataList = this.state.data.body;
		let listNotApprove_1 = await notificationService.getCaregiverOnRequests(dataList[0].id, page, PAGESIZEMODAL)
		this.setState({
			...this.state,
			listNotApprove_1: {
				...this.state.listNotApprove_1,
				body: listNotApprove_1.data,
				page: page,
				totalPage: listNotApprove_1.totalPage
			}
		})

	}

	handleChangePageListApprove_1 = async (page) => {
		let dataList = this.state.data.body;
		let listApprove_1 = await notificationService.getCaregiverApprove(dataList[0].id, page, PAGESIZEMODAL)
		this.setState({
			...this.state,
			listApprove_1: {
				...this.state.listApprove_1,
				body: listApprove_1.data,
				page: page,
				totalPage: listApprove_1.totalPage
			}
		})

	}

	handleChangePageListNotApprove_2 = async (page) => {
		let dataList = this.state.data.body;
		let listNotApprove_2 = await notificationService.getCaregiverOnRequests(dataList[1].id, page, PAGESIZEMODAL)
		this.setState({
			listNotApprove_2: {
				...this.state.listNotApprove_2,
				body: listNotApprove_2.data,
				page: page,
				totalPage: listNotApprove_2.totalPage
			}
		})

	}

	handleChangePageListApprove_2 = async (page) => {
		let dataList = this.state.data.body;
		let listApprove_2 = await notificationService.getCaregiverApprove(dataList[1].id, page, PAGESIZEMODAL)
		this.setState({
			listApprove_2: {
				...this.state.listApprove_2,
				body: listApprove_2.data,
				page: page,
				totalPage: listApprove_2.totalPage
			}
		})

	}

	handleChangePageListNotApprove_3 = async (page) => {
		let dataList = this.state.data.body;
		let listNotApprove_3 = await notificationService.getCaregiverOnRequests(dataList[2].id, page, PAGESIZEMODAL)
		this.setState({
			listNotApprove_3: {
				...this.state.listNotApprove_3,
				body: listNotApprove_3.data,
				page: page,
				totalPage: listNotApprove_3.totalPage
			}
		})

	}

	handleChangePageListApprove_3 = async (page) => {
		let dataList = this.state.data.body;
		let listApprove_3 = await notificationService.getCaregiverApprove(dataList[2].id, page, PAGESIZEMODAL)
		this.setState({
			listApprove_3: {
				...this.state.listApprove_3,
				body: listApprove_3.data,
				page: page,
				totalPage: listApprove_3.totalPage
			}
		})

	}

	handleChange = () => {
		this.setState({
			...this.state,
			openModalCarrerDetail: false,
		})
		setTimeout(() => {
			this.setState({
				dataHistory: {
					...this.state.dataHistory,
					body: [],
					totalPage: 0,
					page: 1,
				},
				dataHistoryError: {
					...this.state.dataHistoryError,
					body: [],
					totalPage: 0,
					page: 1,
				}
			})	
		}, 1000);
	}
 
	handleChangeClose = () => {
		this.setState({
			...this.state,
			openModalConfirm: false
		})
	}

	handleChangePageHistory = async (data, page = 1) => {
		let result = await notificationService.getCaregiverHistory(data, page, PAGESIZEMODAL);
		this.setState({
			...this.state,
			dataHistory: {
				...this.state.dataHistory,
				//  body: orderBy(result.data, ['id'], ['desc']),
				body: result.data,
				totalPage: result.totalPage
			}
		})

	}

	handleChangePageHistoryError = async (data, page = 1) => {
		let result = await notificationService.getCaregiverHistoryError(data, page, PAGESIZEMODAL);
		this.setState({
			...this.state,
			dataHistoryError: {
				...this.state.dataHistoryError,
				// body: orderBy(result.data, ['id'], ['desc']),
				body: result.data,
				totalPage: result.totalPage
			}
		})
	}
	
	// page
	handleChangePageHistoryPage = (page) => {
		this.setState({
			dataHistory: {
				...this.state.dataHistory,
				page: page
			}
		})
		this.handleChangePageHistory(this.state.caregiverIdDetail, page)
	}

	// page
	handleChangePageHistoryErrorPage = (page) => {
		this.setState({
			dataHistoryError: {
				...this.state.dataHistoryError,
				page: page
			}
		})
		this.handleChangePageHistoryError(this.state.caregiverIdDetail, page)
	}

	handleCloseModalError = () => {
		this.setState({
			...this.state,
			dataModalPopup: {
				...this.state.dataModalPopup,
				isOpenModal: false
			}
		})

	}

	renderDate = () => {
		return moment().format('YYYY-MM-DD HH:mm');
	}

	renderDateStart = () => {
		var dateStart = this.refs.dateStart !== undefined ? ReactDOM.findDOMNode(this.refs.dateStart).value : moment().format('YYYY-MM-DD HH:mm');
		return dateStart;
	}

	handleSaveStartTime = async (dateTime) => {
		let data = {
			user_id: this.state.dataCaregiverStart.id,
			start_day: dateTime
		}
		let indexNotification = this.state.indexNotificationStart

		this.setState({
			...this.state,
			isLoading: true,
			openModalConfirm: false

		}, async () => {
			let response = await notificationService.startCaregiver(this.state.data.body[indexNotification].id, data)

			if (response.status === 200) {
				this.renderListDetailByIndex(indexNotification + 1);
			}
		})

		// let dataApp = this.state.indexNotificationStart
		// let indexData = findIndex(dataApp, item => item.id === this.state.dataCaregiverStart.id)
		// let obj = dataApp[indexData];
		// obj['startTime'] = dateTime;
		// obj['cancel'] = true;
	}

	renderModal = () => {
		return (
			<Modal className='modalPopup w-45'
				id="ModalConfirm"
				show={this.state.openModalConfirm}
				onHide={() => this.handleChangeClose()}
			>
				<div>
					<p className="text-center">이영자 간병인님 업무를 시작하시겠습니까?</p>
					<div>
						<input type="text"
							disabled
							className="form-control text-center opacity1"
							value={this.renderDate()}
							ref="dateStart"							
						/></div>
					<div className="button-footer text-center mt-3">
						<button
							className="btn btn-primary"
							onClick={() => this.handleSaveStartTime(this.renderDateStart())}
						>확인</button>
						<button
							className="btn btn-secondary"
							onClick={() => this.handleChangeClose()}
						>취소</button>
					</div>
				</div>
			</Modal>
		)
	}


	async renderListDetail_3() {
		let dataList = this.state.data.body;
		let listNotApprove_3 = [], listApprove_3 = [];
		if (dataList[2] && dataList[2].id) {
			listNotApprove_3 = await notificationService.getCaregiverOnRequests(dataList[2].id);

			if(!this.state.startClick)
			{
				listApprove_3 = await notificationService.getCaregiverApprove(dataList[2].id);
				this.setState({
					...this.state,
					listApprove_3: {
						...this.state.listApprove_3,
						page: 1
					},
				})
			}else {
				listApprove_3 = await notificationService.getCaregiverApprove(dataList[2].id, this.state.listApprove_3.page, PAGESIZEMODAL);
			}
		}
		return { listNotApprove_3, listApprove_3 };
	}

	async renderListDetail_2() {
		let dataList = this.state.data.body;
		let listNotApprove_2 = [], listApprove_2 = [];
		if (dataList[1] && dataList[1].id) {
			listNotApprove_2 = await notificationService.getCaregiverOnRequests(dataList[1].id);
			if(!this.state.startClick)
			{
				listApprove_2 = await notificationService.getCaregiverApprove(dataList[1].id);
				this.setState({
					...this.state,
					listApprove_2: {
						...this.state.listApprove_2,
						page: 1
					},
				})
			}else {
				listApprove_2 = await notificationService.getCaregiverApprove(dataList[1].id, this.state.listApprove_2.page, PAGESIZEMODAL);
			}
		}
		return { listNotApprove_2, listApprove_2 };
	}

	async renderListDetail_1() {
		let dataList = this.state.data.body;
		let listNotApprove_1 = [], listApprove_1 = [];

		if (dataList[0] && dataList[0].id) {
			listNotApprove_1 = await notificationService.getCaregiverOnRequests(dataList[0].id);

			if(!this.state.startClick)
			{
				listApprove_1 = await notificationService.getCaregiverApprove(dataList[0].id);
				this.setState({
					...this.state,
					listApprove_1: {
						...this.state.listApprove_1,
						page: 1
					},
				})
			}else {
				listApprove_1 = await notificationService.getCaregiverApprove(dataList[0].id, this.state.listApprove_1.page, PAGESIZEMODAL);
			}
			
		}
		return { listNotApprove_1, listApprove_1 };
	}

	async renderListDetailByIndex(indexNotification) {
		switch (indexNotification) {
			case 1:
				this.setState({
					...this.state,
					isLoading: true
				}, async () => {
					let { listNotApprove_1, listApprove_1 } = await this.renderListDetail_1();
					this.setState({
						...this.state,
						listNotApprove_1: {
							...this.state.listNotApprove_1,
							body: listNotApprove_1.data,
							page : 1,
							totalPage: listNotApprove_1.totalPage
						},
						listApprove_1: {
							...this.state.listApprove_1,
							body: listApprove_1.data,
							page : this.state.startClick ? this.state.listApprove_1.page : 1,
							totalPage: listApprove_1.totalPage
						},
						isLoading: false,
						startClick: false
					})
				})

				break;
			case 2:
				let { listNotApprove_2, listApprove_2 } = await this.renderListDetail_2();
				this.setState({
					...this.state,
					listNotApprove_2: {
						...this.state.listNotApprove_2,
						body: listNotApprove_2.data,
						page : 1,
						totalPage: listNotApprove_2.totalPage
					},
					listApprove_2: {
						...this.state.listApprove_2,
						body: listApprove_2.data,
						page : this.state.startClick ? this.state.listApprove_2.page : 1,
						totalPage: listApprove_2.totalPage,
					},
					isLoading: false,
					startClick: false
				})
				break;
			case 3:
				let { listNotApprove_3, listApprove_3 } = await this.renderListDetail_3();
				this.setState({
					...this.state,
					listNotApprove_3: {
						...this.state.listNotApprove_3,
						body: listNotApprove_3.data,
						page : 1,
						totalPage: listNotApprove_3.totalPage
					},
					listApprove_3: {
						...this.state.listApprove_3,
						body: listApprove_3.data,
						page : this.state.startClick ? this.state.listApprove_3.page : 1,
						totalPage: listApprove_3.totalPage
					},
					isLoading: false,
					startClick: false
				})
				break;
			default:
				break;
		}
	}

	renderListDetailToggle = async (indexNotification, isShow) => {
		isShow && this.renderListDetailByIndex(indexNotification)

	}
	handleCloseNotification = async (idNotification) => {
		let respnse = await notificationService.closeNotification(idNotification)

		if (respnse.status === 200) {
			await this._renderData(this.state.dataFilter, this.state.data.page, this.state.data.pageSz)
			toast.success('데이터가 업데이트 되었습니다', { autoClose: 3000 });
		}
	}

	render() {
		const { isLoading, title, activeUser, listNotApprove_1, isDetails, listNotApprove_2, listNotApprove_3, openModalCarrerDetail, dataInfo, dataHistory, dataHistoryError, listApprove_1, listApprove_2, listApprove_3 } = this.state;
		const { titleModal, messageModal, isOpenModal } = this.state.dataModalPopup

		return (
			<Root
				title={title}
				activeUser={activeUser}
			>
				<div className="page-list">
					<SearchNotification
						dataFilter={this.state.dataFilter}
						handleChangeDataFilter={this.handleChangeDataFilter}
						handleSubmitFilter={this.handleSubmitFilter}
					/>
					{checkAuth("rooms/notice", this.props.user, ROLE.ALL, false) === true ?
					<div className="text-right mt-3 mr-3">
						<Link to="/rooms/notice/create">
							<button className="btn btn-primary"
							>공고 등록</button>
						</Link>
					</div>
					: ''}

					<ul className="list-tab d-flex">
						{this.renderTab()}
					</ul>


					<ul className="list-tab d-flex">
						{this.renderStatus()}
					</ul>

					<TableNotification
						data={this.state.data}
						handleChange={this.props.handleChange}
						handleChangePage={this.handleChangePage}
						isDetails={isDetails}
						listNotApprove_1={listNotApprove_1}
						handleChangePageListNotApprove_1={this.handleChangePageListNotApprove_1}
						listApprove_1={listApprove_1}
						handleChangePageListApprove_1={this.handleChangePageListApprove_1}
						listNotApprove_2={listNotApprove_2}
						handleChangePageListApprove_2={this.handleChangePageListApprove_2}
						listApprove_2={listApprove_2}
						handleChangePageListNotApprove_2={this.handleChangePageListNotApprove_2}
						listNotApprove_3={listNotApprove_3}
						handleChangePageListNotApprove_3={this.handleChangePageListNotApprove_3}
						handleChangePageListApprove_3={this.handleChangePageListApprove_3}
						listApprove_3={listApprove_3}
						renderListDetailToggle={this.renderListDetailToggle}
						handleCloseNotification={this.handleCloseNotification}
						isLoading={isLoading}
					/>
					<ModalCarrerDetail
						openModalCarrerDetail={openModalCarrerDetail}
						dataInfo={dataInfo}
						dataHistoryError={dataHistoryError}
						dataHistory={dataHistory}
						handleChangePage={this.handleChangePageHistoryPage}
						handleChangePageHistoryError={this.handleChangePageHistoryErrorPage}
						handleCloseModalCarrerDetail={this.handleChange}
					/>

					<ModalPopup
						isOpenModal={isOpenModal}
						titleModal={titleModal}
						messageModal={messageModal}
						handleCloseModal={this.handleCloseModalError}
					/>
					{this.renderModal()}
				</div>
			</Root>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		data: state.notificationReducer.data,
		user: state.authReducer.user.user,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getListNotification: data => {
			dispatch(getListNotification(data))
		},

	}
}

export default (connect(mapStateToProps, mapDispatchToProps)(ListNotification));
