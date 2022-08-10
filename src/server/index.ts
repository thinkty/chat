import express from 'express';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
// import { Request, Response } from 'express';

const app = express();

app.use(express.static("public"));

app.listen(process.env.PORT, () => {
  console.log(`Application started on port ${process.env.PORT}`);
});
