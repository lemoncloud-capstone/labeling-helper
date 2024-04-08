# Server

서버 설정과 관련된 정보 정리

주의! Private 정보는 안올리도록

## EC2 Instance

| spec   | desc  |
|-        |-     |
| class   | Amazon Linux(x86) 64bit |
| type    | t2.large |
| IP      | 3.39.51.135 |
| 접속계정  | `Jack`에게 요청하기 |


접속방법: `$ ssh ec2-user@3.39.51.135`

- AccessKey: `AKIARHYTUBQ5OR7MSKBW`
아래의 명령 실행으로 성공가능해야함

```sh
$ aws s3 ls s3://lemonade-sandbox/
    PRE a1000-jpeg/
```

### 상세 서버 설정 정보

