import React, { Component } from 'react';
import { isNumberKey, getPrefixPhoneNumber } from '../../services/functionService';
import Select from 'react-select';
import { connect } from 'react-redux';
import httpService from '../../services/httpService';
import _ from 'lodash';

const apiEndpoint = process.env.REACT_APP_API_URL;

class HeaderSearchHistory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listArea: [],
			valueArea: '',
			listRoom: [],
			valueRoom: '',
			year: "",
			month: "",
			careGiver_name: "",
			phoneFirst: "",
			phoneSecond: "",
			phoneEnd: "",
			numberRegister: "",
			disabled: true,
		}
	}

	componentWillMount() {
		// let listAreaProps = this.props.listType;
		// let listArea = this.mapListToSelectData(listAreaProps, "동");
		let listArea = this.props.listType;
		this.setState({
			...this.state,
			listArea
		})
	}

	updateValue = async (id, name) => {
		switch (name) {
			case "year":
				let year =  id;
				this.setState({
					...this.state,
					year
				})
				this.props.selectYear(year);
				break;
			case "month":
				let month = id
				this.setState({
					...this.state,
					month
				})

				break;
			case "ward":
					let valueArea = this.state.listArea.filter(item => item.value === id)[0];
					this.setState({
						...this.state,						
						valueArea,
						valueRoom : null

					}, async ()=>{
						let response = await httpService.get(apiEndpoint + "rooms/" + (id <=0 ? 0: id) + "/type?hospital_id=" + this.props.hospital_id);
						let listRoom = this.mapListToSelectData(response.data.data, "호");		
						this.setState({
							...this.state,
							listRoom						
						})
						
					})	
						
				break;
			case "rooms":
				let valueRoom = this.state.listRoom.filter(item => item.value === id)[0];	
				this.setState({
					...this.state,
					valueRoom
				})
				break;
			case "nameCareer":
				let careGiver_name = id;
				this.setState({
					...this.state,
					careGiver_name
				})

				break;

			case "phoneFirst":
				let re = /[\u3131-\uD79D]/ugi;
				let text = id.match(re);
				if (!_.isArray(text)) {
					let phoneFirst =  id;
					this.setState({
						...this.state,
						phoneFirst
					})
				}
				break;
			case "phoneSecond":
				let re1 = /[\u3131-\uD79D]/ugi;
				let text1 = id.match(re1);
				if (!_.isArray(text1)) {
					let phoneSecond =  id;
					this.setState({
						...this.state,
						phoneSecond
					})
				}
				break;
			case "phoneEnd":
				let re2 = /[\u3131-\uD79D]/ugi;
				let text2 = id.match(re2);
				if (!_.isArray(text2)) {
					let phoneEnd =  id;
					this.setState({
						...this.state,
						phoneEnd
					})
				}
				break;
			case "numberRegister":
					let numberRegister =  id;
					this.setState({
						...this.state,
						numberRegister
					})
	
				break;
			default:
				break;
		}
	}
	
	mapListToSelectData(data, suffixLable) {
		let dataSelect = data.map(item => {
			let label = item.name + (suffixLable || '');
			return { value: item.id, label: label }
		})
		return [{ value: '', label: '선택' }, ...dataSelect];
	}

	submitFilter = () => {
		let { year, month ,valueArea, valueRoom, careGiver_name, phoneFirst , phoneSecond, phoneEnd , numberRegister} = this.state;
		let dataSearch = { year, month, valueArea, valueRoom, careGiver_name, phoneFirst , phoneSecond, phoneEnd, numberRegister };
		this.props.handleFilterData(dataSearch);
	}

	render() {
 
		return (

			<div className="header-search history">
				<h2 className="m-0 pb-4 color-black">검색</h2>
				<div className="groups-form d-flex w-100 text-nowrap">
					<label className="label-name">기간 검색:</label>
					<Select
						placeholder="선택"
						className="mr-3"
						options={this.props.renderOptionYear()}
						onChange={(e) => this.updateValue(e.value, "year")}
						blurInputOnSelect={true}
						isSearchable={false}
					/>

					<Select
						className="mx-3"
						placeholder="선택"
						options={this.props.renderOptionMonth()}
						onChange={(e) => this.updateValue(e.value, "month")}
						blurInputOnSelect={true}
						isSearchable={false}
					/>
					<div className="groups-form d-flex text-nowrap">
						<label className="ml-3">병실: </label>

						<Select
							placeholder="일반실"
							className="mr-3"
							value={this.state.valueArea}
							onChange={(e) => this.updateValue(e.value, "ward")}
							options={this.state.listArea}
							blurInputOnSelect={true}
							isSearchable={false}
						/>

						<label className="ml-4">호실: </label>

						<Select
							placeholder="선택"
							className={(this.state.listRoom.length <= 1 ? "disabled" : " ") + " mr-3"}
							value={this.state.valueRoom}
							onChange={(e) => this.updateValue(e.value, "rooms")}
							options={this.state.listRoom}
							blurInputOnSelect={true}
							isSearchable={false}
						/>

						<label className="ml-4">간병인이름: </label>
						<input
							type="text"
							className="form-control max-218"
							onChange={(e) => this.updateValue(e.target.value, 'nameCareer')}
						/>
					</div>
				</div>

				<div className="groups-form d-flex text-nowrap">
					<div className="d-flex w-100">
						<label className="label-name">간병인 휴대전화번호: </label>
						<div className="d-flex justify-content-start handling-problem custom-slectoption w-150">
							<Select
								className="d-inline-block"
								value=""
								onChange={(e) => this.updateValue(e.value, "phoneFirst")}
								options={getPrefixPhoneNumber().prefix}
								blurInputOnSelect={true}
								isSearchable={false}
							/>
							<input
								type="text"
								className="form-control combo-input top4"
								value={this.state.phoneFirst}
								placeholder="000"
								onKeyPress={(e) => isNumberKey(e)}
								maxLength="3"
								onChange={(e) => this.updateValue(e.target.value, "phoneFirst")}
							/>
						</div>

						<label className="mx-2">-</label>

						<input
							type="text"
							className="form-control w150"
							placeholder="0000"
							maxLength="4"
							value={this.state.phoneSecond}
							onKeyPress={(e) => isNumberKey(e)}
							onChange={(e) => this.updateValue(e.target.value, 'phoneSecond')}
						/>

						<label className="mx-2">-</label>

						<input
							type="text"
							value={this.state.phoneEnd}
							className="form-control w150"
							placeholder="0000"
							maxLength="4"
							onKeyPress={(e) => isNumberKey(e)}
							onChange={(e) => this.updateValue(e.target.value, 'phoneEnd')}
						/>
						<label className="ml-4 pl-2 style-w">등록증번호: </label>
						<div className="d-flex w-305 pl-0 pl-xl-1">
							<input 
							type="text" 
							className="form-control max-480" 
							onKeyPress={(e) => isNumberKey(e)}
							onChange={(e) => this.updateValue(e.target.value, 'numberRegister')}
							/>
						</div>
						<div className="text-right w-22">
							<button
								className="btn btn-primary ml-3 p-0 h-33"
								onClick= {this.submitFilter}
							>
								검색
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.authReducer.user.user,
		listArea: state.areaReducer.listArea,
		listType: state.typeReducer.listType,
		hospital_id: state.authReducer.user.user.hospital === null ? null : state.authReducer.user.user.hospital.id
	}
}

export default connect(mapStateToProps)(HeaderSearchHistory)