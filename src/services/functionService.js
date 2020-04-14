import http from "../services/httpService";
import Datatable from "../components/common/datatable";
import { ROLE } from '../config.json';

const apiEndpoint = process.env.REACT_APP_API_URL;

const selectItem = [
	{ value: 'naver.com', label: 'naver.com' },
	{ value: 'hanmail.net', label: 'hanmail.net' },
	{ value: 'gmail.com', label: 'gmail.com' },
	{ value: 'nate.com', label: 'nate.com' },
	{ value: 'hotmail.com', label: 'hotmail.com' },
	{ value: 'empal.com', label: 'empal.com' },
	{ value: 'freechal.com', label: 'freechal.com' },
	{ value: 'paran.com', label: 'paran.com' },
	{ value: 'korea.com', label: 'korea.com' },
	{ value: 'dreamwiz.com', label: 'dreamwiz.com' },
];

const selectItemNumber = [
	{ value: '010', label: '010' },
	{ value: '011', label: '011' },
	{ value: '016', label: '016' },
	{ value: '017', label: '017' },
	{ value: '018', label: '018' },
	{ value: '019', label: '019' },
	{ value: '032', label: '032' },
	{ value: '033', label: '033' },
	{ value: '041', label: '041' },
	{ value: '042', label: '042' },
	{ value: '043', label: '043' },
	{ value: '044', label: '044' },
	{ value: '051', label: '051' },
	{ value: '052', label: '052' },
	{ value: '053', label: '053' },
	{ value: '054', label: '054' },
	{ value: '055', label: '055' },
	{ value: '061', label: '061' },
	{ value: '062', label: '062' },
	{ value: '063', label: '063' },
	{ value: '064', label: '064' },
]

const selectItemNumber1 = [
	'010',
	'020',
	'030',
	'040',
]

const selectPhoneNumberHospital = [
	{ value: '010', label: '010' },
	{ value: '011', label: '011' },
	{ value: '016', label: '016' },
	{ value: '017', label: '017' },
	{ value: '018', label: '018' },
	{ value: '019', label: '019' },
	{ value: '032', label: '032' },
	{ value: '033', label: '033' },
	{ value: '041', label: '041' },
	{ value: '042', label: '042' },
	{ value: '043', label: '043' },
	{ value: '044', label: '044' },
	{ value: '051', label: '051' },
	{ value: '052', label: '052' },
	{ value: '053', label: '053' },
	{ value: '054', label: '054' },
	{ value: '055', label: '055' },
	{ value: '061', label: '061' },
	{ value: '062', label: '062' },
	{ value: '063', label: '063' },
	{ value: '064', label: '064' },
]

const selectWard = [
	{ value: '', label: '선택' },
	{ value: 'A동', label: 'A동' },
	{ value: 'B동', label: 'B동' },
	{ value: 'C동', label: 'C동' },
	{ value: 'D동', label: 'D동' },
	{ value: 'E동', label: 'E동' },
	{ value: 'F동', label: 'F동' },
]

const selectWard1 = [
	{ value: 'A동', label: 'A동' },
	{ value: 'B동', label: 'B동' },
	{ value: 'C동', label: 'C동' },
	{ value: 'D동', label: 'D동' },
	{ value: 'E동', label: 'E동' },
	{ value: 'F동', label: 'F동' },
]

const selectRoom = [
	{ value: '', label: '선택' },
	{ value: '101호', label: '101호' },
	{ value: '102호', label: '102호' },
	{ value: '103호', label: '103호' },
]

const selectRoom1 = [
	{ value: '101호', label: '101호' },
	{ value: '102호', label: '102호' },
	{ value: '103호', label: '103호' },
]

const selectWards = [
	{ value: '', label: '선택' },
	{ value: '일반실', label: '일반실' },
	{ value: '상급병실', label: '상급병실' },
	{ value: '일반실', label: '일반실' },
	{ value: '준중환자실', label: '준중환자실' },
	{ value: '중환자실', label: '중환자실' },
	{ value: '격리실', label: '격리실' },
]

