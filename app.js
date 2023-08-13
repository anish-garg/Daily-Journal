//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")
const mongoose = require("mongoose")

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogDB", { useNewUrlParser: true })

const blogSchema = new mongoose.Schema({
  title: String,
  content: String
})

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Blog = new mongoose.model("Blog", blogSchema)
const Blogger = new mongoose.model("Blogger", userSchema);

app.get("/", (req, res) => {
  res.render("home", {
    startingContent: homeStartingContent
  })
})

app.get("/about", (req, res) => {
  res.render("about", { AboutContent: aboutContent });
})
app.get("/contact", (req, res) => {
  res.render("contact", { ContactContent: contactContent });
})
app.get("/compose", (req, res) => {
  res.render("compose");
})

app.post("/compose", (req, res) => {
  const post = new Blog({
    title: req.body.title,
    content: req.body.postBody
  })
  // blogs.push(blog);
  async function run() {
    try {
      await post.save();
      res.redirect("/")
    } catch (error) {
      console.log(error)
    }
  }
  // console.log(blogs)
  run().catch((err) => console.log(err))

})

app.get("/blogs", (req, res) => {
  // const requestedId = req.params.blogId

  async function run() {
    try {
      const newBlog = await Blog.find({ _id: { $exists: true } })
      // console.log(newBlog)
      res.render("blogs", {
        newBlog: newBlog
      })
    }
    catch (err) {
      console.log(err)
    }
  }
  run().catch((err) => console.log(err))
})



app.get("/login", (req, res) => {
  res.render("login")
})

app.get("/signup", (req, res) => {
  res.render("signup")
})

// app.get("/profile", (req, res) => {
//   res.render("profile", {
//     name:req.body.name
//   })
// })

app.post("/login", (req, res) => {
  const email_login = req.body.email;
  const password_login = req.body.pass;
  // console.log(email_login + "------" + password_login)
  async function run() {
    try {
      const foundUser = await Blogger.findOne({ "email": email_login })
      if (foundUser.password === password_login) {
        res.redirect("/")
      } else {
        console.log("Invalid Credentials")
      }
    } catch (error) {
      console.log(error)
    }
  }
  run().catch((err) => console.log(err))
})

app.post("/signup", (req, res) => {
  const blogger = new Blogger({
    name: req.body.name,
    email: req.body.email,
    password: req.body.pass
  })
  async function run() {
    try {
      const newBlogger = await blogger.save()
      // console.log(newBlogger);
      res.redirect("/")
    } catch (error) {
      console.log(error)
    }
  }

  run().catch((err) => console.log(err))
})













app.listen(3000, function () {
  console.log("Server started on port 3000");
});
