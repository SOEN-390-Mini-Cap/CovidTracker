CREATE TABLE location_reports (
    location_report_id SERIAL,
    patient_id INT NOT NULL,
    address_id INT NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (location_report_id),
    FOREIGN KEY (patient_id) REFERENCES patients (patient_id),
    FOREIGN KEY (address_id) REFERENCES addresses (address_id)
);
