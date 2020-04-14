import httpService from "./httpService";
import moment from 'moment';
import { formatNumber } from '../services/functionService';

const apiEndpoint = process.env.REACT_APP_API_URL + "rooms/recruitments/";
const apiEndpointAide = process.env.REACT_APP_API_URL;
const notifications = [
	// {
	// 	id: 1,
	// 	departRoom: "A동",
	// 	name: "102호",
	// 	typeRoom: "일반실",
	// 	salary: "85,000",
	// 	numberOfPatient: "6",
	// 	careers: [
	// 		{ id: 1, value: 2 },
	// 		{ id: 2, value: 5 }
	// 	],
	// 	details: "석션1 / 피딩1 / 물리치료1 / 투석0 / 호흡기0",
	// 	date: "2018-12-01 14:00",
	// 	type: 2,
	// 	numberCandidate: 8,
	// 	caregiverOnRequests: [
	// 		{ id: 1, name: "abc", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹" },
	// 		{ id: 2, name: "왕금순", gender: "여자", age: "50세", grade: 5, individualOrGroup: "그룹" },
	// 		{ id: 3, name: "457", gender: "남자", age: "40세", grade: 3.5, individualOrGroup: "개인" },
	// 		{ id: 4, name: "장혜숙", gender: "남자", age: "50세", grade: 3, individualOrGroup: "개인" },
	// 		{ id: 5, name: "장영애", gender: "여자", age: "60세", grade: 2, individualOrGroup: "그룹" },
	// 		{ id: 6, name: "9890 ABC", gender: "여자", age: "60세", grade: 5, individualOrGroup: "개인" },
	// 		{ id: 7, name: "이보영", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹" },
	// 		{ id: 22, name: "왕금순", gender: "여자", age: "50세", grade: 5, individualOrGroup: "그룹" },
	// 		{ id: 23, name: "457", gender: "남자", age: "40세", grade: 3.5, individualOrGroup: "개인" },
	// 		{ id: 24, name: "장혜숙", gender: "남자", age: "50세", grade: 3, individualOrGroup: "개인" },
	// 		{ id: 25, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹" },
	// 	],
	// 	caregiverApprove: [
	// 		{ id: 8, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹", startTime: "2019-05-10 15:00", cancel: true },
	// 		{ id: 9, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "개인", startTime: "", cancel: false },
	// 		{ id: 10, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹", startTime: "2019-05-10 15:00", cancel: true },
	// 		{ id: 11, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "개인", startTime: "", cancel: false },
	// 		{ id: 12, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "개인", startTime: "2019-05-10 15:00", cancel: true },
	// 		{ id: 13, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹", startTime: "", cancel: false },
	// 		{ id: 14, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹", startTime: "", cancel: false },
	// 	]
	// },
	// {
	// 	id: 2,
	// 	departRoom: "B동",
	// 	name: "107호",
	// 	typeRoom: "일반실",
	// 	salary: "85,000",
	// 	numberOfPatient: "6",
	// 	careers: [
	// 		{ id: 1, value: 2 },
	// 		{ id: 2, value: 2 }
	// 	],
	// 	details: "석션1 / 피딩1 / 물리치료1 / 투석0 / 호흡기0",
	// 	date: "2018-12-01 14:00",
	// 	type: 1,
	// 	numberCandidate: 6,
	// 	caregiverOnRequests: [
	// 		{ id: 8, name: "장영애", gender: "여자", age: "60세", grade: 3.5, individualOrGroup: "그룹" },
	// 		{ id: 9, name: "장영애", gender: "남자", age: "60세", grade: 4, individualOrGroup: "그룹" },
	// 		{ id: 10, name: "장영애", gender: "남자", age: "60세", grade: 4, individualOrGroup: "그룹" },
	// 		{ id: 11, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹" },
	// 		{ id: 12, name: "장영애", gender: "남자", age: "60세", grade: 5, individualOrGroup: "그룹" },
	// 		{ id: 13, name: "장영애", gender: "여자", age: "60세", grade: 4.5, individualOrGroup: "그룹" },
	// 		{ id: 14, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹" },
	// 	],
	// 	caregiverApprove: [
	// 		{ id: 1, name: "이보영", gender: "여자", age: "60세", grade: 4.5, individualOrGroup: "그룹", startTime: "2019-05-10 15:00", cancel: true },
	// 		{ id: 2, name: "왕금순", gender: "여자", age: "50세", grade: 5, individualOrGroup: "그룹", startTime: "", cancel: false },
	// 	]
	// },
	// {
	// 	id: 3,
	// 	departRoom: "C동",
	// 	name: "107호",
	// 	typeRoom: "일반실",
	// 	salary: "85,000",
	// 	numberOfPatient: "6",
	// 	careers: [
	// 		{ id: 1, value: 6 },
	// 		{ id: 2, value: 1 }
	// 	],
	// 	details: "석션1 / 피딩1 / 물리치료1 / 투석0 / 호흡기0",
	// 	date: "2018-12-01 14:00",
	// 	type: 2,
	// 	numberCandidate: 10,
	// 	caregiverOnRequests: [
	// 		{ id: 1, name: "이보영", gender: "여자", age: "60세", grade: 4.5, individualOrGroup: "그룹" },
	// 		{ id: 2, name: "왕금순", gender: "여자", age: "50세", grade: 5, individualOrGroup: "그룹" },
	// 		{ id: 3, name: "전신옥", gender: "남자", age: "40세", grade: 3, individualOrGroup: "개인" },
	// 		{ id: 4, name: "장혜숙", gender: "남자", age: "50세", grade: 3.5, individualOrGroup: "개인" },
	// 		{ id: 5, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹" },
	// 		{ id: 6, name: "전신옥 ABC", gender: "여자", age: "60세", grade: 5, individualOrGroup: "개인" },
	// 		{ id: 7, name: "이보영", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹" }
	// 	],
	// 	caregiverApprove: [
	// 		// { id: 8, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹", startTime: "2019-05-10 15:00", cancel: true },
	// 		// { id: 9, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹", startTime: "", cancel: false },
	// 		// { id: 10, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹", startTime: "", cancel: false },
	// 		// { id: 11, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹",startTime: "", cancel: false },
	// 		// { id: 12, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹", startTime: "2019-05-10 15:00", cancel: true },
	// 		// { id: 13, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹", startTime: "", cancel: false },
	// 		// { id: 14, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹", startTime: "", cancel: false },
	// 	]
	// },
	// {
	// 	id: 4,
	// 	departRoom: "D동",
	// 	name: "107호",
	// 	typeRoom: "준중환자실",
	// 	salary: "85,000",
	// 	numberOfPatient: "6",
	// 	careers: [
	// 		{ id: 1, value: 3 },
	// 		{ id: 2, value: 3 }
	// 	],
	// 	details: "석션1 / 피딩1 / 물리치료1 / 투석0 / 호흡기0",
	// 	date: "2018-12-01 14:00",
	// 	type: 3,
	// 	status: "신청 10명",
	// 	caregiverOnRequests: [],
	// 	caregiverApprove: []
	// },
	// {
	// 	id: 5,
	// 	departRoom: "F동",
	// 	name: "102호",
	// 	typeRoom: "준중환자실",
	// 	salary: "85,000",
	// 	numberOfPatient: "6",
	// 	careers: [
	// 		{ id: 1, value: 1 },
	// 		{ id: 2, value: 2 }
	// 	],
	// 	details: "석션1 / 피딩1 / 물리치료1 / 투석0 / 호흡기0",
	// 	date: "2018-12-01 14:00",
	// 	type: 1,
	// 	numberCandidate: 10,
	// 	caregiverOnRequests: [
	// 		{ id: 1, name: "abc", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹" },
	// 		{ id: 2, name: "왕금순", gender: "여자", age: "50세", grade: 5, individualOrGroup: "그룹" },
	// 		{ id: 3, name: "457", gender: "남자", age: "40세", grade: 3.5, individualOrGroup: "개인" },
	// 		{ id: 4, name: "장혜숙", gender: "남자", age: "50세", grade: 3, individualOrGroup: "개인" },
	// 		{ id: 5, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹" },
	// 		{ id: 6, name: "9890 ABC", gender: "여자", age: "60세", grade: 5, individualOrGroup: "개인" },
	// 		{ id: 7, name: "이보영", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹" }
	// 	],
	// 	caregiverApprove: [
	// 		{ id: 8, name: "장영애", gender: "여자", age: "60세", grade: 4.5, individualOrGroup: "그룹", startTime: "2019-05-10 15:00", cancel: true },
	// 		{ id: 9, name: "장영애", gender: "여자", age: "60세", grade: 3, individualOrGroup: "그룹", startTime: "", cancel: false },
	// 		{ id: 10, name: "장영애", gender: "여자", age: "60세", grade: 3.5, individualOrGroup: "그룹", startTime: "", cancel: false },
	// 		{ id: 11, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹", startTime: "", cancel: false },
	// 		{ id: 12, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹", startTime: "", cancel: false },
	// 		{ id: 13, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹", startTime: "2019-08-10 10:30", cancel: true },
	// 		{ id: 14, name: "장영애", gender: "여자", age: "60세", grade: 4, individualOrGroup: "그룹", startTime: "", cancel: false },
	// 	]
	// }
]

