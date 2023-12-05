const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// req.body
app.use(express.urlencoded({ extended: false }));

// ejs
app.set("view engine", "ejs");

// static resources folder
app.use(express.static("public"));

// mongo
const mongoose = require("mongoose");
// TOOD: UPDATE YOUR CONNECTION STRING!
const CONNECTION_STRING =
  "mongodb+srv://ccto:ITfqPJJqtBB4Dkny@cluster0.fbhtgjh.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(CONNECTION_STRING);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to database: "));
db.once("open", () => {
  console.log("Mongo DB connected successfully.");
});

// TODO: example of a schema & model
const Schema = mongoose.Schema;
const itSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
});
// model
const it = mongoose.model("it_collections", itSchema);

app.get("/", async (req, res) => {
  const prodList = await it.find().lean().exec();
  console.log(prodList);
  res.render("index", { product: prodList });
});

app.get("/api/it/all", async (req, res) => {
  // write the code to return all pokemon from the database
  try {
    // lean().exec() is used when:
    // - results should be used in a EJS template; OR
    // - results should be sent back to the server as part of an API response
    const results = await it.find().lean().exec();
    // send the pokemon to the server with a status code using res.json()
    return res.status(200).json(results);
  } catch (err) {
    // ERROR
    console.log(err);
    // make a custom object that contains the error message
    const errObject = {
      message: err,
    };
    // send this object back to the client with an error status code
    return res.status(500).json(errObject);
  }
});

app.get("/api/it/price", async (req, res) => {
  console.log("DONE");
  console.log(req.query);
  const myPrice = req.query.price;
  const convertedResult = parseInt(myPrice);

  if (myPrice === 0) {
    return res.status(406).json({ message: "price cannot be empty" });
  }
  if (isNaN(convertedResult) === true) {
    // error
    return res.status(406).json({ message: "price must be a number" });
  }
  const productOutput = await it
    .find({ price: { $gte: myPrice } })
    .lean()
    .exec();
  console.log(productOutput);
  try {
    if (productOutput && productOutput.length > 0) {
      console.log(productOutput);
      return res.status(200).json(productOutput);
    } else {
      console.log("No products found for the given price.");
      return res
        .status(404)
        .json({ message: "No products found for the given price." });
    }
  } catch (err) {
    console.error(err);
    // make a custom object that contains the error message
    const errObject = {
      message: err,
    };
    // send this object back to the client with an error status code
    return res.status(500).json(errObject);
  }
});
const onServerStart = () => {
  console.log("Express http server listening on: " + HTTP_PORT);
  console.log(`http://localhost:${HTTP_PORT}`);
};
app.listen(HTTP_PORT, onServerStart);

// const prodList = await it.find().lean().exec();
// let output = "";
// for (let i = 0; i < prodList.length; i++) {
//   try {

//     if (prodList[i] >= myPrice) {
//       output += prodList[i];
//     }
//
//     return res.status(200).json(output);
//   } catch (err) {
//     // ERROR
//     console.log(err);
//     // make a custom object that contains the error message
//     const errObject = {
//       message: err,
//     };
//     // send this object back to the client with an error status code
//     return res.status(500).json(errObject);
//   }
