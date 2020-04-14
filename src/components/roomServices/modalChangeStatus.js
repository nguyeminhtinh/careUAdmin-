import React, { Component } from 'react';
import Modal from 'react-bootstrap-modal';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import moment from 'moment';

class ModalChangeStatus extends Component {
	state = {
		isDisable: true,
		eventclick: false,
		name: '',
		content: '근무태만',
	}

	handleChange = (value) => {
		let isDisable = true;
		let name = '';
		if (value === 0) {
			isDisable = false;
		}

		if(value === 1) {
			name = '근무태만';
		} 

		if(value === 2) {
			name = '불친절';
		} 

		if(value === 3) {
			name = '위생상태불량';
		} 
		if(value === 1 || value === 2 || value === 3) {
			this.setState({
				name: ''
			})
		}

		this.setState({
			isDisable,
			content: name
		});
	}

	handleCloseModal = () => {
		this.setState({
			isDisable: true,
			name: ''
		}, () => {
			this.props.handleChange({ openModalChangeStatus: false });
		});
	}

	handleChangeInput = (evt) => {
		this.setState({
			content: evt.target.value,
			name: evt.target.value
		});
	}

	handleChangeNotice = () => {
		let t = this;
		this.setState({
			...this.state,
			eventclick: true,
		})
		// if(this.state.content === '') {
		// 	toast.error('콘텐츠를 입력하십시오.');
		// 	t.setState({
		// 		eventclick: false	
		// 	})
		// } else {
			this.props.handleChangeNotice(this.state.content !== '' ? this.state.content : '기타');
			setTimeout(() => {
				this.setState({
					name: ''
				})
			}, 300);
			setTimeout(function () {
			t.setState({
				eventclick: false,
			})
		}, 3000)
		// }
		
	}
	_renderDataNotice = (datas) => {
		let html = [];
		datas.map((item, index) => {
			html.push( <div key={index}><p className="mt-3">경고 내용 :</p> <p>{ moment(item.created_at).format('YYYY-MM-DD HH:mm') }</p> <p>{ item.content }.</p></div> )
			return item;
		})
		return html;
	}

	_renderTextDesc = () => {
		const { status } = this.props.dataStatus;
		let descriptionSatus1 = "교체 요청을 원하는 이유를 선택하세요";
		let descriptionSatus2 = "[근무태만] 에 대한 경고가 1회 있습니다.";
		let descriptionNote = "한번 더 경고하시겠습니까?";

		if (status === 0) {
			return (
				<p>{descriptionSatus1}</p>
			)
		}
		return (
			<div>
				<p>{descriptionSatus2}</p>
				<p>{descriptionNote}</p>
			</div>
		)
	}

	renderContentPopupChange = () => {
		const dataCareer = this.props.dataCareer;
		const { status, data } = this.props.dataStatus
		if (status === 2) {
			return (
				<div className="content-change">
					<p>동 호수 : { data.length !== 0 && data.info && data.info.room ? data.info.room.area.name : '' } {data.info.room ? data.info.room.name : ''}</p>
					<p>간병인 : { data.length !== 0 && data.info && data.info.user ? data.info.user.full_name : '' }</p>
					{ this._renderDataNotice(data.data) }
					<p className="mt-3 text-center">공고는 현재 시점으로 올릴 수 있습니다.<br />
						공지수정 버튼을 통해 수정 후 공지를 올릴 수 있습니다.</p>

					<div className="action text-center mb-0">
						<Link to={"/rooms/notice/edit/" + data.info.recruitment_id+ '/' + dataCareer}>
							<button
								className="btn btn-primary"
							>공지수정</button>
						</Link>
						<button
							className="btn btn-secondary"
							onClick={this.handleCloseModal}
						>취소</button>
					</div>
				</div>
			);
		}

		return (
			<div className="content-change ">
				<label className="description py-1">
					{ this._renderTextDesc() }
				</label>
				<div className="custom-radio">
					<div>
						<label className="radio-wrapper">
							<input
								type="radio"
								name="optradio"
								defaultChecked="checked"
								onChange={() => this.handleChange(1)}
							/>
							<span className="checkradio" />
							<span className="text">근무태만</span>
						</label>
					</div>
					<div>
						<label className="radio-wrapper">
							<input
								type="radio"
								name="optradio"
								onChange={() => this.handleChange(2)}
							/>
							<span className="checkradio" />
							<span className="text">불친절</span>
						</label>
					</div>
					<div>
						<label className="radio-wrapper">
							<input
								type="radio"
								name="optradio"
								onChange={() => this.handleChange(3)}
							/>
							<span className="checkradio" />
							<span className="text">위생상태불량</span>
						</label>
					</div>
					<div>
						<label className="radio-wrapper last">
							<input
								type="radio"
								name="optradio"
								onChange={() => this.handleChange(0)}
							/>
							<span className="checkradio" />
							<span className="text">기타</span>
							<input
								type="text"
								className="form-control"
								placeholder="기타 이유를 입력해주세요"
								disabled={this.state.isDisable}
								value={this.state.name}
								onChange={evt => this.handleChangeInput(evt)}
							/>
						</label>
					</div>
				</div>
				<div className="action text-center">
					<Link to={"/rooms/notice/edit/" + this.props.recruitment + '/0'}>
						<button
							className="btn btn-primary"
						>교체하기</button>
					</Link>
					<button
						className="btn btn-primary"
						disabled={this.state.eventclick}
						onClick={this.handleChangeNotice}
					>확인</button>
					<button
						className="btn btn-secondary"
						onClick={this.handleCloseModal}
					>취소</button>
				</div>
				<div className="">
					<label className="description mb-0 pt-0 pb-2"> 교체하기</label>
					<div>
						바로 교체하고 싶다면 교체하기 버튼을 터치하세요<br />
						공고수정 화면으로 이동해 공고를 등록할 수 있습니다.<br />
						병원담당자가 새 간병인을 승인하면,<br />
						현재 간병인에게 근무종료일 하루 전에 알려줍니다.
					</div>
				</div>
			</div>
		);
	}

	render() {
		return (
			<Modal className='modalPopup w-45 modalchange max-h-100'
				id="ChangeStatus"
				show={this.props.openModalChangeStatus}
				onHide={() => this.props.handleChange({ openModalChangeStatus: true })}
			>
				{this.renderContentPopupChange()}
			</Modal>
		);
	}
}

export default ModalChangeStatus;