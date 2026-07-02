require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed");
        console.log(err);
    } else {
        console.log("Connected to MySQL successfully");
    }
});



const app = express();
app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Placement Preparation Tracker Backend");
});

app.get("/about", (req, res) => {
    res.send("This application helps students track placement preparation.");
});




app.post("/topics", (req, res) => {

    const { category, topicName, status, questionsSolved } = req.body;

    const sqlInsert =
        "INSERT INTO topics (category, topic_name, status, questions_solved) VALUES (?, ?, ?, ?)";

    db.query(
        sqlInsert,
        [category, topicName, status, questionsSolved],
        function (err, result) {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Failed to add topic"
                });
            }

            res.json({
                message: "Topic added successfully"
            });
        }
    );

});
app.get("/topics", (req, res) => {

    const sqlSelect = "SELECT * FROM topics";

    db.query(sqlSelect, function (err, result) {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Failed to receive data"
            })
        }
        res.json(result);



    });

});

app.put("/topics/:id", (req, res) => {

    const id = req.params.id;
    const { category, topicName, status, questionsSolved } = req.body;

    const sqlupdate = `update topics
    set 
         category=?,
         topic_name=?,
         status=?,
         questions_solved=?
    
    where id=?
    `;

    db.query(sqlupdate,
        [category, topicName, status, questionsSolved, id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("failed to update topic")
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Topic not found"
                });
            }

            res.json({
                message: "Topic updated successfully"
            });
        }
    )

})

app.delete("/topics/:id", (req, res) => {
   
    const id = req.params.id;
    const sqldelete = `
    delete from topics
    where id=?
    `;

    db.query(sqldelete, [id], (err, result) => {

        if (err) {
            return res.status(500).send("Failed to delete");
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Topic not found"
            });
        }

        res.json({
            message: "Topic updated successfully"
        });
    })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});