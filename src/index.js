const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
require('dotenv').config();

const adminRouter = require('./routers/admin');
const articleRouter = require('./routers/article');
const editorRouter = require('./routers/editor');
const userRouter = require('./routers/user');

const app = express();
const port = process.env.PORT || 5000;

// middleware
// app.use(cors());
app.use(express.json());

app.use('/api', adminRouter);
app.use('/api', articleRouter);
app.use('/api', editorRouter);
app.use('/api', userRouter);

const DatabaseName = "singularity-newspaper";
const mongoString = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.e3jxy.mongodb.net/${DatabaseName}?retryWrites=true&w=majority`;
mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})

app.get('/', (req, res) => {
    res.json({
        "1": "GET: http://localhost:5000/",
        "2": "GET: http://localhost:5000/api/users",
        "3": "POST: http://localhost:5000/api/users/registration",
        "4": "POST: http://localhost:5000/api/users/login",
        "5": "POST: http://localhost:5000/api/users/logout",
        "6": "POST: http://localhost:5000/api/users/logout-all",
        "7": "GET: http://localhost:5000/api/users",
        "8": "GET: http://localhost:5000/api/users/<id>",
        "9": "PATCH: http://localhost:5000/api/users/<id>",
        "10": "DELETE: http://localhost:5000/api/users/<id>",
        "11": "PATCH: http://localhost:5000/api/active-user/<id>",
        "12": "GET: http://localhost:5000/api/editors",
        "13": "GET: http://localhost:5000/api/editors/<id>",
        "14": "PATCH: http://localhost:5000/api/make-admin/<id>",
        "15": "PATCH: http://localhost:5000/api/admin-profile/me",
        "16": "GET: http://localhost:5000/api/admin-profile/me",
        "17": "GET: http://localhost:5000/api/search-editor/<email>",
        "18": "GET: http://localhost:5000/api/editor-profile/me",
        "19": "PATCH: http://localhost:5000/api/editor-profile/me",
        "20": "POST: http://localhost:5000/api/articles/",
        "21": "PATCH: http://localhost:5000/api/articles/<id>",
        "22": "GET: http://localhost:5000/api/articles/",
        "23": "GET: http://localhost:5000/api/articles/<id>",
        "24": "GET: http://localhost:5000/api/articles/<id>/image",
        "25": "PATCH: http://localhost:5000/api/articles/<id>/image",
        "26": "DELETE: http://localhost:5000/api/articles/<id>/image",
        "27": "DELETE: http://localhost:5000/api/articles/<id>",
    });
});