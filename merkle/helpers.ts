import { writeFileSync } from 'fs';


export const addIndexToLeaves = (leaves) => {
	leaves.map((x, i) => {
		x.index = i
	})
	return leaves
}	

export const writeToFileSystem = (data, path) => {
	writeFileSync(`./merkle/data/${path}.json`, data);
	console.log(`info written to data/${path}.json`)
}