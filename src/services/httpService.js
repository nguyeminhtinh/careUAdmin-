import axios from "axios";
import { polyfill } from 'es6-promise';
import { getJwt } from "./authService";
import auth from "./authService";
import { toast } from "react-toastify";
polyfill();

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common['Authorization'] = getJwt();

axios.interceptors.request.use(config => {
	axios.defaults.headers.common['Authorization'] = getJwt();
	return config;
});

axios.interceptors.response.use(null, error => {
	const expectedError =
		error.response &&
		error.response.status >= 400 &&
		error.response.status < 500;

	if (error.response.status === 401) {
		// toast.error("이메일 또는 비밀번호를 다시 확인해주세요.");
	}

	if (!expectedError) {
		toast.error("An unexpected error occurrred.");
		auth.logout();
	}

	return Promise.reject(error.response);
});

function setJwt(jwt) {
	axios.defaults.headers.common["Authorization"] = getJwt();
}

export default {
	get: axios.get,
	post: axios.post,
	put: axios.put,
	delete: axios.delete,
	setJwt
};