CREATE TABLE appointments (
    appointment_id SERIAL,
    doctor_id INT NOT NULL,
    patient_id INT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    address_id INT NOT NULL,
    PRIMARY KEY (appointment_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id),
    FOREIGN KEY (patient_id) REFERENCES patients (patient_id),
    FOREIGN KEY (address_id) REFERENCES addresses (address_id)
);