const selectWardValid = [
	{ value: '상급병실', label: '상급병실' },
	{ value: '일반실', label: '일반실' },
	{ value: '준중환자실', label: '준중환자실' },
	{ value: '중환자실', label: '중환자실' },
	{ value: '격리실을', label: '격리실을' },
]

const selectVacationstatus = [
	{ value: '', label: '선택' },
	{ value: 1, label: '재공고' },
	{ value: 2, label: '매칭' },
	{ value: 3, label: '취소' },
	{ value: 4, label: 'D-3' },
	{ value: 5, label: 'D-1' },
	{ value: 6, label: '매칭안됨' },
	{ value: 7, label: '오프매칭' }
]


const selectEndDate = [
	{ value: '', label: '선택' },
	{ value: 'ASC', label: '오름차순' },
	{ value: 'DESC', label: '내림차순' },
]

const registrationDate = [
	{ value: '등록일', label: '등록일' },
	{ value: 'ASC', label: '오름차순' },
	{ value: 'DESC', label: '내림차순' }
]

const deadline = [
	{ value: '', label: '선택' },
	{ value: 'ASC', label: '오름차순' },
	{ value: 'DESC', label: '내림차순' }
]

const selectCondition = [
	{ value: '', label: '선택' },
	{ value: '1', label: '대기' },
	{ value: '2', label: '배정' },
]

const selectDepartment = [
	{ value: '', label: '선택' },
	{ value: '간호사', label: '간호사' },
	{ value: '원무과', label: '원무과' },
]

const selDepartment = [
	{ value: '간호사', label: '간호사' },
	{ value: '원무과', label: '원무과' },
]

const selPosition = [
	{ value: '간호사', label: '간호사' },
	{ value: '사원', label: '사원' },
	{ value: '과장', label: '과장' },
]

const selectPosition = [
	{ value: '', label: '선택' },
	{ value: '간호사', label: '간호사' },
	{ value: '사원', label: '사원' },
	{ value: '과장', label: '과장' },
]

const selectPrefixFaxNumber = [
	{ value: '010', label: '010' },
	{ value: '011', label: '011' },
	{ value: '016', label: '016' },
	{ value: '017', label: '017' },
	{ value: '018', label: '018' },
	{ value: '019', label: '019' },
	{ value: '032', label: '032' },
	{ value: '033', label: '033' },
	{ value: '041', label: '041' },
	{ value: '042', label: '042' },
	{ value: '043', label: '043' },
	{ value: '044', label: '044' },
	{ value: '051', label: '051' },
	{ value: '052', label: '052' },
	{ value: '053', label: '053' },
	{ value: '054', label: '054' },
	{ value: '055', label: '055' },
	{ value: '061', label: '061' },
	{ value: '062', label: '062' },
	{ value: '063', label: '063' },
	{ value: '064', label: '064' },
]

const selectDayOfMonth = [
	{ value: '1', label: '1' },
	{ value: '2', label: '2' },
	{ value: '3', label: '3' },
	{ value: '4', label: '4' },
	{ value: '5', label: '5' },
	{ value: '6', label: '6' },
	{ value: '7', label: '7' },
	{ value: '8', label: '8' },
	{ value: '9', label: '9' },
	{ value: '10', label: '10' },
	{ value: '11', label: '11' },
	{ value: '12', label: '12' },
	{ value: '13', label: '13' },
	{ value: '14', label: '14' },
	{ value: '15', label: '15' },
	{ value: '16', label: '16' },
	{ value: '17', label: '17' },
	{ value: '18', label: '18' },
	{ value: '19', label: '19' },
	{ value: '20', label: '20' },
	{ value: '21', label: '21' },
	{ value: '22', label: '22' },
	{ value: '23', label: '23' },
	{ value: '24', label: '24' },
	{ value: '25', label: '25' },
	{ value: '26', label: '26' },
	{ value: '27', label: '27' },
	{ value: '28', label: '28' },
	{ value: '29', label: '29' },
	{ value: '30', label: '30' },
	{ value: '31', label: '31' },
]

