import os
import subprocess
import uuid
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
OUTPUT_DIR = BASE_DIR / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

BLENDER_EXECUTABLE = os.getenv("BLENDER_PATH", r"C:\Program Files\Blender Foundation\Blender 5.1\blender.exe")
BLENDER_SCRIPT = str((BASE_DIR / "scripts" / "blender_convert.py").resolve())

print("BASE_DIR        :", BASE_DIR)
print("OUTPUT_DIR      :", OUTPUT_DIR)
print("Blender trouvé  :", os.path.exists(BLENDER_EXECUTABLE))
print("Script trouvé   :", os.path.exists(BLENDER_SCRIPT))
print("Chemin script   :", BLENDER_SCRIPT)

SUPPORTED_SOURCE_FORMATS = {"stl", "obj", "fbx", "ply", "glb", "dae", "abc", "usdz"}
SUPPORTED_TARGET_FORMATS = {"stl", "obj", "fbx", "ply", "glb", "dae", "usdz", "abc"}


def convert_file(input_path: str, original_filename: str, source_format: str, target_format: str):
    source_format = source_format.lower().strip()
    target_format = target_format.lower().strip()

    if source_format not in SUPPORTED_SOURCE_FORMATS:
        raise Exception(f"Format source non supporté : {source_format}")

    if target_format not in SUPPORTED_TARGET_FORMATS:
        raise Exception(f"Format cible non supporté : {target_format}")

    if not os.path.exists(BLENDER_EXECUTABLE):
        raise Exception(f"Blender introuvable : {BLENDER_EXECUTABLE}")

    if not os.path.exists(BLENDER_SCRIPT):
        raise Exception(f"Script Blender introuvable : {BLENDER_SCRIPT}")

    if not os.path.exists(input_path):
        raise Exception(f"Fichier source introuvable : {input_path}")

    output_filename = f"{uuid.uuid4().hex}.{target_format}"
    output_path = OUTPUT_DIR / output_filename

    command = [
        BLENDER_EXECUTABLE,
        "--background",
        "--python",
        BLENDER_SCRIPT,
        "--",
        input_path,
        str(output_path.resolve()),
        source_format,
        target_format,
    ]

    print("=== COMMAND ===")
    print(command)

    try:
        process = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=False,
            timeout=120
        )
    except subprocess.TimeoutExpired:
        raise Exception("Blender a dépassé le délai autorisé pendant la conversion.")

    print("=== BLENDER STDOUT ===")
    print(process.stdout)
    print("=== BLENDER STDERR ===")
    print(process.stderr)
    print("=== BLENDER RETURN CODE ===")
    print(process.returncode)

    if process.returncode != 0:
        raise Exception(
            "Blender conversion failed.\n"
            f"STDOUT:\n{process.stdout}\n\n"
            f"STDERR:\n{process.stderr}"
        )

    if not output_path.exists():
        raise Exception(
            "Le fichier converti n'a pas été généré.\n"
            f"STDOUT:\n{process.stdout}\n\n"
            f"STDERR:\n{process.stderr}"
        )

    return {
        "success": True,
        "filename": output_filename,
        "original_filename": original_filename,
        "output_url": f"/outputs/{output_filename}",
        "source_format": source_format.upper(),
        "target_format": target_format.upper(),
    }