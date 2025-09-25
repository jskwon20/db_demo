# FastAPI 게시판 애플리케이션

이 프로젝트는 FastAPI, Docker, MySQL을 사용하여 구현한 간단한 게시판 애플리케이션입니다.

## 프로젝트 구조

```
.
├── app
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
│   ├── static
│   │   ├── css
│   │   │   └── main.css
│   │   ├── images
│   │   └── js
│   │       └── main.js
│   └── templates
│       └── index.html
└── docker-compose.yml
```

## 시작하기

### 사전 요구 사항

- Docker
- Docker Compose

### 설치 및 실행

1.  프로젝트를 클론합니다.

    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```

2.  Docker Compose를 사용하여 애플리케이션을 빌드하고 실행합니다.

    ```bash
    docker-compose up -d --build
    ```

3.  웹 브라우저에서 `http://localhost:8000`으로 접속합니다.

## API 엔드포인트

- `GET /`: 메인 페이지를 렌더링합니다.
- `GET /posts/`: 모든 게시글을 조회합니다.
- `POST /posts/`: 새로운 게시글을 작성합니다.
