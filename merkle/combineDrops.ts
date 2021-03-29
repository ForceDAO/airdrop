const data = require("./data.json");
const data2 = require("./data2.json");
import {addIndexToLeaves} from "./helpers"
import { writeFileSync } from 'fs';


const combine = () => {
	let data3 = []
	data.map(y => {
		data2.map(x => {
			if (x.address === y.address) {
				const amount = Number(x.amount) + Number(y.amount)
				data3.push({address: x.address, amount: amount.toString()})				
			}
		})
	})

	data3.map(y => {
		data.map((x, i) => {
			if (y.address == x.address) {
				data.splice(i, 1)
			}
		})
	})

	data3.map(y => {
		data2.map((x, i) => {
			if (y.address == x.address) {
				data2.splice(i, 1)
			}
		})
	})

	const final = data3.concat(data2).concat(data)
	addIndexToLeaves(final)
	writeFileSync(`./combinedData.json`, JSON.stringify(final));

	console.log({data3, data2, data, final})
	console.log({data2: data2.length, data: data.length, data3: data3.length})

}

combine()