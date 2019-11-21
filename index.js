const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const router = require('./routes/route');

app.get("/",(req,res)=>{
    res.send("GET /initialize to start game.");
});
app.use(cors());
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname,'public')));
app.use('/',router);

app.listen(8080,()=>{
    console.log("start server");
});