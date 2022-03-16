const express = require("express");
const {
  loadContact,
  findContact,
  addContact,
  dupeCheck,
  deleteContact,
  updateContact,
} = require("./utils/contacts");

const expressLayouts = require("express-ejs-layouts");
const { body, check, validationResult } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 3000;

// Use EJS + Layouts
app.set("view engine", "ejs");

// Third party Middleware
app.use(expressLayouts);

// Built-in Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Flash Configuration
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Route Start
// .
// .

// Home Route (Default)
app.get("/", (req, res) => {
  // res.sendFile("./index.html", { root: __dirname });
  res.render("index", {
    layout: "layouts/main_layout",
    name: "Joevano",
    title: "Home",
  });
});

// About Route
app.get("/about", (req, res) => {
  // res.sendFile("./about.html", { root: __dirname });
  res.render("about", {
    layout: "layouts/main_layout",
    title: "About",
  });
});

// Contact Route
app.get("/contact", (req, res) => {
  // res.sendFile("./contact.html", { root: __dirname });
  const contacts = loadContact();

  res.render("contact", {
    layout: "layouts/main_layout",
    title: "Contact",
    contacts,
    msg: req.flash("msg"),
  });
});

// Contact Add Data
app.get("/contact/add", (req, res) => {
  res.render("add_contact", {
    layout: "layouts/main_layout",
    title: "Form Contact",
  });
});

// Process add Contact (Validation)
app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const dupe = dupeCheck(value);
      if (dupe) {
        throw new Error("Name already exist");
      }
      return true;
    }),
    check("email", "Email not valid!").isEmail(),
    check("nohp", "No hp not valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("add_contact", {
        layout: "layouts/main_layout",
        title: "Form Contact",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);

      // Send flash message
      req.flash("msg", "Data successfully added!");
      res.redirect("/contact");
    }
  }
);

// Delete Contact
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  // If contact not exist
  if (!contact) {
    res.status(404);
    res.sendFile("./404.html", { root: __dirname });
  } else {
    deleteContact(req.params.nama);
    // Send flash message
    req.flash("msg", "Data successfully deleted!");
    res.redirect("/contact");
  }
});

// Edit Contact
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("edit_contact", {
    layout: "layouts/main_layout",
    title: "Edit Contact",
    contact,
  });
});

// Process edit Contact
app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const dupe = dupeCheck(value);
      if (value !== req.body.oldNama && dupe) {
        throw new Error("Name already exist");
      }
      return true;
    }),
    check("email", "Email not valid!").isEmail(),
    check("nohp", "No hp not valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("edit_contact", {
        layout: "layouts/main_layout",
        title: "Form Edit Contact",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContact(req.body);

      // Send flash message
      req.flash("msg", "Data successfully updated!");
      res.redirect("/contact");
    }
  }
);

// Details Contact
app.get("/contact/:nama", (req, res) => {
  // res.sendFile("./contact.html", { root: __dirname });
  const contact = findContact(req.params.nama);

  res.render("detailContact", {
    layout: "layouts/main_layout",
    title: "Detail Contact",
    contact,
  });
});

// 404 Code
app.use((req, res) => {
  res.status(404);
  res.sendFile("./404.html", { root: __dirname });
});

app.listen(port);
console.log(`listening to http://localhost:${port}`);
