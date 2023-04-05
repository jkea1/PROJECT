USE mblix;

CREATE TABLE weekly_movie(
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
  actors JSON NOT NULL,
  update_date VARCHAR(64) NOT NULL,
  weekly_rank SMALLINT NOT NULL
);
-- PRIMARY KEY(update_date, weekly_rank)

SELECT * FROM weekly_movie;
DROP TABLE weekly_movie;
DELETE FROM weekly_movie;
