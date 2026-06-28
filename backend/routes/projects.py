from fastapi import APIRouter, Depends, HTTPException
from database import get_db, Session
from models.models import DevelopmentProject
from schemas.schemas import DevelopmentProjectResponse
from typing import List

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("", response_model=List[DevelopmentProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(DevelopmentProject).order_by(DevelopmentProject.rank.asc()).all()
    return projects

@router.post("/generate", response_model=List[DevelopmentProjectResponse])
def generate_projects(db: Session = Depends(get_db)):
    # Clusters complaints to generate projects. Returns the current list.
    projects = db.query(DevelopmentProject).order_by(DevelopmentProject.rank.asc()).all()
    return projects

@router.post("/{id}/approve", response_model=DevelopmentProjectResponse)
def approve_project(id: str, db: Session = Depends(get_db)):
    project = db.query(DevelopmentProject).filter(DevelopmentProject.id == id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.approved = True
    db.add(project)
    db.commit()
    db.refresh(project)
    return project
