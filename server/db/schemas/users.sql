CREATE TABLE users (
    user_id serial PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth TIMESTAMP WITH TIME ZONE  NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);
