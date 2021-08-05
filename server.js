const express = require("express");
const mongoose = require("mongoose");
const Todo = require("./Controller/Todo");
const User = require("./Controller/Users");
const CookieParser = require("cookie-parser");
const cors = require("cors")
const jwt = require("express-jwt")
require("dotenv").config()
const app = express();
const PORT = 4000;
app.use(cors({
    origin: true,
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD','DELETE','PATCH'],
    credentials: true
  }));
app.use(express.json())
mongoose.connect(process.env.DB,{useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true})
const db =  mongoose.connection
db.on("error", console.error.bind(console,"connnection error"))
db.once('open', ()=>{
    console.log("connected with Database")
})
app.use(CookieParser())
app.post("/user", User.CreateUserOrLogin);

app.use(jwt({secret: process.env.SECRET, getToken:req => req.cookies.token,algorithms: ['HS256']}))
app.post("/savedata", Todo.Savetodo);
app.get("/getdata",Todo.getTodo);
app.post("/deletetodo", Todo.deleteTodo);
app.get("/user/logout", User.logout);
app.patch("/updatetodo", Todo.updateTodo);
app.post("/getsort", Todo.getTodoBySort);


app.listen(process.env.PORT || PORT,()=>{
    console.log("Server is Running")
})


