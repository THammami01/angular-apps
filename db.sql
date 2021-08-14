CREATE DATABASE SGI;

USE SGI;

SHOW TABLES;

CREATE TABLE User(
	userNb INT PRIMARY KEY AUTO_INCREMENT,
	userId VARCHAR(255) NOT NULL UNIQUE,
	userPwd VARCHAR(255) NOT NULL
);

DESC User;
SELECT * FROM User;
DROP TABLE User;

INSERT INTO User(userId, userPwd)
VALUES("admin5", "admin5");


CREATE TABLE Incident(
	incidentNb INT PRIMARY KEY AUTO_INCREMENT,

    sourcePost VARCHAR(255) NOT NULL, -- Poste source
	voltage INT NOT NULL, -- Tension en KV
    departure VARCHAR(255) NOT NULL, -- Nom du départ
	aSType VARCHAR(255) NOT NULL, -- Types (A=Aérien/S=Souterrain)

    incidentType VARCHAR(255) NOT NULL, -- or nature, Type de l'incident (R+L+D, R=DRR L=DRL D=DD)
    -- cause VARCHAR(255) NOT NULL,

	startDatetime VARCHAR(255) NOT NULL, -- Début
	firstRecoveryDatetime VARCHAR(255) NOT NULL, -- 1er rétablissement
    endDatetime VARCHAR(255) NOT NULL, -- Fin

	cutOff INT NOT NULL, -- Courant coupé
	recovery INT NOT NULL, -- Courant 1er rétablissement
    section VARCHAR(255) NOT NULL, -- Tronçon concerné
    observations TEXT NULL -- Observations
);

DESC Incident;
SELECT * FROM Incident;
DROP TABLE Incident;

INSERT INTO Incident(
	sourcePost, voltage, departure, aSType, incidentType, startDatetime,
    firstRecoveryDatetime, endDatetime, cutOff, recovery, section, observations
) VALUES(
	"Mnihla", 30, "K. Andalous", "A", "DRR, DRL, DD", "14/08/2021 20:07",
	"14/08/2021 22:00", "14/08/2021 23:30", 51, 12, "entre T2 et T3", "......"
);