// seed.js
const mongoose = require('mongoose');
require("dotenv").config();
const { faker } = require('@faker-js/faker'); // npm i @faker-js/faker

const User = require('./models/User');   // adjust paths to your actual models
const Event = require('./models/EventDetails');

const MONGO_URI = process.env.MONGODB_URL;

const categories = ['Sports']; // match your actual enum values if any
const types = ['Cricket', 'Football', 'Chess', 'Cycling']; // adjust to your real enum

// ---------- USERS ----------
const generateUsers = (count) => {
  return Array.from({ length: count }, () => ({
    email: faker.internet.email(),
    profileDetails: new mongoose.Types.ObjectId(), // placeholder — won't resolve unless you seed Profiles too
    image: `https://api.dicebear.com/5.x/initials/svg?seed=${faker.person.firstName()}`,
    purchasedTickets: [], // left empty as requested
  }));
};

// ---------- EVENTS ----------
const generateEvents = (count, organiserIds) => {
  return Array.from({ length: count }, () => ({
    organiser: faker.helpers.arrayElement(organiserIds), // real user _id
    imageUrl: faker.image.urlPicsumPhotos(),
    dateAndTime: faker.date.future(),
    location: faker.location.city(),
    title: faker.lorem.words(3),
    duration: String(faker.number.int({ min: 1, max: 4 })),
    language: faker.helpers.arrayElement(['Hindi', 'English', 'Telugu']),
    artist: faker.person.fullName(),
    category: faker.helpers.arrayElement(categories),
    type: faker.helpers.arrayElement(types),
    generalSeats: String(faker.number.int({ min: 50, max: 200 })),
    vipSeats: String(faker.number.int({ min: 10, max: 50 })),
    generalSeatPrice: String(faker.number.int({ min: 200, max: 2000 })),
    vipSeatPrice: String(faker.number.int({ min: 2000, max: 8000 })),
    generalTicketsSold: 0,
    vipTicketsSold: 0,
    userEnrolled: [], // left empty as requested
  }));
};

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true});
    console.log('Connected to Atlas');

    // Step 1: Insert users
    const users = generateUsers(5);
    const insertedUsers = await User.insertMany(users);
    const userIds = insertedUsers.map((u) => u._id);
    console.log(`Inserted ${insertedUsers.length} users`);

    // Step 2: Insert events, referencing real user ids as organiser
    const events = generateEvents(100, userIds);
    const insertedEvents = await Event.insertMany(events);
    console.log(`Inserted ${insertedEvents.length} events`);

    mongoose.disconnect();
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.disconnect();
  }
}

seedDB();