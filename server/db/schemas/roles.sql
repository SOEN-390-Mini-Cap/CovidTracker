CREATE TABLE roles (
    role_id SERIAL,
    role_name VARCHAR (255) UNIQUE NOT NULL,
    PRIMARY KEY (role_id)
);
