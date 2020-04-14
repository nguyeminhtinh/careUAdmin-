import React, { Component } from 'react';
import SideBar from '../layout/sidebar';
import Header from '../layout/header';
import Modal from 'react-bootstrap-modal';
import InputPassword from '../login/inputPassword';
import auth from "../../services/authService";
import { connect } from 'react-redux';
import {  withRouter } from 'react-router-dom';
import { getListHospitals, getStatusUserHospital, closeJoinHospital } from '../../services/hospitals';
import { doLogin, doLogout, getHospital, getListHospital, getListRoom, getListType, getListArea, getListCourses, getListTypes, getListMedicals } from '../../redux/actions/action';
import moment from 'moment';
import { ToastContainer } from "react-toastify";
import { checkPassword } from '../../services/userService';
import hospitals from '../../services/hospitals';
import types from '../../services/typeService';
import area from '../../services/areaService';
import room from '../../services/roomService';
import { toast } from 'react-toastify';

class Index extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: "",
			error_password: false,
			error_correct_password: false,
			openModalLogout: false,
			openModalChangeUser: false
		}
	}
	getListCourses = async () => {
		let response = await hospitals.getListCourses();

		this.props.getListCourses(response.data.data);
	}

	getListType = async (id) => {
		let response = await types.getListType(id);
		this.props.getListType(response);
	}
	
	getListTypes = async () => {
		let response = await hospitals.getListTypes();
		this.props.getListTypes(response.data.data);
	}

	getListMedicals = async () => {
		let response = await hospitals.getListMedicals();

		this.props.getListMedicals(response.data.data);
	}

	getListArea = async (id) => {
		let response = await area.getListArea(id);

		this.props.getListArea(response.data.data);
	}

	getListRoom = async (id) => {
		let response = await room.listRoom(id);

		this.props.getListRoom(response.data.data.data);
	}
	async componentWillMount () {
		
		let now = moment();
		let then = moment(localStorage.expiresAt);

		if (localStorage.token !== undefined) {
			if (moment(now._d).isAfter(then)) {
				window.location.href = '/login';
			}
		}

		if (localStorage.expiresAt === undefined) {
			window.location.href = '/login';
		}
		let response = await auth.getflag(this.props.user.id);
		if(response && response.data.data.flag === 1) {
			const { user } = this.props;
			var arrTypes = this.props.listTypes;
			// let dataHospital = {
			// 	name: user.hospital !== null ? user.hospital.name : '',
			// 	type: user.hospital !== null ? arrTypes[user.hospital.type]: ''
			// }
			let response = await auth.info(this.props.user.id);
			let dataHospital = {
				name: response.data.data.user.hospital !== null ? response.data.data.user.hospital.name : '',
				type: response.data.data.user.hospital !== null ? arrTypes[response.data.data.user.hospital.type]: ''
			}
			if (response.data.data.user.hospital !== null) {
				this.getListType(response.data.data.user.hospital.id);
				this.getListArea(response.data.data.user.hospital.id);
				this.getListRoom(response.data.data.user.hospital.id);
			}
			this.props.doLogin(response.data.data);
			this.props.getHospital(dataHospital);
			this.getListCourses();
			this.getListMedicals();
			this.getListTypes();
			let hospitals = await getListHospitals('', 1, 100);
			this.props.getListHospital(hospitals.data.data.hospitals);
			let statusUserHospital = await getStatusUserHospital(response.data.data.user.id);
			if(statusUserHospital.data.data.status && statusUserHospital.data.data.status!==1 && statusUserHospital.data.data.status!==3) {
				localStorage.setItem('urlHome', '/');
				if(window.location.pathname !== "/"){
					this.props.history.push("/");
				}	
			
			} else {
				localStorage.setItem('urlHome', '/home-waiting');
				if(window.location.pathname !== "/home-waiting"){
					this.props.history.push("/home-waiting");
				}	
			}
			await auth.updateflag(this.props.user.id);
		} else {
			if(window.location.pathname === "/"){
				let statusUserHospital = await getStatusUserHospital(this.props.user.id);
				console.log(statusUserHospital);
				if(statusUserHospital.data.data.status && statusUserHospital.data.data.status!==1 && statusUserHospital.data.data.status!==3) {
					localStorage.setItem('urlHome', '/');
					if(window.location.pathname !== "/"){
						this.props.history.push("/");
					}	
				} else {
					localStorage.setItem('urlHome', '/home-waiting');
					if(window.location.pathname !== "/home-waiting"){
						this.props.history.push("/home-waiting");
					}	
				}
			}
		}
	}

	handleLogout = () => {
		auth.logout();
		this.props.doLogout();
		this.props.getListType([]);
		this.props.getHospital({});
		this.props.getListHospital([]);
		this.props.getListArea([]);
		this.props.getListCourses([]);
		this.props.getListMedicals([]);
		this.props.history.push("/login");
	}

	handleCloseModal = () => {
		this.setState({
			password: "",
			error_password: false,
			error_correct_password: false
		}, () => {
			this.handleChange({ openModalChangeUser: false });
		});
	}

	handleChangeData = (data) => {
		this.setState({
			...data,
			error_password: false,
			error_correct_password: false
		});
	}

	handleChangeOption = (name, value) => {
		let dataOption = {};
		dataOption[name] = value;

		this.handleChangeData(dataOption);
	}

	handleSubmit = async (e) => {
		e.preventDefault();
		if (this.state.password !== "") {
			/*Check password*/
			let response = await checkPassword(this.props.user.id, this.state.password);
			if (response.data.data !== undefined) {
				// window.location.href = "/profile";
				this.props.history.push("/profile");
			} else {
				this.setState({
					error_correct_password: true
				});
			}
			return false;
		}
		this.setState({
			error_password: true
		});
		return false;
		// this.props.dispatch({type:'UPDATE_PROFILE', user:this.props.user})
	}

	handleCloseJoinHospital = async (hospital_id, user_id) => {
		let data = {'user_id' : user_id};
		let response = await closeJoinHospital(hospital_id, data);

		if(response.data.data.length !== 0) {			
			toast.success(response.data.message);
			setTimeout(() => {
				auth.logout();
				this.props.history.push("/login");
			}, 3000);
		}else {
			toast.error(response.data.message);
		}
	}		

	renderErrorPassword = () => {
		if (this.state.error_password) {
			return (
				<span className="text-danger">비밀번호를 입력해 주세요</span>
			);
		}

		if (this.state.error_correct_password) {
			return (
				<span className="text-danger">암호가 정확하지 않습니다. 다시 시도하십시오.</span>
			);
		}
	}

	handleChange = (data) => {
		this.setState({
			...data
		});
	}

	render() {
		const { password } = this.state;
		const { title, activeUser, hospital, subtitle, user } = this.props;

		// if (Object.keys(user).length === 0) {
		// 	return null;
		// }

		return (
			<div className="page bg-ddd">
				<ToastContainer />
				<Header
					title={title}
					subtitle={subtitle} />
				<SideBar
					handleCloseJoinHospital={this.handleCloseJoinHospital}
					user={user}
					hospital={hospital}
					activeUser={activeUser}
					handleChange={this.handleChange}
				/>

				<Modal className='modalPopup w-55'
					id="ChangeUser"
					show={this.state.openModalChangeUser}
					onHide={this.handleCloseModal}
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Title>정보변경</Modal.Title>
					<div>
						<form onSubmit={this.handleSubmit}>
							<div className="form-groups d-flex form-email align-self-center mt-4">
								<InputPassword
									className="form-control input-password"
									value={password}
									name="password"
									ref={(input) => this.getPassword = input}
									placeholder="비밀번호를 입력해주세요"
									handleChange={this.handleChangeOption}
								/>
							</div>
							{this.renderErrorPassword()}

							<div className="action text-center">

								<button
									className="btn btn-primary"
									// onClick={() => this.props.dispatch({ type: 'UPDATE_PROFILE' })}>
									type="submit">
									확인</button>
								<button
									className="btn btn-secondary"
									type="button"
									onClick={this.handleCloseModal}
								>취소</button>
							</div>
						</form>
					</div>
				</Modal>

				<Modal className='modalPopup w-45'
					id="Logout"
					show={this.state.openModalLogout}
					onHide={() => this.handleChange({ openModalLogout: true })}
				>
					<div className="text-center">
						<h6 className="text-question">로그아웃 하시겠습니까?</h6>
						<div className="modal-action-footer">
							<button
								className="btn btn-primary"
								onClick={this.handleLogout}
							>확인</button>
							<button className="btn btn-secondary"
								onClick={() => this.handleChange({ openModalLogout: false })}
							>취소</button>
						</div>
					</div>
				</Modal>
				<div className="wrapper-content">
					{this.props.children}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.authReducer.user.user,
		hospital: state.hospitalReducer.hospital,
		listTypes: state.hospitalReducer.listTypes,
		listHospital: state.hospitalReducer.listHospital,
		hospital_id: state.authReducer.user.user ? state.authReducer.user.user.hospital ? state.authReducer.user.user.hospital.id : null : null
	}
}

const mapDispatchToProps = dispatch => {
	return {
		doLogin: data => {
			dispatch(doLogin(data))
		},
		doLogout: () => {
			dispatch(doLogout())
		},
		getHospital: data => {
			dispatch(getHospital(data))
		},
		getListTypes: data => {
			dispatch(getListTypes(data))
		},
		getListHospital: data => {
			dispatch(getListHospital(data))
		},
		getListType: data => {
			dispatch(getListType(data))
		},
		getListArea: data => {
			dispatch(getListArea(data))
		},
		getListCourses: data => {
			dispatch(getListCourses(data))
		},
		getListMedicals: data => {
			dispatch(getListMedicals(data))
		},
		getListRoom: data => {
			dispatch(getListRoom(data))
		},
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));
