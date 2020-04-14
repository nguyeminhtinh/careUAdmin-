import React, { Component } from 'react';
import logo from '../../public/images/logo.png';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap-modal';
import $ from 'jquery';
import renderHTML from 'react-render-html';
import { ROLE } from '../../config.json';
import { connect } from 'react-redux';

const ROLE_CAREGIVER = 'caregiver';

class SideBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isToggleOn1: false,
			isToggleOn2: false,
			isToggleOn3: false,
			openModalConfirm: false,
			urlHome: '/'
		};
	}

	renderSideBar = () => {
		return (
			<nav className="nav flex-column">
				<ul className="parent">
					<li className="child active">
						<Link to={this.state.urlHome}>
							<p>홈</p>
						</Link>
					</li>
				</ul>
			</nav>
		);
	}

	componentWillMount() {
		const urlHome = localStorage.getItem('urlHome')
		this.setState({
			urlHome: urlHome
		});
	}

	clickShowSubmenu1 = (data) => {
		$("#parent-1 > a").next(".subparent").slideToggle("fast", function () {
			$("#parent-1 > a i").toggleClass("on");
		});
		$("#parent-2 .subparent, #parent-3 .subparent").hide();
		$("#parent-2, #parent-3").removeClass("on");
		this.setState({
			...data
		});
	}

	clickShowSubmenu2 = (data) => {
		$("#parent-2 > a").next(".subparent").slideToggle("fast", function () {
			$("#parent-2 > a i").toggleClass("on");
		});
		$("#parent-1 .subparent, #parent-3 .subparent").hide();
		$("#parent-1, #parent-3").removeClass("on");
		this.setState({
			...data
		});
	}

	clickShowSubmenu3 = (data) => {
		$("#parent-3 > a").next(".subparent").slideToggle("fast", function () {
			$("#parent-3 > a i").toggleClass("on");
		});
		$("#parent-1 .subparent, #parent-2 .subparent").hide();
		$("#parent-1, #parent-2").removeClass("on");
		this.setState({
			...data
		});
	}

	checkPermission = (path, role) => {
		if (this.props.user !== null) {
			var user = this.props.user;
			if (user.role === 'caregiver') {
				if (user.permissions !== null) {
					let auth = false;
					var permissions = user.permissions;
					permissions.map((permission, key) => {
						var page = permission[0];
						var roles = permission[1];
						if (page !== null && page === path && roles !== null && (roles.indexOf(role) > -1 || roles.indexOf(ROLE.ALL) > -1)) {
							auth = true;
						}
					})
					if (auth === false) {
						return false;
					}
					return true;
				}
				return false;
			}
			return true;
		}
		return false;
	}

	renderSideBarUser = () => {
		var checkHospital = this.checkPermission('hospitals', ROLE.VIEW);
		var checkRoomStatus = this.checkPermission('rooms/status', ROLE.VIEW);
		var checkRoomNotice = this.checkPermission('rooms/notice', ROLE.VIEW);
		var checkRoomRegister = this.checkPermission('rooms/register', ROLE.VIEW);
		var checkRoomHistory = this.checkPermission('rooms/history', ROLE.VIEW);
		var checkRoom = checkRoomStatus || checkRoomNotice || checkRoomRegister || checkRoomHistory ? true : false;

		var checkSettlementBill = this.checkPermission('settlements/bill', ROLE.VIEW);
		var checkSettlementTax = this.checkPermission('settlements/tax', ROLE.VIEW);
		var checkSettlement = checkSettlementBill || checkSettlementTax ? true : false;

		var checkProblem = this.checkPermission('problems', ROLE.VIEW);
		var checkAccountEmployee = this.checkPermission('accounts/employee', ROLE.VIEW);
		var checkAccountRequest = this.checkPermission('accounts/request', ROLE.VIEW);
		var checkAccountDepartmentPosition = this.checkPermission('accounts/department-position', ROLE.VIEW);
		var checkAccountPermissions = this.checkPermission('accounts/permission', ROLE.VIEW);
		var checkAccount = checkAccountEmployee || checkAccountRequest || checkAccountDepartmentPosition || checkAccountPermissions ? true : false;
		return (
			<div>
				<nav className="nav flex-column">
					<ul className="parent">
						<li className={window.location.pathname === "/" || window.location.pathname === "/home-waiting" ? "active" : ""}>
							<Link to={this.state.urlHome}>
								<p>홈</p>
							</Link>
						</li>
						{checkHospital === true ?
							<li className={window.location.pathname === "/hospitals" ? "active" : ""}>
								<Link to="/hospitals">
									<p>병원 정보</p>
								</Link>
							</li>
							: ''}

						{checkRoom === true ?
							<li className={!this.state.isToggleOn1 ? "sub " : "on sub"} id="parent-1">
								<Link
									to="#"
									className={window.location.pathname.indexOf("/rooms") !== -1 ? "active-parent" : ""}
									onClick={() => this.clickShowSubmenu1({ isToggleOn1: !this.state.isToggleOn1 })}
								>
									<p>병실 관리</p>
									<i className="fa fa-angle-right"></i>
								</Link>
								<ul className={window.location.pathname.indexOf("/rooms") !== -1 ? "active subparent" : "subparent"}>
									{checkRoomStatus === true ?
										<li className={window.location.pathname === "/rooms/status" ? "active" : ""}>
											<Link to="/rooms/status">
												<p>현황</p>
											</Link>
										</li>
										: ''}

									{checkRoomNotice === true ?
										<li className={window.location.pathname.indexOf("/rooms/notice") !== -1 ? "active" : ""}>
											<Link to="/rooms/notice">
												<p>공고</p>
											</Link>
										</li>
										: ''}

									{checkRoomRegister === true ?
										<li className={window.location.pathname.indexOf("/rooms/register") !== -1 ? "active" : ""}>
											<Link to="/rooms/register">
												<p>등록</p>
											</Link>
										</li>
										: ''}

									{checkRoomHistory === true ?
										<li className={window.location.pathname.indexOf("/rooms/history") !== -1 ? "active" : ""}>
											<Link to="/rooms/history">
												<p>과거 내역</p>
											</Link>
										</li>
										: ''}
								</ul>
							</li>
							: ''}

						{checkSettlement === true ?
							<li className={!this.state.isToggleOn2 ? "sub " : "on sub"} id="parent-2">
								<Link
									to="#"
									className={window.location.pathname.indexOf("/settlements") !== -1 ? "active-parent" : ""}
									onClick={() => this.clickShowSubmenu2({ isToggleOn2: !this.state.isToggleOn2 })}
								>
									<p>정산</p>
									<i className="fa fa-angle-right"></i>
								</Link>
								<ul className={window.location.pathname.indexOf("/settlements") !== -1 ? "active subparent" : "subparent"}>
									{checkSettlementBill === true ?
										<li className={window.location.pathname === "/settlements/bill" ? "active" : ""}>
											<Link to="/settlements/bill">
												<p>정산</p>
											</Link>
										</li>
										: ''}
									{checkSettlementTax === true ?
										<li className={window.location.pathname === "/settlements/tax" ? "active" : ""}>
											<Link to="/settlements/tax">
												<p>세금(원천징수세)</p>
											</Link>
										</li>
										: ''}
								</ul>
							</li>
							: ''}

						{checkProblem === true ?
							<li className={window.location.pathname.indexOf("/problems") !== -1 ? "active" : ""}>
								<Link to="/problems">
									<p>사고 처리</p>
								</Link>
							</li>
							: ''}

						{checkAccount === true ?
							<li className={!this.state.isToggleOn3 ? "sub " : "on sub"} id="parent-3">
								<Link
									to="#"
									className={window.location.pathname.indexOf("/accounts") !== -1 ? "active-parent" : ""}
									onClick={() => this.clickShowSubmenu3({ isToggleOn3: !this.state.isToggleOn3 })}>
									<p>계정 관리</p>
									<i className="fa fa-angle-right"></i>
								</Link>
								<ul className={window.location.pathname.indexOf("/accounts") !== -1 ? "active subparent" : "subparent"}>
									{checkAccountEmployee === true ?
										<li className={window.location.pathname === "/accounts/employee" ? "active" : ""}>
											<Link to="/accounts/employee">
												<p>직원 계정  관리</p>
											</Link>
										</li>
										: ''}

									{checkAccountRequest === true ?
										<li className={window.location.pathname === "/accounts/request" ? "active" : ""}>
											<Link to="/accounts/request">
												<p>요청 계정 관리</p>
											</Link>
										</li>
										: ''}

									{checkAccountDepartmentPosition === true ?
										<li className={window.location.pathname === "/accounts/department-position" ? "active" : ""}>
											<Link to="/accounts/department-position">
												<p>부서/직책 관리</p>
											</Link>
										</li>
										: ''}

									{checkAccountPermissions === true ?
										<li className={window.location.pathname.indexOf("/accounts/permissions") !== -1 ? "active" : ""}>
											<Link to="/accounts/permissions">
												<p>권한 상세 관리</p>
											</Link>
										</li>
										: ''}
								</ul>
							</li>
						: ''}
					</ul>
				</nav>
				{this.renderTerminationBtn()}
			</div>
		);
	}

	renderContent = () => {
		if (this.props.activeUser) {
			return this.renderSideBarUser();
		}

		return this.renderSideBar();
	}

	handleChangeModalConfirm = (boolean) => {

		this.setState({
			openModalConfirm: boolean
		});
	}

	handleModalComfirm = () => {
		this.handleChangeModalConfirm(true)
		this.renderModalConfirm();
	}

	renderModalConfirm = () => {
		return (
			<Modal className='modalPopup w-45'
				id="ModalConfirm"
				show={this.state.openModalConfirm}
				onHide={() => this.handleChangeModalConfirm(false)}
			>
				<div>
					<p className="text-center">해지하겠습니까? 이 병원의 소속에서 해지됩니다</p>
					<div className="button-footer text-center">
						<button
							className="btn btn-primary"
							onClick={this.handleCloseJoinHospital}
						>예</button>
						<button
							className="btn btn-secondary"
							onClick={() => this.handleChangeModalConfirm(false)}
						>아니오</button>
					</div>
				</div>
			</Modal>
		)
	}

	handleCloseJoinHospital = () => {
		this.handleChangeModalConfirm(false);
		this.props.handleCloseJoinHospital(this.props.user.hospital.id, this.props.user.id);
	}

	navMainPage = () => {
		window.location.href = '/';
	}

	renderTerminationBtn = () => {
		if (this.props.user.role === ROLE_CAREGIVER) {
			return (
				<div className="text-right pb-3 mr-3">
					<button type="button"
						className="btn btn-secondary btn-pass btn-sidebar bottomright"
						onClick={this.handleModalComfirm}
					>해지</button>
				</div>
			)
		}
	}

	render() {
		const { user, hospital } = this.props;
		var position = user.role !== 'caregiver' ? '원장(마스터)' : (user.position !== null ? renderHTML('&nbsp;') + user.position.name : '');
		var userHospital = user.hospital !== null ? user.hospital : '';
		if (user.isApproved === false) {
			position = '';
			userHospital = '';
		}

		return (
			<div className="sidebar">
				<div className="wrapp-logo">
					<img src={logo} alt="" className="img-logo" />
				</div>
				<div className="wrapp-info">
					<label>{hospital !== null ? hospital.name : ''} &nbsp; {hospital !== null ? hospital.type : ''}</label>
					<label>이름/직책 : {user.full_name} {position}</label>
					{user !== undefined && user !== null &&
						(<label> <span>계정: </span><span>{user.email}</span></label>)
					}
					<div className="action d-flex justify-content-around">
						<button
							className="btn btn-secondary btn-pass btn-sidebar"
							onClick={() => this.props.handleChange({ openModalChangeUser: true })}
						>정보변경</button>
						<button
							className="btn btn-secondary btn-sidebar"
							onClick={() => this.props.handleChange({ openModalLogout: true })}
						>로그아웃</button>
					</div>
				</div>
				{this.renderContent()}
				{this.renderModalConfirm()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.authReducer.user.user === null ? null : state.authReducer.user.user
	}
}

export default connect(mapStateToProps)(SideBar);