const dataHistory = [
	{
		id: 1,
		caregiverId: 1,
		departRoom: "A동 101호",
		nameHospital: "가온병원 1",
		date: "2019-01-01 12:00 ~ 2019-01-31 12:00",
		room: "중환자실",
		status: "단기"
	},
	{
		id: 2,
		caregiverId: 1,
		departRoom: "A동 101호",
		nameHospital: "가온병원",
		date: "2019-01-01 12:00 ~ 2019-01-31 12:00",
		room: "중환자실",
		status: "단기"
	},
	{
		id: 3,
		caregiverId: 1,
		departRoom: "A동 101호",
		nameHospital: "가온병원 3",
		date: "2019-01-01 12:00 ~ 2019-01-31 12:00",
		room: "중환자실",
		status: "단기"
	},
	{
		id: 4,
		caregiverId: 1,
		departRoom: "A동 101호",
		nameHospital: "가온병원 4",
		date: "2019-01-01 12:00 ~ 2019-01-31 12:00",
		room: "중환자실",
		status: "단기"
	},
	{
		id: 5,
		caregiverId: 1,
		departRoom: "A동 101호",
		nameHospital: "가온병원",
		date: "2019-01-01 12:00 ~ 2019-01-31 12:00",
		room: "중환자실",
		status: "단기"
	},
	{
		id: 6,
		caregiverId: 1,
		departRoom: "A동 101호",
		nameHospital: "가온병원 6",
		date: "2019-01-01 12:00 ~ 2019-01-31 12:00",
		room: "중환자실",
		status: "단기"
	},
	{
		id: 7,
		caregiverId: 1,
		departRoom: "A동 101호",
		nameHospital: "가온병원 7",
		date: "2019-01-01 12:00 ~ 2019-01-31 12:00",
		room: "중환자실",
		status: "단기"
	},
	{
		id: 3,
		caregiverId: 2,
		departRoom: "A동 101호",
		nameHospital: "가온병원",
		date: "2019-01-01 12:00 ~ 2019-01-31 12:00",
		room: "중환자실",
		status: "단기"
	},
	{
		id: 4,
		caregiverId: 2,
		departRoom: "A동 101호",
		nameHospital: "가온병원 2",
		date: "2019-01-01 12:00 ~ 2019-01-31 12:00",
		room: "중환자실",
		status: "단기"
	},
	{
		id: 5,
		caregiverId: 2,
		departRoom: "A동 101호",
		nameHospital: "가온병원",
		date: "2019-01-01 12:00 ~ 2019-01-31 12:00",
		room: "중환자실",
		status: "단기"
	},
	{
		id: 6,
		caregiverId: 3,
		departRoom: "A동 101호",
		nameHospital: "가온병원",
		date: "2019-01-01 12:00 ~ 2019-01-31 12:00",
		room: "중환자실",
		status: "단기"
	}
]

