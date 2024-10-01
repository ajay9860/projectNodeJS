const db = require("../config/db")
const Crypto = require('crypto');
const jwt = require('jsonwebtoken'); // Ensure jwt is required




const getCountriesData = async (req, res) => {
  try {
      const data = await db.query('select * from countries')
      if (data) {
          return res.send({
              'result' : data[0]
          })
      } else {
          return res.send({'msg' : 'record not found'})
      }

  } catch (error) {
      console.log(error)
  }
  
}


const addCountriesData = async (req, res) => {
  try {
      const data = req.body;
      const file = req.file;

      console.log(data, 'aaaaaaaaaaaaaa1', file.filename)
      if (data.id) {
        console.log('in if part')
        const number = Number(data.id)
        if (!file) {
          return res.status(400).send({ message: 'No file uploaded' });
        }

      console.log('File Information:', file);

      // Extract file information to be stored in the database
      const flag =  'http://localhost:8080/images/' + file.filename;
      console.log(flag, 'flag@@@@@@@@')
      // Use parameterized queries to prevent SQL injection

      
      const query = `
      UPDATE countries
      SET countryName = ?,
          continent = ?,
          rank = ?,
          flag = ?
      WHERE id = ?
  `;
  
  // Define the parameter values
  const values = [
    data.countryName,
    data.continent,
    data.middlename,
    data.rank,
      flag,
      id
  ];
      // return res.send({image: flag})
      const result = await db.query(query, values);

      if (result) {
          console.log(result, 'update record successfully');
          return reencryptPasswords.status(200).send({
              statusCode: 200,
              result: 'update record successfully'
          });
      } else {
          return res.status(500).send({ msg: 'Failed to save record' });
      }
      } else {
        console.log('in else part')

        if (!file) {
          return res.status(400).send({ message: 'No file uploaded' });
      }

      console.log('File Information:', file);

      // Extract file information to be stored in the database
      const flag =  'http://localhost:8080/uploads/' + file.filename;
      // Use parameterized queries to prevent SQL injection

      const uniqueCountry = `
          SELECT name FROM countries WHERE name = ?`;  // or use `?` depending on your query language
        const countryValue = [
          data.countryName
        ];

      const resultQuery = await db.query(uniqueCountry, countryValue);
    if (resultQuery[0].length > 0) {
      return res.status(200).send({ message: 'Country name must be unique.' }) 
    }


    const uniquecontinent = `
          SELECT name FROM countries WHERE name = ?`;  // or use `?` depending on your query language
        const countrycontinent = [
          data.countryName
        ];

      const resultcontinent = await db.query(uniquecontinent, countrycontinent);
        if (resultcontinent[0].length > 0) {
          return res.status(200).send({ message: 'Continent name must be unique.' }) 
        }



      const query = `
          INSERT INTO countries (
              name,
              continent,
              \`rank\`,
              flag
          ) VALUES (?, ?, ?, ?)
      `;
      const values = [
          data.countryName,
          data.continent,
          data.rank,
          flag
      ];

      // return res.send({image: flag})
      const result = await db.query(query, values);

      if (result) {
          console.log(result, 'Record saved successfully');
          return res.status(200).send({
              statusCode: 200,
              result: 'Record saved successfully'
          });
      } else {
          return res.status(500).send({ msg: 'Failed to save record' });
      }
      }
      
  } catch (error) {
      console.error('Error uploading file and saving record:', error);
      return res.status(500).send({
          message: 'Internal Server Error',
          error: error.message
      });
  }
};


const getCountriesList = async (req, res) => {
  try {
      const data = await db.query('select name from countries')
      if (data) {
          return res.send({
              'result' : data[0]
          })
      } else {
          return res.send({'msg' : 'record not found'})
      }

  } catch (error) {
      console.log(error)
  }
  
}


const getContinentList = async (req, res) => {
  try {
      const data = await db.query('SELECT DISTINCT continent FROM countries')
      if (data) {
          return res.send({
              'result' : data[0]
          })
      } else {
          return res.send({'msg' : 'record not found'})
      }

  } catch (error) {
      console.log(error)
  }
  
}


const validatesystemuserlogin = async (req, res) => {
  const data = req.body;

  try {
    const userresult = await db.query(
      `SELECT u.id, u.email, u.hashedPassword, u.salt, u.name, u.mobile, u.dob, u.profileimg, u.isverified, u.createdby, u.updatedby, u.createdat, u.updatedat, u.deletedat, u.auth FROM usersinfo u WHERE email = ?`,
      [data.email]
    );

    console.log(userresult, 'Database query result');

    if (userresult != null && userresult.length > 0) {
      const user = userresult[0];
      console.log('User object:', user);
      
      let isValidPassword = verifyUserPassword(user[0], data.password);
      if (isValidPassword) {
        const token = jwt.sign(
          {
            id: user[0].id,
            email: user[0].email,
          },
          "xpressbees",
          {
            expiresIn: '7 days',
          }
        );
        user.token = token;
        res.statusCode = 200;
        res.send({
          statusCode: 200,
          error: '',
          token: token,
        });
      } else {
        res.statusCode = 400;
        res.send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'User Password Wrong!',
        });
      }
    } else {
      res.statusCode = 400;
      res.send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'User Email Not Found!',
      });
    }
  } catch (err) {
    console.error('Error:', err);
    res.statusCode = 500;
    res.send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: err.message,
    });
  }
};



module.exports = { validatesystemuserlogin, getCountriesData, addCountriesData, getCountriesList, getContinentList}