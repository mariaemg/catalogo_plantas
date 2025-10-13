from flask import Flask, render_template, jsonify, request
from sqlalchemy.orm import selectinload
from database import Bonsai, Comentario, getSession
from datetime import datetime
import os

def create_app():
    app = Flask(__name__)

    # --- API de bonsáis ---
    @app.route("/api/bonsais")
    def api_bonsais():
        with getSession() as session:
            bonsais = session.query(Bonsai).options(selectinload(Bonsai.fotos)).all()
            result = [b.to_dict() for b in bonsais]
        return jsonify(result)

    # --- Página principal ---
    @app.route("/")
    def index():
        with getSession() as session:
            bonsais = session.query(Bonsai).options(selectinload(Bonsai.fotos)).all()
        return render_template("index.html", bonsais=bonsais)

    # --- Página detalle bonsái ---
    @app.route("/bonsai/<int:bonsai_id>")
    def detalle_bonsai(bonsai_id):
        with getSession() as session:
            bonsai = session.query(Bonsai)\
                .options(selectinload(Bonsai.fotos), selectinload(Bonsai.comentarios))\
                .filter_by(id=bonsai_id).first()

        if not bonsai:
            return "Bonsái no encontrado", 404

        # Lista de rutas de fotos para JS
        fotos = [f.ruta_archivo for f in bonsai.fotos]

        return render_template(
            "info-bonsai.html",
            bonsai=bonsai,
            bonsaiFotos=fotos
        )

    # --- Obtener comentarios ---
    @app.route("/comentarios/<int:bonsai_id>")
    def obtener_comentarios(bonsai_id):
        with getSession() as session:
            comentarios = session.query(Comentario)\
                .filter_by(bonsai_id=bonsai_id)\
                .order_by(Comentario.fecha.desc())\
                .all()

        comentarios_list = [
            {
                "nombre": c.nombre,  # escape se hace en template o en JS
                "texto": c.texto,
                "fecha": c.fecha.strftime("%d-%m-%Y %H:%M")  # formato legible
            } for c in comentarios
        ]
        return jsonify(comentarios_list)

    # --- Agregar comentario ---
    @app.route("/comentario/<int:bonsai_id>", methods=["POST"])
    def agregar_comentario(bonsai_id):
        data = request.get_json()
        nombre = data.get("nombre", "").strip()
        texto = data.get("texto", "").strip()
        fecha_str = data.get("fecha", "").strip()  # viene del JS

        errores = []
        if not nombre or len(nombre) < 3:
            errores.append("El nombre debe tener al menos 3 caracteres.")
        if not texto or len(texto) < 5:
            errores.append("El comentario debe tener al menos 5 caracteres.")
        if not fecha_str:
            errores.append("La fecha es obligatoria.")

        if errores:
            return jsonify({"errores": errores}), 400

        # Convertir la fecha enviada por JS a datetime
        try:
            fecha = datetime.strptime(fecha_str, "%d-%m-%Y %H:%M")
        except ValueError:
            return jsonify({"errores": ["Formato de fecha inválido."]}), 400

        comentario = Comentario(
            nombre=nombre,
            texto=texto,
            fecha=fecha,
            bonsai_id=bonsai_id
        )

        with getSession() as session:
            session.add(comentario)
            session.commit()
            session.refresh(comentario)

        return jsonify({
            "comentario": {
                "nombre": nombre,
                "texto": texto,
                "fecha": fecha_str
            }
        })

    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))  # Render define PORT
    app.run(host="0.0.0.0", port=port, debug=True)
