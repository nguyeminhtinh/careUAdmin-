import http from "../services/httpService";

const apiEndpointDelete = process.env.REACT_APP_API_URL + "hospitals/";

export async function getListApprovedAccount(hospitalId, params) {
	const apiEndpoint = process.env.REACT_APP_API_URL + "hospitals/" + hospitalId + "/list-approved-account?part_id="+ params.part_id +"&position_id="+ params.position_id +"&keyword="+ encodeURIComponent(params.keyword) +"&page="+params.page+"&limit="+params.limit;
	var response = await http.get(apiEndpoint);
	// var listApprovedAccounts = [];

	// if (response.status === 200) {
	// 	var accounts = response.data.data.accounts;
	// 	console.log(accounts);
	// 	accounts.map(account => {
	// 		let accountApproved = {
	// 			"id": account.user ? account.user.id : 0 ,
	// 			"email": account.user ? account.user.email : '-',
	// 			"fullName": account.user ? account.user.full_name : '-',
	// 			"phone": account.user ? account.user.phone : '-',
	// 			"departName": account.part ? account.part.name : '-',
	// 			"position": account.position ? account.position.name : '-'

	// 		}
	// 		listApprovedAccounts.push(accountApproved);

	// 		return account;
	// 	});
	// }

	// let listRoom = [...listApprovedAccounts];

	// if (data.fullName !== undefined) {
	// 	listRoom = listRoom.filter(item => item.fullName.indexOf(data.fullName.trim()) !== -1);
	// }

	// if (data.departName !== undefined) {
	// 	listRoom = listRoom.filter(item => item.departName.indexOf(data.departName.trim()) !== -1);
	// }

	// if (data.position !== undefined) {
	// 	listRoom = listRoom.filter(item => item.position.indexOf(data.position.trim()) !== -1);
	// }

	// return listRoom;
	return response;
}

export async function deleteAccounts(id, data) {
	let dataUser = {
		user_id: data
	}

	const result = await http.put(apiEndpointDelete + id + '/account/remove', dataUser);
	return result;
}

export async function getUsersWokingInRoom(arrId) {
	const apiEndpoint = process.env.REACT_APP_API_URL+ 'users/get-users-woking-in-room?arrId='+arrId;
	const result = await http.get(apiEndpoint);
	return result;
}