const dataHistoryError = [
	{
		id: 1,
		caregiverId: 1,
		nameHospital: "서울대학교 병원 1",
		departRoom: "1057호",
		date: "2018-09-07 12:00",
		room: "일반실",
		status: "단기",
		salary: "80,000",
		notes: "24시간 오전 12시 이전 취소"
	},
	{
		id: 2,
		caregiverId: 1,
		nameHospital: "서울대학교 병원 2",
		departRoom: "1057호",
		date: "2018-09-07 12:00",
		room: "일반실",
		status: "단기",
		salary: "80,000",
		notes: "24시간 오전 12시 이전 취소"
	},
	{
		id: 3,
		caregiverId: 1,
		nameHospital: "서울대학교 병원",
		departRoom: "1057호",
		date: "2018-09-07 12:00",
		room: "일반실",
		status: "단기",
		salary: "80,000",
		notes: "24시간 오전 12시 이전 취소"
	},
	{
		id: 4,
		caregiverId: 1,
		nameHospital: "서울대학교 병원 4",
		departRoom: "1057호",
		date: "2018-09-07 12:00",
		room: "일반실",
		status: "단기",
		salary: "80,000",
		notes: "24시간 오전 12시 이전 취소"
	},
	{
		id: 5,
		caregiverId: 1,
		nameHospital: "서울대학교 병원 5",
		departRoom: "1057호",
		date: "2018-09-07 12:00",
		room: "일반실",
		status: "단기",
		salary: "80,000",
		notes: "24시간 오전 12시 이전 취소"
	},
	{
		id: 6,
		caregiverId: 1,
		nameHospital: "서울대학교 병원 6",
		departRoom: "1057호",
		date: "2018-09-07 12:00",
		room: "일반실",
		status: "단기",
		salary: "80,000",
		notes: "24시간 오전 12시 이전 취소"
	},
	{
		id: 7,
		caregiverId: 1,
		nameHospital: "서울대학교 병원 7",
		departRoom: "1057호",
		date: "2018-09-07 12:00",
		room: "일반실",
		status: "단기",
		salary: "80,000",
		notes: "24시간 오전 12시 이전 취소"
	},
	{
		id: 8,
		caregiverId: 2,
		nameHospital: "서울대학교 병원 8",
		departRoom: "1057호",
		date: "2018-09-07 12:00",
		room: "일반실",
		status: "단기",
		salary: "80,000",
		notes: "24시간 오전 12시 이전 취소"
	},
	{
		id: 9,
		caregiverId: 2,
		nameHospital: "서울대학교 병원 ",
		departRoom: "1057호",
		date: "2018-09-07 12:00",
		room: "일반실",
		status: "단기",
		salary: "80,000",
		notes: "24시간 오전 12시 이전 취소"
	},
	{
		id: 10,
		caregiverId: 2,
		nameHospital: "서울대학교 병원",
		departRoom: "1057호",
		date: "2018-09-07 12:00",
		room: "일반실",
		status: "단기",
		salary: "80,000",
		notes: "24시간 오전 12시 이전 취소"
	},
	{
		id: 11,
		caregiverId: 2,
		nameHospital: "서울대학교 병원",
		departRoom: "1057호",
		date: "2018-09-07 12:00",
		room: "일반실",
		status: "단기",
		salary: "80,000",
		notes: "24시간 오전 12시 이전 취소"
	},
	{
		id: 12,
		caregiverId: 3,
		nameHospital: "서울대학교 병원",
		departRoom: "1057호",
		date: "2018-09-07 12:00",
		room: "일반실",
		status: "단기",
		salary: "80,000",
		notes: "24시간 오전 12시 이전 취소"
	},
	{
		id: 13,
		caregiverId: 3,
		nameHospital: "서울대학교 병원",
		departRoom: "1057호",
		date: "2018-09-07 12:00",
		room: "일반실",
		status: "단기",
		salary: "80,000",
		notes: "24시간 오전 12시 이전 취소"
	},
	{
		id: 14,
		caregiverId: 3,
		nameHospital: "서울대학교 병원",
		departRoom: "1057호",
		date: "2018-09-07 12:00",
		room: "일반실",
		status: "단기",
		salary: "80,000",
		notes: "24시간 오전 12시 이전 취소"
	}
]


