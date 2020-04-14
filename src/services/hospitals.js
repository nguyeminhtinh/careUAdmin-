import http from "./httpService";
const apiEndpoint = process.env.REACT_APP_API_URL + "hospitals/";
const httpServe = process.env.REACT_APP_API_URL;

export async function getListHospitals(keyword, page, pageSz) {
	const response = await http.get(apiEndpoint + 'list?keyword=' + encodeURIComponent(keyword) + '&page=' + page + '&limit=' + pageSz);

	return response;
}

export async function getUnRegistereds(keyword, page, pageSz) {
	const response = await http.get(apiEndpoint + 'unregistered?keyword=' + encodeURIComponent(keyword) + '&page=' + page + '&limit=' + pageSz+ '&isMaster=true');

	return response;
}

export async function getPositions(hospitalId = 1) {
	const response = await http.get(httpServe + 'positions/list/' + hospitalId);

	return response;
}
export async function getParts(hospitalId = 1) {
	const response = await http.get(httpServe + 'parts/list/' + hospitalId);

	return response;
}

export async function removedApplyHospital(UserId = 34) {
	const response = await http.delete(httpServe + 'users/' + UserId + '/removed-hospital');

	return response;
}

export async function getListWaiting(UserId = 34) {
	const response = await http.get(httpServe + 'users/' + UserId + '/waiting-hospital');

	return response;
}

export async function getStatusUserHospital(UserId = 34) {
	const response = await http.get(httpServe + 'users/' + UserId + '/status-hospital');

	return response;
}

export async function postRegistHospital(UserId = 34, data) {
	const response = await http.post(httpServe + 'users/' + UserId + '/regist-hospital', data);

	return response;
}

export async function getListRoomById(hospitals_id) {
	let response = await http.get(apiEndpoint + hospitals_id + '/list-rooms');
	let responseResult = response;

	let data = responseResult.data.data.rooms;

	data.map((item) => {
		item.user_room_recruitments.map((rs) => {
			rs.recruitment = rs.recruitment.amount;
			rs.aide = rs.aide.full_name;

			return rs;
		});

		return item;
	});

	return responseResult;
}

export async function getListMedicals() {
	const response = await http.get(apiEndpoint + 'medicals/list');

	return response;
}

export async function getListCourses() {
	const response = await http.get(apiEndpoint + 'courses/list');

	return response;
}

export async function getHospitalById(id) {
	const response = await http.get(apiEndpoint + id);

	return response;
}

export async function updateHospital(id, data) {
	const response = await http.put(apiEndpoint + id + '/update', data);

	return response;
}

export function getAllTypeHospital() {
	// const response = await http.get(apiEndpoint + 'types/list');
	// return response;
	return new Promise((resolve, reject) => {
		http.get(apiEndpoint + 'types/list').then(result => {
			resolve(result)
		}).catch(err => {
			reject(err)
		})
	})

}

export async function getListTypes() {
	const response = await http.get(apiEndpoint + 'types/list');
	return response;
}

export function getAllHospitalAddress() {
	// const response = await http.get(apiEndpoint + 'address/list');
	// return response;
	return new Promise((resolve, reject) => {
		http.get(apiEndpoint + 'address/list').then(result => {
			resolve(result)
		}).catch(err => {
			reject(err)
		})
	})
}

export async function createHospital(data) {
	const response = await http.post(apiEndpoint + 'create', data);

	return response;
}

export async function checkPhoneExists(phone) {
	// const response = await http.get(apiEndpoint + 'check-phone-hospital-exists?phone=' + phone);
	// return response;
	const response = await http.get(httpServe + 'check-phone-exists?phone='+phone);
	return response;
}

export async function checkFaxExists(fax) {
	const response = await http.get(httpServe + 'check-fax-exists?fax='+fax);
	return response;
}


export async function closeJoinHospital(hospitals_id, data) {
	const response = await http.put(apiEndpoint + hospitals_id + '/account/closed', data);

	return response;
}


export default { getListHospitals, getListWaiting, getPositions, getParts, getListRoomById, getListMedicals, getListCourses, getHospitalById, updateHospital, getAllTypeHospital, getAllHospitalAddress, createHospital, getListTypes, closeJoinHospital, checkPhoneExists, checkFaxExists };
