import http from "../services/httpService";
import { formatNumber } from '../services/functionService';
import renderHTML from 'react-render-html';
import moment from "moment";
const apiAddVote = process.env.REACT_APP_API_URL + "rooms/";
const apiEndpoint = process.env.REACT_APP_API_URL;

export async function getTableRoomHistory(id, filter, page, pageSz) {
	let params = {page: page, limit: pageSz, phoneNumber1: filter.phoneFirst, phoneNumber2: filter.phoneSecond, phoneNumber3: filter.phoneEnd, year: filter.year, month: filter.month, area_id: filter.area_id, room_id: filter.room_id, careGiver_name: filter.careGiver_name, symbol:filter.numberRegister }

	var roomHistory = await http.get(apiEndpoint + 'rooms/' + (id===null?0:id)+ '/history',{ params: params });
	var listTableHistory = JSON.parse(JSON.stringify(roomHistory.data.data.history));
	var result =  listTableHistory;
	return {
		data: result,
		total: roomHistory.data.data.total
	};
}

export async function getCareGiversHistory(id, page, pageSz, roomId) {
	let params = {page: page, limit: pageSz}

	var roomHistory = await http.get(apiEndpoint + 'rooms/' + roomId + '/aide',{ params: params });
	var roomHistoryTmp = JSON.parse(JSON.stringify(roomHistory.data.data.history));

	var roomHistoryHeader = await http.get(apiEndpoint + 'rooms/' + roomId);
	var roomHistoryinfo = JSON.parse(JSON.stringify(roomHistoryHeader.data.data));
	let data = roomHistoryTmp;
	
	data.map((item) => {
		let html = "", content = ""; 
		if(item.room && item.room.type_room_change_salary && item.room.type_room_change_salary.length > 0) {
			item.room.type_room_change_salary.map((item1) => {
				html += moment(item1.date_change).format('YYYY-MM-DD') + '<br/>' + formatNumber(Number(item1.salary_bonus) + Number(item.recruitment.salary)) + '<br/><br/>';
				content += item1.content + '<br/><br/>';
				return item1;
			})
		} else {
			html = "-";
			content = "-";
		}
		item.full_name	= item.user.full_name;
		item.phone 		= item.user.phone === null ? "-" : item.user.phone;
		item.symbol 	= item.user.symbol === null ? "-" : item.user.symbol;
		item.address 	= item.user.address === null ? "-" : item.user.address;
		item.amount 	= formatNumber(item.recruitment.salary) ;
		item.start_day_user = item.start_day === null ? "-" : item.start_day;
		item.end_day_user 	= item.end_day === null ? "-" : item.end_day;
		item.changeHistory  = renderHTML(html);
		item.reason_for_leave = renderHTML(content);
		item.type_close = item.type_close === 1 ? renderHTML("비정상<br/>(불친절)") : "정상";
		return item;
	});
	
	return {
		roomHistoryinfo,
		data: data,
		total: roomHistory.data.data.total
	};
}

export async function getAddRating(id, master_id, number) {
	let dataVote = {
		rating: number,
		master_id: master_id,
	}
	var addRating = await http.post(apiAddVote + 'recruitments/' + id + '/rating', dataVote);
	
	return addRating;
}
