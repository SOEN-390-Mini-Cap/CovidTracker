CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_on TIMESTAMP NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (role_id) REFERENCES roles (role_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
