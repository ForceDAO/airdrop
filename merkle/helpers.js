const addIndexToLeaves = (leaves) => {
	leaves.map((x, i) => {
		x.index = i
	})
	return leaves
}	

module.exports = {
	addIndexToLeaves
}