export async function getNotifications(masterId, dataFilter, page, pageSz) {
	if (!page || !pageSz) {
		page = 1;
		pageSz = 3;
	}

	let params = { ...dataFilter, limit: pageSz, page: page }
	let response = await httpService.get(apiEndpoint + masterId + '/list', { params: params });
	let notificationList = []
	let countEmergency, countWorkLong, countWorkShort, totalRecord, totalDefault;
	if (response.status === 200) {
		let notifications = [...response.data.data.recruitments];
		totalRecord = response.data.data.total;
		totalDefault = response.data.data.total_default;
		countEmergency = response.data.data.count_emergency;
		countWorkLong = response.data.data.count_work_long;
		countWorkShort = response.data.data.count_work_short;
		
		for (let item of notifications) {
			let startDay = item.start_day !== null ? moment(item.start_day).format("YYYY-MM-DD HH:mm") : '';
			let endDay = item.end_day !== null ? moment(item.end_day).format("YYYY-MM-DD HH:mm") : '';
			let notification = {};
			notification.id = item.id;
			if (item.room) {
				notification.departRoom = item.room.area.name;
				notification.name = item.room.name;
				notification.typeRoom = item.room.type.name;
				//notification.numberOfPatient = item.room.amount;
			}
			notification.numberOfPatient = item.status === 2 ? item.room.count_patient : item.count_patient;
			notification.salary = item.status === 2 ? formatNumber(item.room.amount) : formatNumber(item.salary);
			notification.count_female_aide = item.count_female_aide;
			notification.count_male_aide = item.count_male_aide;
			notification.count_other_aide = item.count_other_aide;
			notification.count_couple_aide = item.count_couple_aide;
			notification.details = item.id;
			notification.date = item.work_type !== null && item.work_type === 1 ? startDay : startDay + ' ~ ' + endDay;
			notification.type = item.id;
			notification.count_aide_waiting = item.count_aide_waiting;
			notification.count_aide_approved = item.count_aide_approved;

			// details: "석션1 / 피딩1 / 물리치료1 / 투석0 / 호흡기0",
			notification.details = `석션${item.care_suction} / 피딩${item.care_feeding} / 물리치료${item.care_physiotherapy} / 투석${item.care_dialysis} / 호흡기${item.care_respiratory}`
			notification.status = item.status;

			notificationList.push(notification);
		}
	}

	return {
		data: notificationList,
		totalPage: totalRecord,
		totalDefault: totalDefault,
		countEmergency,
		countWorkLong,
		countWorkShort
	}
}

