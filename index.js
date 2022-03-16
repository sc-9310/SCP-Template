const fs = require("fs");
const express = require("express");
const path = require("path");
const cors = require("cors");
const compression = require("compression");

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// const router = require("./routes");
// app.use(router);

// Handle 404
app.use(function (req, res) {
  res.status(404).send("404: Page not Found", 404);
  console.error("- IP: " + req.ip);
});

// Handle 500
app.use(function (error, req, res) {
  res.status(500).send("500: Internal Server Error", 500);
  console.error("- IP: " + req.ip + "\nERROR: " + error);
});

let environment = "public";

// Certificate
let credentials;
let privateKey;
let certificate;
let ca;

try {
  privateKey = fs.readFileSync(
    "/etc/letsencrypt/live/<project>/privkey.pem",
    "utf8"
  );
  certificate = fs.readFileSync(
    "/etc/letsencrypt/live/<project>/cert.pem",
    "utf8"
  );
  ca = fs.readFileSync(
    "/etc/letsencrypt/live/<project>/chain.pem",
    "utf8"
  );

  credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
  };
}
catch (e) {
  console.error(
    "ERROR: Certificate could not be loaded, running as 'local' mode..."
  );
  environment = "local";
}

if (environment === "local") {
  const port = process.env.PORT || 80;
  app.listen(port, function () {
    console.log(`App running in local environment on port ` + port);
  });
}
else {
  // handles acme-challenge and redirects to https
  require("http")
    .createServer(app)
    .listen(80, "0.0.0.0", function () {
      console.log("Listening for ACME http-01 challenges on", this.address());
    });

  // handles the app
  require("https")
    .createServer(credentials, app)
    .listen(443, "0.0.0.0", function () {
      console.log(
        "Listening for ACME tls-sni-01 challenges and serve app on",
        this.address()
      );
    });
}
