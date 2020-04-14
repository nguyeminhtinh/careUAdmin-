import React, { Component } from 'react';
import Modal from 'react-bootstrap-modal';
import '../../public/css/login.css';
import { Link } from 'react-router-dom';
import InputPassword from '../../components/login/inputPassword';
import auth from "../../services/authService";
import InputEmail from '../../components/common/inputEmailCustom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from 'react-redux';
import { doLogin, getHospital, getListHospital, getListType, getListArea, getListCourses, getListMedicals, getListRoom, getListTypes } from '../../redux/actions/action';
import { getListHospitals, getStatusUserHospital } from '../../services/hospitals';
import types from '../../services/typeService';
import area from '../../services/areaService';
import room from '../../services/roomService';
import hospitals from '../../services/hospitals';

class Login extends Component {
	state = {
		dataLogin: {
			email: localStorage.email || "",
			email_suffixes: localStorage.email_suffixes || "naver.com",
			password: localStorage.password || "",
			remember: localStorage.remember || false
		},
		openModalLogin: false,
		errors: [],
		isClick: false
	};

	componentWillMount() {
		//auth.logout();
		this.getListTypes();
		if (localStorage.token !== undefined && this.props.user !== undefined) {
			window.location.href = '/';
		} else {
			auth.logout();
		}		
	}

	getListType = async (id) => {
		let response = await types.getListType(id);
		this.props.getListType(response);
	}

	getListCourses = async () => {
		let response = await hospitals.getListCourses();
		this.props.getListCourses(response.data.data);
	}

	getListMedicals = async () => {
		let response = await hospitals.getListMedicals();
		this.props.getListMedicals(response.data.data);
	}

	handleChangeData = (data) => {
		this.setState({
			dataLogin: {
				...this.state.dataLogin,
				...data,
			},
			errors: []
		});
	}

	getListTypes = async () => {
		let response = await hospitals.getListTypes();
		this.props.getListTypes(response.data.data);
	}

	validForm = () => {
		let errors = [];
		const { dataLogin } = this.state;

		if (dataLogin.password.length === 0 || dataLogin.email.length === 0 || dataLogin.email_suffixes.length === 0) {
			errors = {
				status: false,
				msg: "이메일 또는 비밀번호를 입력해주세요."
			};
			this.handleChange({ openModalLogin: true });
		}

		this.setState({
			errors: errors
		});

		return errors;
	}

	getListArea = async (id) => {
		let response = await area.getListArea(id);
		this.props.getListArea(response.data.data);
	}

	getListRoom = async (id) => {
		let response = await room.listRoom(id);
		this.props.getListRoom(response.data.data.data);
	}

	submitForm = async (e) => {
		this.setState({
			isClick: true
		})
		e.preventDefault();

		if (this.validForm().length !== 0) {
			setTimeout(() => {
				this.setState({
					isClick: false
				})
			}, 1000);
			return;
		}

		let dataSubmit = JSON.stringify(this.state.dataLogin);
		dataSubmit = JSON.parse(dataSubmit);

		dataSubmit.email = dataSubmit.email + "@" + dataSubmit.email_suffixes;
		try {
			let response = await auth.login(this.state.dataLogin);
			if (response.data.data.user.hospital !== null) {
				this.getListType(response.data.data.user.hospital.id);
				this.getListArea(response.data.data.user.hospital.id);
				this.getListRoom(response.data.data.user.hospital.id);
			}
			var arrTypes = this.props.listTypes;
			let dataHospital = {
				name: response.data.data.user.hospital !== null ? response.data.data.user.hospital.name : '',
				type: response.data.data.user.hospital !== null ? arrTypes[response.data.data.user.hospital.type]: ''
			}
			this.props.doLogin(response.data.data);
			this.props.getHospital(dataHospital);
			this.getListCourses();
			this.getListMedicals();
			let hospitals = await getListHospitals('', 1, 100);
			this.props.getListHospital(hospitals.data.data.hospitals);
			let statusUserHospital = await getStatusUserHospital(response.data.data.user.id);
			if(statusUserHospital.data.data.status &&  statusUserHospital.data.data.status !==1) {
				localStorage.setItem('urlHome', '/');
				this.props.history.push("/");
			} else {
				localStorage.setItem('urlHome', '/home-waiting');
				this.props.history.push("/home-waiting");				
			}
		} catch (ex) {
			toast.error(ex.data.errors.message);
		}
		setTimeout(() => {
			this.setState({
				isClick: false
			})
		}, 3000);
	}

