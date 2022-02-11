CREATE TABLE patients (
    patient_id INT,
    assigned_doctor_id INT,
    status_fields JSON NOT NULL,
    PRIMARY KEY (patient_id),
    FOREIGN KEY (patient_id) REFERENCES users (user_id),
    FOREIGN KEY (assigned_doctor_id) REFERENCES doctors (doctor_id)
);
