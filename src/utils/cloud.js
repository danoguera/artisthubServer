const Busboy = require('busboy');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {
  formData(req, res, next) {
    let uploadingFile = false;

    function done() {
      if (uploadingFile) return;
      next();
    }

    const busboy = new Busboy({ headers: req.headers });
    req.body = {};

    busboy.on('field', (key, val) => {
      req.body[key] = val;
    });

    busboy.on('file', (fieldname, file) => {
      uploadingFile = true;
      const stream = cloudinary.uploader.upload_stream(
        { upload_preset: 'artist_preset' },
        (err, res) => {
          if(err) {
            throw Error('Algo salió mal');
          }
          req.body[fieldname] = res;
          uploadingFile = false;
          done();
        }
      );

      file.on('data', data => {
        stream.write(data);
      });

      file.on('end', () => {
        stream.end();
      })
    });

    busboy.on('finish', () => {
      done();
    });

    req.pipe(busboy);
  }
}