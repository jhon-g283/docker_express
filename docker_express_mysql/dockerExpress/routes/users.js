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

// bodyを解析するにはbody-parserをインクルードしてjson解析用のメソッドをしないといけないらしい
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

// sequelizeの設定を追加
const { Sequelize } = require('sequelize');
// databaseやuser, passwordをdcoker-compose.ymlで設定したものを使う↓
const sequelize = new Sequelize('my_mysql_db', 'root', 'root', {
  host: 'my_mysql', // hostの名前をdocker-compose.ymlで設定したmy_mysqlに変更する
  dialect: 'mysql',
});

const mysql = require("mysql2");//Mysql２インポート

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

  // res.header("Access-Control-Allow-Origin", "https://r9bkv.csb.app"); 
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');



  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  res.send('respond with a resource');

  console.log("------start--");
 
  try{
    // await connection.connect();
    await connection.query("SELECT user, host, plugin FROM mysql.user", function (
        error,
        results,
        fields
      ) {
        console.log("------00000--");
    
        console.log(results);
        
        console.log("end!!");
        // console.log(error);
        // console.log(fields);
    
        // if (error) throw error;
        // console.log(results[0]);
      });
    
    // );

    console.log("ok!!");
    // res.send('respond SQL OK')
  }catch(e){
    console.log(e);
  }
  



});


// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// routerでuse設定
router.use("/",  (req, res,next) => {
  // res.header("Access-Control-Allow-Origin", "https://r9bkv.csb.app"); //
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); //
  
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin,Content-Type");

  // res.write("Hello World!.wwwww"); //write a response to the client
  // res.write(req);
  // bodyParser.json;
  bodyParser.json({ extended: true }); // for parsing application/x-www-form-urlencoded

  // res.end(); //end the response

  console.log("set up..use");
  console.log(req.ip);
  console.log(req.method);
  console.log(req.path);
  console.log(req.protocol);
  console.log(req.query.name);
  next();
  
});

router.post("/post_test", jsonParser, async (req, res)=> {
  // ここではクロスオリジンは必須のよう
  // res.header("Access-Control-Allow-Origin", "https://r9bkv.csb.app"); //
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); //

  res.header("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin,Content-Type");
  // res.header("", "Content-Type");
  bodyParser.json({ extended: true }); // for parsing application/x-www-form-urlencoded

  var error_flg = false;//エラー用のフラグ
  console.log("post complite");
  console.log(req.body);
  const result = transInsert(req.body);//ボディ部分を渡してInsert文を作成

  // いったん関数ないで接続を設定
  const connection = mysql.createConnection({
    host: "my_mysql",
    user: "root",
    password: "root",
    database: "my_mysql_db"
  });

  try{
    // Insert文（クエリ）を実行
    await connection.query(result, function (
        error,
        results,
        fields
      ) {
        console.log("------post--");
        console.log("------result--");
        console.log(results);
        console.log("------error--");
        console.log(error);
        console.log("------fields--");
        console.log(fields);

        
        console.log("end!!");
        // console.log(error);
        // console.log(fields);
    
        if (error) throw error;
        // console.log(results[0]);
      });
    
    // );

    console.log("ok!!");
    // res.send('respond SQL OK')
  }catch(e){
    console.log("catch error!");
    error_flg=true;
    console.log(e);
  }
  

  // エラーフラグを見て実行結果をレスポンスで返す
  if(error_flg !== true){
    res.write("error!! ");
  }else{
    res.write("注文完了");
    res.write(result);
    
  }
  

  res.end();
});

// SQLの作成用関数
const transInsert = (infojson) => {
  console.log("---transInsert--");
  console.log(infojson);
  var json_data = infojson["order_info"];//インデックス名からbody部分取得
  console.log(json_data);
  var i;
  var l;
  var query_arr = "";
 
// body部分がある場合、配列にカラムの内容を突っ込んでいく
  if (json_data !== undefined) {
    for (const [key, value] of Object.entries(json_data)) {

      i = value.indexOf(":");//フロントの仕様上：で文字を区切る。区切った右側が登録内容
      l = value.length;//長さ取得
      console.log(key + " " + value + " => " + value.slice(i + 1, l));

      if (query_arr === "") {
        //最初のカラム
        query_arr = "'" + value.slice(i + 1, l) + "'";
      } else {
        //２回目以降のカラムをつなげていく
        query_arr = query_arr + ",'" + value.slice(i + 1, l) + "'";
      }
    }
  } else {
    query_arr = json_data;
  }

  // SQLのInsert文のカラム部分をセット
  var SQL = `insert into test_table values(${query_arr});`;
  console.log(SQL);

  return SQL;
};




module.exports = router;