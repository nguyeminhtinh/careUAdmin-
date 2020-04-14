import http from "../services/httpService";

const apiEndpoint = process.env.REACT_APP_API_URL + 'permissions';

export async function getPermissions() {
	const response = await http.get(apiEndpoint);

	return response;
}

export async function getListPermission(hospital_id, page, limit) {
	const response = await http.get(apiEndpoint + '/' + hospital_id + '/accounts?limit=' + limit + '&page=' + page);

	return response;
}

export async function getPermissionById(id) {
	const response = await http.get(apiEndpoint + '/' + id + '/detail');

	return response;
}

export async function updatePermissionById(id, data) {
	const response = await http.put(apiEndpoint + '/' + id + '/update', data);

	return response;
}

export default { getPermissions, getListPermission, getPermissionById, updatePermissionById };