export async function getCaregiverOnRequests(recruitmentId, page, pageSz) {
	if (!page || !pageSz) {
		page = 1;
		pageSz = 5;
	}
	let params = { limit: pageSz, page: page }

	let response = await httpService.get(apiEndpoint + recruitmentId + '/list-account-waiting', { params: params });
	let dataRequests = []
	let totalRecord = 0;
	if (response.status === 200) {
		let dataAccounts = [...response.data.data.accounts];
		totalRecord = response.data.data.total;
		for (const item of dataAccounts) {
			let account = {};
			if (item.user) {
				account.id = item.user.id
				account.name = item.user.full_name
				account.gender = item.user.gender === 1 ? "남자" : "여자"
				account.age = item.user.age !== undefined && item.user.age.length > 0 ? item.user.age + "세" : '-'
				account.grade = item.user.avgRating !== undefined ? item.user.avgRating : '-'
				account.individualOrGroup = item.user.group_id ? "그룹" : "개인"
				account.statusOfRecruitment = item.recruitment.status

				dataRequests.push(account)
			}

		}
	}
	return {
		data: dataRequests,
		totalPage: totalRecord,
	}
}

export async function getCaregiverApprove(id, page, pageSz) {
	if (!page || !pageSz) {
		page = 1;
		pageSz = 5;
	}
	let params = { limit: pageSz, page: page }

	let response = await httpService.get(apiEndpoint + id + '/list-account-approved', { params: params });
	let dataApproves = []
	let totalRecord = 0;
	if (response.status === 200) {
		let dataAccounts = [...response.data.data.accounts];
		totalRecord = response.data.data.total;
		for (const item of dataAccounts) {
			let account = {};
			if (item.start_day) {
				account.startTime = moment(item.start_day).format('YYYY-MM-DD HH:mm');
			}
			if (item.user) {
				account.id = item.user.id
				account.name = item.user.full_name
				account.gender = item.user.gender === 1 ? "남자" : "여자"
				account.age = item.user.age !== undefined && item.user.age.length > 0 ? item.user.age + "세" : '-'
				account.grade = item.user.avgRating !== null ? item.user.avgRating : '-'
				account.individualOrGroup = item.user.group_id ? "그룹" : "개인"
				account.statusOfRecruitment = item.recruitment.status

				dataApproves.push(account)
			}
		}
	}
	return {
		data: dataApproves,
		totalPage: totalRecord
	}
}
export function getTotalByType(type) {
	if (type !== 0) {
		return notifications.filter(item => item.type === type).length;
	}

	return notifications.length;
}

