// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;
// Expressインポート
var express = require('express');
var router = express.Router();//ルーター設定



// sequelizeの設定を追加
const { Sequelize } = require('sequelize');
// databaseやuser, passwordをdcoker-compose.ymlで設定したものを使う↓
const sequelize = new Sequelize('my_mysql_db', 'root', 'root', {
  host: 'my_mysql', // hostの名前をdocker-compose.ymlで設定したmy_mysqlに変更する
  dialect: 'mysql',
});

const mysql = require("mysql2");//Mysql２インポート
//const mysql = require("mysql2/promise");

// タイミング的にMysqlを認識できないので関数ないで接続情報を設定
// const connection = mysql.createConnection({
//   host: "my_mysql",
//   user: "root",
//   password: "root",
//   database: "my_mysql_db"
// });


/* GET users listing. */
router.get('/', async (req, res, next) => {
  // 忘れずに上に"async"を追加する。
  // my_mysqlに接続されているかテスト

  const connection = mysql.createConnection({
    host: "my_mysql",
    user: "root",
    password: "root",
    database: "my_mysql_db"
  });
//
//   res.header("Access-Control-Allow-Origin", "https://n93fl.csb.app"); //
// res.header("Access-Control-Allow-Origin", "https://sxsri.csb.app"); //
res.header("Access-Control-Allow-Origin", "http://localhost:8080"); //  

  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin,Content-Type");

  const sql = "select * from test_table;";
  let get_results="";//結果格納s

  // res.header("Access-Control-Allow-Origin", "https://r9bkv.csb.app"); 
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');



  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  // res.send('respond with a resource');

  console.log("------start--");
 
  try{
    // await connection.connect();
    //"SELECT user, host, plugin FROM mysql.user"
    await connection.query(sql, function (
        error,
        results,
        fields
      ) {
        console.log("------00000--");
    
        //console.log(results);
        get_results=results;
        if(get_results===""){
          console.log("no data!!");
        }else{
          console.log("get data!! from database");
          console.log("-----");
          
           console.log(get_results);

        }
       
        res.send(results);
        
        console.log("end!!");
        // console.log(error);
        // console.log(fields);
    
        // if (error) throw error;
        // console.log(results[0]);
      });
    
    // );

    console.log("ok!!");
    console.log(get_results);
    // res.send('respond SQL OK')
  }catch(e){
    console.log(e);
  }
  

console.log(get_results);


});


// routerでuse設定
router.use("/",  (req, res,next) => {
//   res.header("Access-Control-Allow-Origin", "https://n93fl.csb.app"); //
  res.header("Access-Control-Allow-Origin", "http://localhost:8080"); //
  // res.header("Access-Control-Allow-Origin", "http://0.0.0.0:8080/#"); //
  // res.header("Access-Control-Allow-Origin", "https://sxsri.csb.app"); //
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Origin,Content-Type");

 

  console.log("set up..use");
  console.log(req.ip);
  console.log(req.method);
  console.log(req.path);
  console.log(req.protocol);
  console.log(req.query.name);
  next();
  
});

module.exports = router;