import http from "../services/httpService";
const apiEndpoint = process.env.REACT_APP_API_URL + "positions/";

const positions = [
	{ id: 1, value: "간호사", label: "간호사" },
	{ id: 2, value: "주임", label: "주임" },
	{ id: 3, value: "부장", label: "부장" },
	{ id: 4, value: "과장", label: "과장" }
]

export function getListPosition() {
	return positions;
}

export async function getListPositions(hospitals_id, page, limit) {
	let response = await http.get(apiEndpoint + 'list/' + hospitals_id + "?page=" + page + "&limit=" + limit);

	return response;
}

export async function addPositions(data) {
	let response = await http.post(apiEndpoint + 'create', data);

	return response;
}

export async function updatePositions(data) {
	let response = await http.put(apiEndpoint + data.id + '/update', data);

	return response;
}

export async function deletePositions(id) {
	let response = await http.delete(apiEndpoint + id + '/delete');

	return response;
}

export default { getListPositions, addPositions, updatePositions, deletePositions };