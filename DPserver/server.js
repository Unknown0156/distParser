const express = require('express');
const path = require('path');
const db = require('./queries');

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//страничка парсера
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})
//скачивание архива
app.get('/download', (req, res)=>{
    res.setHeader('Content-disposition', 'attachment; filename=distParser.rar');
    res.setHeader('Content-type', 'application/x-rar-compressed');
    res.sendFile(path.join(__dirname, '/distparser.rar'));
})
//ссылка на телеграм
app.get('/tg', db.tg);
//получение данных
app.post('/newqa', db.newqa);
//запуск
app.listen(port, () => console.log(`distParser server listening on port ${port}!`))