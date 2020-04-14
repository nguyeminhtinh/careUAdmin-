import _ from 'lodash';
import moment from 'moment';

import http from "../services/httpService";

const apiEndpoint = process.env.REACT_APP_API_URL;
const roomHistory = [
	{
		id: 1,
		ward: "712",
		rooms: [
			{ id: 54 , name: "양옥순 54" },
			{ id: 1, name: "양옥순" },
			{ id: 2, name: "양옥순 1" },

		],
		date: "2019-04-22"
	},
	{
		id: 2,
		ward: "713",
		rooms: [
			{ id: 3, name: "전신옥" },
			{ id: 4, name: "장혜숙" },
			{ id: 5, name: "전지원" },
			{ id: 54 , name: "양옥순 54" },

		],
		date: "2019-04-22"
	},
	{
		id: 3,
		ward: "714",
		rooms: [
			{ id: 6, name: "양옥순" },
			{ id: 7, name: "양옥순 1" }
		],
		date: "2019-03-22"
	},
	{
		id: 4,
		ward: "715",
		rooms: [
			{ id: 8, name: "전신옥" },
		],
		date: "2019-02-22"
	},
	{
		id: 5,
		ward: "716",
		rooms: [
			{ id: 9, name: "양옥순" },
			{ id: 10, name: "양옥순 1" }
		],
		date: "2019-01-22"
	},
	{
		id: 6,
		ward: "717",
		rooms: [
			{ id: 11, name: "전신옥" },
			{ id: 12, name: "장혜숙" },
			{ id: 13, name: "전지원" }
		],
		date: "2019-05-22"
	}
]

const bills = [
	{
		id: 1,
		typeRoom: 1,
		totalDate: 1,
		amount: 25000
	},
	{
		id: 2,
		typeRoom: 1,
		totalDate: 2,
		amount: 25000
	},
	{
		id: 3,
		typeRoom: 2,
		totalDate: 6,
		amount: 25000
	},
	{
		id: 4,
		typeRoom: 2,
		totalDate: 4,
		amount: 25000
	},
	{
		id: 5,
		typeRoom: 3,
		totalDate: 31,
		amount: 25000
	},
	{
		id: 6,
		typeRoom: 4,
		totalDate: 14,
		amount: 25000
	},
	{
		id: 7,
		typeRoom: 5,
		totalDate: 17,
		amount: 25000
	},
	{
		id: 8,
		typeRoom: 6,
		totalDate: 11,
		amount: 25000
	},
	{
		id: 9,
		typeRoom: 7,
		totalDate: 3,
		amount: 25000
	},
	{
		id: 10,
		typeRoom: 8,
		totalDate: 30,
		amount: 20000
	},
	{
		id: 11,
		typeRoom: 9,
		totalDate: 1,
		amount: 120000
	},
	{
		id: 12,
		typeRoom: 10,
		totalDate: 15,
		amount: 30000
	},
	{
		id: 13,
		typeRoom: 11,
		totalDate: 5,
		amount: 40000
	},
	{
		id: 14,
		typeRoom: 12,
		totalDate: 20,
		amount: 10000
	},
	{
		id: 15,
		typeRoom: 13,
		totalDate: 5,
		amount: 12000
	},
	{
		id: 16,
		typeRoom: 54,
		totalDate: 3,
		amount: 12000
	}

]

export async function getRooms(year, month, page, pageSz, id) {
	let mMonth = month < 10 && month > 0 ? '0' + month : month;
	const result = await http.get(apiEndpoint + 'settlements/' + id + '/total?year=' + year + '&month=' + mMonth + '&page=' + page + '&limit=' + pageSz);
	// const taxTmp = JSON.parse(JSON.stringify(result.data.data.data.taxcode));
	// console.log(taxTmp);
	// const data = []; var c = 0;
	// taxTmp.map((item, key) => {
	// 	var tmp = {
	// 		id: key,
	// 		room: item.room === null ? "" : item.room,
	// 	};
	// 	data[key] = tmp;
	// 	data[key]['careers'] = [];
	// 	var model = item.model;
	// 	model.map((item1, key1) => {
	// 		c++;
	// 		var arrTmp = {
	// 			id: c,
	// 			name: item1.full_name === null ? '-' : item1.full_name,
	// 			billing: item1.billing === null ? '-' : item1.billing,
	// 			total: item1.total === null ? '-' : item1.total,
	// 			nuclear: item1.nuclear === null ? '-' : item1.nuclear,
	// 			symbol: item1.symbol === null ? '-' : item1.symbol,
	// 			address:  item1.address === null ? '-' : item1.address,
	// 		}	
	// 		data[key]['careers'][key1] = arrTmp;
	// 		return item1;
	// 	});
	// 	return item;
	// })
	// console.log(data)
	// return {
	// 	data: data,
	// 	aide: result.data.data.data.count_aide,
	// 	total: result.data.data.data.total,
	// 	totalPage: result.data.data.total
	// };	
	return result;
}

export function getRoomById(typeRoom) {
	return bills.filter(bill => bill.typeRoom === typeRoom);
}

export function getBillingAmount(typeRoom) {
	let array = bills.filter(bill => bill.typeRoom === typeRoom);
	let total = 0;

	total = _.sumBy(array, function (o) {
		return o.totalDate * o.amount;
	});

	return total;
}
export default { getRooms, getRoomById, getBillingAmount }