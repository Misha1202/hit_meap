const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware
app.use(fileUpload());
app.use(express.static('public'));

// Создаем папки, если их нет
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('converted')) fs.mkdirSync('converted');

// Маршруты
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  const targetFormat = req.body.targetFormat;
  const uploadPath = path.join(__dirname, 'uploads', file.name);

  file.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);

    // Здесь будет логика конвертации
    // Пока просто копируем файл как заглушку
    const convertedPath = path.join(__dirname, 'converted', 
      `${path.parse(file.name).name}.${targetFormat}`);
    
    fs.copyFileSync(uploadPath, convertedPath);

    res.download(convertedPath, (err) => {
      if (err) console.error('Download error:', err);
      // Удаляем временные файлы
      fs.unlinkSync(uploadPath);
      fs.unlinkSync(convertedPath);
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});