const selectMonth = [
	{ value: '1월', label: '1월' },
	{ value: '2월', label: '2월' },
	{ value: '3월', label: '3월' },
	{ value: '4월', label: '4월' },
	{ value: '5월', label: '5월' },
	{ value: '6월', label: '6월' },
	{ value: '7월', label: '7월' },
	{ value: '8월', label: '8월' },
	{ value: '9월', label: '9월' },
	{ value: '10월', label: '10월' },
	{ value: '11월', label: '11월' },
	{ value: '12월', label: '12월' },
]

const selectHourInDay = [
	{ value: '0', label: '0시' },
	{ value: '1', label: '1시' },
	{ value: '2', label: '2시' },
	{ value: '3', label: '3시' },
	{ value: '4', label: '4시' },
	{ value: '5', label: '5시' },
	{ value: '6', label: '6시' },
	{ value: '7', label: '7시' },
	{ value: '8', label: '8시' },
	{ value: '9', label: '9시' },
	{ value: '10', label: '10시' },
	{ value: '11', label: '11시' },
	{ value: '12', label: '12시' },
	{ value: '13', label: '13시' },
	{ value: '14', label: '14시' },
	{ value: '15', label: '15시' },
	{ value: '16', label: '16시' },
	{ value: '17', label: '17시' },
	{ value: '18', label: '18시' },
	{ value: '19', label: '19시' },
	{ value: '20', label: '20시' },
	{ value: '21', label: '21시' },
	{ value: '22', label: '22시' },
	{ value: '23', label: '23시' },
]

const selectCaregiverNumber = [
	{ value: '0', label: '0' },
	{ value: '1', label: '1' },
	{ value: '2', label: '2' },
	{ value: '3', label: '3' },
	{ value: '4', label: '4' },
	{ value: '5', label: '5' },
	{ value: '6', label: '6' },
	{ value: '7', label: '7' },
	{ value: '8', label: '8' },
	{ value: '9', label: '9' },
	{ value: '10', label: '10' },
	{ value: '11', label: '11' },
	{ value: '12', label: '12' },
	{ value: '13', label: '13' },
	{ value: '14', label: '14' },
	{ value: '15', label: '15' },
	{ value: '16', label: '16' },
	{ value: '17', label: '17' },
	{ value: '18', label: '18' },
	{ value: '19', label: '19' },
	{ value: '20', label: '20' },
]

export function getSuffixEmail() {
	return { suffixes: selectItem }
}

export function getPrefixPhoneNumber() {
	return { prefix: selectItemNumber }
}

export function getPrefixPhoneNumber1() {
	return { prefix1: selectItemNumber1 }
}

export function getPrefixPhoneNumberHospital() {
	return { prefixPhoneNumberHospital: selectPhoneNumberHospital }
}

export function getPrefixWard() {
	return { prefixWard: selectWard }
}

export function getPrefixWard1() {
	return { prefixWard1: selectWard1 }
}

export function getPrefixRoom() {
	return { prefixRoom: selectRoom }
}

export function getPrefixRoom1() {
	return { prefixRoom1: selectRoom1 }
}

export function getPrefixWards() {
	return { prefixWards: selectWards }
}


export function getPrefixWardValid() {
	return selectWardValid;
}

export function getPrefixVacationstatus() {
	return { prefixVacationstatus: selectVacationstatus }
	// const result = await http.get(apiEndpoint + 'hospitals/status-of-leave');
	// var results = JSON.parse(JSON.stringify(result.data.data));
	// let data = []
	// let key = results.count
	// data[0] = { value: "", label: '선택' }
	// for(var i = 1; i<= key; i++){
	// 	var tmp = { value: i, label: results.data[i] };
	// 	data[i] = tmp;
	// }
	// return { prefixVacationstatus: data }
}

