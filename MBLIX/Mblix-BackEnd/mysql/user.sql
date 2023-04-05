-- Admin(DB) user set
show tables;
show databases;

use mysql;
show tables;

create user 'redwood'@'localhost' identified by '1234';
grant all privileges on Mblix.* to 'redwood'@'localhost';
drop user 'redwood'@'localhost';

-- User data

USE mblix;

CREATE TABLE user(
  id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
  nickname VARCHAR(256) NOT NULL,
  mail VARCHAR(256),
  auth_type VARCHAR(8) NOT NULL,
  profile_id VARCHAR(512) NOT NULL,
  mbti VARCHAR(8) NOT NULL,
  liked_movie_list JSON NOT NULL
);

SELECT * FROM user;
DROP TABLE user;
DELETE FROM user where id<5;

INSERT INTO user(mail, auth_type, profile_id, mbti, liked_movie_list) VALUES("a@mail.com", "kakao", "1", "ISTP", "[]");
INSERT INTO user(nickname, mail, auth_type, profile_id, mbti, liked_movie_list) VALUES("조병민", "chrisredwood123@gmail.com", "kakao", "0", "ENFJ", "[0,1,2]");

UPDATE user SET liked_movie_list = JSON_ARRAY(0,1,2,3,4) WHERE id=5;
SELECT * FROM user;