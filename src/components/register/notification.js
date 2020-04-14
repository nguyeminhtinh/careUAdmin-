import React, { Component } from 'react';
import { TYPE_USER } from '../../config.json';
import auth from '../../services/authService';
class Notification extends Component {
	navLoginPage = () => {
		auth.logout();
		window.location.href = "/login";
	}

	renderContent = () => {
		const { type_user } = this.props;
		const { email } = this.props.dataResult;
		const { name } = this.props.dataResult;

		if (type_user === TYPE_USER.MASTER) {
			return (
				<div>
					<div className="page-notification">
						<h1>CareU  가입을 환영합니다.</h1>

						<p>{name} 원장(마스터)님의 회원가입이 완료 되었습니다.</p>
						<p>아이디는 <a className="text-primary" href={"mailto:" + email}>{email}</a> 입니다.</p>
						<p>CareU 에서 서류 확인 후 1~2일 내로 승인메일을 보내드리겠습니다</p>
						<h6 className="font-weight-light mb-3 mt-5">승인 대기 중에서는 일부 서비스만 이용할 수 있습니다.</h6>

						<p className="mb-1">CareU 승인 전 사용할 수 있는 기능</p>
						<ul>
							<li>병원정보</li>
							<li>병실관리(현황, 등록)</li>
							<li>계정관리</li>
						</ul>

						<p className="mt-4">승인 대기 중 [병원정보], [병실관리-등록] 정보를 미리 입력해두면 편리하게 사용할 수 있습니다.
						필수로 입력해주셔야 서비스 사용이 가능합니다.
					</p>

						<p className="mb-1">CareU승인 전 사용할 수 없는 기능</p>
						<ul>
							<li>병실관리(공고등록, 간병인승인)</li>
							<li>정산</li>
							<li>사고처리</li>
						</ul>

						<p>참고 부탁 드립니다. 감사합니다.</p>
					</div>
					<div className="text-center mb-3">
						<button
							className="btn btn-secondary"
							onClick={this.navLoginPage}
						>
							확인
						</button>
					</div>
				</div>
			);
		}

		return (
			<div>
				<div className="page-notification">
					<h1>CareU  가입을 환영합니다.</h1>

					<p>{name}  님의 회원가입이 완료 되었습니다.</p>
					<p>아이디는 <a className="text-primary" href={"mailto:" + email}>{email}</a> 입니다.</p>

					<p className="mt-4">홈에서, 근무지 병원을 선택 후 병원 원장(마스터)의 승인이 있어야 서비스를 사용할 수 있습니다.</p>

					<p>참고 부탁 드립니다. 감사합니다.</p>
				</div>
				<div className="text-center mb-3">
					<button
						className="btn btn-secondary"
						onClick={this.navLoginPage}
					>
						확인
						</button>
				</div>
			</div>
		);
	}

	render() {

		return (
			this.renderContent()
		);
	}
}

export default Notification;