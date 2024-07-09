const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "magic_number"

});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database.");
});


app.use(express.static('public')); 
// เพื่อเสิร์ฟไฟล์ static

// app.post('/api/insert', (req, res) => {
//     const { num_number1,
//         num_number2,
//         num_detail,
//         num_good_point,
//         num_bad_point } = req.body;

//     const query = "INSERT INTO num_data(num_number1,num_number2,num_detail,num_good_point,num_bad_point) VALUES (?,?,?,?,?)";

//     connection.query(query, [num_number1,
//         num_number2,
//         num_detail,
//         num_good_point,
//         num_bad_point], (err, results) => {
//             if (err) {
//                 console.error("Error inserting data: ", err);
//                 res.status(500).json({ error: "Internal Server Error" });
//             }

//             res.json({
//                 msg: "Data inserted successfully",
//                 insertedId: results.insertId

//             })
//         })
// });



app.get('/api/get-num-data', (req, res) => {
    const num_number1 = req.query.num_number1;

    const query = "SELECT * FROM num_data WHERE num_number1 = ?";

    connection.query(query, [num_number1], (err, results) => {
        if (err) {
            console.error("Error fetching data: ", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
