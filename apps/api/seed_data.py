import uuid
from datetime import datetime, timedelta
from sqlmodel import Session, select
from core.database import engine
from models.tables import Project

def seed_projects():
    """Seed the database with sample projects"""
    with Session(engine) as session:
        # Check if projects already exist
        existing_projects = session.exec(select(Project)).all()
        if existing_projects:
            print("Projects already exist, skipping seed data")
            return

        # Create sample projects
        sample_projects = [
            {
                "id": str(uuid.uuid4()),
                "name": "E-commerce Platform",
                "description": "A modern e-commerce platform with React and Node.js",
                "status": "active",
                "start_date": datetime.now() - timedelta(days=30),
                "end_date": datetime.now() + timedelta(days=60),
                "team_id": str(uuid.uuid4()),
                "created_by_id": str(uuid.uuid4()),
                "created_at": datetime.now() - timedelta(days=30),
                "updated_at": datetime.now(),
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Mobile App Development",
                "description": "Cross-platform mobile app using React Native",
                "status": "active",
                "start_date": datetime.now() - timedelta(days=15),
                "end_date": datetime.now() + timedelta(days=45),
                "team_id": str(uuid.uuid4()),
                "created_by_id": str(uuid.uuid4()),
                "created_at": datetime.now() - timedelta(days=15),
                "updated_at": datetime.now(),
            },
            {
                "id": str(uuid.uuid4()),
                "name": "AI Chatbot",
                "description": "Intelligent chatbot using machine learning",
                "status": "planning",
                "start_date": datetime.now() + timedelta(days=7),
                "end_date": datetime.now() + timedelta(days=90),
                "team_id": str(uuid.uuid4()),
                "created_by_id": str(uuid.uuid4()),
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Dashboard Analytics",
                "description": "Real-time analytics dashboard with charts and graphs",
                "status": "completed",
                "start_date": datetime.now() - timedelta(days=90),
                "end_date": datetime.now() - timedelta(days=10),
                "team_id": str(uuid.uuid4()),
                "created_by_id": str(uuid.uuid4()),
                "created_at": datetime.now() - timedelta(days=90),
                "updated_at": datetime.now() - timedelta(days=10),
            },
            {
                "id": str(uuid.uuid4()),
                "name": "API Gateway",
                "description": "Microservices API gateway with authentication",
                "status": "active",
                "start_date": datetime.now() - timedelta(days=7),
                "end_date": datetime.now() + timedelta(days=30),
                "team_id": str(uuid.uuid4()),
                "created_by_id": str(uuid.uuid4()),
                "created_at": datetime.now() - timedelta(days=7),
                "updated_at": datetime.now(),
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Database Migration",
                "description": "Legacy system migration to modern database",
                "status": "planning",
                "start_date": datetime.now() + timedelta(days=14),
                "end_date": datetime.now() + timedelta(days=120),
                "team_id": str(uuid.uuid4()),
                "created_by_id": str(uuid.uuid4()),
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Security Audit",
                "description": "Comprehensive security audit and penetration testing",
                "status": "active",
                "start_date": datetime.now() - timedelta(days=3),
                "end_date": datetime.now() + timedelta(days=21),
                "team_id": str(uuid.uuid4()),
                "created_by_id": str(uuid.uuid4()),
                "created_at": datetime.now() - timedelta(days=3),
                "updated_at": datetime.now(),
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Performance Optimization",
                "description": "Application performance optimization and caching",
                "status": "completed",
                "start_date": datetime.now() - timedelta(days=45),
                "end_date": datetime.now() - timedelta(days=5),
                "team_id": str(uuid.uuid4()),
                "created_by_id": str(uuid.uuid4()),
                "created_at": datetime.now() - timedelta(days=45),
                "updated_at": datetime.now() - timedelta(days=5),
            },
        ]

        for project_data in sample_projects:
            project = Project(**project_data)
            session.add(project)

        session.commit()
        print(f"Successfully seeded {len(sample_projects)} projects")

if __name__ == "__main__":
    seed_projects() 