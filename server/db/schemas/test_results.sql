CREATE TABLE test_results(
    test_id SERIAL,
    patient_id INT NOT NULL,
    test_result VARCHAR(255) NOT NULL,
    type_of_test VARCHAR(255) NOT NULL,
    date_of_test TIMESTAMP WITH TIME ZONE NOT NULL,
    address_id INT NOT NULL,
    PRIMARY KEY (test_id),
    FOREIGN KEY(patient_id) REFERENCES patients (patient_id),
    FOREIGN KEY(address_id) REFERENCES addresses (address_id)
);