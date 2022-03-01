CREATE TABLE statuses (
    status_id SERIAL,
    patient_id INT NOT NULL,
    status_body JSON NOT NULL,
    is_reviewed BOOLEAN NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (status_id),
    FOREIGN KEY (patient_id) REFERENCES patients (patient_id)
);
