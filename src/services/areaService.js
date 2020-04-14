import http from "../services/httpService";
const apiEndpoint = process.env.REACT_APP_API_URL + "hospitals/";
export async function getListArea(hospitalId) {
	const response = await http.get(apiEndpoint + hospitalId + '/areas');
	return response;
}
export default { getListArea };