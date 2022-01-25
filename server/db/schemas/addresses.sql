CREATE TABLE addresses (
    user_id INT NOT NULL,
    street_address: VARCHAR(255) NOT NULL,
    street_address_line_two VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    postal_code VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, street_address),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
