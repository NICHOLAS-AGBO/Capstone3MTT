const express = require('express');
const mongoose = require('mongoose')
const path = require('path')
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;




app.use(cors({
    origin:  process.env.CLIENT_URL || 'http://localhost:3000', //or your frontend url
    credentials: true,
}))

// Middleware
//app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
console.log(process.env.MONGODB_URI)

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true,sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', maxAge: 7 * 24 * 60 * 60 * 1000} // 1 week 
  }));
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Could not connect to MongoDB', error));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(process.env.MONGODB_URI)
}
);




