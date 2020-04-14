import React, { Component } from 'react';
import { getDeadline } from '../../../services/functionService';
import Select from 'react-select';
import { connect } from 'react-redux';
import httpService from '../../../services/httpService';

const apiEndpoint = process.env.REACT_APP_API_URL;
class SearchNotification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listArea: [],
			valueArea: '',
			listRoom: [],
			valueRoom: '',
			valueTypeRoom: '',
			listSort: [],
			endDaySort: '',
			disabled: true,
		}
	}

	componentWillMount() {
		let listAreaProps = this.props.listArea;
		let listArea = this.mapListToSelectData(listAreaProps, "")
		this.setState({
			...this.state,
			listArea,
			listSort: getDeadline().prefixDeadline
		})

	}
	updateValue = async (id, name) => {
		// this.props.handleChangeDataFilter(id, name);  //call the passed props here

		switch (name) {
			case "area":
				let dataArea = [...this.state.listArea]
				let valueArea = dataArea.filter(item => item.value === id)[0]
				await this.setState({
					...this.state,
					valueArea,
					valueRoom: null

				}, async () => {
					let listRoom = [];
					if (id !== '') {
						let response = await httpService.get(apiEndpoint + "rooms/" + id + "/area");
						listRoom = this.mapListToSelectData(response.data.data, "")
					}

					await this.setState({
						...this.state,
						listRoom
					})
				})

				break;
			case "room":
				let dataRoom = [...this.state.listRoom];
				let valueRoom = dataRoom.filter(item => item.value === id)[0]
				await this.setState({
					...this.state,
					valueRoom
				})

				break;
			case "typeRoom":
				let valueTypeRoom = this.props.listType.filter(item => item.value === id)[0]
				await this.setState({
					...this.state,
					valueTypeRoom
				})

				break;
			case "sort":
				let dataSort = [...this.state.listSort]
				let endDaySort = dataSort.filter(item => item.value === id)[0]
				await this.setState({
					...this.state,
					endDaySort
				})

				break;

			default:
				break;
		}

	}

	mapListToSelectData(data, suffixLable) {
		let dataSelect = data.map(item => {
			let label = item.name + (suffixLable || '')
			return { value: item.id, label: label }
		})
		return [{ value: '', label: '선택' }, ...dataSelect]
	}

	submitFilter = () => {
		let { valueArea, valueRoom, valueTypeRoom, endDaySort } = this.state;
		let dataSearch = { valueArea, valueRoom, valueTypeRoom, endDaySort };
		this.props.handleSubmitFilter(dataSearch);
	}

	render() {
		return (
			<div className="header-search header-notification">
				<h5>검색</h5>
				<div className="d-flex">
					<div className="d-flex w-100">
						<label className="mr-2">병동 :</label>
						<div className="mr-5">
							<Select
								placeholder="선택"
								value={this.state.valueArea}
								onChange={(e) => this.updateValue(e.value, "area")}
								options={this.state.listArea}
								blurInputOnSelect={true}
								isSearchable={false}
							/>
						</div>

						<label className="mr-2">호실 :</label>
						<div className="mr-5">
							<Select
								className={(this.state.listRoom.length <= 1 ? "disabled" : " ")}
								placeholder="선택"
								value={this.state.valueRoom}
								onChange={(e) => this.updateValue(e.value, "room")}
								options={this.state.listRoom}
								blurInputOnSelect={true}
								isSearchable={false}
							/>
						</div>
						<label className="mr-2">병실:</label>
						<div className="mr-5">
							<Select
								placeholder="선택"
								value={this.state.valueTypeRoom}
								onChange={(e) => this.updateValue(e.value, "typeRoom")}
								options={this.props.listType}
								blurInputOnSelect={true}
								isSearchable={false}
							/>
						</div>

						<label className="mr-2">기간 정렬 :</label>
						<div className="d-flex two-select mr-5">
							{/* <Select className="mr-5"
								placeholder="등록일"
								options={getRegistrationDate().prefixRegistrationDate}
								blurInputOnSelect={true}
								isSearchable={false}
							/> */}
							<Select
								placeholder="선택"
								value={this.state.endDaySort}
								options={this.state.listSort}
								onChange={(e) => this.updateValue(e.value, "sort")}
								blurInputOnSelect={true}
								isSearchable={false}
							/>
						</div>
					</div>
					<div className="text-right ml-5 ">
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
		listType: state.typeReducer.listType,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getListNotification: data => {
			//dispatch(getListNotification(data))
		},

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchNotification)
