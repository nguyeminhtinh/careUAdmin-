import React, { Component } from 'react';
import Modal from 'react-bootstrap-modal';
import moment from 'moment';
import { toast } from "react-toastify";
class ModalExit extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			content: "무단이탈",
			name: "",
			eventclick: false,
		};
	}

	state = {
		isDisable: true
	}

	handleChange = (value) => {
		let isDisable = true;
		let name = "";

		if (value === 0) {
			isDisable = false;
		}

		if(value === 1) {
			name = "무단이탈";
			this.setState({
				name: ""
			});
		} 

		if(value === 2) {
			name = "환자수부족";
			this.setState({
				name: ""
			});
		} 

		this.setState({
			isDisable,
			content: name
		});
	}

	handleCloseModal = () => {
		this.setState({
			eventclick: true,
		});
		this.setState({
			isDisable: true,
			name: ""
		}, () => {
			this.props.handleChange({ openModalExit: false });
			let t = this;
			setTimeout(() => {
				t.setState({
					eventclick: false	
				})
			}, 3000);
		});
	}

	handleCloseRecruitment = () => {
		this.setState({
			eventclick: true,
		});
		if(this.props.startUserRecruitment && moment().valueOf() <= moment(this.props.startUserRecruitment)) {
			toast.error('종료 시간은 시작 시간보다 작을 수 없습니다')
		} else{
			let content = this.state.content
			this.props.closeRecruitment(content);
		}
		setTimeout(() => {
			this.setState({
				name: ''
			})	
		}, 300);
		let t = this;
		setTimeout(() => {
			t.setState({
				eventclick: false	
			})
		}, 3000);
	}
	
	handleChangeInput = (evt) => {
		this.setState({
			content: evt.target.value,
			name: evt.target.value
		});
	}

	render() {
		return (
			<Modal className='modalPopup w-45 modalchange max-h-100'
				id="Exit"
				show={this.props.openModalExit}
				onHide={() => this.props.handleChange({ openModalExit: true })}
			>
				<div className="content-change">
					<p className="description pb-0 pt-1">간병인님의 업무를 종료합니다.</p>
					<p className="description pt-0 pb-2">종료 이유를 선택해주세요</p>
					<div className="custom-radio">
						<div>
							<label className="radio-wrapper">
								<input
									type="radio"
									name="optradioExit"
									defaultChecked="checked"
									onChange={() => this.handleChange(1)}
								/>
								<span className="checkradio" />
								<span className="text">무단이탈</span>
							</label>
						</div>
						<div>
							<label className="radio-wrapper">
								<input
									type="radio"
									name="optradioExit"
									onChange={() => this.handleChange(2)}
								/>
								<span className="checkradio" />
								<span className="text">환자수부족</span>
							</label>
						</div>
						<div>
							<label className="radio-wrapper last">
								<input
									type="radio"
									name="optradioExit"
									onChange={() => this.handleChange(0)}
								/>
								<span className="checkradio" />
								<span className="text">기타</span>
								<input
									type="text"
									className="form-control"
									placeholder="기타 이유를 입력해주세요"
									value={this.state.name}
									onChange={evt => this.handleChangeInput(evt)}
									disabled={this.state.isDisable}
								/>
							</label>
						</div>
					</div>
					<p className="mt-3">[병실관리]-[공고]-[등록]을 통해 공고를 올릴 수 있습니다.</p>
					<div className="action text-center mb-0">
						<button
							className="btn btn-primary"
							disabled={this.state.eventclick}
							onClick={this.handleCloseRecruitment}
						>확인</button>
						<button
							className="btn btn-secondary"
							onClick={this.handleCloseModal}
						>취소</button>
					</div>
				</div>
			</Modal>
		);
	}
}

export default ModalExit;