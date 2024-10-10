const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 6173;

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = uuid() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/files/${
    req.file.filename
  }`;
  res.status(200).json({ url: fileUrl });
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/files', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`File server is running on port ${PORT}`);
});
