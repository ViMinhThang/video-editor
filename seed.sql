-- Insert Users
INSERT INTO users (id, name, email, password, createdAt, updatedAt) VALUES
(1, 'Alice', 'alice@example.com', 'hashed_password_1', '2025-08-04T07:00:00Z', '2025-08-04T07:00:00Z'),
(2, 'Bob', 'bob@example.com', 'hashed_password_2', '2025-08-04T07:10:00Z', '2025-08-04T07:10:00Z'),
(3, 'Charlie', 'charlie@example.com', 'hashed_password_3', '2025-08-04T07:20:00Z', '2025-08-04T07:20:00Z');

-- Insert Projects
INSERT INTO projects (id, user_id, title, description, create_at, update_at) VALUES
(1, 1, 'Alice''s First Project', 'A demo edit project by Alice.', '2025-08-04T08:00:00Z', '2025-08-04T08:30:00Z'),
(2, 2, 'Bob''s Music Edit', 'Music visualization and cut.', '2025-08-04T09:00:00Z', '2025-08-04T09:15:00Z'),
(3, 3, 'Charlie''s Podcast', 'Video podcast editing.', '2025-08-04T09:30:00Z', '2025-08-04T10:00:00Z');

-- Insert Tracks
INSERT INTO tracks (id, project_id, type, "order") VALUES
(1, 1, 'video', 0),
(2, 1, 'audio', 1),
(3, 2, 'text', 0),
(4, 3, 'video', 0),
(5, 3, 'audio', 1);
