CREATE TABLE messages (
    message_id SERIAL,
    from_user_id INT,
    to_user_id INT,
    message_body TEXT,
    created_on TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (message_id),
    FOREIGN KEY (from_user_id) REFERENCES users (user_id),
    FOREIGN KEY (to_user_id) REFERENCES users (user_id)
);
