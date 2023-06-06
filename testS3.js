const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIA26HX2AKWG4EVCXPY',
  secretAccessKey: '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',
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
