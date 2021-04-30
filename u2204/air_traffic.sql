-- from the terminal run:
-- psql < air_traffic.sql

DROP DATABASE IF EXISTS air_traffic;

CREATE DATABASE air_traffic;

\c air_traffic

CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  country TEXT UNIQUE NOT NULL
);

CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  city TEXT UNIQUE NOT NULL,
  country_id INTEGER REFERENCES countries ON DELETE CASCADE
);

CREATE TABLE people (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT
);

CREATE TABLE airlines (
  id SERIAL PRIMARY KEY,
  airline TEXT UNIQUE NOT NULL
);

CREATE TABLE tickets
(
  id SERIAL PRIMARY KEY,
  person_id INTEGER REFERENCES people,
  seat TEXT NOT NULL,
  departure TIMESTAMP NOT NULL,
  arrival TIMESTAMP NOT NULL,
  airline_id INTEGER REFERENCES airlines,
  from_city_id INTEGER REFERENCES cities,
  to_city_id INTEGER REFERENCES cities
);


INSERT INTO countries (country)
VALUES 
('United States'),
('Japan'),
('France'),
('UAE'),
('Brazil'),
('United Kingdom'),
('Mexico'),
('Morocco'),
('China'),
('Chile');

INSERT INTO cities (city, country_id)
VALUES
('Washington DC', 1),--1
('Los Angeles', 1),--2
('Seattle', 1),--3
('New York',1),--4
('Cedar Rapids', 1),--5
('Charlotte', 1),--6
('Las Vegas', 1),--7
('Chicago', 1),--8
('New Orleans', 1),--9
('Tokyo', 2),--10
('Paris', 3),--11
('Dubai', 4),--12
('Sao Paolo', 5),--13
('London', 6),--14
('Mexico City', 7),--15
('Casablanca', 8),--16
('Beijing', 9),--17
('Santiago', 10);--18

INSERT INTO people (first_name, last_name)
VALUES
('Jennifer', 'Finch'),
('Thadeus', 'Gathercoal'),
('Sonja', 'Pauley'),
('Waneta', 'Skeleton'),
('Berkie', 'Wycliff'),
('Alvin', 'Leathes'),
('Cory', 'Squibbes');

INSERT INTO airlines (airline)
VALUES
('United'),
('British Airways'),
('Delta'),
('TUI Fly Belgium'),
('Air China'),
('American Airlines'),
('Avianca Brasil');

INSERT INTO tickets
  (person_id, seat, departure, arrival, airline_id, from_city_id, to_city_id)
VALUES
  (1, '33B', '2018-04-08 09:00:00', '2018-04-08 12:00:00', 1, 1, 3),
  (2, '8A', '2018-12-19 12:45:00', '2018-12-19 16:15:00', 2, 10, 14),
  (3, '12F', '2018-01-02 07:00:00', '2018-01-02 08:03:00', 3, 2, 7),
  (1, '20A', '2018-04-15 16:50:00', '2018-04-15 21:00:00', 3, 3, 15),
  (4, '23D', '2018-08-01 18:30:00', '2018-08-01 21:50:00', 4, 11, 16),
  (2, '18C', '2018-10-31 01:15:00', '2018-10-31 12:55:00', 5, 12, 17),
  (5, '9E', '2019-02-06 06:00:00', '2019-02-06 07:47:00', 1, 4, 6),
  (6, '1A', '2018-12-22 14:42:00', '2018-12-22 15:56:00', 6, 5, 8),
  (5, '32B', '2019-02-06 16:28:00', '2019-02-06 19:18:00', 6, 6, 9),
  (7, '10D', '2019-01-20 19:30:00', '2019-01-20 22:45:00', 7, 13, 18);


SELECT * FROM tickets;

SELECT tickets.id, first_name, last_name, seat, departure, arrival, airline,
  ci1.city AS from_city,
  co1.country AS from_country,
  ci2.city AS to_city,
  co2.country AS to_country
FROM tickets
JOIN people ON person_id = people.id
JOIN airlines ON airline_id = airlines.id
JOIN cities ci1 ON from_city_id = ci1.id
JOIN cities ci2 ON to_city_id = ci2.id
JOIN countries co1 ON ci1.country_id = co1.id
JOIN countries co2 ON ci2.country_id = co2.id;