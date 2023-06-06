const AWS = require('aws-sdk');
require("dotenv").config();

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY


AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: "us-east-1"
});

const express = require('express');
const app = express();

app.get('/images/:filename', (req, res) => {
  const s3 = new AWS.S3();
  const params = {
    Bucket: 'friender-bucket-rithm31',
    Key: req.params.filename
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(404).send('Image not found');
    }

    res.set('Content-Type', data.ContentType);
    res.send(data.Body);
  });
});

// Start the Express server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
