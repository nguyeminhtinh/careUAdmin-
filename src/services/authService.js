import http from "../services/httpService";
// import { UserModel } from "../models/UserModel";
import base64  from "base-64";

const apiEndpoint = process.env.REACT_APP_API_URL + "login";
const httpServe = process.env.REACT_APP_API_URL;
const tokenKey = "token";
http.setJwt(getJwt());

export async function login(userInfo) {
	let email = userInfo.email + "@" + userInfo.email_suffixes;
	let password = base64.encode(userInfo.password);
	let userObj = { email: email, password: password, remember: true }
	const response = await http.post(apiEndpoint, userObj);
	if (response.status === 200) {
		const user = JSON.parse(JSON.stringify(response.data.data.user));
		localStorage.setItem('currentUser', JSON.stringify(user));
		localStorage.setItem(tokenKey, response.data.data.access_token);
		localStorage.setItem('expiresAt', response.data.data.expires_at);
	}

	if (userInfo.remember) {
		localStorage.email = userInfo.email;
		localStorage.email_suffixes = userInfo.email_suffixes;
		localStorage.password = password;
		localStorage.remember = userInfo.remember;
	} else {
		localStorage.email = "";
		localStorage.email_suffixes = "naver.com";
		localStorage.password = "";
		localStorage.remember = false;
	}

	http.setJwt(getJwt());

	return response;
}

export async function info(id) { 
	const response = await http.get(httpServe + 'users/' + id + '/info' );
	return response;
}

export async function getflag(id) { 
	const response = await http.get(httpServe + 'users/' + id + '/flag' );
	return response;
}

export async function updateflag(id) { 
	const response = await http.put(httpServe + 'users/' + id + '/flag' );
	return response;
}

export function logout() {
	localStorage.removeItem(tokenKey);
	localStorage.removeItem('expiresAt');
	localStorage.removeItem('currentUser');
}

export  function getCurrentUser() {
	try {
		return JSON.parse(localStorage.getItem('currentUser'));
	} catch (ex) {
		return null;
	}
}

export async function checkMailExists($email) {
	const response = await http.get(httpServe + 'check-email-exists?email='+$email);

	return response;
}

export async function checkPhoneExists($phone) {
	const response = await http.get(httpServe + 'check-phone-exists?phone='+$phone);
	return response;
}

// export async function checkPhoneProfileExists($phone, $userId) {
// 	const response = await http.get(httpServe + 'check-phone-profile-exists?phone='+$phone+'&userId='+$userId);

// 	return response;
// }

export function getJwt() {
	return "Bearer " + localStorage.getItem(tokenKey);
}

export default { login, logout, getCurrentUser, getJwt, info, getflag, updateflag };
