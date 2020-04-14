import React, { Component } from 'react';
import Modal from 'react-bootstrap-modal';
import Datetime from 'react-datetime';
import { toast } from "react-toastify";
import moment from 'moment';
import { loadPriceCurent } from "../../services/roomStatus";
import { formatNumber, isNumberKey } from '../../services/functionService';
import _ from 'lodash';
import ReactDOM from 'react-dom';

class ModalChangePrice extends Component {
	
	state = { 
		type1: true, 
		type2: false,
		time1: false,
		time2: true,
		envenclick: false,
		timeStart: '',
		timeEnd: '',
		history: [],
		price: {
			curent: 0,
			bonus: 0,
			aide: '',
			room: '',
			area: ''
		},
		changePrice: {
			price: '',
			time: '',
			content: '',
			type_id: 0
		}

	}

	handleChange1 = () => {
		this.setState({ 
			type1: !this.state.type1,
			time1: !this.state.time1
		})
		if(this.state.type1) {
			this.setState({
				timeStart: ''
			})
		}
	}
	
	handleChange2 =() => {
		this.setState({
			type2: !this.state.type2,
			time2: !this.state.time2    
		})
		if(this.state.type2) {
			this.setState({
				timeEnd: ''
			})
		}		
	}

	handleChangeInput = (event, type) => {
		let dayStart =  '', dayEnd = '', time = ''; 
		let check = moment(event, [], true).isValid();
		if(type === 1) {
			dayStart = check ? event.format('YYYY-MM-DD HH:mm:ss') : '';
			this.setState({
				timeStart: dayStart
			})
		} else if(type === 2) {
			dayEnd = check ? event.format('YYYY-MM-DD HH:mm:ss') : '';
			this.setState({
				timeEnd: dayEnd
			})
		} else if(type === 3){
			time = check ? event.format('YYYY-MM-DD HH:mm:ss') : '';
			this.setState({
				changePrice: {
					...this.state.changePrice,
					time: time
				} 
			})
		}
    }
 
	onCloseModal = () => {
		this.props.handleChange({ openModal: false })
		var t = this;
		setTimeout(function(){
			t.setState({
				type1: true, 
				type2: false,
				time1: false,
				time2: true,
				timeStart: '',
				timeEnd: '',
				changePrice: {
					price: '',
					time: '',
					content: '',
				}
			})
		}, 500)
	}

	changeTimeRecruitment = () => {
		var t = this;
		this.setState({
			envenclick: true
		})
		if(this.state.timeStart === ""  && this.state.timeEnd === "") {
			toast.error('시간을 선택하십시오!');
		} else if(this.state.timeStart !== ""  && this.state.timeEnd !== "" && moment(this.state.timeStart).valueOf() >= moment(this.state.timeEnd).valueOf()) {
			toast.error('종료일은 시작일보다 커야합니다!');
		} else if(this.state.type1 && this.state.timeStart === "") {
			toast.error('데이터를 입력하십시오!');
		} else if(this.state.type2 && this.state.timeEnd === "") {
			toast.error('데이터를 입력하십시오!');
		} else if(this.state.timeStart !== '' && moment(this.state.timeStart).valueOf() <  moment().valueOf()) {
			toast.error('시작 날짜는 시스템 날짜보다 커야합니다!');
		} else if(this.state.timeEnd !== '' && moment(this.state.timeEnd).valueOf() <  moment().valueOf()) {
			toast.error('종료 날짜는 시스템 날짜보다 커야합니다!');
		} else if (moment().valueOf() >= moment(this.state.timeEnd).valueOf()) {
			toast.error('종료일은 현재보다 커야합니다!');
		} 
		// else if (moment(this.props.startUserRecruitment).valueOf() > moment(this.state.timeStart).valueOf()) {
		// 	toast.error('시작일은 첫 번째 시작일보다 커야합니다!');
		// } 
		else{
			// console.log(this.state)
			this.props.changePriceRecruitment(this.state)
			this.props.handleChange({ openModal: false })
			setTimeout(function(){
				t.setState({
					type1: true, 
					type2: false,
					time1: false,
					time2: true,
					timeStart: '',
					timeEnd: ''
				});
			},500);
		}
		setTimeout(function(){
			t.setState({
				envenclick: false
			})
		}, 3000)
	}

