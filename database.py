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
    DB_USER = "bonsai_user"
    DB_PASS = "G7v!p9Rz#2qL8mT4"  # contraseña segura
    DB_HOST = "localhost"
    DB_PORT = 3306   # MySQL
    DB_NAME = "bonsais_db"

    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    engine = create_engine(DATABASE_URL, echo=True)
    return Session(engine)

# ------------------ MODELOS ------------------

class Bonsai(Base):
    __tablename__ = "bonsai"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(200), nullable=False)
    tipo: Mapped[str] = mapped_column(String(100), nullable=False)
    edad: Mapped[int] = mapped_column(Integer, nullable=False)
    altura: Mapped[int] = mapped_column(Integer, nullable=True)
    tipo_cuidado: Mapped[str] = mapped_column(String(200), nullable=True)
    descripcion: Mapped[str] = mapped_column(Text, nullable=True)
    precio: Mapped[int] = mapped_column(Integer, nullable=True)

    fotos: Mapped[list["Foto"]] = relationship(
        back_populates="bonsai",
        cascade="all, delete-orphan"
    )
    comentarios: Mapped[list["Comentario"]] = relationship(
        back_populates="bonsai",
        cascade="all, delete-orphan"
    )

    # ---------------- to_dict ----------------
    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "tipo": self.tipo,
            "edad": self.edad,
            "altura": self.altura,
            "tipo_cuidado": self.tipo_cuidado,
            "descripcion": self.descripcion,
            "precio": self.precio,
            "fotos": [f.ruta_archivo for f in self.fotos]
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
    print("Tablas creadas correctamente.")
