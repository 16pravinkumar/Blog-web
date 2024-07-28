const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

const userModel = require("./models/user");
const postModel = require("./models/post");

const cookieParser = require("cookie-parser");



app.use(cookieParser());

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));


app.get('/profile/upload',(req,res) => {
  res.render('profileUpload')
})
const upload = require("./config/multerConfig")


app.post('/upload',isLoggedIn,  upload.single('avatar'), async(req,res)=>{
  let user = await userModel.findOne({email: req.user.email});
  user.profilePic = req.file.filename;
  await user.save();
  res.redirect('/profile')
})


app.get("/", (req, res) => {
  res.render("index");
});


// user Registered Data
app.post("/register", async (req, res) => {
  let { name, userName, age, email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (user) {
    return res.status(500).send(`Already Registered`);
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        let user = await userModel.create({
          name,
          userName,
          age,
          email,
          password: hash,
        });

        let token = jwt.sign({ email: email, userid: user._id }, "shh");
        res.cookie("token", token);

        res.redirect("/login");
      });
    });
  }
});

// login
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).send("User not found");
  }
  // console.log(user);

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      // res.redirect()
      let token = jwt.sign({ email: email, userid: user._id }, "shh");
      res.cookie("token", token);
      res.redirect("profile");
    } else {
      res.status(400).send("Invalid Credentials");
    }
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

app.get("/profile", isLoggedIn, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");

  // console.log(user);
  res.render("profile", { user });
});

app.post("/posts", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });

  let { postContent } = req.body;
  let posts = await postModel.create({
    user: user._id,
    content: postContent,
  });

  user.posts.push(posts._id);
  await user.save();

  res.redirect("/profile");
});

// likes
app.get("/like/:id", isLoggedIn, async (req, res, next) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");
  // console.log(req.user)

  if (post.likes.indexOf(req.user.userid) === -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  }

  await post.save();
  res.redirect("/profile");
});

// edit

app.get("/edit/:postid", isLoggedIn, async (req, res) => {
  let post = await postModel
    .findOne({ _id: req.params.postid })
    .populate("user");

  res.render("edit", { post });
});
app.post("/update/:postid", isLoggedIn, async (req, res) => {
  let post = await postModel.findOneAndUpdate(
    { _id: req.params.postid },
    { content: req.body.postContent }
  );
  res.redirect("/profile");
});

function isLoggedIn(req, res, next) {
  if (req.cookies.token === "") return res.redirect("/login");
  else {
    let data = jwt.verify(req.cookies.token, "shh");
    req.user = data;
  }
  next();
}

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
