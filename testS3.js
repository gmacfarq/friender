const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'YOUR_AWS_ACCESS_KEY',
  secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',
  region: 'YOUR_AWS_REGION'
});

const express = require('express');
const app = express();

app.get('/images/:filename', (req, res) => {
  const s3 = new AWS.S3();
  const params = {
    Bucket: 'YOUR_S3_BUCKET_NAME',
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
