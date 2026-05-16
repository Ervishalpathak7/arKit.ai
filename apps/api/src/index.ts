import express from "express";

const app = express();
const PORT = 3000;

app.listen(PORT, (err) => {
  if (err) console.error(`erron in starting app : ${err}`);
  console.log(`app is running on http://localhost:${PORT}`);
});
