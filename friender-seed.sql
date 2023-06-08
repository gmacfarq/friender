-- Insert 10 users
INSERT INTO users (username, password, first_name, last_name, zip_code, friend_radius, hobbies, interests, img_url, email, is_admin)
VALUES
  ('user1', 'password1', 'John', 'Doe', 12345, 10, 'Hiking', 'Reading', 'https://example.com/img1.jpg', 'john@example.com', false),
  ('user2', 'password2', 'Jane', 'Smith', 54321, 15, 'Cooking', 'Gardening', 'https://example.com/img2.jpg', 'jane@example.com', false),
  ('user3', 'password3', 'Bob', 'Johnson', 67890, 20, 'Running', 'Painting', 'https://example.com/img3.jpg', 'bob@example.com', false),
  ('user4', 'password4', 'Alice', 'Williams', 98765, 25, 'Swimming', 'Photography', 'https://example.com/img4.jpg', 'alice@example.com', false),
  ('user5', 'password5', 'David', 'Brown', 54321, 10, 'Hiking', 'Gaming', 'https://example.com/img5.jpg', 'david@example.com', false),
  ('user6', 'password6', 'Sarah', 'Jones', 12345, 15, 'Cooking', 'Reading', 'https://example.com/img6.jpg', 'sarah@example.com', false),
  ('user7', 'password7', 'Michael', 'Davis', 67890, 20, 'Running', 'Gardening', 'https://example.com/img7.jpg', 'michael@example.com', false),
  ('user8', 'password8', 'Emily', 'Miller', 98765, 25, 'Swimming', 'Painting', 'https://example.com/img8.jpg', 'emily@example.com', false),
  ('user9', 'password9', 'James', 'Wilson', 12345, 10, 'Hiking', 'Photography', 'https://example.com/img9.jpg', 'james@example.com', false),
  ('user10', 'password10', 'Olivia', 'Taylor', 54321, 15, 'Cooking', 'Gaming', 'https://example.com/img10.jpg', 'olivia@example.com', false);

-- Insert potential matches between users
INSERT INTO potential_matches (user_username_1, user_username_2, match_date)
VALUES
  ('user1', 'user2', CURRENT_DATE),
  ('user1', 'user3', CURRENT_DATE),
  ('user1', 'user4', CURRENT_DATE),
  ('user2', 'user3', CURRENT_DATE),
  ('user2', 'user4', CURRENT_DATE),
  ('user3', 'user4', CURRENT_DATE),
  ('user5', 'user6', CURRENT_DATE),
  ('user5', 'user7', CURRENT_DATE),
  ('user5', 'user8', CURRENT_DATE),
  ('user6', 'user7', CURRENT_DATE);
