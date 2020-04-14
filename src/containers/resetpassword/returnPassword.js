import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../public/css/returnId.css';
import { getUserById } from '../../services/userService';

class ReturnPassword extends Component {
	constructor() {
		super();

		// this.state = {
		// 	user: {}
		// }
	}

	componentWillMount() {
		// if (this.props.match.params.id !== undefined) {
		// 	let user = getUserById(parseInt(this.props.match.params.id));

		// 	this.setState({
		// 		user
		// 	});
		// }
		//console.log(this.props.location.state.email);
	}

	render() {

		return (
			<div className="page-returnId bg-white">
				<div className="wrapper fadeInDown mt-5">
					<div id="formContent" className="stage-returnId border">
						<div className="fadeIn first heading">
							<h1>비밀번호 변경</h1>
						</div>
						<form className="input-content">
							<p className="description fontSize-13">
								코드가 잘못되었거나 만료되었습니다
							</p>
							<div className="form-group m-0 margin-top-l">
								<Link to="/find-password" className="link">
									<button type="button" className="btn btn-primary margin-right-l">비밀번호 찾기</button>
								</Link>
								<Link to="/login" className="link">
									<button type="button" className="btn btn-primary btn-width-x">로그인</button>
								</Link>
							</div>

						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default ReturnPassword;