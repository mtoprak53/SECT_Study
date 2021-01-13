DROP DATABASE IF EXISTS soccer;

CREATE DATABASE soccer;

\c soccer

CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE refrees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(15) NOT NULL,
  last_name VARCHAR(20)
);

CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  team1 VARCHAR(20) NOT NULL,
  score1 INTEGER NOT NULL CHECK (score1 >= 0) DEFAULT 0,
  team2 VARCHAR(20) NOT NULL,
  score2 INTEGER NOT NULL CHECK (score2 >= 0) DEFAULT 0,
  refree_id INTEGER REFERENCES refrees ON DELETE SET NULL
);

CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams ON DELETE CASCADE,
  player VARCHAR(30) NOT NULL
);

CREATE TABLE seasons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL,
  start DATE NOT NULL,
  ending DATE NOT NULL
);

-- ???
-- The standings/rankings of each team in the league (This doesn’t have to be its own table if the data can be captured somehow).