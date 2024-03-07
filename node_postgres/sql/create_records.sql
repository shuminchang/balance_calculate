CREATE TABLE records (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  contributors JSONB NOT NULL,
  money_each INTEGER NOT NULL
);

