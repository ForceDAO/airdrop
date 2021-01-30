const fs = require("fs");
const path = require("path");

const addIndexToLeaves = (leaves) => {
	leaves.map((x, i) => {
		x.index = i
	})
	return leaves
}	

const writeToFileSystem = (data, path) => {
	fs.writeFileSync(`./data/${path}.json`, data);
	console.log(`info written to data/${path}.json`)
}

module.exports = {
	addIndexToLeaves,
	writeToFileSystem
}