export async function approveCaregiver(notificationId, caregiverId) {

	let response = await httpService.put(apiEndpoint + notificationId + '/account/approved', { user_id: caregiverId });

	return response;
}

export async function cancelCaregiver(notificationId, caregiverId) {

	let response = await httpService.put(apiEndpoint + notificationId + '/account/removed', { user_id: caregiverId });

	return response;
}

export async function startCaregiver(notificationId, data) {
	let response = await httpService.put(apiEndpoint + notificationId + '/account/start', data);

	return response;
}
export async function closeNotification(idNotification) {
	let response = await httpService.put(apiEndpoint + idNotification + "/expired");

	return response;
}

export async function createNotification(data) {
	let response = await httpService.post(apiEndpoint + 'create', data);
	return response;
}

export async function getNotification(notificationId) {
	let response = await httpService.get(apiEndpoint + notificationId + '/detail');
	return response;
}

export async function updateNotification(notificationId, data) {
	let response = await httpService.put(apiEndpoint + notificationId + '/update', data);
	return response;
}

export async function getDetailAide(data) {
	let response = await httpService.get(apiEndpointAide + 'users/' + data + '/detail');
	return response.data.data;
}

export async function getCaregiverHistory(id, page, pageSz) {
	let params = {page: page, limit: pageSz};
	let dataRequests =  await httpService.get(apiEndpointAide + 'users/' + id + '/history', { params: params });
	let datas = JSON.parse(JSON.stringify(dataRequests.data.data.data));
	let result = [], tmp = '';
	datas.map((item, key) => {
		tmp = {
			id: (Number(page) -1) * Number(pageSz) + key + 1,
			nameHospital: item.hospital ? item.hospital.name : '-',
			departRoom: item.room && item.room.area ? item.room.area.name : '-',
			date: item.start_day + ' ~ ' + item.end_day,
			room: item.room ? item.room.name : '-',
			status: item.status,
		};
		result[key] = tmp;
		return item;
	});
	let data = {
		data: result,
		totalPage: dataRequests.data.data.total
	}
	return data;	
}

export async function getCaregiverHistoryError(id, page, pageSz) {
	let params = {page: page, limit: pageSz};
	let dataRequests =  await httpService.get(apiEndpointAide + 'users/' + id + '/fined', { params: params });
	let datas = JSON.parse(JSON.stringify(dataRequests.data.data.data));
	let result = [], tmp = '';
	datas.map((item, key) => {
		tmp = {
			id: (Number(page) -1) * Number(pageSz) + key + 1,
			nameHospital: item.hospital ? item.hospital.name : '-',
			departRoom: item.room && item.room.type ? item.room.type.name : '-',
			date: item.created_at ? moment(item.created_at).format('YYYY-MM-DD HH:mm') : '-',
			room: item.room ? item.room.name : '-',
			status: item.room && item.room.type ? item.room.type.name : '-',
			salary: item.recruitment ? formatNumber(item.recruitment.salary) : '-', 
			notes: item.content ? item.content : '-'
		};
		result[key] = tmp;
		return item;
	});
	let data = {
		data: result,
		totalPage: dataRequests.data.data.total
	}
	return data;
}

export async function getCountEmergency(data) {
	let response = await httpService.get(apiEndpoint + data + '/count-emergency');
	return response.data.data.count_emergency;
}

export async function setExpired(notificationId, data) {
	let response = await httpService.put(apiEndpoint + notificationId + '/expired', data);
	return response.data;
}

export default { getDetailAide, getNotifications, getCaregiverOnRequests, getCaregiverApprove, getCaregiverHistory, getCaregiverHistoryError, getTotalByType, approveCaregiver, cancelCaregiver, startCaregiver, closeNotification, getCountEmergency, setExpired };

