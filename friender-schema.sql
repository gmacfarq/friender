CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  location INTEGER NOT NULL,
  hobbies TEXT NOT NULL,
  interests TEXT NOT NULL
  email TEXT
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  file_name TEXT NOT NULL,
  user_username VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE
);

CREATE TABLE likes (
  username_liking VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  username_liked VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  match_id INTEGER
    REFERENCES matches ON DELETE CASCADE,
  PRIMARY KEY (username_liking, username_liked)
);

CREATE TABLE matches (
  id SERIAL PRIMARY KEY
  timestamp DATE DEFAULT CURRENT_DATE NOT NULL,
);

CREATE TABLE messages (
  id SERIAL
  match_id INTEGER
    REFERENCES matches ON DELETE CASCADE,
  timestamp DATE DEFAULT CURRENT_DATE NOT NULL,

  PRIMARY KEY (id, match_id)
);
