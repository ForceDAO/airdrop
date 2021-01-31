# Merkle Airdrop Contracts

Forked from Richard Moore's repo https://github.com/ricmoo/ethers-airdrop

Original Blog: https://blog.ricmoo.com/merkle-air-drops-e6406945584d

## Build

```
npm run build
```

## Test

```
npm run test
```

## Generate Proofs

```
npm run generate-proofs
```

## TODO 

   - [ x ] sanatize data (duplicate address, valid address, add up amount)
  - [ x ] the 3 functions needed are add up all amounts, check for validity of address and uniqueness of address
  - [ ] and probably should take all amounts and times them by 18 somewhere?
  - [ ] upload to S3
  - [ x ] add address and amount to env and/or json and pipe into deploy task 
  - [ x ] test sanatize data 