CREATE TABLE doctors (
    doctor_id INT,
    PRIMARY KEY (doctor_id),
    FOREIGN KEY (doctor_id) REFERENCES users (user_id)
);
