-- SQL JOINS EXERCISE --
-- ---------------------

-- I-1
SELECT * FROM owners o
LEFT JOIN vehicles v
ON o.id = v.owner_id;

-- --------------------------------------

-- I-2
SELECT o.first_name, o.last_name, COUNT(*) FROM owners o
JOIN vehicles v ON o.id = v.owner_id
GROUP BY o.id
ORDER BY o.first_name;

-- --------------------------------------

-- I-3
SELECT o.first_name, o.last_name, ROUND(AVG(price)) AS avg_price, COUNT(*)
FROM owners o
JOIN vehicles v ON o.id = v.owner_id
GROUP BY o.id
HAVING COUNT(*) > 1 AND AVG(price) > 10000
ORDER BY o.first_name DESC;

-- --------------------------------------

-- SQL Zoo - 6
-- --------------------------------------

--1
SELECT matchid, player FROM goal
WHERE teamid = 'GER';

-- --------------------------------------

--2
SELECT id, stadium, team1, team2 FROM game
WHERE id = 1012;

-- --------------------------------------

--3
SELECT player, teamid, stadium, mdate
FROM game JOIN goal ON (id=matchid)
WHERE teamid = 'GER'

-- --------------------------------------

--4
SELECT team1, team2, player
FROM game JOIN goal ON (id=matchid)*
WHERE player LIKE 'Mario%'

-- --------------------------------------

--5
SELECT player, teamid, coach, gtime FROM goal
JOIN eteam ON (teamid=id)
WHERE gtime <= 10;

-- --------------------------------------

--6
SELECT mdate, teamname FROM game
JOIN eteam ON (team1=eteam.id)
WHERE coach = 'Fernando Santos';

-- --------------------------------------

--7
SELECT player FROM goal
JOIN game ON (matchid=id)
WHERE stadium = 'National Stadium, Warsaw';

-- --------------------------------------

--8
-- CORRECT SOLUTION BUT NOT ACCEPTED BY THE SITE
SELECT player FROM goal
JOIN game ON (matchid=id)
WHERE team1 = 'GER' OR team2 = 'GER'
  AND NOT teamid = 'GER'
GROUP BY player

-- --------------------------------------

--9
SELECT teamname, COUNT(*) FROM eteam
JOIN goal ON id=teamid
GROUP BY teamname
ORDER BY teamname

-- --------------------------------------

--10
SELECT stadium, COUNT(*) FROM game
JOIN goal ON id = matchid
GROUP BY stadium

-- --------------------------------------

--11
SELECT id, mdate, COUNT(*) FROM game
JOIN goal ON id = matchid
WHERE (team1 = 'POL' OR team2 = 'POL')
GROUP BY matchid

-- --------------------------------------

-- 12
SELECT id, mdate, COUNT(*) FROM game
JOIN goal ON id=matchid
WHERE teamid = 'GER'
GROUP BY id, matchid, mdate  --??

-- --------------------------------------

-- SQL Zoo - 7
-- --------------------------------------

--1
SELECT id, title
 FROM movie
 WHERE yr=1962

-- --------------------------------------

--2
SELECT yr FROM movie
WHERE title = 'Citizen Kane'

-- --------------------------------------
--3
SELECT id, title, yr FROM movie
WHERE title LIKE '%Star Trek%'
ORDER BY yr

-- --------------------------------------

--4
SELECT id FROM actor
WHERE name = 'Glenn Close'

-- --------------------------------------

--5
SELECT id FROM movie
WHERE title = 'Casablanca'

-- --------------------------------------

--6
SELECT name FROM actor
JOIN casting ON id=actorid
WHERE movieid = 11768

-- --------------------------------------

--7
SELECT name FROM actor a
JOIN casting c ON a.id = actorid
JOIN movie m ON m.id = movieid
WHERE title = 'Alien'

-- --------------------------------------

--8
SELECT title FROM movie m
JOIN casting c ON m.id = movieid
JOIN actor a ON a.id = actorid
WHERE name = 'Harrison Ford'

-- --------------------------------------

--9
SELECT title FROM movie m
JOIN casting c ON m.id = movieid
JOIN actor a ON a.id = actorid
WHERE name = 'Harrison Ford' AND NOT ord = 1

-- --------------------------------------

--10
SELECT title, name FROM movie m
JOIN casting c ON m.id = movieid
JOIN actor a ON a.id = actorid
WHERE yr = 1962 AND ord = 1

-- --------------------------------------

--11
SELECT yr, COUNT(title) FROM movie m
JOIN casting  c ON m.id=movieid
JOIN actor a ON actorid=a.id
WHERE name='Rock Hudson'
GROUP BY yr
HAVING COUNT(title) > 2

-- --------------------------------------

--12
SELECT title, name FROM movie m
JOIN casting c ON (m.id = movieid AND ord=1)
JOIN actor a ON a.id = actorid
WHERE m.id IN (
  SELECT movieid FROM casting
  WHERE actorid IN (
    SELECT id FROM actor
    WHERE name='Julie Andrews'
  )
)

-- --------------------------------------

--13
SELECT name FROM actor
JOIN casting ON id=actorid AND ord=1
GROUP BY name
HAVING COUNT(name) >= 15

-- --------------------------------------

--14
SELECT title, COUNT(actorid) FROM casting
JOIN movie ON id=movieid AND yr=1978
GROUP BY title
ORDER BY COUNT(actorid) DESC, title

-- --------------------------------------

--15
SELECT name FROM actor
JOIN casting ON actor.id=actorid
WHERE movieid IN (
  SELECT movie.id FROM movie
  JOIN casting ON movie.id=movieid
  JOIN actor ON actorid=actor.id
  WHERE name = 'Art Garfunkel'
)
AND NOT name = 'Art Garfunkel'
GROUP BY name

-- --------------------------------------
