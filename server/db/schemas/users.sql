CREATE TABLE users (
    user_id SERIAL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    date_of_birth TIMESTAMP WITH TIME ZONE NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE NOT NULL,
    address_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (address_id) REFERENCES addresses (address_id),
    FOREIGN KEY (role_id) REFERENCES roles (role_id)
);
