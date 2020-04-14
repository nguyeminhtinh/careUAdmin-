import { PAGESIZEMODAL } from '../config.json';
import http from "../services/httpService";

const apiEndpoint = process.env.REACT_APP_API_URL;

const rooms = [
	{
		id: 1,
		departRoom: "A동",
		name: "101호",
		type: "일반실",
		numberOfPatient: 6,
		careers: [
			{ id: 1, name: "이사라", endDate: "12/22(일) 14:00", dayOff: "11/30(월) 10:00 ~ 12/11(일) 14:00", status: "매칭" },
			{ id: 2, name: "이미영", endDate: "-", dayOff: "-", status: "-" }
		]
	},
	{
		id: 2,
		departRoom: "B동",
		name: "102호",
		type: "일반실",
		numberOfPatient: "미입력",
		careers: [
			{ id: 3, name: "김국이", endDate: "-", dayOff: "-", status: "매칭" },
			{ id: 4, name: "김가나", endDate: "-", dayOff: "-", status: "-" },
			{ id: 5, name: "허민희", endDate: "12/18(월) 15:00", dayOff: "-", status: "-" }
		]
	},
	{
		id: 3,
		departRoom: "C동",
		name: "103호",
		type: "일반실",
		numberOfPatient: "미입력",
		careers: [
			{ id: 6, name: "이모란", endDate: "12/18(화) 14:00", dayOff: "-", status: "-" }
		]
	},
	{
		id: 4,
		departRoom: "D동",
		name: "104호",
		type: "준중환자실",
		numberOfPatient: 6,
		careers: [
			{ id: 7, name: "임국영", endDate: "-", dayOff: "-", status: "-" },
			{ id: 8, name: "임국이", endDate: "-", dayOff: "11/30(월) 10:00 ~ 12/11(일) 14:00", status: "-" },
		]
	},
	{
		id: 5,
		departRoom: "E동",
		name: "105호",
		type: "일반실",
		numberOfPatient: 6,
		careers: [
			{ id: 9, name: "이초화", endDate: "-", dayOff: "-", status: "-" },
			{ id: 10, name: "박금희", endDate: "-", dayOff: "-", status: "-" },
		]
	},
	{
		id: 6,
		departRoom: "F동",
		name: "105호",
		type: "일반실",
		numberOfPatient: 6,
		careers: [
			{ id: 9, name: "이초화", endDate: "-", dayOff: "-", status: "-" },
			{ id: 10, name: "이초화", endDate: "-", dayOff: "-", status: "-" },
		]
	},
	{
		id: 7,
		departRoom: "H동",
		name: "101호",
		type: "일반실",
		numberOfPatient: 6,
		careers: [
			{ id: 1, name: "이사라", endDate: "12/22(일) 14:00", dayOff: "휴가일", status: "매칭" },
			{ id: 2, name: "이미영", endDate: "-", dayOff: "11/30(월) 10:00 ~ 12/11(일) 14:00", status: "-" }
		]
	},
]

export function getRooms(data, page, pageSz) {
	let listRoom = [...rooms];

	if (data.departRoom !== "") {
		listRoom = listRoom.filter(item => item.departRoom === data.departRoom);
	}

	if (data.name !== "") {
		listRoom = listRoom.filter(item => item.name === data.name);
	}

	if (data.typeRoom !== "") {
		listRoom = listRoom.filter(item => item.type.indexOf(data.typeRoom) !== -1);
	}

	if (data.nameCareer !== "") {
		listRoom = listRoom.filter(item => {
			return item.careers.find((career) => {
				return career.name.indexOf(data.nameCareer) !== -1
			});
		});
	}

	if (data.statusOff !== "") {
		listRoom = listRoom.filter(item => {
			return item.careers.find((career) => {
				return career.status === data.statusOff
			});
		});
	}

	if (!page || !pageSz) {
		page = 1;
		pageSz = PAGESIZEMODAL;
	}

	return {
		data: listRoom.slice((page - 1) * pageSz, page * pageSz),
		totalPage: listRoom.length
	};
}

export function getRoomById(id) {
	let listRoom = [...rooms];

	listRoom = listRoom.filter(item => item.id === id);

	return listRoom;
}

export async function createRoom(data) {
	const result = await http.post(apiEndpoint + 'rooms/create', data);

	return result;
}

export async function listRoom(id) {
	const result = await http.get(apiEndpoint + 'rooms/' + id + '/hospital');

	return result;
}

export async function deleteRoom(id) {
	const result = await http.delete(apiEndpoint + 'rooms/' + id + '/delete');

	return result;
}

export async function updateRoom(data, id) {
	const result = await http.put(apiEndpoint + 'rooms/' + id + '/edit', data);

	return result;
}

export async function updateStatusRoom(data) {
	const result = await http.put(apiEndpoint + 'rooms/' + data.id + '/change-status', data);

	return result;
}

export async function saveAllRoom(data) {
	const result = await http.post(apiEndpoint + 'rooms/save', data);

	return result;
}

export async function getInfoRoomHospital(id) {
	const result = await http.get(apiEndpoint + 'rooms/info/' + id + '/hospital');
	return result;
}

export async function getRoomsByArea(areaId) {
	const result = await http.get(apiEndpoint + 'rooms/' + areaId + '/area');
	return result;
}

export default { createRoom, listRoom, updateRoom, updateStatusRoom, saveAllRoom, getInfoRoomHospital, deleteRoom };