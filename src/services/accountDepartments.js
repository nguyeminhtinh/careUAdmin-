import http from "../services/httpService";
const apiEndpoint = process.env.REACT_APP_API_URL + "parts/";

const departments = [
	{ id: 1, value: "간호과", label: "간호과" },
	{ id: 2, value: "원무과", label: "원무과" }
]

export function getListDepartment() {

	return departments;
}

export async function getListParts(hospitals_id, page, limit) {
	let response = await http.get(apiEndpoint + 'list/' + hospitals_id + "?page=" + page + "&limit=" + limit);

	return response;
}

export async function addPart(data) {
	let response = await http.post(apiEndpoint + 'create', data);

	return response;
}

export async function updatePart(data) {
	let response = await http.put(apiEndpoint + data.id + '/update', data);

	return response;
}

export async function deletePart(id) {
	let response = await http.delete(apiEndpoint + id + '/delete');

	return response;
}

export default { getListParts, addPart, updatePart, deletePart };