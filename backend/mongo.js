const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://sohum:${password}@learn.svrev5k.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  // Display all persons in the database
  Person.find({}).then(result => {
    result.forEach(i => {
      console.log(i);
    });
    mongoose.connection.close();
  });
} else {
  // Add a new person to the database
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(result => {
    console.log(`Added ${process.argv[3]} ${process.argv[4]} to phonebook.`);
    mongoose.connection.close();
  });
}
