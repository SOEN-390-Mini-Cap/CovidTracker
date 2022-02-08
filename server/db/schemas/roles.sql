CREATE TABLE roles (
    role_id INT,
    role_name VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (role_id)
);

INSERT INTO roles (role_id, role_name) VALUES (1, 'USER');
INSERT INTO roles (role_id, role_name) VALUES (2, 'PATIENT');
INSERT INTO roles (role_id, role_name) VALUES (3, 'DOCTOR');
INSERT INTO roles (role_id, role_name) VALUES (4, 'ADMIN');
INSERT INTO roles (role_id, role_name) VALUES (5, 'HEALTH_OFFICIAL');
INSERT INTO roles (role_id, role_name) VALUES (6, 'IMMIGRATION_OFFICER');
