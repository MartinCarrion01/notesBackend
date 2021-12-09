require("dotenv").config();

const PORT = process.env.PORT;
const MONGOURL = process.env.MONGOURL;
const MONGOURLTEST = process.env.MONGOURLTEST;

module.exports = {
  MONGOURL,
  MONGOURLTEST,
  PORT,
};
