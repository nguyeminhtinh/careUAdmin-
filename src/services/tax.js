import _ from 'lodash';
import http from "../services/httpService";

const apiEndpoint = process.env.REACT_APP_API_URL;

export async function getTaxs(dataFilter, page, pageSz, id) {
	let year = dataFilter.year;
	let month = dataFilter.month < 10 && dataFilter.month > 0 ? '0' + dataFilter.month : dataFilter.month;
	const result = await http.get(apiEndpoint + 'settlements/' + id + '/taxcode?year=' + year + '&month=' + month + '&page=' + page + '&limit=' + pageSz );
	const taxTmp = JSON.parse(JSON.stringify(result.data.data.data.taxcode));
	const data = []; var c = 0;
	taxTmp.map((item, key) => {
		var tmp = {
			id: key,
			room: item.room === null ? "" : item.room,
		};
		data[key] = tmp;
		data[key]['careers'] = [];
		var model = item.model;
		model.map((item1, key1) => {
			c++;
			var arrTmp = {
				id: c,
				name: item1.full_name === null ? '-' : item1.full_name,
				billing: item1.billing === null ? '-' : item1.billing,
				total: item1.total === null ? '-' : item1.total,
				nuclear: item1.nuclear === null ? '-' : item1.nuclear,
				symbol: item1.symbol === null ? '-' : item1.symbol,
				address: (item1.address === null || item1.address === "") ? '-' : item1.address,
			}	
			data[key]['careers'][key1] = arrTmp;
			return item1;
		});
		return item;
	})
	return {
		data: data,
		aide: result.data.data.data.aide,
		avg_taxcode: result.data.data.data.avg_taxcode,
		total: result.data.data.data.total,
		total_taxcode:  result.data.data.data.total_taxcode,
		totalPage: result.data.data.total
	};
}

