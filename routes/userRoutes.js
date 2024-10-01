const express = require('express')
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const upload = multer({ dest: 'uploads/' }); // Specify the upload directory

const image = multer({ dest: 'images/' }); // Specify the upload directory

// http:localhost:8080/uploads/Screenshot from 2023-08-25 14-01-42.png
app.use('/images', express.static('images'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { validatesystemuserlogin, getCountriesData, addCountriesData, getCountriesList, getContinentList } = require('../controller/userController')

const router = express.Router()

//routes

// get all users


router.post('/validatesystemuserlogin', validatesystemuserlogin)

router.get('/getCountriesData', getCountriesData)

router.post('/addCountriesData', upload.single('file'), addCountriesData)

router.get('/getCountriesList', getCountriesList)

router.get('/getContinentList', getContinentList)

module.exports = router