	handleChangeOption = (name, value) => {
		let dataOption = {};
		dataOption[name] = value;
		this.handleChangeData(dataOption);
	}

	renderDataOption = (option) => {
		let html = [];
		option.map((item, index) => {
			html.push(
				<option key={index} value={item}>{item}</option>
			);
			return item;
		});
		return html;
	}

	handleChange = (data) => {
		this.setState({
			...data
		});
	}

	render() {
		return (
			<React.Fragment>
				<ToastContainer />
				<div className="page-login bg-white">
					<div className="wrapper-login fadeInDown">
						<div id="formContent">
							<form onSubmit={this.submitForm}>
								<div className="fadeIn first">
									<h1>로그인</h1>
								</div>
								<p className="description">Care U 의 계정을 입력해 주세요.</p>
								<InputEmail
									email={this.state.dataLogin.email}
									email_suffixes={this.state.dataLogin.email_suffixes}
									handleChangeData={this.handleChangeData}
								/>
								<div className="form-groups">
									<InputPassword
										className="input-password form-control"
										name="password"
										placeholder="비밀번호를 입력해주세요"
										value={this.state.dataLogin.password}
										handleChange={this.handleChangeOption}
									/>
								</div>
								<div className="form-groups mt-3">
									<button 
										ref="btn" 
										type="submit"
										disabled={this.state.isClick}
										className="btn btn-default w-100 m-0">
									로그인
									</button>
								</div>
								<div className="form-groups input-cheched mb-4">
									<label htmlFor="checkbox">
										로그인 상태 유지
										<input
											type="checkbox"
											id="checkbox"
											defaultChecked={this.state.dataLogin.remember === "true" ? "checked" : ""}
											onChange={(e) => this.handleChangeData({ remember: e.target.checked })}
										/>
										<span className="checkmark"></span>
									</label>
								</div>
							</form>
							<div className="login-nav">
								<nav className="nav justify-content-center">
									<Link to="/register" className="link">
										<button className="nav-link">회원가입</button>
									</Link>
									<Link to="/find-password" className="link">
										<button className="nav-link">비밀번호 찾기</button>
									</Link>
									<Link to="/find-id" className="link">
										<button className="nav-link">아이디 찾기</button>
									</Link>
								</nav>
							</div>
							<div id="formFooter">
								<p>※ 문의 사항은 카카오플러스 CareU 검색 후<br />
									친구 추가 시 상담을 통해 신속히 해결할 수 있습니다.</p>
							</div>
						</div>
					</div>
					{this.state.errors && (
						<Modal className='modalPopup w-45'
							id="ModalLogin"
							show={this.state.openModalLogin}
							onHide={() => this.handleChange({ openModalLogin: false })}
						>
							<Modal.Header closeButton>
							</Modal.Header>
							<Modal.Title>웹 페이지 메시지</Modal.Title>
							<div className="text-center pt-16">
								{this.state.errors.msg}
							</div>
							<div className="action-footer text-center">
								<button
									className="btn btn-secondary"
									onClick={() => this.handleChange({ openModalLogin: false })}
								>확인</button>
							</div>
						</Modal>
					)}

				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.authReducer.user.user,
		listTypes: state.hospitalReducer.listTypes,
		hospital: state.hospitalReducer
	}
}

const mapDispatchToProps = dispatch => {
	return {
		doLogin: data => {
			dispatch(doLogin(data))
		},
		getHospital: data => {
			dispatch(getHospital(data))
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
		getListTypes: data => {
			dispatch(getListTypes(data))
		},
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