	loadPriceCurent = async () => {
		this.setState({
			changePrice:{
				...this.state.changePrice,
			}
		})
		const id = this.props.dataCareerId;
		try {
			let response = await loadPriceCurent(id);
			this.setState({
				changePrice:{
					...this.state.changePrice,
					// price: '',
					// time: '',
					// content: '',
					type_id: response.data.data.type_id
				},
			})
		} catch (ex) {
			console.log(ex);
		}
	}

	renderHistory = (datas) => {
		let html = [];
		datas.map((item, index) => {
			html.push(
				<li key={index}>{item.created_at?moment(item.created_at).format('YY-MM-DD HH:mm'):''} - {moment(item.date_change).format('YY-MM-DD HH:mm')} - {formatNumber(Number(item.salary_bonus))} 원 &nbsp; {item.content}</li>
			);
			return item;
		});

		return html;
	}

	renderHistoryTime = (datas) => {
		let html = [];
		datas.map((item, index) => {
			html.push(
				<li key={index}>{item.created_at?moment(item.created_at).format('YY-MM-DD HH:mm'):''} - 시작하다: {item.start?moment(item.start).format('YY-MM-DD HH:mm'):''} {item.end?'- 끝: ':''} {item.end ? moment(item.end).format('YY-MM-DD HH:mm'): ''}</li>
			);
			return item;
		});

		return html;
	}


	handlePrice = (evt) => {
		let target = evt.target;
		var name  = target.name;
		var value = target.value;
		if(name === 'price') {
			let re = /[\u3131-\uD79D]/ugi;
				let text = value.match(re);
				if (!_.isArray(text) && !isNaN(value) && value.length < 19 ) {
					this.setState({
						changePrice: {
							...this.state.changePrice,
							[name] : value
						}
					});
				}
		} else { 
			this.setState({
				changePrice: {
					...this.state.changePrice,
					[name] : value
				}
			});
		}
	}

	changeSlaryBonus = () => {
		var t = this;
		this.setState({
			envenclick: true
		})
		if(this.state.changePrice.price < 0){
			toast.error('금액은 0보다 커야합니다.');
		} else if (moment().valueOf() >= moment(this.state.changePrice.time).valueOf()) {
			toast.error('날짜는 현재보다 커야합니다!');
		} else if(this.state.changePrice.price !== "" && this.state.changePrice.time !== "" && this.state.changePrice.content !== ""){
		    this.props.changeSlaryBonus(this.state.changePrice);
			setTimeout(function(){
				t.setState({
					changePrice: {
						price: '',
						content: ''
					}
				})
			}, 500)
		} else{
			toast.error('전체 데이터를 입력하십시오.');
		}
		setTimeout(function(){
			t.setState({
				envenclick: false
			})
		}, 3000)
	}

	isValidDate(dt) {
		return (dt >= (moment().startOf('day'))  && moment().subtract(1, 'minute') );
	}

	isValidDateEnd(dt, t) {
		if(t && t.timeStart) return (dt >= (moment().startOf('day'))) && moment().subtract(1, 'minute');
		return (dt >= (moment().startOf('day'))) && moment().subtract(1, 'minute');
	}

