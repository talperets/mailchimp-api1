const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");
require("dotenv");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("pages"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const myEmail = req.body.email;
  const data = {
    members: [
      {
        email_address: myEmail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const url = process.env.URL;
  const jsonData = JSON.stringify(data);
  const options = {
    method: "POST",
    auth: process.env.AUTH,
  };
  try {
    const request = https.request(url, options, (response) => {
      response.on("data", (data) => {
        JSON.parse(data);
      });
    });
    request.write(jsonData);
    request.end();
    res.send("OK");
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
});

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});

//
//
