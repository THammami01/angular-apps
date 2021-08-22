CREATE DATABASE SGP;

USE SGP;

SHOW TABLES;

CREATE TABLE User(
	userNb INT PRIMARY KEY AUTO_INCREMENT,
	userId VARCHAR(255) NOT NULL UNIQUE,
	userPwd VARCHAR(255) NOT NULL
);

UPDATE User SET userPwd = 'admin' WHERE userNb = 1 AND userId = 'user1' AND userPwd = 'user1';
DESC User;
SELECT * FROM User;
DROP TABLE User;

INSERT INTO User(userId, userPwd)
VALUES("user3", "user3");


CREATE TABLE Patient(
	patientNb INT PRIMARY KEY NOT NULL UNIQUE,
	patientId VARCHAR(255) NOT NULL UNIQUE,
	lastname VARCHAR(255) NOT NULL,
	firstname VARCHAR(255) NOT NULL,
	nicNb VARCHAR(255) NOT NULL,
	phoneNb VARCHAR(255) NOT NULL,
	birthday VARCHAR(255) NOT NULL,
	addday VARCHAR(255) NOT NULL,
	parentName VARCHAR(255) NOT NULL
);

DESC Patient;
SELECT * FROM Patient;
DELETE FROM Patient;
DROP TABLE Patient;
SELECT MAX(incidentNb) FROM Patient;

-- 'Manel Amara', 'Marwa Agrebi', 'Maram Ben Aziza', 'Zaza Show', 'Sami Fehri',
-- 'Hedi Zaiem', 'Music Actors', 'Lobna Sediri', 'Amira Al Jaziri', 'Ramla Dhouibi	', 
-- 'Laetitia Lo Iudice', 'Emna Fakher	', 'Aicha Othman', 'Asma Othmani', 'Karim Gharbi',
-- 'Faycel Lahdiri', 'Tarek Baalouch', 'Zahra Ben Habib', 'Beya Zardi', 'Lynda Toumy	',
-- 'Rym Ben Messaoud', 'Nermine Sfar'

INSERT INTO Patient VALUES(
	11, '0011', "Othmani", "Asma", "09000011", "(+216) 97 000 011", "30/11/1991", "11/08/2021", 'X Ben Y'
);
