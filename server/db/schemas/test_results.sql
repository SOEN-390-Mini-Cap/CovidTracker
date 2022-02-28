CREATE TABLE test_results(
    test_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    test_result VARCHAR(255) NOT NULL,
    type_of_test VARCHAR(255) NOT NULL,
    Date_of_test TIMESTAMP NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    street_address_line_two VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    postal_code VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    FOREIGN KEY(patient_id) REFERENCES patients
);