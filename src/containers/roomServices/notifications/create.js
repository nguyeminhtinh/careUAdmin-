import React, { Component } from 'react';
import '../../../public/css/notification.css';
import Root from '../../../components/layout/root';
import CreateNotificationComponent from '../../../components/roomServices/notifications/create';
import moment from 'moment';
import { connect } from 'react-redux';
import { ROLE } from '../../../config.json';
import { checkAuth } from '../../../services/functionService';

class CreateNotification extends Component {
	constructor(props) {
		super(props);

		checkAuth("rooms/notice", this.props.user, ROLE.ALL, true);

		this.state = {
			title: "공고 등록",
			activeUser: true,
			dataEdit: {
				register_flag: false
			}
		}
	}

	componentWillMount() {
		if (this.props.match.params.id !== undefined) {
			this.setState({
				title: "병실관리(수정)",
				dataEdit: {
					register_flag: true,
					range: "B동",
					room_number: "102호",
					room_type: "4",
					room_type_other: "목욕 도우미",
					patient_number: "6",
					type_announcement: "1",
					per_day_charge: "80,000",
					daily_pay_add: "6,000",
					daily_pay_add_times: "30",
					working_style: "1",
					long_term: moment("2019-04-01 00:00"),
					short_term: moment("2019-05-11 00:00"),
					man_caregiver: "2",
					woman_caregiver: "4",
					irrelevant_caregiver: "6",
					couple_caregiver: true,
					section: "2",
					feeding: "4",
					physiotherapy: "6",
					dialysis: "8",
					respiratory: "10",
					room_facility: [0, 1, 2, 3, 4, 5],
					hospital_facility: [0, 1, 2, 3],
					regis_date_time: "2018-08-31 15:02:02",
					writer: "김가나",
					note: "메모는 간호사들만 볼 수 있으며, 간병인 앱에는 보여지지 않습니다."
				}
			})
		}
	}

	handleChange = (data) => {
		this.setState({
			...data
		});
	}

	render() {
		const { title, activeUser } = this.state;

		return (
			<Root
				title={title}
				activeUser={activeUser}
			>
				<CreateNotificationComponent
					sickroomManagement={this.state.dataEdit}
				/>
			</Root>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		user: state.authReducer.user.user,
	}
}
export default (connect(mapStateToProps)(CreateNotification));
