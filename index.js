const express = require("express");
const app = express();
const port = 3000;


app.post("/magic8ball", (req, res) => {
  res.json({
    response_type: "in_channel",
    text: "It's 80 degrees right now.",
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
