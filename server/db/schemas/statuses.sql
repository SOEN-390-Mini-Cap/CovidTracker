CREATE TABLE statuses (
    status_id SERIAL,
    patient_id INT NOT NULL,
    status JSON NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (status_id),
    FOREIGN KEY (patient_id) REFERENCES patients (patient_id)
);
