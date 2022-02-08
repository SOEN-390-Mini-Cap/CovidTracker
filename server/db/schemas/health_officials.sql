CREATE TABLE health_officials (
    health_official_id INT,
    PRIMARY KEY (health_official_id),
    FOREIGN KEY (health_official_id) REFERENCES users (user_id)
);
