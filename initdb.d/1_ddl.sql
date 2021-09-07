CREATE DATABASE IF NOT EXISTS sada;
CREATE TABLE IF NOT EXISTS sada.masashi(
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
);
insert into sada.masashi values('1','m');

CREATE TABLE IF NOT EXISTS my_mysql_db.test_table(
  `id` INT AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `mali` varchar(100) NOT NULL,
  `tel` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
   PRIMARY KEY (id)

);