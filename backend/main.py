from fastapi import FastAPI, HTTPException, status
from db import init_db, get_connection
from pydantic import BaseModel, Field
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    due_date: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[str] = None

class Task(TaskBase):
    id: int
    completed: bool = False

app = FastAPI(
    title="TaskFlow API",
    description="API for managing tasks.",
    version="1.0.0",
)

init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

def fetch_task_or_404(task_id: int, conn: sqlite3.Connection) -> sqlite3.Row:
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, description, completed, due_date FROM tasks WHERE id = ?", (task_id,))
    task_row = cursor.fetchone()
    if task_row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task with id {task_id} not found")
    return task_row

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, title, description, completed, due_date FROM tasks ORDER BY id")
            tasks = cursor.fetchall()
            return [Task.model_validate(dict(row)) for row in tasks]
    except sqlite3.Error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error occurred")

@app.post("/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskBase):
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO tasks (title, description, completed, due_date) VALUES (?, ?, ?, ?)",
                (task.title, task.description, False, task.due_date),
            )
            conn.commit()
            new_task_id = cursor.lastrowid
            return Task(
                id=new_task_id,
                title=task.title,
                description=task.description,
                completed=False,
                due_date=task.due_date
            )
    except sqlite3.Error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error occurred")

@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: int):
    try:
        with get_connection() as conn:
            task_row = fetch_task_or_404(task_id, conn)
            return Task.model_validate(dict(task_row))
    except sqlite3.Error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error occurred")

@app.patch("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task_update: TaskUpdate):
    update_data = task_update.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided for update")

    set_clauses = [f"{key} = ?" for key in update_data]
    values = [int(value) if isinstance(value, bool) else value for value in update_data.values()]
    values.append(task_id)
    sql = f"UPDATE tasks SET {', '.join(set_clauses)} WHERE id = ?"

    try:
        with get_connection() as conn:
            fetch_task_or_404(task_id, conn)
            cursor = conn.cursor()
            cursor.execute(sql, values)
            conn.commit()
            updated_task_row = fetch_task_or_404(task_id, conn)
            return Task.model_validate(dict(updated_task_row))
    except sqlite3.Error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error occurred")

@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int):
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
            conn.commit()
            if cursor.rowcount == 0:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Task with id {task_id} not found")
    except sqlite3.Error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error occurred")
