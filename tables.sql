CREATE TABLE users(
    email VARCHAR(70) PRIMARY KEY,
    firstname VARCHAR(25) NOT NULL,
    lastname VARCHAR(25) NOT NULL,
    password VARCHAR(64) NOT NULL
);

CREATE TABLE comments(
    alias VARCHAR(25) NOT NULL,
    message TEXT NOT NULL,
    time VARCHAR(70) NOT NULL,
    userid VARCHAR(70) NOT NULL
);
    -- FOREIGN KEY(users) user