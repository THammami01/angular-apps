SHOW DATABASES;

CREATE DATABASE SGC;

USE SGC;

SHOW TABLES;

CREATE TABLE employee (
	id INT PRIMARY KEY AUTO_INCREMENT,
	registration VARCHAR(255) NOT NULL,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	position VARCHAR(255) NOT NULL,
	phone VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	passkey VARCHAR(255) NOT NULL,
  -- password is a reserved word
	signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DESC Employee;
SELECT * FROM Employee;
DELETE FROM Employee;

INSERT INTO Employee(registration, firstname, lastname, position, phone, email, passkey)
VALUES(
	"1001", "Tarek", "Hammami", "Service Informatique",
	"90000000", "thammami.me@gmail.com", "Hello123"
);