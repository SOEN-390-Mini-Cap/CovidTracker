CREATE TABLE admins (
    admin_id INT,
    PRIMARY KEY (admin_id),
    FOREIGN KEY (admin_id) REFERENCES users (user_id)
);
