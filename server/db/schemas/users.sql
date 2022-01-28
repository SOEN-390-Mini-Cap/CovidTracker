CREATE TABLE users (
    user_id SERIAL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    date_of_birth TIMESTAMP WITH TIME ZONE NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    address_id INT NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (address_id) REFERENCES addresses (address_id)
);