export function getPrefixEndDate() {
	return { prefixEndDate: selectEndDate }
}

export function getPrefixCondition() {
	return { prefixCondition: selectCondition }
}

export function getPrefixDepartment() {
	return { prefixDepartment: selectDepartment }
}

export function getSelectDepartment() {
	return { department: selDepartment }
}

export function getPrefixPosition() {
	return { prefixPosition: selectPosition }
}

export function getSelectPosition() {
	return {
		position: selPosition
	}
}

export function getRegistrationDate() {
	return { prefixRegistrationDate: registrationDate }
}

export function getDeadline() {
	return { prefixDeadline: deadline }
}

export function getPrefixFaxNumber() {
	return { prefixFaxNumber: selectPrefixFaxNumber }
}

export function getDayOfMonth() {
	return { dayOfMonth: selectDayOfMonth }
}

export function getSelectMonth() {
	return { selectMonth: selectMonth }
}

export function getHourInDay() {
	return { hourInDay: selectHourInDay }
}

export function getCaregiverNumber() {
	return { caregiverNumber: selectCaregiverNumber }
}

export function isNumberKey(e) {
	var charCode = (e.which) ? e.which : e.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		e.preventDefault();
		return false;
	}
	return true;
}

export function isMaxlength(e, maxlength) {
	var charCode = (e.which) ? e.which : e.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		e.preventDefault();
		return false;
	}
	let code = e.target.value + e.key;
	if (maxlength && code > maxlength) {
		e.preventDefault();
		return false;
	}
	return true;
}

export function isOnPasteNumber(e) {
	var pastedData = e.clipboardData.getData('text');
	var regex = /[0-9]/;
	if (!regex.test(pastedData)) {
		e.preventDefault();
		return false;
	}

	return true;
}

export function isCharacterValid(str, reg) {
	for (var i = 0; i < str.length; i++) {
		if (!reg.test(str.charAt(i))) {
			return true;
		}
	}
	return false;
}

export function checkDiffTwoArray(array1, array2) {
	return JSON.stringify(array1) === JSON.stringify(array2)
}

export function formatNumber(num) {
	var p = num.toFixed(2).split(".");
	return p[0].split("").reverse().reduce(function (acc, num, i, orig) {
		return num === "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
	}, "");
}

export function getRandomLetter() {
	let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	return alphabet[Math.floor(Math.random() * alphabet.length)];
}

export function exportExcel(table, name, filename = '다운로드') {
	let uri = 'data:application/vnd.ms-excel;base64,'
		, template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
		, base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
		, format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
	if (!table.nodeType) {
		table = document.getElementById(table)
		let ctx  = { worksheet: name || 'Worksheet', table: table.innerHTML }
		var link = document.createElement("a");
		let href = uri + base64(format(template, ctx));
		link.download = filename + ".xls";
		link.href = href;
		console.log(href)
		link.click();
		// window.location.href = uri + base64(format(template, ctx))
	}
}

export function checkAuth(path, user, role, location) {
	let auth = false;
	let urlH = localStorage.getItem('urlHome')
	if(user !== null)
	{
		if(user.role !== null && user.role === 'caregiver') 
		{
			if(user.permissions !== null)
			{
				var permissions = user.permissions;
				permissions.map((permission, key) => {
					var page = permission[0];
					var roles = permission[1];
					if(page !== null && page === path && roles !== null && (roles.indexOf(role) > -1 || roles.indexOf(ROLE.ALL) > -1))
					{
						auth =  true;
					}
				})
				if(auth === false)
				{
					if(location === true)
					{
						window.location.href = urlH;
					}
					return false;
				}
				return true;
			}else {
				if(location === true)
				{
					window.location.href = urlH;
				}
				return false;
			}
		}
		if(location === false)
		{
			return true;
		}		
	}else {
		if(location === true)
		{
			window.location.href = "/login";
		}
		return false;
	}
}