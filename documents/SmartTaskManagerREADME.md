# Random Project: Smart Task Manager

## Overview
Smart Task Manager is a lightweight tool for organizing tasks, setting priorities, and tracking progress. It is designed for developers and teams who want a simple and fast workflow.

## Features
- Create, update, and delete tasks
- Assign tags and priority levels
- Track completion progress
- Export tasks to JSON or CSV
- REST API support

## Tech Stack
- Backend: Python Flask
- Database: SQLite
- Frontend: React
- Containerization: Docker

## Folder Structure
```
smart-task-manager/
├── backend/
│   ├── app.py
│   ├── models.py
│   └── routes/
├── frontend/
│   ├── src/
│   └── public/
├── docker-compose.yml
└── README.md
```

## API Endpoints
### POST /tasks
Create a new task.

### GET /tasks
Fetch all tasks.

### PUT /tasks/:id
Update a task.

### DELETE /tasks/:id
Delete a task.

## Installation
```
git clone https://github.com/example/smart-task-manager
cd smart-task-manager
docker compose up --build
```

## License
MIT License
