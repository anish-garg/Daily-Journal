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
  email: String,
  password: String
});

const Blog = new mongoose.model("Blog", blogSchema)
const Blogger = new mongoose.model("Blogger", userSchema);

const blogs = [];

app.get("/", (req, res) => {
  res.render("home", {
    startingContent: homeStartingContent, blogs: blogs
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

var post;

app.post("/compose", (req, res) => {
  var post = new Blog({
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

app.get("/blogs/:blogId", (req, res) => {
  const requestedId = req.params.blogId
  async function run() {
    try {
      const newBlog = await Blog.findOne({ _id: requestedId }).then(function (err, post) {
        res.render("blogs", {
          requestedTtitle: post.title,
          requestedContent: post.content
        })
      });
    } catch (err) {
      console.log(err)
    }
  }
  run().catch((err) => console.log(err))
})

app.get("/login", (req, res) => {
  res.render("login")
  // var email_login = req.body.email
  // var password_login = req.body.pass
  // console.log(email_login)
  // console.log(password_login)
})

app.get("/signup", (req, res) => {
  res.render("signup")
  //   var email_signup = req.body.email
  //   var password_signup = req.body.pass
  //   const blogger = new Blogger({
  //     email: email_signup,
  //     password: password_signup
  //   })

  //   async function run() {
  //     try {
  //       await blogger.save()
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }

  //   run().catch((err) => console.log(err))
})







app.listen(3000, function () {
  console.log("Server started on port 3000");
});
