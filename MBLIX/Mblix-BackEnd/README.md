# Mblix-BackEnd
Mblix-BackEnd 백엔드 개발 사항에 대한 정리

## Get movie data & Save as a file
[movies/README.md](https://github.com/Mblix-GOF/Mblix-BackEnd/tree/main/movies/README.md) 파일을 참고하십시오.

## Save to MySQL Database
MySQL을 로컬에 설치하고 데이터를 저장하고 계정을 만들어 접근하기 위해 아래 과정을 순서대로 진행합니다.

### Install MySQL
[Download MySQL Link](https://dev.mysql.com/downloads/mysql/)

### Add movie / actor tables
mysql 폴더에 있는 SQL 파일들을 참고하여 각 테이블을 생성하십시오. 백엔드에서 활용하기 위해서는 각 유저에 맞는 MySQL 설정을 참고하십시오.

### Normalize and Save to DB
데이터를 가공하고 나서 MySQL DB에 넣기 위해 data_normalize 폴더로 이동 후 다음 명령을 수행합니다.
```
cd data_normalize
node save_mysql.js
node update_data.js
```

## REST API Specification
프론트엔드에서 REST API로 사용하기 위한 API 명세서를 정의합니다. 

### Auth

소셜 로그인

로그아웃

프로필 상세 정보


### Movie

영화 리스트 조회

영화 이름 검색

영화 배우 이름 검색


### MBTI

영화 관련 MBTI 저장

영화 별 MBTI들의 선호도 저장