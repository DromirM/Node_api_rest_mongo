const express = require("express");
const mongoose = require("mongoose");
//const bodyParser = require("body-parser");
const { config } = require("dotenv");
config();

const bookRoutes = require("./routes/book.routes");

// Usamos express para los middlewares.
const app = express();
//app.use(bodyParser.json());
app.use(express.json()); // Parseador de bodies propio de express.

//Conectamos la base de datos:
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME });

app.use("/books", bookRoutes);

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    console.error("Se ha producido un error: ", err.message);
  }
  console.log(`Servidor iniciado en el puerto ${port}`);
});
