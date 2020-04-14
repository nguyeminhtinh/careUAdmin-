import http from "../services/httpService";
import _ from "lodash";
const apiEndpoint = process.env.REACT_APP_API_URL + "troubles/";

export async function getHandlingProblem(data, page, limit) {
	var response = await http.get(apiEndpoint + 'list?hospital_id='+data.hospitalId+'&aide_name=' + encodeURIComponent(data.aide_name) + '&type_id=' + data.type_id + '&phone_head=' + data.phoneFirst + '&phone_midle=' + data.phoneSecond + '&phone_end=' + data.phoneEnd + '&status=' + data.insurrance + '&page=' + page + '&limit=' + limit);

	var listHandling = response.data.data.troubles;
	listHandling.map(item => {
		item.room_type = item.room !== null && item.room.type ? item.room.type.name : '';
		if (_.size(item.insurrance) === 0) {
			var pendingObj = { id: 3, name: "대기" }
			item.insurrance.push(pendingObj);
		} else {
			item.insurrance = [];
			item.insurrance.push({ id: 1, name: "배정" });
			item.insurrance.push({ id: 2, name: "이사라 (010-2354-1111)" });
		}
		return item;
	});

	return { listHandling, total: response.data.data.total };
}

export async function getHandlingProblemById(data) {
	var responses = await http.post(apiEndpoint + 'create', data);

	return responses;
}

export async function updateHandlingProblemById(id, data) {
	var response = await http.put(apiEndpoint + id + '/update', data);

	return response;
}

export async function getDataById(data) {
	var responses = await http.get(apiEndpoint + data);

	return responses;
}