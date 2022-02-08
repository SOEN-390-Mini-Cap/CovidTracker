CREATE TABLE immigration_officers (
    immigration_officer_id INT,
    PRIMARY KEY (immigration_officer_id),
    FOREIGN KEY (immigration_officer_id) REFERENCES users (user_id)
);
