import { PAGESIZEMODAL } from '../config.json';
import http from "../services/httpService";
import renderHTML from 'react-render-html';
import moment from 'moment';
import { formatNumber } from '../services/functionService';

const apiEndpoint = process.env.REACT_APP_API_URL;
export async function getRoomStatus(data, page, pageSz, id, random=0) {
	let params = {page: page, limit: pageSz, random: random, area_id: data && data.departRoom ? data.departRoom: '', room_id: data && data.room_id ? data.room_id : '', type_id: data && data.typeRoom ? data.typeRoom : '', keyword: data && data.nameCareer ? data.nameCareer : '', status: data && data.statusOff ? data.statusOff : '', working_end_date: data && data.dateSort ? data.dateSort : '' }
	const result = await http.get(apiEndpoint + 'hospitals/' + id + '/list-rooms', { params: params });
	var roomStatusTmp = JSON.parse(JSON.stringify(result.data.data.rooms));
	let datas = roomStatusTmp;
	let results = []; let patient = 0, noti = 0, room = 0;
	datas.map((item, key) => {
		room++;
		let pat;
		if(item.type_room_change && item.type_room_change.length > 0) {
			pat = item.type_room_change[0].count_patient + '명';
		} else {
			// if (item.room_count_patient === 0)
			pat = '미입력';
			// else pat = item.room_count_patient + '명';
		}
		var arrTmp = {
			id: key,
			area: item.area_name === null ? "" : item.area_name,
			name: item.room_name === null ? "" : item.room_name,
			type: item.type_name === null ? "" : item.type_name,
			patient: pat
		};
		// patient += item.room_count_patient;
		results[key] = arrTmp;
		results[key]['careers'] = [];
		let carvastDepath = item.user_room_recruitments;
		carvastDepath.map((item1, key1) => {
			let varVs = item1.vacations;
			let arr2Tmp = '';
			let arr3Tmp = '';
			patient++;
			varVs.map((item2) => {
				arr2Tmp += moment(item2.day_start).format('MMMM Do HH:mm') + ' ~ ' + moment(item2.day_end).format('MMMM Do HH:mm') + ' <br />';
				arr3Tmp += item2.content + ' <br />';
				return item2;
			});
			let notice = item1.notice === null ? 0 : item1.notice.type;
			if(notice !== 0) {
				noti++;
			}
			var arr1Tmp = {
				id: item1.id === null ? "" : item1.id,
				amount: item1.recruitment.salary === null ? "-" : formatNumber(item1.recruitment.salary),
				user: item1.aide.full_name === null ? "-" : item1.aide.full_name,
				start: item1.start_day === null ? "-" : item1.start_day,
				end: item1.end_day === null ? "-" : item1.end_day,
				vacations: arr2Tmp === '' ? "-" : renderHTML(arr2Tmp),
				// status: item1.status === null ? "-" : item1.status,
				status: arr3Tmp === '' ? "-" : renderHTML(arr3Tmp),
				type: notice,
				recruitment: item1.recruitment === null ? 0 : item1.recruitment.id,
				room: item.id === null ? 0 : item.id
			};
			results[key]['careers'][key1] = arr1Tmp;
			return results[key]['careers'];
		});
		return results;
	});
	return {
		data: results,
		notice: noti,
		total: room,
		totalPage: result.data.data.total,
		patient: patient
	};
}

export async function getRoomNormal(data, page, pageSz, id, aide, random = 0) {
	let params = {page: page, limit: pageSz, id: id ? id : '', random: random, aide: aide ? aide : '',  area_id: data && data.departRoom ? data.departRoom: '', room_id: data && data.room_id ? data.room_id : '', type_id: data && data.typeRoom ? data.typeRoom : '', keyword: data && data.nameCareer ? data.nameCareer : '', status: data && data.statusOff ? data.statusOff : '', working_end_date: data && data.dateSort ? data.dateSort : '' }
	const result = await http.get(apiEndpoint + 'hospitals/list-rooms-normal', { params: params });
	var roomStatusTmp = JSON.parse(JSON.stringify(result.data.data.rooms));
	let datas = roomStatusTmp;
	let results = []; let patient = 0, noti = 0, c = 0, room = 0; 
	datas.map((item, key) => {
		let pat;
		room++;
		if(item.type_room_change && item.type_room_change.length > 0) {
			pat = item.type_room_change[0].count_patient + '명';
		} else {
			// if (item.room_count_patient === 0) 
			pat = '미입력';
			// else pat = item.room_count_patient + '명';
		}
		var arrTmp = {
			id: key,
			area: item.area_name === null ? "" : item.area_name,
			name: item.room_name === null ? "" : item.room_name,
			type: item.type_name === null ? "" : item.type_name,
			patient: pat
		};
		results[key] = arrTmp;
		results[key]['careers'] = [];
		let carvastDepath = item.user_room_recruitments;
		carvastDepath.map((item1, key1) => {
			let varVs = item1.vacations;
			let arr2Tmp = '';
			patient++;
			varVs.map((item2) => {
				arr2Tmp += moment(item2.day_start).format('MMMM Do HH:mm') + ' ~ ' + moment(item2.day_end).format('MMMM Do HH:mm') + ' <br />';
				return item2;
			});
			let notice = item1.notice === null ? 0 : item1.notice.type;
			if(notice !== 0) {
				noti++;
			}
			var arr1Tmp = {
				id: c,
				user: item1.aide.full_name === null ? "-" : item1.aide.full_name,
				end: item1.end_day === null ? "-" : item1.end_day,
				vacations: arr2Tmp === '' ? "-" : renderHTML(arr2Tmp),
				status: item1.reason_for_leave === "" ||  item1.reason_for_leave === null ? "-" : item1.reason_for_leave,
			};
			results[key]['careers'][key1] = arr1Tmp;
			c++;
			return results[key]['careers'];
		});
		return results;
	});
	return {
		data: results,
		room: room,
		notice: noti,
		total: result.data.data.total,
		patient: patient
	};
}


