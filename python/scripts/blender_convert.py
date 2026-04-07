import bpy
import sys
import os


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

    for mesh in list(bpy.data.meshes):
        bpy.data.meshes.remove(mesh, do_unlink=True)

    for material in list(bpy.data.materials):
        if material.users == 0:
            bpy.data.materials.remove(material, do_unlink=True)

    for image in list(bpy.data.images):
        if image.users == 0:
            bpy.data.images.remove(image, do_unlink=True)


def import_file(input_path, source_format):
    source_format = source_format.lower()

    if source_format == "stl":
        bpy.ops.wm.stl_import(filepath=input_path)
    elif source_format == "obj":
        bpy.ops.wm.obj_import(filepath=input_path)
    elif source_format == "fbx":
        bpy.ops.import_scene.fbx(filepath=input_path)
    elif source_format == "ply":
        bpy.ops.import_mesh.ply(filepath=input_path)
    elif source_format == "glb":
        bpy.ops.import_scene.gltf(filepath=input_path)
    elif source_format == "dae":
        bpy.ops.wm.collada_import(filepath=input_path)
    elif source_format == "abc":
        bpy.ops.wm.alembic_import(filepath=input_path)
    elif source_format == "usdz":
        bpy.ops.wm.usd_import(filepath=input_path)
    else:
        raise Exception(f"Format source non supporté : {source_format}")


def export_file(output_path, target_format):
    target_format = target_format.lower()

    if target_format == "stl":
        bpy.ops.wm.stl_export(filepath=output_path)
    elif target_format == "obj":
        bpy.ops.wm.obj_export(filepath=output_path)
    elif target_format == "fbx":
        bpy.ops.export_scene.fbx(filepath=output_path)
    elif target_format == "ply":
        bpy.ops.export_mesh.ply(filepath=output_path)
    elif target_format == "glb":
        bpy.ops.export_scene.gltf(
            filepath=output_path,
            export_format='GLB',
            export_apply=True
        )
    elif target_format == "dae":
        bpy.ops.wm.collada_export(filepath=output_path)
    elif target_format == "usdz":
        bpy.ops.wm.usd_export(filepath=output_path)
    elif target_format == "abc":
        bpy.ops.wm.alembic_export(filepath=output_path)
    else:
        raise Exception(f"Format cible non supporté : {target_format}")


def validate_output(output_path):
    if not os.path.exists(output_path):
        raise Exception(f"Le fichier de sortie n'existe pas : {output_path}")

    if os.path.getsize(output_path) == 0:
        raise Exception(f"Le fichier généré est vide : {output_path}")


def main():
    argv = sys.argv

    if "--" not in argv:
        raise Exception("Arguments Blender manquants.")

    args = argv[argv.index("--") + 1:]

    if len(args) < 4:
        raise Exception("Usage: input_path output_path source_format target_format")

    input_path = args[0]
    output_path = args[1]
    source_format = args[2]
    target_format = args[3]

    print("=== START BLENDER CONVERSION ===")
    print(f"INPUT: {input_path}")
    print(f"OUTPUT: {output_path}")
    print(f"SOURCE FORMAT: {source_format}")
    print(f"TARGET FORMAT: {target_format}")

    if not os.path.exists(input_path):
        raise Exception(f"Fichier source introuvable : {input_path}")

    output_dir = os.path.dirname(output_path)
    os.makedirs(output_dir, exist_ok=True)

    clear_scene()
    import_file(input_path, source_format)

    imported_objects = [
        obj for obj in bpy.context.scene.objects
        if obj.type in {"MESH", "CURVE", "SURFACE", "META", "FONT"}
    ]

    if len(imported_objects) == 0:
        raise Exception("Aucun objet exploitable n'a été importé dans Blender.")

    bpy.ops.object.select_all(action='DESELECT')
    for obj in imported_objects:
        obj.select_set(True)

    bpy.context.view_layer.objects.active = imported_objects[0]

    export_file(output_path, target_format)
    validate_output(output_path)

    print(f"Conversion terminée avec succès : {output_path}")
    print("=== END BLENDER CONVERSION ===")


if __name__ == "__main__":
    main()