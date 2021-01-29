const addIndexToLeaves = (leaves) => {
	leaves.map((x, i) => {
		x.index = i
	})
	console.log(leaves)
	return leaves
}	

module.exports = {
	addIndexToLeaves
}