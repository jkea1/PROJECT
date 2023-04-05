CREATE TABLE movie(
  id INTEGER NOT NULL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  english_name VARCHAR(128),
  prod_year VARCHAR(16),
  show_time VARCHAR(8),
  watch_grade VARCHAR(16),
  genre VARCHAR(32),
  nation VARCHAR(32),
  director VARCHAR(64),
  naver_movie_url VARCHAR(256) NOT NULL,
  poster_url VARCHAR(256) NOT NULL,
  actors JSON NOT NULL
);

SELECT * FROM movie;
DROP TABLE movie;
DELETE TABLE movie;
SELECT * FROM movie where actors LIKE "%이병헌%";

SELECT DISTINCT *
FROM movie, JSON_TABLE(actors, "$[*]" COLUMNS(actor_name INT PATH '$')) as actor_list 
where actors LIKE "%이병헌%";

SELECT DISTINCT *
FROM movie
where actors LIKE "%이병헌%";

SELECT *
FROM movie
WHERE id = 1;

SELECT DISTINCT id, name, poster_url FROM movie, (SELECT movie_id, ENFJ FROM Movie_MBTI ORDER BY ENFJ DESC LIMIT 10) as movies WHERE id = movies.movie_id;
SELECT * FROM Movie_MBTI WHERE movie_id = 1;