	render() {
		const { departRoom, name, nameCareer } = this.props.dataCareer;
		const {price} = this.props;
		return (
			<Modal
				className='modalPopup w-55'
				id="ChangePrice"
				show={this.props.openModal}
				onHide={() => this.props.handleChange({ openModal: true })}
			>
				<ul className="nav nav-tabs">
					<li className="nav-item">
						<a className="nav-link active" data-toggle="tab" href="#home">시간변동</a>
					</li>
					<li className="nav-item" onClick={this.loadPriceCurent }>
						<a className="nav-link" data-toggle="tab" href="#menu1">가격변동</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" data-toggle="tab" href="#menu2">변동내역</a>
					</li>
				</ul>
				<div className="tab-content">
					<div className="tab-pane active tab-1" id="home">
						<div>
							<p className="mt-3 mb-1">동 호수 : {price.area} {price.room}</p>
							<p>간병인: {price.aide}</p>

							<p className="mt-3 mb-4">원하는 시간을 선택 후 변경해주세요</p>
							<label className="checkbox-wrapper mb-2">
								<input
									type="checkbox"
									name="hospitalFacility00"
									value="1"
									className="hospitalFacility"
									onChange={this.handleChange1}
									defaultChecked={this.state.type1}
									
								/>
								시작시간
								<span className="checkmark">
								</span>
							</label>
							<div className="form-group row">
								<div className="col-6">
									<Datetime
										className="input-date"
										name="start"
										timeFormat="HH:mm:ss"
										isValidDate={(dt) =>this.isValidDate(dt, this)}
										onChange={evt => this.handleChangeInput(evt, 1)}
										value ={moment(this.state.timeStart)}
										// defaultValue={this.state.timeStart}
										ref="start"
										inputProps={{ placeholder: '일시를 선택하세요', disabled: this.state.time1  }}
									/>
								</div>
							</div>
							<label className="checkbox-wrapper mb-2">
								<input
									type="checkbox"
									onChange={this.handleChange2}
									value="2"
									name="hospitalFacility01"
									className="hospitalFacility"
									defaultChecked={this.state.type2}
								/>
								종료예약시간
								<span className="checkmark">
								</span>
							</label>
							<div className="form-group row">
								<div className="col-6">
									<Datetime
										className="input-date"
										name="end"
										timeFormat="HH:mm:ss"
										isValidDate={(dt) => this.isValidDateEnd(dt,this.state)}
										onChange={evt => this.handleChangeInput(evt, 2)}
										defaultValue={this.state.timeEnd}
										inputProps={{ placeholder: '일시를 선택하세요', disabled: this.state.time2 }}
									/>
								</div>
							</div>
							<div className="action text-center">
								<button
									className="btn btn-primary"
									disabled={this.state.envenclick}
									onClick={() => this.changeTimeRecruitment()}
								>확인</button>
								<button
									className="btn btn-secondary"
									onClick={() => this.onCloseModal()}
								>취소</button>
							</div>
						</div>
					</div>
					<div className="tab-pane fade" id="menu1">
						<div>
							<p className="mt-3 mb-1">동 호수 : {price.area} {price.room}</p>
							<p>간병인 : {price.aide}</p>

							<p className="mt-3 mb-2">변경할 금액을 입력해주세요</p>
							<p className="mb-1">기본금액 :  {formatNumber(Number(price.curent))} 원</p>
							<p>현재 금액 :  {formatNumber(Number(price.bonus) + Number(price.curent))}  원</p>

							<div className="form-group row mt-3">
								<label className="col-sm-3 col-form-label">변동 금액 :</label>
								<div className="col-sm-9">
									<input
										type="text"
										onKeyPress={(e) => isNumberKey(e)}
										name="price"
										onChange={this.handlePrice}
										value={this.state.changePrice.price}
										className="form-control"
										placeholder="변동 금액"
									/>
								</div>
							</div>
							<div className="form-group row">
								<label className="col-sm-3 col-form-label">날짜 :</label>
								<div className="col-sm-9">
									<Datetime
										className="input-date"
										timeFormat="HH:mm:ss"
										onChange={evt => this.handleChangeInput(evt, 3)}
										inputProps={{ placeholder: '일시를 선택하세요', readOnly: true }}
									/>
								</div>
							</div>
							<div className="form-group row">
								<label className="col-sm-3 col-form-label">변경 이유 :</label>
								<div className="col-sm-9">
									<textarea
										type="text"
										rows="3"
										name="content"
										onChange={this.handlePrice}
										value={this.state.changePrice.content}
										className="form-control"
										placeholder="이유를 입력해주세요" />
								</div>
							</div>
							<div className="action text-center">
								<button
									className="btn btn-primary"
									disabled={this.state.envenclick}
									onClick={this.changeSlaryBonus}
								>확인</button>
								<button
									className="btn btn-secondary"
									onClick={() => this.onCloseModal()}
								>취소</button>
							</div>
						</div>
					</div>
					<div className="tab-pane fade" id="menu2">
						<div className="">
							<p>변동상세내역</p>
							<ul>
								{this.renderHistory(this.props.historyChange)}
							</ul>
							<p>{ this.props.timeHistory.length > 0 ? '세부 사항 변경 시간' : ''}</p>
							<ul>
								{this.renderHistoryTime(this.props.timeHistory)}	
							</ul>
						</div>

						<div className="action text-center mt-5">
							<button
								className="btn btn-secondary"
								onClick={() => this.props.handleChange({ openModal: false })}
							>취소</button>
						</div>
					</div>
				</div>
			</Modal>
		);
	}
}

export default ModalChangePrice;