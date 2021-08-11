SHOW DATABASES;

CREATE DATABASE SGC;

USE SGC;

SHOW TABLES;

CREATE TABLE Employee (
	id INT PRIMARY KEY AUTO_INCREMENT,
	registration VARCHAR(255) NOT NULL UNIQUE,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	position VARCHAR(255) NOT NULL,
	phone VARCHAR(255) NOT NULL,
	gender VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	passkey VARCHAR(255) NOT NULL,
	signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DESC Employee;
SELECT * FROM Employee;
DELETE FROM Employee;
DROP TABLE Employee;

INSERT INTO Employee(registration, firstname, lastname, position, phone, gender, email, passkey)
VALUES(
	"1001", "Tarek", "Hammami", "Service Informatique",
	"90000000", "Masculin", "thammami.me@gmail.com", "Hello123"
);

INSERT INTO Employee(registration, firstname, lastname, position, phone, gender, email, passkey)
VALUES(
	"1002", "X", "Y", "Administrateur du site",
	"90000001", "Féménin", "x.y@gmail.com", "Hello123"
);




CREATE TABLE Demand (
	id INT PRIMARY KEY AUTO_INCREMENT,
	employeeId INT NOT NULL,
	leaveType VARCHAR(255) NOT NULL,
	startDate VARCHAR(255) NOT NULL,
	endDate VARCHAR(255) NOT NULL,
	demandStatus VARCHAR(255) NOT NULL DEFAULT "En Attente",
	submitDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updateDate TIMESTAMP
);

DESC Demand;
SELECT * FROM Demand;
DELETE FROM Demand;
DROP TABLE Demand;

INSERT INTO Demand(employeeId, leaveType, startDate, endDate)
VALUES(1, "Maladie", "1626390000000", "1637276400000");

SELECT D.*, CONCAT(E.firstname, " ", E.lastname) AS employeeName
FROM Demand AS D, Employee AS E
WHERE D.employeeId = E.id;
