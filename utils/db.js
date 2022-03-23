const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://Joevano:root@immanuel.uta9f.mongodb.net/immanuel?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// // Add Data
// const contact1 = new Contact({
//   nama: "Dason",
//   nohp: "081926142356",
//   email: "das@gmail.com",
// });

// // Save to Collection
// contact1.save().then((contact) => console.log(contact));
