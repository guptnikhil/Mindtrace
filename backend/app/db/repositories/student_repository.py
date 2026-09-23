from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, OperationalError
from app.models.student import Student

class StudentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, student_id: str) -> Optional[Student]:
        return self.db.query(Student).filter(Student.id == student_id).first()

    def get_by_identifier(self, student_identifier: str) -> Optional[Student]:
        return self.db.query(Student).filter(Student.student_identifier == student_identifier).first()

    def list_all(self, skip: int = 0, limit: int = 100) -> List[Student]:
        return self.db.query(Student).offset(skip).limit(limit).all()

    def create(self, student_identifier: str, name: str, branch: Optional[str] = None, year: Optional[int] = None) -> Student:
        student = Student(
            student_identifier=student_identifier,
            name=name,
            branch=branch or "Computer Science & Engineering",
            year=year or 3
        )
        self.db.add(student)
        self.db.commit()
        self.db.refresh(student)
        return student

    def update(self, student: Student, update_data: dict) -> Student:
        for field, value in update_data.items():
            if value is not None and hasattr(student, field):
                setattr(student, field, value)
        self.db.commit()
        self.db.refresh(student)
        return student

    def delete(self, student_id: str) -> bool:
        student = self.get_by_id(student_id)
        if student:
            self.db.delete(student)
            self.db.commit()
            return True
        return False
