const express = require("express");
const request = require("request");

const app = express();
const cors = require("cors");
const pool = require("./db");
const isDef = (v) => v !== undefined && v !== null;

const portNumber = 3000;

// Middleware =======================
app.use(cors());
app.use(express.json());

// Routes ===========================

// Create a flower
app.post("/flowers", async (req, res) => {
  try {
    const { description } = req.body;
    const newFlower = await pool.query(
      "INSERT INTO flowers (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.json(newFlower.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Get all flowers
app.get("/flowers", async (req, res) => {
  try {
    const allFlowers = await pool.query("SELECT * FROM flowers");
    res.json(allFlowers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get a flower
app.get("/flowers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allFlowers = await pool.query("SELECT * FROM flowers WHERE id = $1", [
      id,
    ]);
    res.json(allFlowers.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
// Update a flower
app.put("/flowers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const updateFlower = await pool.query(
      "UPDATE flowers SET description= $1 WHERE id = $2",
      [description, id]
    );
    res.json("Flower was updated");
  } catch (err) {
    console.error(err.message);
  }
});

// Delete a flower
app.delete("/flowers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteFlower = await pool.query("DELETE FROM flowers WHERE id = $1", [
      id,
    ]);
    res.json("Flower was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});

app.get(/.*/, (req, res) => {
  request(`http://localhost:${portNumber}/`)
    .on("error", (err) => res.sendFile("loading.html", { root: __dirname }))
    .pipe(res);
});
