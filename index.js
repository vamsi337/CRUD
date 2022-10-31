var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Book = require("./bookController");
var app = express();
const User = require("./model/user");
const bcrypt = require("bcrypt");
const auth = require("./middleware/auth");
mongoose.connect("mongodb://localhost:27017/crudDB");

//var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post("/register", async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign({ user_id: user._id, email }, "jwt", {
      expiresIn: "2h",
    });
  
    user.token = token;

    
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  
});

app.get("/", function (req, res) {
  res.send("Hey there..");
});

app.get("/books", auth, function (req, res) {
  console.log("Getting all books");
  Book.find({}, function (err, books) {
    if (err) throw err;
    console.log(books);
    res.json(books);
  });
});
app.get("/books/:id", auth, function (req, res) {
  Book.findOne(
    {
      _id: req.params.id,
    },
    function (err, book) {
      if (err) throw err;
      console.log(book);
      res.json(book);
    }
  );
});

app.post("/book", auth, function (req, res) {
  var newBook = new Book();
  newBook.title = req.body.title;
  newBook.category = req.body.category;
  newBook.save(function (err, book) {
    if (err) {
      res.send("error saving book");
    } else {
      console.log(book);
      res.send(book);
    }
  });
});
app.put("/book/:id", auth, function (req, res) {
  var bookId = req.params.id;

  Book.findOneAndUpdate(
    {
      _id: bookId,
    },
    { $set: { title: req.body.title } },
    { upsert: true },

    function (err, newBook) {
      if (err) {
        res.send("error updating ");
      } else {
        console.log(newBook);
        res.send(newBook);
      }
    }
  );
});

app.delete("/book/:id", auth, function (req, res) {
  Book.findOneAndRemove(
    {
      _id: req.params.id,
    },
    function (err, book) {
      if (err) {
        res.send("error removing");
      } else {
        console.log(book);
        res.status(204);
      }
    }
  );
});
app.listen(4000);
console.log("Listening on port 4000");
