export const increaseTime = async (ethers, timeToMoveForward) => {
	ethers.provider.send("evm_increaseTime", [timeToMoveForward])  
	ethers.provider.send("evm_mine")   
}
