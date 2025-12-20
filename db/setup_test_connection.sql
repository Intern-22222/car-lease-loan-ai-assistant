-- Create test table
CREATE TABLE test_connection (
  id SERIAL PRIMARY KEY,
  message TEXT
);

-- Insert sample data
INSERT INTO test_connection (message)
VALUES ('Hello World');

-- Test query
SELECT * FROM test_connection;