export async function apiCloseRecruitment(id, content) {
	let dataClose = {
		content: content,
	}
	var closeRecruitment = await http.put(apiEndpoint + 'hospitals/' + id + '/close', dataClose);
	return closeRecruitment;
}

export async function apiChangeNotice(id, master_id, content) {
	let dataChange = {
		content: content,
		master_id: master_id
	}
	var changeRecruitment = await http.post(apiEndpoint + 'rooms/recruitments/' + id + '/notice', dataChange);
	return changeRecruitment;
}

export async function apiChangeTimeRectuitment(id, data) {
	let dataChange = {
		type1: data.type1, 
		type2: data.type2,
		timeStart: data.timeStart,
		timeEnd: data.timeEnd
	}
	var changeRecruitment = await http.put(apiEndpoint + 'rooms/recruitments/' + id + '/time', dataChange);
	return changeRecruitment;
}

export async function apiHistoryChange(id) {
	var historyRecruitment = await http.get(apiEndpoint + 'rooms/recruitments/' + id + '/history');
	return historyRecruitment;
}

export async function apiHistoryChangeTime(id) {
	var history = await http.get(apiEndpoint + 'rooms/recruitments/' + id + '/user-recruitment-change');
	return history;
}

export async function loadPriceCurent(id) {
	var priceCurent = await http.get(apiEndpoint + 'rooms/recruitments/' + id + '/curent');
	return priceCurent;
}

export async function apiChangePriceRectuitment(data) {
	let id = data.type_id;
	let dataChange = {
		price: data.price,
		time: data.time,
		content: data.content
	};
	let priceCurent = await http.post(apiEndpoint + 'rooms/recruitments/' + id + '/price', dataChange);
	return priceCurent;
}

export async function getRoomChangePatient(id, time= '', ad= 0, area ='') {
	let params = {time: time, area: area};
	var patientToday = await http.get(apiEndpoint + 'rooms/' + id + '/hospital', { params: params });
	let datas = JSON.parse(JSON.stringify(patientToday.data.data.data));
	let result = [], select = [], tmp = '', tmp1 = '';
	datas.map((item, key) => {
		let dataType = item.roomchangetoday.length > 0 ? item.roomchangetoday[0].count_patient  : '';
		if(ad === 0) {
			tmp = {
				name: item.area.name ? item.area.name : '',
				room_id: item.id ? item.id : 0,
				room: item.name ? item.name : '',
				value: dataType,
				maxlength: item.count_patient && item.count_patient !== 0 ? item.count_patient : null 
			};
			tmp1 = {
				value: item.area.name ? item.area.name : '',
				label: item.area.name ? item.area.name : '',
			}
			result[key] = tmp;
			select[key] = tmp1;
		} else {
			if(dataType === '') {
				tmp = {
					name: item.area.name ? item.area.name : '',
					room_id: item.id ? item.id : 0,
					room: item.name ? item.name : '',
					value: dataType,
					maxlength: item.count_patient && item.count_patient !== 0 ? item.count_patient : null
				};
				tmp1 = {
					value: item.area.name ? item.area.name : '',
					label: item.area.name ? item.area.name : '',
				}
				result[key] = tmp;
				select[key] = tmp1;
			}	
		}
		return item;
	});
	let results = {
		table: result,
		select: select 
	}
	return results;
}

export async function apiChangePrice(data) {
	var changeRecruitment = await http.put(apiEndpoint + 'rooms/update/patient', data);
	return changeRecruitment;
}

export async function getInfoAide(id) {
	var changeRecruitment = await http.get(apiEndpoint + 'users/' + id + '/detail-recruitment' );
	return changeRecruitment;
}

export async function getHistoryAide(id, page, pageSz) {
	let params = {page: page, limit: pageSz};
	var history = await http.get(apiEndpoint + 'users/' + id + '/history-recruitment', { params: params });
	let datas = JSON.parse(JSON.stringify(history.data.data.data));
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
		totalPage: history.data.data.total
	}
	return data;
}

export async function getFinedAide(id, page, pageSz) {
	let params = {page: page, limit: pageSz};
	var fined = await http.get(apiEndpoint + 'users/' + id + '/fined-recruitment', { params: params });
	let datas = JSON.parse(JSON.stringify(fined.data.data.data));
	let result = [], tmp = '';
	datas.map((item, key) => {
		tmp = {
			id: (Number(page) -1) * Number(pageSz) + key + 1,
			nameHospital: item.hospital ? item.hospital.name : '-',
			departRoom: item.room  ? item.room.name : '-',
			date: item.created_at ? moment(item.created_at).format('YYYY-MM-DD HH:mm') : '-',
			room: item.room && item.room.type ? item.room.type.name : '-',
			status: item.recruitment ? item.recruitment.work : '-',
			salary: item.recruitment ? formatNumber(item.recruitment.salary) : '-', 
			notes: item.content ? item.content : '-'
		};
		result[key] = tmp;
		return item;
	});
	let data = {
		data: result,
		totalPage: fined.data.data.total
	}
	return data;
}

export async function apiNoticeUserRecruitment (id) {
	var notice = await http.get(apiEndpoint + 'rooms/recruitments/' + id + '/notice');
	let datas = JSON.parse(JSON.stringify(notice.data.data));
	return datas;
}