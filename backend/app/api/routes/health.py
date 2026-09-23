from fastapi import APIRouter

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    """Health check endpoint required by system specs."""
    return {"status": "ok"}
