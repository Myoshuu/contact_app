const fs = require("fs");

// If folder data not exist
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// If contacts.json not exist
const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

// Load Contact from contacts.json
const loadContact = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

// Find with id
const findContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );
  // console.log(contacts);
  return contact;
};

// Replace data to contacts.json
const saveContacts = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

// Add Contact data
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

// Duplicate name check
const dupeCheck = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama === nama);
};

// Delete Contact
const deleteContact = (nama) => {
  const contacts = loadContact();
  const filtered = contacts.filter((contact) => contact.nama !== nama);

  saveContacts(filtered);
};

// Update Contact
const updateContact = (newContact) => {
  const contacts = loadContact();

  // remove name contact that same with oldContact
  const filtered = contacts.filter(
    (contact) => contact.nama !== newContact.oldNama
  );
  // console.log(filtered, newContact);
  delete newContact.oldNama;
  filtered.push(newContact);
  saveContacts(filtered);
};

module.exports = {
  loadContact,
  findContact,
  addContact,
  dupeCheck,
  deleteContact,
  updateContact,
};
