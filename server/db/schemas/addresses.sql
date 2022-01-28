CREATE TABLE addresses (
    address_id SERIAL,
    street_address VARCHAR(255) NOT NULL,
    street_address_line_two VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    postal_code VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    PRIMARY KEY (address_id)
);
