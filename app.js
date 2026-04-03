require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let tasks = []; // temporary (we'll replace with DB later)

// Show tasks
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
        res.render("index", { tasks: result.rows });
    } catch (err) {
       console.error("FULL ERROR:", err);
res.send(err.message);
    }
});

// Add task
app.post("/add", async (req, res) => {
    const task = req.body.task;

    try {
        await pool.query("INSERT INTO tasks (task) VALUES ($1)", [task]);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error adding task");
    }
});

// Delete task
app.post("/delete", async (req, res) => {
    const id = req.body.id;

    try {
        await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error deleting task");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
