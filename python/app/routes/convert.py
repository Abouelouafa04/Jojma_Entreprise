from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from app.utils.file_manager import save_upload_file
from app.services.converter import convert_file

router = APIRouter()

SUPPORTED_FORMATS = {"stl", "obj", "fbx", "ply", "glb", "dae", "abc", "usdz"}


@router.post("/convert")
async def convert_3d_file(
    file: UploadFile = File(...),
    source_format: str = Form(...),
    target_format: str = Form(...)
):
    source_format = source_format.lower().strip()
    target_format = target_format.lower().strip()

    print("=== REQUEST RECEIVED ===")
    print("filename:", file.filename)
    print("source_format:", source_format)
    print("target_format:", target_format)

    if source_format not in SUPPORTED_FORMATS:
        raise HTTPException(status_code=400, detail=f"Format source non supporté : {source_format}")

    if target_format not in SUPPORTED_FORMATS:
        raise HTTPException(status_code=400, detail=f"Format cible non supporté : {target_format}")

    try:
        saved_input = await save_upload_file(file, source_format)

        print("=== FILE SAVED ===")
        print(saved_input)

        result = convert_file(
            input_path=saved_input["absolute_path"],
            original_filename=saved_input["original_filename"],
            source_format=source_format,
            target_format=target_format,
        )

        print("=== REQUEST SUCCESS ===")
        return result

    except Exception as exc:
        print("=== REQUEST ERROR ===")
        print(str(exc))
        raise HTTPException(status_code=500, detail=str(exc))