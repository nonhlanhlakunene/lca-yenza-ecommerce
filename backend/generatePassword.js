import bcrypt from "bcrypt";
const password = "aphiwe123";
const hash = await bcrypt.hash(password, 10);

console.log(hash);