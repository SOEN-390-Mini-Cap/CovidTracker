CREATE TABLE status_fields (
    patient_id INT,
    temperature BOOL NOT NULL,
    weight BOOL NOT NULL,
    other_symptoms BOOL NOT NULL,
    fever BOOL NOT NULL,
    cough BOOL NOT NULL,
    shortness_of_breath BOOL NOT NULL,
    loss_of_taste_and_smell BOOL NOT NULL,
    nausea BOOL NOT NULL,
    stomach_aches BOOL NOT NULL,
    vomiting BOOL NOT NULL,
    headaches BOOL NOT NULL,
    muscle_pain BOOL NOT NULL,
    sore_throat BOOL NOT NULL,
    PRIMARY KEY (patient_id),
    FOREIGN KEY (patient_id) REFERENCES patients (patient_id)
);
