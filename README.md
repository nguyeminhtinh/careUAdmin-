휴넷 합격마법사
========================

#### 공통 모듈
   
```
/common
```

#### 관리자페이지

```
/admin
```

#### 프론트엔드

```
/site
```


>서비스 공통적으로 사용하는 모듈 개발이 완료될 때까지는 한 저장소에서 버전 관리를 하는 것이 효율적입니다.
>따라서 아래의 파일들을 /admin, /site 폴터 아래에 적용하거나,
>공통 모듈 개발 후에 저장소를 분리할 것입니다.

# 삭제 금지 파일 목록 # 
* .gitignore
* Dockerfile-development
* Dockerfile-local
* Dockerfile-production
* Dockerfile-staging
* bitbucket-pipelines.yml