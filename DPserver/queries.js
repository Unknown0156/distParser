require('console-stamp')(console, '[HH:MM:ss]');
const config = require('./config.js');

//подключение в бд
const Pool = require('pg').Pool
const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
})

//ссылка на телеграм
const tg=(req, res)=>{
    pool.query('SELECT link FROM tg')
    .then(result=>{
        if(result.rowCount!=0){
            res.status(200).send(result.rows[0].link);
        }else{
            res.status(404).end();
        }
    })
}

//получение данных и проверка доступа
const newqa = (req, res) => {
    const {username, profession, question, answer, subject, theme, testnum}=req.body;
    var auth=false;

    //проверка доступа
    pool.query('SELECT access FROM users WHERE name=$1 AND profession=$2',[username, profession])
    .then(result=>{
    if(result.rowCount==0){//если пользователь не найден в бд
        //добавление пользователя в бд
        pool.query('INSERT INTO users (name, profession, access) VALUES ($1, $2, $3)', [username, profession, false])
        .catch(err=>console.error('Error: ', err.stack));
        res.status(404).end();
    }else//если найден, проверка доступа
        if(result.rows[0].access){
            auth=true;
            res.status(200).end();
        }else{
            res.status(404).end();
        }
    })
    .catch(err=>console.error('Error: ', err.stack))
    
    //поиск вопроса
    pool.query('SELECT * FROM questions WHERE question=$1', [question])
    .then(result=>{
        if(result.rowCount==0){//если вопрос не найден
            var themeid=0;//ид темы
            //поиск ид темы
            pool.query('SELECT id FROM themes WHERE subject=$1 AND name=$2 AND test=$3', [subject, theme, testnum])
            .then(result=>{
                if(result.rowCount!=0){//если ид темы найден
                    themeid=result.rows[0].id;
                    //добавление вопроса в бд
                    pool.query('INSERT INTO questions (question, answer, theme) VALUES ($1, $2, $3)', [question, answer, themeid])
                    .catch(err=>console.error('Error: ', err.stack));
                    console.log(username+' from '+profession+' send new question in theme '+subject);
                }else{
                    pool.query('INSERT INTO themes (subject, name, test) VALUES ($1, $2, $3) RETURNING id', [subject, theme, testnum])
                    .then(result=>{
                        themeid=result.rows[0].id;
                        pool.query('INSERT INTO questions (question, answer, theme) VALUES ($1, $2, $3)', [question, answer, themeid])
                        .catch(err=>console.error('Error: ', err.stack));
                        console.log(username+' from '+profession+' send new question in theme '+subject);
                    })
                    .catch(err=>console.error('Error: ', err.stack));
                }
            })
            .catch(err=>console.error('Error: ', err.stack));
        }
    })
    .catch(err=>console.error('Error: ', err.stack));
}

module.exports={
    tg,
    newqa
}