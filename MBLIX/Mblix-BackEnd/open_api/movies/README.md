# Mblix-BackEnd 영화 데이터 설명 

## 필요한 JS concept
- [node-fetch](https://www.npmjs.com/package/node-fetch#common-usage)
- [async-await](https://ko.javascript.info/async-await)
- [Mozila - fetch API](https://developer.mozilla.org/ko/docs/Web/API/Fetch_API/Using_Fetch)
- [npm-fs](https://www.npmjs.com/package/fs)
- [nodejs fs writeFileSync options](https://nodejs.org/api/fs.html#fswritefilesyncfile-data-options)


## [KOBIS](https://www.kobis.or.kr/kobisopenapi/homepg/main/main.do)
- [searchMovieList](https://www.kobis.or.kr/kobisopenapi/homepg/apiservice/searchServiceInfo.do?serviceId=searchMovieInfo)
- [searchMovieInfo](https://www.kobis.or.kr/kobisopenapi/homepg/apiservice/searchServiceInfo.do)

```JS
// the result of request movie
[
  {
    movieCd: '20225115',
    movieNm: '보일링 포인트',
    movieNmEn: 'Boiling Point',
    prdtYear: '2021',
    openDt: '20220804',
    typeNm: '장편',
    prdtStatNm: '개봉예정',
    nationAlt: '영국',
    genreAlt: '스릴러,드라마',
    repNationNm: '영국',
    repGenreNm: '스릴러',
    directors: [ [Object] ],
    companys: []
  }
]

// change movieInfo custom object
{
  name: '보일링 포인트',
  englishName: 'Boiling Point',
  productionYear: '2021',
  showTime: '94',
  genre: [ { genreNm: '스릴러' }, { genreNm: '드라마' } ],
  nationNm: [ { nationNm: '영국' } ],
  watchGrade: [ { auditNo: '2022-MF01121', watchGradeNm: '15세이상관람가' } ],
  directorName: [ { peopleNm: '필립 바랜티니', peopleNmEn: 'Philip Barantini' } ],
  actorName: [
    {
      peopleNm: '스티븐 그레이엄',
      peopleNmEn: 'Stephen Graham',
      cast: '',
      castEn: ''
    },
    {
      peopleNm: '제이슨 플레밍',
      peopleNmEn: 'Jason Flemyng',
      cast: '',
      castEn: ''
    }
  ]
}
```

## Naver Movie API
- [Naver movie API](https://developers.naver.com/docs/serviceapi/search/movie/movie.md)
- [Naver developer app list](https://developers.naver.com/apps/#/list)
- [Naver developer API notification - limitation of Open API](https://developers.naver.com/notice/article/10000000000030659365)

## [KMDB](https://www.kmdb.or.kr/info/api/apiDetail/6)

```JS
// result of searching "극한직업"
{
  DOCID: 'K18606',
  movieId: 'K',
  movieSeq: '18606',
  title: '  !HS 극한직업 !HE ',
  titleEng: 'Extreme Job (Geuk-han-jik-eop)',
  titleOrg: '',
  titleEtc: '극한직업^극한 직업^Extreme Job (Geuk-han-jik-eop)',
  prodYear: '2018',
  directors: { director: [Array] },
  actors: { actor: [Array] },
  nation: '대한민국',
  company: '(주)어바웃필름',
  plots: { plot: [Array] },
  runtime: '111',
  rating: '15세관람가',
  genre: '코메디',
  kmdbUrl: 'https://www.kmdb.or.kr/db/kor/detail/movie/K/18606'
},
```

```JS
// CUSTOM

/**
 * the movie properties should be extracted
 * actors.actor: Array
 *  - actorNm: String
 *  - actorEnNm: String
 * directors.director: Array
 *  - directorNm: String
 *  - directorEnNm: String
 * genre: String
 * kmdbUrl: String
 * nation: String
 * plots.plot: Array
 *  - plotLang: String
 *  - plotText: String
 * posters: String
 * prodYear: String
 * rating: String
 * runtime: String
 * title: String
 * titleEng: String
 */
```

## 결론
여러 Open API를 사용하여 데이터를 가져온 뒤 서비스에 사용될 수 있는 특정 컬럼을 새로 생성하여 데이터를 저장했습니다. 