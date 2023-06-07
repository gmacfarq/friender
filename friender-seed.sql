-- Insert users
INSERT INTO users (username, password, first_name, last_name, location, hobbies, interests, img_filename, email, is_admin)
VALUES
  ('user1', 'password1', 'John', 'Doe', 1, 'Hiking, Cooking', 'Photography', 'user1.jpg', 'john.doe@example.com', FALSE),
  ('user2', 'password2', 'Jane', 'Smith', 2, 'Reading, Painting', 'Music', 'user2.jpg', 'jane.smith@example.com', FALSE),
  ('user3', 'password3', 'Michael', 'Johnson', 3, 'Sports, Traveling', 'Gardening', 'user3.jpg', 'michael.johnson@example.com', FALSE);

-- Insert matches
INSERT INTO matches (liker_username, liked_username, is_successful_match, timestamp)
VALUES
  ('user1', 'user2', TRUE, CURRENT_DATE),
  ('user2', 'user3', FALSE, CURRENT_DATE);

-- Insert messages
INSERT INTO messages (match_id, sender_username, message_text, timestamp)
VALUES
  -- Messages for successful match (match_id: 1)
  (1, 'user1', 'Hi Jane! How are you?', CURRENT_DATE),
  (1, 'user2', 'Hey John! I am doing great, thanks!', CURRENT_DATE + INTERVAL '1 hour'),
  (1, 'user1', 'Thats good to hear! Are you up for hiking this weekend?', CURRENT_DATE + INTERVAL '2 hours'),
  (1, 'user2', 'Absolutely! Hiking sounds fun. Lets do it!', CURRENT_DATE + INTERVAL '2 hours 30 minutes'),

  -- Messages for unsuccessful match (match_id: 2)
  (2, 'user2', 'Hi Michael! Hows your day going?', CURRENT_DATE),
  (2, 'user3', 'Hey Jane! Its been a busy day, but Im doing well.', CURRENT_DATE + INTERVAL '1 hour');

