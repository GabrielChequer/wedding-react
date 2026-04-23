# Wedding Site

## Running locally

You need three terminals:

```bash

# Express middleware
cd server && npm install && npm run dev

# React frontend
cd wedding-site && npm install && npm run dev
```

http://localhost:6767

## Environment variables

`server/.env`:

```
PORT=3001
GO_SERVER_URL=http://localhost:8080
ALLOWED_ORIGINS=http://localhost:6767
```
