import http from "../services/httpService";

const apiEndpoint = process.env.REACT_APP_API_URL;
const users = [
	{
		id: 1,
		name: "이사라",
		email: "careUTest@gmail.com",
		password: "123456",
		phone: "031-1234-5678",
		role: "caregiver",
		hospitalName: "사랑요양병원",
		nursingSign: "11245611",
		businessNumber: "1112345872",
		businessImage: "business_registration.jpg",
		isApproved: false
	},
	{
		id: 2,
		name: "이미영",
		email: "userNormal01@gmail.com",
		password: "123456",
		phone: "031-1111-2222",
		role: "caregiver",
		hospitalName: "사랑요양병원",
		nursingSign: "11245611",
		businessNumber: "1112345872",
		businessImage: "business_registration.jpg",
		isApproved: true
	},
	{
		id: 3,
		name: "김국이",
		email: "userMaster01@gmail.com",
		password: "123456",
		phone: "031-3333-3333",
		role: "master",
		hospitalName: "사랑요양병원",
		nursingSign: "11245611",
		businessNumber: "1112345872",
		businessImage: "business_registration.jpg",
		isApproved: false
	},
	{
		id: 4,
		name: "사국이",
		email: "userMaster02@gmail.com",
		password: "123456",
		phone: "031-3333-3333",
		role: "master",
		hospitalName: "사랑요양병원",
		nursingSign: "11245611",
		businessNumber: "1112345872",
		businessImage: "business_registration.jpg",
		isApproved: true
	}
]

function userUrl(id) {
	return `${apiEndpoint}/${id}`;
}

export function getUsers() {
	return http.get(apiEndpoint);
}

export function getUser(userId) {
	return http.get(userUrl(userId));
}

export async function getUserToken(code) {
	let url = apiEndpoint + 'get-user/'+code;
	const response = await http.get(url);

	return response.data;
}

export async function checkCodeUser(code) {
	let url = apiEndpoint + 'check-code/'+code;
	const response = await http.get(url);

	return response.data;
}

export function getUserLogin(user) {
	if (user) {
		let checkLogin = users.find((u) => u.email === user.email && u.password === user.password);
		if (checkLogin === undefined) {
			return {
				status: false,
				msg: "이메일 또는 비밀번호를 다시 확인해주세요."
			}
		} else {
			return {
				status: true,
				msg: "Success",
				data: checkLogin
			}
		}
	}

	return false;
}

export async function resetPasswordUser(code, user) {
	let url = apiEndpoint + 'change-password/'+code;
	let password = user.password;
	let password_confirmation = user.password_confirmation;

	let data = {
		password,
		password_confirmation
	}

	const response = await http.put(url, data);
	return response.data;
}

export async function getUserFindId(name, phone) {
	let url = apiEndpoint + 'find-id?full_name=' + encodeURIComponent(name) + '&phone='+phone;
	const response = await http.get(url);

	return response.data;
}

export function getUserById(id) {
	return users.find((u) => u.id === id);
}

export async function getUserFindByEmail(user) {
	let url = apiEndpoint + 'find-password';
	let email = user.email + "@" + user.email_suffixes;

	let data = {
		full_name: user.name,
		email
	}

	const response = await http.put(url, data);
	return response.data;
}

export function findUserByEmail(email) {
	const userList = [...users];
	return userList.filter(user => user.email === email)[0];
}

export function register(user) {
	return http.post(apiEndpoint);
}

export function save(user) {
	return http.post(apiEndpoint);
}

export async function getUserInfo() {
	console.log('getUserInfo', localStorage.getItem('token'));
	const { data } = await http.get(apiEndpoint + "profile/2");
	console.log('data user info', data.data);

	return data.data;
}

export async function userRegisterHospital(id, data) {
	let response = await http.post(apiEndpoint + 'users/' + id + '/regist-hospital', data);

	return response;
}

export async function getUserProfile(id) {
	let response = await http.get(apiEndpoint + 'profile/' + id);

	return response;
}

export async function updateProfile(id, data) {
	let response = await http.put(apiEndpoint + 'profile/' + id + '/update', data);
	return response;
}

export async function checkPassword(id, password) {
	let response = await http.get(apiEndpoint + 'users/' + id + '/check-password?password=' + password);
	return response;
}
