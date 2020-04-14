import http from "../services/httpService";
const apiEndpointRefuse = process.env.REACT_APP_API_URL + "hospitals/";
const apiEndpointApproved = process.env.REACT_APP_API_URL + "hospitals/";
const httpServe = process.env.REACT_APP_API_URL;

export async function getListWaitingAccount(hospitalId, page, limit) {
	var apiEndpointWaiting = process.env.REACT_APP_API_URL + "hospitals/" + hospitalId + "/list-waiting-account";
	var response = await http.get(apiEndpointWaiting + "?page=" + page + "&limit=" + limit);

	return response;
}

export async function getRefuseAccount(id, datapopup) {
	let dataUser = {
		user_id: datapopup.id
	}
	var refuse = await http.put(apiEndpointRefuse + id + '/account/refuse', dataUser);
	return refuse;
}

export async function getApprovedAccount(id, datapopup) {
	let dataUser = {
		user_id: datapopup.id,
		part_id: datapopup.partId,
		position_id: datapopup.positionId
	}
	var approved = await http.put(apiEndpointApproved + id + '/account/approved', dataUser);

	return approved;
}

export async function getPositionList(hospitalId = 34) {
	var response = await http.get(httpServe + 'positions/list/' + hospitalId);
	return response;
}

export async function getPartList(hospitalId = 34) {
	var response = await http.get(httpServe + 'parts/list/' + hospitalId);
	return response;
}