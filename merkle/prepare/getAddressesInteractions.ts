const csv = require('csv-parser')
const fs = require('fs')
import { writeFileSync } from 'fs';
const currentData = require("./addresses.json")
const raw = [];

console.log(currentData.length)

fs.createReadStream('./mockContracts/balancer-exchange.csv')
  .pipe(csv())
  .on('data', (data) => raw.push(data))
  .on('end', () => {
    console.log(raw.length)
    raw.map(x => currentData.push(x.From))
    console.log(currentData.length)
    const noDuplicates = new Set(currentData)
    console.log(noDuplicates.size)
    writeFileSync(`./addresses.json`, JSON.stringify(Array.from(noDuplicates)));
  });