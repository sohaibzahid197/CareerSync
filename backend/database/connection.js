const mongoose = require("mongoose");

const DATABASE = process.env.DATABASE;

mongoose
  .connect(DATABASE)
  .then(() => {
    console.log("Connected to the database successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });