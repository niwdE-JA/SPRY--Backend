CREATE TABLE users(
    email VARCHAR(70) PRIMARY KEY,
    firstname VARCHAR(25) NOT NULL,
    lastname VARCHAR(25) NOT NULL,
    password VARCHAR(64) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    epoch_time BIGINT NOT NULL
);

CREATE TABLE comments(
    alias VARCHAR(25) NOT NULL,
    message TEXT NOT NULL,
    time VARCHAR(70) NOT NULL,
    email VARCHAR(70) NOT NULL,
    FOREIGN KEY(email)
    REFERENCES users(email)
    ON DELETE CASCADE
);
    -- FOREIGN KEY(users) user
CREATE TABLE urls(
    email VARCHAR(70) PRIMARY KEY,
    id VARCHAR(64) NOT NULL,
    epoch_time BIGINT NOT NULL
);