require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors())
app.use(express.json());

// database connection
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

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
        next();

    }
    catch (err) {
        return res.status(401).json({
            message: "Invalid Token"
        });
    }

}

app.get("/", (req, res) => {
    res.send("Welcome to Placement Preparation Tracker Backend");
});

app.get("/about", (req, res) => {
    res.send("This application helps students track placement preparation.");
});

//add topics
app.post("/topics",verifyToken, (req, res) => {

    const { category, topicName, status, questionsSolved } = req.body;

    const sqlInsert =
        "INSERT INTO topics (category, topic_name, status, questions_solved,user_id) VALUES (?, ?, ?, ?,?)";

    db.query(
        sqlInsert,
        [category, topicName, status, questionsSolved,req.user.id],
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

//to retriev topics
app.get("/topics",verifyToken, (req, res) => {

    const sqlSelect = "SELECT * FROM topics where user_id=?";

    db.query(sqlSelect, [req.user.id], function (err, result) {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Failed to receive data"
            })
        }
        res.json(result);

    });

});

// update topics
app.put("/topics/:id", verifyToken,(req, res) => {

    const id = req.params.id;
    const { category, topicName, status, questionsSolved } = req.body;

    const sqlupdate = `update topics
    set 
         category=?,
         topic_name=?,
         status=?,
         questions_solved=?
    
    where id=? and user_id=?
    `;

    db.query(sqlupdate,
        [category, topicName, status, questionsSolved, id,req.user.id],
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

// delete topics
app.delete("/topics/:id", verifyToken,(req, res) => {

    const id = req.params.id;
    const sqldelete = `
    delete from topics
    where id=? and user_id=?
    `;

    db.query(sqldelete, [id,req.user.id], (err, result) => {

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

// registration
app.post("/register", async (req, res) => {

    const { name, email, password } = req.body;
    if (!name.trim()) {
        return res.status(400).json({
            message: "Name is required"
        });
    }
    if (!email.trim()) {
        return res.status(400).json({
            message: "email is required"
        });
    }
    if (!password.trim()) {
        return res.status(400).json({
            message: "password is required"
        });
    }

    const sqlemail = `
    select *
    from users
    where email=?`;

    db.query(sqlemail, [email], async (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });

        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const sqlusersinsert = `
        insert into users(name,email,password) values(?,?,?)`;

        db.query(sqlusersinsert, [name, email, hashedPassword], (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Registration Failed!!!"
                });
            }

            return res.status(201).json({
                message: "Registration successfull!!"
            })
        })

    })
})

// user login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email.trim()) {
        return res.status(400).json({
            message: "email is required"
        });
    }
    if (!password.trim()) {
        return res.status(400).json({
            message: "password is required"
        });
    }
    const sqlFindUser = `
    select *
    from users
    where email=?`;

    db.query(sqlFindUser, [email], async (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Login Failed!!!"
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, result[0].password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                id: result[0].id,
                email: result[0].email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token
        });

    })

})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});