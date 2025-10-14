-- SQLINES DEMO ***  Distrib 8.4.6, for Win64 (x86_64)
--
-- SQLINES DEMO ***   Database: bonsais_db
-- SQLINES DEMO *** -------------------------------------
-- SQLINES DEMO *** 4.6

/* SQLINES DEMO *** CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/* SQLINES DEMO *** CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/* SQLINES DEMO *** COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/* SQLINES DEMO ***  utf8mb4 */;
/* SQLINES DEMO *** TIME_ZONE=@@TIME_ZONE */;
/* SQLINES DEMO *** ZONE='+00:00' */;
/* SQLINES DEMO *** UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/* SQLINES DEMO *** FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/* SQLINES DEMO *** SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/* SQLINES DEMO *** SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- SQLINES DEMO *** or table `bonsai`
--

DROP TABLE IF EXISTS bonsai;
/* SQLINES DEMO *** d_cs_client     = @@character_set_client */;
/* SQLINES DEMO *** cter_set_client = utf8mb4 */;
-- SQLINES FOR EVALUATION USE ONLY (14 DAYS)
CREATE TABLE bonsai (
  id int NOT NULL GENERATED ALWAYS AS IDENTITY,
  nombre varchar(200) NOT NULL,
  tipo varchar(100) NOT NULL,
  edad int NOT NULL,
  altura int DEFAULT NULL,
  tipo_cuidado varchar(200) DEFAULT NULL,
  descripcion text,
  precio int DEFAULT NULL,
  PRIMARY KEY (id)
)  ;

ALTER SEQUENCE bonsai_seq RESTART WITH 2;
/* SQLINES DEMO *** cter_set_client = @saved_cs_client */;

--
-- SQLINES DEMO *** table `bonsai`
--

LOCK TABLES bonsai WRITE;
/* SQLINES DEMO *** LE `bonsai` DISABLE KEYS */;
INSERT INTO bonsai VALUES (1,'Portulacaria Afra N1','Portulacaria Afra',7,NULL,'Bajo','Este es el ejemplar n┬░1, es una Portulacaria Afra de unos 7 a├▒os de entrenamiento y muy f├íciles cuidados.',45000);
/* SQLINES DEMO *** LE `bonsai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- SQLINES DEMO *** or table `comentario`
--

DROP TABLE IF EXISTS comentario;
/* SQLINES DEMO *** d_cs_client     = @@character_set_client */;
/* SQLINES DEMO *** cter_set_client = utf8mb4 */;
CREATE TABLE comentario (
  id int NOT NULL GENERATED ALWAYS AS IDENTITY,
  nombre varchar(80) NOT NULL,
  texto text NOT NULL,
  fecha timestamp(0) NOT NULL,
  bonsai_id int NOT NULL,
  PRIMARY KEY (id)
,
  CONSTRAINT comentario_ibfk_1 FOREIGN KEY (bonsai_id) REFERENCES bonsai (id)
)  ;

ALTER SEQUENCE comentario_seq RESTART WITH 3;
/* SQLINES DEMO *** cter_set_client = @saved_cs_client */;

CREATE INDEX bonsai_id ON comentario (bonsai_id);

--
-- SQLINES DEMO *** table `comentario`
--

LOCK TABLES comentario WRITE;
/* SQLINES DEMO *** LE `comentario` DISABLE KEYS */;
INSERT INTO comentario VALUES (1,'webiwabo','awawiwawoo awawiwawooo wuuuwiwawiawawiwabo','2025-10-12 21:18:04',1),(2,'juanin','tulio estamos al aire','2025-10-12 18:30:00',1);
/* SQLINES DEMO *** LE `comentario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- SQLINES DEMO *** or table `foto`
--

DROP TABLE IF EXISTS foto;
/* SQLINES DEMO *** d_cs_client     = @@character_set_client */;
/* SQLINES DEMO *** cter_set_client = utf8mb4 */;
CREATE TABLE foto (
  id int NOT NULL GENERATED ALWAYS AS IDENTITY,
  ruta_archivo varchar(300) NOT NULL,
  nombre_archivo varchar(300) NOT NULL,
  bonsai_id int NOT NULL,
  PRIMARY KEY (id)
,
  CONSTRAINT foto_ibfk_1 FOREIGN KEY (bonsai_id) REFERENCES bonsai (id)
)  ;

ALTER SEQUENCE foto_seq RESTART WITH 6;
/* SQLINES DEMO *** cter_set_client = @saved_cs_client */;

CREATE INDEX bonsai_id ON foto (bonsai_id);

--
-- SQLINES DEMO *** table `foto`
--

LOCK TABLES foto WRITE;
/* SQLINES DEMO *** LE `foto` DISABLE KEYS */;
INSERT INTO foto VALUES (1,'/static/images/portulacaria1.jpeg','portulacaria1.jpeg',1),(2,'/static/images/portulacaria2.jpeg','portulacaria2.jpeg',1),(3,'/static/images/portulacaria3.jpeg','portulacaria3.jpeg',1),(4,'/static/images/portulacaria4.jpeg','portulacaria4.jpeg',1),(5,'/static/images/portulacaria5.jpeg','portulacaria5.jpeg',1);
/* SQLINES DEMO *** LE `foto` ENABLE KEYS */;
UNLOCK TABLES;
/* SQLINES DEMO *** ZONE=@OLD_TIME_ZONE */;

/* SQLINES DEMO *** ODE=@OLD_SQL_MODE */;
/* SQLINES DEMO *** GN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/* SQLINES DEMO *** E_CHECKS=@OLD_UNIQUE_CHECKS */;
/* SQLINES DEMO *** CTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/* SQLINES DEMO *** CTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/* SQLINES DEMO *** TION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/* SQLINES DEMO *** OTES=@OLD_SQL_NOTES */;

-- SQLINES DEMO ***  2025-10-13 20:48:01
