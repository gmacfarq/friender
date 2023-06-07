-- Inserting users
INSERT INTO users (user_id, username, password, first_name, last_name, location, hobbies, interests, img_filename, email, is_admin)
VALUES
  (1, 'user1', 'password1', 'John', 'Doe', 12345, 'Hiking, Cooking', 'Reading, Painting', 'user1.jpg', 'user1@example.com', FALSE),
  (2, 'user2', 'password2', 'Jane', 'Smith', 54321, 'Running, Swimming', 'Photography, Traveling', 'user2.jpg', 'user2@example.com', FALSE),
  (3, 'user3', 'password3', 'Mike', 'Johnson', 98765, 'Cycling, Gaming', 'Music, Movies', 'user3.jpg', 'user3@example.com', FALSE);

-- Inserting a successful match
INSERT INTO successful_matches (match_id, user_id_1, user_id_2, match_date)
VALUES
  (1, 1, 2, CURRENT_DATE);
  -- Inserting potential matches
INSERT INTO potential_matches (match_id, user_id_1, user_id_2,  timestamp)
VALUES
  (1, 1, 2, NULL),
  (2, 2, 3, NULL),
  (3, 1, 3, NULL);

-- Inserting messages
INSERT INTO messages (message_id, receiver_id, sender_id, message_text, message_date)
VALUES
  (1, 1, 2, 'Hello, would you like to grab a coffee sometime?', CURRENT_DATE),
  (2, 2, 1, 'Sure! I love coffee. How about meeting at the cafe near the park?', CURRENT_DATE),
  (3, 3, 2, 'I saw that you also enjoy swimming. Do you have any favorite swimming spots?', CURRENT_DATE),
  (4, 2, 3, 'Yes, I love swimming! Theres a great community pool in my neighborhood.', CURRENT_DATE);
