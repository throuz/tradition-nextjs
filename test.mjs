import { Decimal } from "decimal.js";
const test = new Decimal(0.7).plus(0.1);
console.log(test);
console.log(test + 1);
console.log(typeof test);
