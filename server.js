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
const PORT = process.env.PORT || 3000;



app.use(cors({
    origin:  process.env.FRONTEND_URL || 'http://localhost:3000'|| 'https://capstone3mtt-3letankft-chukwunonso-kuzues-projects.vercel.app', //or your frontend url
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
console.log(process.env.MONGODB_URI)


// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    ttl: 14 * 24 * 60 * 60,
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true,sameSite: 'none', maxAge: 14 * 24 * 60 * 60} // 14 days
  }));

  app.use((req, res, next) => {
    console.log('Session:', req.session);
    console.log('Cookies:', req.cookies);
    next();
  });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Could not connect to MongoDB', error));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(process.env.MONGODB_URI)
}
);




