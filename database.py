import os
from datetime import datetime
from sqlalchemy import (
    create_engine, String, Integer, DateTime, Text, ForeignKey
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

# ---------------- BASE DECLARATIVA ----------------
class Base(DeclarativeBase):
    pass

# ---------------- CONEXIÓN Y SESIÓN ----------------
def getSession():
    DATABASE_URL = os.environ.get("DATABASE_URL")

    if not DATABASE_URL:
        DB_USER = os.environ.get("DB_USER")
        DB_PASS = os.environ.get("DB_PASS")
        DB_HOST = os.environ.get("DB_HOST", "localhost")
        DB_PORT = os.environ.get("DB_PORT", 3306)
        DB_NAME = os.environ.get("DB_NAME")
        DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)

    engine = create_engine(DATABASE_URL, echo=True)
    return Session(engine)

# ------------------ MODELOS ------------------

class Bonsai(Base):
    __tablename__ = "bonsai"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(200), nullable=False)
    tipo: Mapped[str] = mapped_column(String(100), nullable=False)
    edad: Mapped[int] = mapped_column(Integer, nullable=False)  # años totales
    entrenamiento: Mapped[int] = mapped_column(Integer, nullable=True)  # años como bonsái
    altura: Mapped[int] = mapped_column(Integer, nullable=True)  # cm
    ancho: Mapped[int] = mapped_column(Integer, nullable=True)  # cm
    maceta: Mapped[str] = mapped_column(String(100), nullable=True)  # cerámica o plástica
    dificultad_cuidado: Mapped[str] = mapped_column(String(20), nullable=True)  # Bajo / Medio / Alto
    descripcion: Mapped[str] = mapped_column(Text, nullable=True)
    precio: Mapped[int] = mapped_column(Integer, nullable=True)

    fotos: Mapped[list["Foto"]] = relationship(
        back_populates="bonsai", cascade="all, delete-orphan"
    )
    comentarios: Mapped[list["Comentario"]] = relationship(
        back_populates="bonsai", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "tipo": self.tipo,
            "edad": self.edad,
            "entrenamiento": self.entrenamiento,
            "altura": self.altura,
            "ancho": self.ancho,
            "maceta": self.maceta,
            "dificultad_cuidado": self.dificultad_cuidado,
            "descripcion": self.descripcion,
            "precio": self.precio,
            "fotos": [f.ruta_archivo for f in self.fotos],
        }

class Foto(Base):
    __tablename__ = "foto"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo: Mapped[str] = mapped_column(String(300), nullable=False)
    nombre_archivo: Mapped[str] = mapped_column(String(300), nullable=False)
    bonsai_id: Mapped[int] = mapped_column(ForeignKey("bonsai.id"), nullable=False)

    bonsai: Mapped["Bonsai"] = relationship(back_populates="fotos")

class Comentario(Base):
    __tablename__ = "comentario"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(80), nullable=False)
    texto: Mapped[str] = mapped_column(Text, nullable=False)
    fecha: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    bonsai_id: Mapped[int] = mapped_column(ForeignKey("bonsai.id"), nullable=False)

    bonsai: Mapped["Bonsai"] = relationship(back_populates="comentarios")

# ---------------- CREAR TABLAS ----------------
if __name__ == "__main__":
    session = getSession()
    Base.metadata.create_all(bind=session.get_bind())
    print("✅ Tablas creadas correctamente.")
