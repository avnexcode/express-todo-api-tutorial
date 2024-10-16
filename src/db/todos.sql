CREATE TABLE todos (
    id VARCHAR(25) PRIMARY KEY DEFAULT (SUBSTR(UPPER(UUID()), 1, 25)),
    text VARCHAR(100) NOT NULL,
    status BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);