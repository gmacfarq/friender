CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  location INTEGER NOT NULL,
  hobbies TEXT NOT NULL,
  interests TEXT NOT NULL,
  img_filename TEXT,
  email TEXT
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  liker_username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  liked_username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  is_successful_match BOOLEAN DEFAULT FALSE,
  timestamp DATE DEFAULT NULL
);

CREATE TABLE messages (
  id SERIAL,
  match_id INTEGER
    REFERENCES matches ON DELETE CASCADE,
  sender_username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  timestamp DATE DEFAULT CURRENT_DATE NOT NULL,
  PRIMARY KEY (id, match_id, sender_username)
);
