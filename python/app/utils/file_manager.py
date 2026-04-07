import uuid
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


async def save_upload_file(file, source_format: str):
    extension = Path(file.filename).suffix.lower()

    if not extension:
        extension = f".{source_format.lower()}"

    safe_name = f"{uuid.uuid4().hex}{extension}"
    output_path = UPLOAD_DIR / safe_name

    content = await file.read()

    with open(output_path, "wb") as buffer:
        buffer.write(content)

    return {
        "original_filename": file.filename,
        "stored_filename": safe_name,
        "absolute_path": str(output_path.resolve()),
        "relative_path": f"/uploads/{safe_name}",
    }