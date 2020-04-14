import http from "../services/httpService";

const apiEndpoint = process.env.REACT_APP_API_URL;

export async function getListType(id) {
	const response = await http.get(apiEndpoint + "types");
	if (response.status === 200) {
	    let data = [];

	    response.data.data.map(item => {
	        data.push({
	            value: item.id,
	            label: item.name
	        });
	        return item;
	    })

	    return [{ value: '', label: '선택' }, ...data];
	}
}

export async function getTypes() {
	const response = await http.get(apiEndpoint + "types");

	if (response.status === 200) {
		return response;
	}
}

export default { getListType };