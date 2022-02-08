CREATE TABLE patients (
    patient_id INT,
    PRIMARY KEY (patient_id),
    FOREIGN KEY (patient_id) REFERENCES users (user_id)
);
