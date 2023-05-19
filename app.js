const express = require("express");
const mongoose = require("mongoose");
const UserModel = require("./models/users");
const postModel = require("./models/post");
const cors = require("cors");
const PORT = 4000;
const app = express();

//middlewares
app.use(express.json());

//cross origin resource Sharing
app.use(cors());

// const dbUrl = "mongodb://localhost:27017/foodblog";
// const dbUrl = "mongodb://127.0.0.1:27017/foodblog"
const dbUrl = "mongodb+srv://anupamit011:@cluster0.zcfnlvf.mongodb.net/?retryWrites=true&w=majority"

mongoose
  .connect(dbUrl)
  .then(() => console.log("Connection established"))
  .catch((err) => console.log(err));
app.get("/", (res) => {
  res.send("api up and running");
});

app.post("/login", (req, res) => {
  UserModel.findOne({ email: req.body.email }).then((userData) => {
    if (userData) {
      if (req.body.password == userData.password) {
        res.send({ message: "login Successfully", status: 200 });
      } else {
        res.send({ message: "Invalid Password", status: 400 });
      }
    } else {
      res.send({ message: "user not found" });
    }
  });
});
app.post("/signup", async (req, res) => {
  UserModel.findOne({ email: req.body.email }).then((userData) => {
    if (userData) {
      res.send("User already exists");
    } else {
      let user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      user.save().then(() => {
        res.send({message:"User successfully signed up"});
      });
    }
  });
});

app.post("/addfood", async (req, res) => {
  const newpost = new postModel({
    author: req.body.author,
    title: req.body.title,
    image: req.body.image,
    summery: req.body.summery,
    location: req.body.location,
  });
  newpost.save().then(() => {
    res.send({ message: "Post add successfully" });
  });
});

app.get("/posts", async (req, res) => {
  const food = await postModel.find();
  res.json(food);
});
app.get("/users", async (req, res) => {
  const aboutuser = await UserModel.find();
  res.json(aboutuser);
});

// app.get("/posts/:id", async (req, res) => {
//   const {id} = req.params;
//   const singlePost = await postModel.findById(id);
//   res.send(singlePost);
// });
app.get("/posts/:id", async (req, res) => {
  const id = req.params.id;
  const singlePost = await postModel.findById(id);
  res.json({ singlePost: singlePost });
});

app.listen(PORT, () => {
  console.log(`backend server has been served on ${PORT}`);
});
