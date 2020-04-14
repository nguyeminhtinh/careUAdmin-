import React, { Component } from 'react';
import { getPrefixVacationstatus, getPrefixEndDate } from '../../services/functionService';
import Select from 'react-select';
import { connect } from 'react-redux';
import httpService from '../../services/httpService';

const apiEndpoint = process.env.REACT_APP_API_URL;

class HeaderSearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listArea: [{ value: '', label: '선택' }],
			valueArea: '',
			listRoom: [{ value: '', label: '선택' }],
			valueRoom: '',
			valueTypeRoom: '',
			careGiver_name: "",
			listSatustOff : [],
			statusOff: "",
			listSort: [],
			dateSort: "",
			disabled: true,
		}
	}

	componentWillMount() {
		let listAreaProps = this.props.listArea;
		let listArea = this.mapListToSelectData(listAreaProps, "");
		this.setState({
			...this.state,
			listArea,
			listSatustOff: getPrefixVacationstatus().prefixVacationstatus,
			listSort: getPrefixEndDate().prefixEndDate
			
		})
	}

	updateValue = async (id, name) => {

		switch (name) {
			case "ward":
					let valueArea = this.state.listArea.filter(item => item.value === id)[0];
					await this.setState({
						...this.state,						
						valueArea,
						valueRoom : null

					}, async ()=>{
						let response = await httpService.get(apiEndpoint + "rooms/" + (id <=0 ? 0: id) + "/area");
						let listRoom = this.mapListToSelectData(response.data.data, "호");			
						await this.setState({
							...this.state,
							listRoom						
						})		
					})	
						
				break;
			case "rooms":
				let valueRoom = this.state.listRoom.filter(item => item.value === id)[0];	
				await this.setState({
					...this.state,
					valueRoom
				})
				break;
			case "typeRoom":
				let valueTypeRoom = this.props.listType.filter(item => item.value === id)[0];
				await this.setState({
					...this.state,
					valueTypeRoom
				})

				break;
			case "nameCareer":
				let careGiver_name =  id;
				await this.setState({
					...this.state,
					careGiver_name
				})

				break;
			case "statusOff":
				let dataStatus = [...this.state.listSatustOff]
				
				let statusOff = dataStatus.filter(item => item.value === id)[0];
				await this.setState({
					...this.state,
					statusOff
				})

				break;
			case "dateSort":
				let dataSort = [...this.state.listSort]
				
				let dateSort = dataSort.filter(item => item.value === id)[0];
				await this.setState({
					...this.state,
					dateSort
				})

				break;
			default:
				break;
		}
	}

	mapListToSelectData(data, suffixLable) {
		let dataSelect = data.map(item => {
			let label = item.name + (suffixLable || '');
			return { value: item.id, label: label };
		})
		return [{ value: '', label: '선택' }, ...dataSelect];
	}

	mapListToSelectData2(data, suffixLable) {
		let dataSelect = data.map(item => {
			let label = item.name + (suffixLable || '');
			return { value: item.id, label: label };
		})
		return [{ value: '', label: '선택' }, ...dataSelect];
	}

	submitFilter = () => {
		let { valueArea, valueRoom, valueTypeRoom, careGiver_name, statusOff, dateSort} = this.state;
		let dataSearch = { valueArea, valueRoom, valueTypeRoom, careGiver_name, statusOff, dateSort };

		this.props.handleFilterData(dataSearch);
	}
	
	render() {

		return (
			<div className="header-search header-staus">
				<h5>검색</h5>
				<div className="select-fix d-flex align-items-center justify-content-between">
					<div className="d-flex align-items-center justify-content-between">
						<label className="">병동:</label>
						<div className="">
							<Select
								placeholder="선택"
								value={this.state.valueArea}
								onChange={(e) => this.updateValue(e.value, "ward")}
								options={this.state.listArea}
								blurInputOnSelect={true}
								isSearchable={false}
							/>
						</div>
					</div>
					<div className="d-flex align-items-center justify-content-between">
						<label className="">호실:</label>
						<div className="">
							<Select
								placeholder="선택"
								// className={(this.state.listRoom.length <= 1 ? "disabled" : " ") + " mr-3"}
								className=" mr-3"
								value={this.state.valueRoom}
								onChange={(e) => this.updateValue(e.value, "rooms")}
								options={this.state.listRoom}
								blurInputOnSelect={true}
								isSearchable={false}
							/>
						</div>
					</div>
					<div className="d-flex align-items-center justify-content-between">
						<label className="">병실:</label>
						<div className="">
							<Select
								placeholder="선택"
								value={this.state.valueTypeRoom}
								onChange={(e) => this.updateValue(e.value, "typeRoom")}
								options={this.props.listType}
								blurInputOnSelect={true}
								isSearchable={false}
							/>
						</div>
					</div>
					<div className="d-flex align-items-center justify-content-between">
						<label className="">간병인 이름:</label>
						<div className="">
							<input
								className="mb-0 form-control"
								placeholder="입력"
								onChange={(e) => this.updateValue(e.target.value, 'nameCareer')}
							/>
						</div>
					</div>
					<div className="d-flex align-items-center justify-content-between">
						<label className="">휴가상태:</label>
						<div className="">
							<Select
								placeholder="선택"
								value={this.state.statusOff}
								options={this.state.listSatustOff}
								onChange={(e) => this.updateValue(e.value, "statusOff")}
								blurInputOnSelect={true}
								isSearchable={false}
							/>
						</div>
					</div>
					<div className="d-flex align-items-center justify-content-between">
						<label className="">종료예약일:</label>
						<div className="">
							<Select
								placeholder="선택"
								value={this.state.dateSort}
								options={this.state.listSort}
								onChange={(e) => this.updateValue(e.value, "dateSort")}
								blurInputOnSelect={true}
								isSearchable={false}
							/>
						</div>
					</div>
					<div className="text-right">
						<button
							className="btn btn-primary"
							onClick={this.submitFilter}
						>검색</button>
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
		listType: state.typeReducer.listType
	}
}

export default connect(mapStateToProps)(HeaderSearch)