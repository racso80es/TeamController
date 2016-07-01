-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 28-06-2016 a las 12:52:43
-- Versión del servidor: 10.0.20-MariaDB
-- Versión de PHP: 5.2.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de datos: 'u938118667_team'
--

DELIMITER $$
--
-- Procedimientos
--
DROP PROCEDURE IF EXISTS `Prc_DocumentacionTipo_Listar`$$
CREATE PROCEDURE `Prc_DocumentacionTipo_Listar`(IN pnUsuario BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 11/12/2015
        Descripcion: Se devuelven los tipos de documentaciones coincidentes con los filtros indicados
*/
	-- Definicion de variables
	SELECT DocTip.DocTip_Id, DocTip.DocTip_Nombre, DocTip.DocTip_Descripcion, DocTip.DocTip_ValorDocumento
	FROM DocumentacionTipo DocTip
	ORDER BY DocTip.DocTip_Nombre;
END$$

DROP PROCEDURE IF EXISTS `Prc_Documentacion_Eliminar`$$
CREATE PROCEDURE `Prc_Documentacion_Eliminar`(IN pnId BIGINT(20),
				            IN pnUsuario BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 10/12/2015
        Descripcion: Se elimina la documentacion indicada
*/
	-- Definicion de variables
	DECLARE lnEquipo BIGINT(20);

	SET lnEquipo = (SELECT Doc_Equipo FROM Documentacion WHERE Doc_Id = pnId);

	-- El usuario ha de ser administrador del equipo
	IF NOT EXISTS(SELECT EquUsu_Id 
		      FROM EquipoUsuario 
		      WHERE EquUsu_Usuario = pnUsuario
		        AND EquUsu_Equipo = lnEquipo
  		        AND EquUsu_Administrador = TRUE) THEN
		CALL raise (55, 'No tiene los privilegios para eliminar documentacion de este equipo');
	ELSE
		-- Se elimina el registro
		DELETE FROM Documentacion WHERE Doc_Id = pnId;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Documentacion_Insertar`$$
CREATE PROCEDURE `Prc_Documentacion_Insertar`(IN pnUsuario BIGINT(20),
  				            IN pnEquipo BIGINT(20),
 				            IN pnLiga BIGINT(20),
				            IN pnJugador BIGINT(20),
				            IN psNombre VARCHAR(50),
				            IN psDescripcion VARCHAR(255),
					    IN pnTipo BIGINT(20),
				            IN pnValor DECIMAL(10, 2))
BEGIN
/*
	Autor: OPG
        Fecha: 10/12/2015
        Descripcion: Se crea una nueva documentación
*/
	-- Definicion de variables
	DECLARE lnId BIGINT(20);
	DECLARE lsError VARCHAR(255);

	DECLARE exit handler for sqlexception
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);
		ROLLBACK;
	END;

	DECLARE exit handler for sqlwarning
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);

		ROLLBACK;
	END;

	START TRANSACTION;

	-- El usuario ha de ser administrador del equipo
	IF NOT EXISTS(SELECT EquUsu_Id 
		      FROM EquipoUsuario 
		      WHERE EquUsu_Usuario = pnUsuario
		        AND EquUsu_Equipo = pnEquipo
  		        AND EquUsu_Administrador = TRUE) THEN
		CALL raise (55, 'No tiene los privilegios para añadir documentacion de este equipo');
	ELSE
		-- Se añade el registro
		INSERT INTO Documentacion
			(Doc_Equipo, Doc_Liga, Doc_Jugador, Doc_Nombre, Doc_Descripcion, Doc_Tipo, Doc_Valor, Doc_FechaAlta, Doc_FechaModificacion, Doc_FechaBaja, Doc_Activo)
			VALUES
			(pnEquipo, pnLiga, pnJugador, psNombre, psDescripcion, pnTipo, pnValor, NOW(), NULL, NULL, TRUE);
	
		-- Se devuelve el identificador de registro
		SET lnId = last_insert_id();

		COMMIT;

		SELECT lnId AS Id;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Documentacion_Listar`$$
CREATE PROCEDURE `Prc_Documentacion_Listar`(IN pnUsuario BIGINT(20),
                                          IN pnEquipo BIGINT(20),
                                          IN pnLiga BIGINT(20),
                                          IN pnJugador BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 10/12/2015
        Descripcion: Se devuelven las documentaciones coincidentes con los filtros indicados
*/
	-- Definicion de variables
	SELECT Doc.Doc_Id, Doc.Doc_Nombre, Doc.Doc_Descripcion, Doc.Doc_Valor, Doc_FechaAlta, Doc_FechaModificacion, Doc_FechaBaja, Doc_Activo,
	       DocTip.DocTip_Id, DocTip.DocTip_Nombre,
	       Equ.Equ_Id, Equ.Equ_Nombre, 
	       Lig.Lig_Id, Lig.Lig_Nombre, 
	       Jug.Jug_Id, Jug.Jug_Nombre
	FROM Documentacion Doc
	INNER JOIN DocumentacionTipo DocTip ON DocTip.DocTip_Id = Doc.Doc_Tipo
	INNER JOIN Equipo Equ ON Equ.Equ_Id = Doc.Doc_Equipo
	LEFT JOIN Liga Lig ON Lig.Lig_Id = Doc.Doc_Liga
	LEFT JOIN Jugador Jug ON Jug.Jug_Id = Doc.Doc_Jugador
	WHERE (pnEquipo IS NULL OR Equ.Equ_Id = pnEquipo)
  	  AND (pnLiga IS NULL OR Lig.Lig_Id = pnLiga)
  	  AND (pnJugador IS NULL OR Jug.Jug_Id = pnJugador)
	  AND EXISTS(SELECT EquUsu_Id 
		     FROM EquipoUsuario 
		     WHERE EquUsu_Usuario = pnUsuario
		       AND EquUsu_Equipo = Equ.Equ_Id)
	ORDER BY Equ.Equ_Nombre, Lig.Lig_Nombre, Jug.Jug_Nombre, Doc_FechaAlta;
END$$

DROP PROCEDURE IF EXISTS `Prc_Documentacion_Modificar`$$
CREATE PROCEDURE `Prc_Documentacion_Modificar`(IN pnId BIGINT(20),
					     IN pnUsuario BIGINT(20),
    				             IN pnEquipo BIGINT(20),
				             IN pnLiga BIGINT(20),
				             IN pnJugador BIGINT(20),
				             IN psNombre VARCHAR(50),
				             IN psDescripcion VARCHAR(255),
				             IN pnTipo BIGINT(20),
 				       	     IN pnValor DECIMAL(10, 2),
				             IN pbActivo TINYINT(1))
BEGIN
/*
	Autor: OPG
        Fecha: 10/12/2015
        Descripcion: Se modifica la Documentacion indicada
*/
	-- Definicion de variables
	DECLARE lsError VARCHAR(255);

	DECLARE exit handler for sqlexception
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);
		ROLLBACK;
	END;

	DECLARE exit handler for sqlwarning
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);

		ROLLBACK;
	END;

	-- El usuario ha de ser administrador del equipo
	IF NOT EXISTS(SELECT EquUsu_Id 
		      FROM EquipoUsuario 
		      WHERE EquUsu_Usuario = pnUsuario
		        AND EquUsu_Equipo = pnEquipo
  		        AND EquUsu_Administrador = TRUE) THEN
		CALL raise (55, 'No tiene los privilegios para modificar documentacion de este equipo');
	ELSE
		-- Se modifica el registro
		UPDATE Documentacion SET
			Doc_Equipo = pnEquipo,
			Doc_Liga = pnLiga,
			Doc_Jugador = pnJugador,
			Doc_Nombre = psNombre,
			Doc_Descripcion = psDescripcion,  
		        Doc_Valor = pnValor,
			Doc_FechaModificacion = NOW(), 
			Doc_FechaBaja = CASE WHEN pbActivo = TRUE THEN NULL ELSE CASE WHEN Doc_Activo = pbActivo THEN Doc_FechaBaja ELSE NOW() END END, 
			Doc_Activo = pbActivo
		WHERE Doc_id = pnId;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Equipos_Listar`$$
CREATE PROCEDURE `Prc_Equipos_Listar`(IN pnUsuario BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 17/11/2015
        Descripcion: Se devuelven todos los equipos activos del usuario indicado
*/
	-- Definicion de variables

	-- El usuario ha de ser administrador del equipo
	SELECT Equ.Equ_Id, Equ.Equ_nombre, Equ.Equ_Descripcion
	FROM Equipo Equ
	INNER JOIN EquipoUsuario EquUsu ON EquUsu.EquUsu_Equipo = Equ.Equ_Id
	WHERE EquUsu.EquUsu_Usuario = pnUsuario
	  AND Equ.Equ_Activo = TRUE
        ORDER BY Equ.Equ_Nombre;
END$$

DROP PROCEDURE IF EXISTS `Prc_Equipo_Obtener`$$
CREATE PROCEDURE `Prc_Equipo_Obtener`(IN pnUsuario BIGINT(20),
				    				  IN pnEquipo BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 17/11/2015
        Descripcion: Se devuelve el equipo indicado
*/
	-- Definicion de variables

	-- El usuario ha de ser administrador del equipo
	SELECT Equ.Equ_Id, Equ.Equ_Nombre, Equ.Equ_Descripcion
	FROM Equipo Equ
	INNER JOIN EquipoUsuario EquUsu ON EquUsu.EquUsu_Equipo = Equ.Equ_Id
	WHERE EquUsu.EquUsu_Usuario = pnUsuario
	  AND Equ.Equ_Id = pnEquipo
	  AND Equ.Equ_Activo = TRUE
        ORDER BY Equ.Equ_Nombre;
END$$

DROP PROCEDURE IF EXISTS `Prc_Jugador_Obtener`$$
CREATE PROCEDURE `Prc_Jugador_Obtener`(IN pnUsuario BIGINT(20),
				     IN pnId BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 18/11/2015
        Descripcion: Se devuelven los datos del juagdor indicado
*/
	-- Definicion de variables

	SELECT Jug.Jug_Id, Jug.Jug_Nombre, Jug.Jug_Apellido1, Jug.Jug_Apellido2, Jug.Jug_Email, Jug.Jug_Equipo
	FROM Jugador Jug
	WHERE Jug.Jug_Id = pnId
          AND EXISTS(SELECT EquUsu_Id 
		     FROM EquipoUsuario 
		     WHERE EquUsu_Usuario = pnUsuario
		       AND EquUsu_Equipo = Jug.Jug_Equipo);
END$$

DROP PROCEDURE IF EXISTS `Prc_Documentacion_Obtener`$$
CREATE PROCEDURE `Prc_Documentacion_Obtener`(IN pnId BIGINT(20),
      				           IN pnUsuario BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 19/11/2015
        Descripcion: Se devuelven los datos de la documentacion indicada
*/
	-- Definicion de variables

	SELECT Doc.Doc_Id, Doc.Doc_Nombre, Doc.Doc_Descripcion, Doc.Doc_Valor, Doc_FechaAlta, Doc_FechaModificacion, Doc_FechaBaja, Doc_Activo,
	       DocTip.DocTip_Id, DocTip.DocTip_Nombre,
	       Equ.Equ_Id, Equ.Equ_Nombre, 
	       Lig.Lig_Id, Lig.Lig_Nombre, 
	       Jug.Jug_Id, Jug.Jug_Nombre
	FROM Documentacion Doc
	INNER JOIN DocumentacionTipo DocTip ON DocTip.DocTip_Id = Doc.Doc_Tipo
	INNER JOIN Equipo Equ ON Equ.Equ_Id = Doc.Doc_Equipo
	LEFT JOIN Liga Lig ON Lig.Lig_Id = Doc.Doc_Liga
	LEFT JOIN Jugador Jug ON Jug.Jug_Id = Doc.Doc_Jugador
	WHERE Doc.Doc_Id = pnId
          AND EXISTS(SELECT EquUsu_Id 
		     FROM EquipoUsuario 
		     WHERE EquUsu_Usuario = pnUsuario
		       AND EquUsu_Equipo = Equ.Equ_Id);
END$$

DROP PROCEDURE IF EXISTS `Prc_EquipoUsuario_Eliminar`$$
CREATE PROCEDURE `Prc_EquipoUsuario_Eliminar`(IN pnUsuario BIGINT(20),
                                            IN pnEquipo BIGINT(20),
                                            IN pnUsuarioAccion BIGINT(20))
BEGIN
/*
	Autor: OPG
	Fecha: 29/03/2016
    Descripcion: Si no se trata del último usuario, se elimina la relación entre usuario y equipo indicado
*/
	-- Definicion de variables
    DECLARE lnEquipo BIGINT(20);
    DECLARE lsInvitadoEmail VARCHAR(50);
    DECLARE ldFecha DATETIME;
    DECLARE lbAdministrador TINYINT(1);
	DECLARE lnId BIGINT(20);
	DECLARE lsError VARCHAR(255);

    DECLARE exit handler for sqlexception
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);
		ROLLBACK;
	END;

	DECLARE CONTINUE handler for sqlwarning 
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
	START TRANSACTION;
    
   	-- El usuario ha de ser administrador del equipo o el mismo que se está modificando
	IF NOT EXISTS(SELECT EquUsu_Id 
                  FROM EquipoUsuario 
                  WHERE EquUsu_Usuario = pnUsuarioAccion
		            AND EquUsu_Equipo = pnEquipo
  		            AND (EquUsu_Administrador = TRUE
					  OR EquUsu_Usuario = pnUsuario)) THEN
		CALL raise (55, 'No tiene los privilegios para eliminar usuarios en este equipo');
    ELSEIF NOT EXISTS(SELECT *
					  FROM EquipoUsuario
					  WHERE EquUsu_Equipo = pnEquipo
					    AND EquUsu_Usuario <> pnUsuario
					    AND EquUsu_Administrador = TRUE) THEN
		-- No puede ser el último usuario administrador del equipo
        CALL raise (55, 'No puede eliminar este usuario del equipo. Es el último que es administrador.');
	ELSE
		-- Se elimina relación entre usuario y equipo
        DELETE FROM EquipoUsuario 
		WHERE EquUsu_Equipo = pnEquipo 
          AND EquUsu_Usuario = pnUsuario;
    END IF;

	COMMIT;
END$$

DROP PROCEDURE IF EXISTS `Prc_EquipoUsuario_Insertar`$$
CREATE PROCEDURE `Prc_EquipoUsuario_Insertar`(IN pnUsuario BIGINT(20),
                                            IN pnEquipo BIGINT(20),
										    IN pbAdministrador TINYINT(1))
BEGIN
/*
	Autor: OPG
    Fecha: 17/03/2016
    Descripcion: Se añade la relacion entre equipo y usuario
*/
	-- Definicion de variables
	DECLARE lnId BIGINT(20);
	DECLARE lsError VARCHAR(255);

	DECLARE exit handler for sqlexception
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);
	END;

	DECLARE exit handler for sqlwarning
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);
	END;

	START TRANSACTION;
        
	-- Se añade el registro
	INSERT INTO EquipoUsuario 
		(EquUsu_Equipo, EquUsu_Usuario, EquUsu_Administrador)
		VALUES
		(pnEquipo, pnUsuario, pbAdministrador);
	
	-- Se devuelve el identificador de registro
        SET lnId = last_insert_id();

	COMMIT;

	SELECT lnId AS Id;
END$$

DROP PROCEDURE IF EXISTS `Prc_Equipo_Eliminar`$$
CREATE PROCEDURE `Prc_Equipo_Eliminar`(IN pnUsuario BIGINT(20),
									 IN pnEquipo BIGINT(20))
BEGIN
/*
	Autor: OPG
	Fecha: 18/01/2016
    Descripcion: Se elimina el equipo indicado
*/
	-- Definicion de variables
	DECLARE lnId BIGINT(20);
	DECLARE lsError VARCHAR(255);
    DECLARE lnCuantos BIGINT(20);

	DECLARE exit handler for sqlexception
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);
		ROLLBACK;
	END;

	DECLARE exit handler for sqlwarning
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);
		ROLLBACK;
	END;

	START TRANSACTION;

	-- El usuario ha de ser administrador del equipo
	IF NOT EXISTS(SELECT EquUsu_Id 
				  FROM EquipoUsuario 
		          WHERE EquUsu_Usuario = pnUsuario
		            AND EquUsu_Equipo = pnEquipo) THEN
		CALL raise (55, 'El usuario indicado no tiene asignado el equipo seleccionado.');
	END IF;
    
    -- Si es el último usuario del equipo, se prosigue
    SET lnCuantos = (SELECT COUNT(*) FROM EquipoUsuario WHERE EquUsu_Equipo = pnEquipo AND EquUsu_Usuario <> pnUsuario);
    IF lnCuantos = 0 THEN
		DELETE FROM EquipoUsuario WHERE EquUsu_Equipo = pnEquipo AND EquUsu_Usuario = pnUsuario;
		-- Se elimina el equipo con todas las relaciones que tenga
		UPDATE Equipo SET
			Equ_FechaModificacion = NOW(), 
			Equ_FechaBaja = NOW(), 
			Equ_Activo = FALSE
		WHERE Equ_Id = pnEquipo;
	ELSE
		-- Si es el último usuario administrador, no puede abandonar el grupo
		SET lnCuantos = (SELECT COUNT(*) FROM EquipoUsuario WHERE EquUsu_Equipo = pnEquipo AND EquUsu_Usuario <> pnUsuario AND EquUsu_Administrador=TRUE);
		IF lnCuantos < 1 THEN
			CALL raise (55, 'Es el último usuario administrador del equipo. Ha de seleccionar otro administrador para poder abandonarlo.');
		ELSE
			DELETE FROM EquipoUsuario WHERE EquUsu_Equipo = pnEquipo AND EquUsu_Usuario = pnUsuario;
		END IF;		
	END IF;
	COMMIT;
END$$

DROP PROCEDURE IF EXISTS `Prc_Liga_Listar`$$
CREATE PROCEDURE `Prc_Liga_Listar`(IN pnUsuario BIGINT(20),
                                 IN pnEquipo BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 19/11/2015
        Descripcion: Se devuelven todas las ligas activas del usuario y equipo actual
*/
	-- Definicion de variables

	-- El usuario ha de ser administrador del equipo
	SELECT Lig.Lig_Id, Lig.Lig_Nombre, Lig.Lig_Descripcion
	FROM Liga Lig
	WHERE Lig.Lig_Equipo = pnEquipo
          AND Lig.Lig_Activo = TRUE
          AND EXISTS(SELECT EquUsu_Id 
		     FROM EquipoUsuario 
		     WHERE EquUsu_Usuario = pnUsuario
		       AND EquUsu_Equipo = Lig.Lig_Equipo)
	ORDER BY Lig.Lig_Nombre;
END$$

DROP PROCEDURE IF EXISTS `Prc_Liga_Obtener`$$
CREATE PROCEDURE `Prc_Liga_Obtener`(IN pnUsuario BIGINT(20),
				  IN pnId BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 19/11/2015
        Descripcion: Se devuelven los datos de la liga indicada
*/
	-- Definicion de variables

	SELECT Lig.Lig_Id, Lig.Lig_Nombre, Lig.Lig_Descripcion, Lig.Lig_Equipo
	FROM Liga Lig
	WHERE Lig.Lig_Id = pnId
          AND EXISTS(SELECT EquUsu_Id 
		     FROM EquipoUsuario 
		     WHERE EquUsu_Usuario = pnUsuario
		       AND EquUsu_Equipo = Lig.Lig_Equipo);
END$$

DROP PROCEDURE IF EXISTS `Prc_Equipo_Insertar`$$
CREATE PROCEDURE `Prc_Equipo_Insertar`(IN pnUsuario BIGINT(20),
				     IN psNombre VARCHAR(50),
				     IN psDescripcion VARCHAR(255))
BEGIN
/*
	Autor: OPG
        Fecha: 13/11/2015
        Descripcion: Se añade el nuevo equipo para el usuario indicado
*/
	-- Definicion de variables
	DECLARE lnId BIGINT(20);

	DECLARE exit handler for sqlexception
	BEGIN
		CALL raise (55, 'Se ha producido un error al añadir equipo');
		ROLLBACK;
	END;

	DECLARE exit handler for sqlwarning
	BEGIN
		CALL raise (55, 'Se ha producido un error al añadir equipo');
		ROLLBACK;
	END;

	START TRANSACTION;
        
	-- Se añade el registro
	INSERT INTO Equipo 
		(Equ_Nombre, Equ_Descripcion, Equ_FechaAlta, Equ_FechaModificacion, Equ_FechaBaja, Equ_Activo)
		VALUES
		(psNombre, psDescripcion, NOW(), NULL, NULL, TRUE);
	
	-- Se devuelve el identificador de registro
        SET lnId = last_insert_id();

	INSERT INTO EquipoUsuario 
		(EquUsu_Equipo, EquUsu_usuario, EquUsu_Administrador)
		VALUES
		(lnId, pnUsuario, TRUE);
	COMMIT;

	SELECT lnId AS Id;
END$$

DROP PROCEDURE IF EXISTS `Prc_Equipo_Modificar`$$
CREATE PROCEDURE `Prc_Equipo_Modificar`(IN pnEquipo BIGINT(20),
				      IN pnUsuario BIGINT(20),
				      IN psNombre VARCHAR(50),
				      IN psDescripcion VARCHAR(255))
BEGIN
/*
	Autor: OPG
        Fecha: 13/11/2015
        Descripcion: Se modifica el equipo indicado
*/
	-- Definicion de variables
        DECLARE pbActivo BOOLEAN;
        SET pbActivo = true;

	-- El usuario ha de ser administrador del equipo
	IF NOT EXISTS(SELECT EquUsu_Id 
		      FROM EquipoUsuario 
		      WHERE EquUsu_Usuario = pnUsuario
		        AND EquUsu_Equipo = pnEquipo
  		        AND EquUsu_Administrador = TRUE) THEN
		CALL raise (55, 'No tiene los privilegios para modificar este equipo');
	ELSE
		-- Se modifica el registro
		UPDATE Equipo SET
			Equ_Nombre = psNombre,
			Equ_Descripcion = psDescripcion, 
			Equ_FechaModificacion = NOW(), 
			Equ_FechaBaja = CASE WHEN pbActivo = TRUE THEN NULL ELSE CASE WHEN Equ_Activo = pbActivo THEN Equ_FechaBaja ELSE NOW() END END, 
			Equ_Activo = pbActivo
		WHERE Equ_id = pnEquipo;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Gasto_Eliminar`$$
CREATE PROCEDURE `Prc_Gasto_Eliminar`(IN pnId BIGINT(20),
				    IN pnUsuario BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 30/11/2015
        Descripcion: Se elimina el gasto indicado
*/
	-- Definicion de variables
	DECLARE lnEquipo BIGINT(20);

	SET lnEquipo = (SELECT Gas_Equipo FROM Gasto WHERE Gas_Id = pnId);

	-- El usuario ha de ser administrador del equipo
	IF NOT EXISTS(SELECT EquUsu_Id 
		      FROM EquipoUsuario 
		      WHERE EquUsu_Usuario = pnUsuario
		        AND EquUsu_Equipo = lnEquipo
  		        AND EquUsu_Administrador = TRUE) THEN
		CALL raise (55, 'No tiene los privilegios para eliminar gasto de este equipo');
	ELSE
		-- Se elimina el registro
		DELETE FROM Gasto WHERE Gas_id = pnId;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Gasto_Insertar`$$
CREATE PROCEDURE `Prc_Gasto_Insertar`(IN pnUsuario BIGINT(20),
  				    IN pnEquipo BIGINT(20),
				    IN pnLiga BIGINT(20),
				    IN pnJugador BIGINT(20),
				    IN psConcepto VARCHAR(255),
				    IN pnImporte DECIMAL(10, 2))
BEGIN
/*
	Autor: OPG
        Fecha: 30/11/2015
        Descripcion: Se crea un nuevo gasto
*/
	-- Definicion de variables
	DECLARE lnId BIGINT(20);

	DECLARE exit handler for sqlexception
	BEGIN
		CALL raise (55, 'Se ha producido un error al añadir gasto');
		ROLLBACK;
	END;

	DECLARE exit handler for sqlwarning
	BEGIN
		CALL raise (55, 'Se ha producido un error al añadir gasto');
		ROLLBACK;
	END;

	START TRANSACTION;
        
	-- Se añade el registro
	INSERT INTO Gasto
		(Gas_Equipo, Gas_Liga, Gas_Jugador, Gas_Concepto, Gas_Importe, Gas_FechaAlta, Gas_FechaModificacion, Gas_FechaBaja, Gas_Activo)
		VALUES
		(pnEquipo, pnLiga, pnJugador, psConcepto, pnImporte, NOW(), NULL, NULL, TRUE);
	
	-- Se devuelve el identificador de registro
        SET lnId = last_insert_id();

	COMMIT;

	SELECT lnId AS Id;
END$$

DROP PROCEDURE IF EXISTS `Prc_Gasto_Listar`$$
CREATE PROCEDURE `Prc_Gasto_Listar`(IN pnUsuario BIGINT(20),
				  IN pnEquipo BIGINT(20),
				  IN pnLiga BIGINT(20),
				  IN pnJugador BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 27/11/2015
        Descripcion: Se devuelven los gastos coincidentes con los filtros indicados
*/
	-- Definicion de variables
	SELECT Gas.Gas_Id, Gas.Gas_Concepto, Gas.Gas_Importe, Gas_FechaAlta, Gas_FechaModificacion, Gas_FechaBaja, Gas_Activo,
	       Equ.Equ_Id, Equ.Equ_Nombre, 
	       Lig.Lig_Id, Lig.Lig_Nombre, 
	       Jug.Jug_Id, Jug.Jug_Nombre
	FROM Gasto Gas
	INNER JOIN Equipo Equ ON Equ.Equ_Id = Gas.Gas_Equipo
	LEFT JOIN Liga Lig ON Lig.Lig_Id = Gas.Gas_Liga
	LEFT JOIN Jugador Jug ON Jug.Jug_Id = Gas.Gas_Jugador
	WHERE (pnEquipo IS NULL OR Equ.Equ_Id = pnEquipo)
  	  AND (pnLiga IS NULL OR Lig.Lig_Id = pnLiga)
  	  AND (pnJugador IS NULL OR Jug.Jug_Id = pnJugador)
	ORDER BY Equ.Equ_Nombre, Lig.Lig_Nombre, Jug.Jug_Nombre, Gas_FechaAlta;
END$$

DROP PROCEDURE IF EXISTS `Prc_Usuario_Correcto`$$
CREATE PROCEDURE `Prc_Usuario_Correcto`(IN psUsuario VARCHAR(50),
                                       IN psPassword VARCHAR(50))
BEGIN
/*
	Autor: OPG
    Fecha: 12/11/2015
    Descripcion: Se comprueba si el usuario existe con los datos indicados. Si
       	         existe, se devuelve el Id; si no, se devuelve 0
        
*/
	-- Definicion de variables
    DECLARE lnId BIGINT(20);
        
    SELECT Usu_Id INTO lnId 
    FROM Usuario 
    WHERE Usu_Usuario = psUsuario
	  AND Usu_Password = AES_ENCRYPT(psPassword, Fnc_PasswordPalabra() + psUsuario);
        
	IF lnId IS NULL THEN
		SET lnId = 0;  
	END IF;
        
    SELECT lnId AS Result;
END$$

DROP PROCEDURE IF EXISTS `Prc_Usuario_Existente`$$
CREATE PROCEDURE `Prc_Usuario_Existente`(IN psUsuario VARCHAR(50))
BEGIN
/*
	Autor: OPG
    Fecha: 02/03/2016
    Descripcion: Se devuelve el identificador de usuario si se
			     encuentra alguno coincidente con el indicado
        
*/
	-- Definicion de variables
    DECLARE lnId BIGINT(20);
        
    SELECT Usu_Id INTO lnId 
    FROM Usuario 
    WHERE Usu_Usuario = psUsuario;
        
	IF lnId IS NULL THEN
		SET lnId = 0;  
	END IF;
        
    SELECT lnId AS Result;
END$$

DROP PROCEDURE IF EXISTS `Prc_Usuario_Listar`$$
CREATE PROCEDURE `Prc_Usuario_Listar`(IN pnUsuario BIGINT(20),
				    IN pnEquipo BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 22/02/2016
        Descripcion: Se devuelven todos los usuario del equipo indicado
*/
	-- Definicion de variables

	-- El usuario ha de ser administrador del equipo
	SELECT Usu.Usu_Id, Usu.Usu_Usuario, Usu.Usu_Alias
	FROM Usuario Usu
	INNER JOIN EquipoUsuario EquUsu ON EquUsu.EquUsu_Usuario = Usu.Usu_Id
	WHERE EquUsu.EquUsu_Equipo = pnEquipo
      AND EXISTS(SELECT EquUsu_Id 
		         FROM EquipoUsuario 
		         WHERE EquUsu_Usuario = pnUsuario
		           AND EquUsu_Equipo = EquUsu.EquUsu_Equipo)
	ORDER BY Usu.Usu_Usuario;
END$$

DROP PROCEDURE IF EXISTS Prc_Usuario_ObtenerBasico$$
CREATE PROCEDURE Prc_Usuario_ObtenerBasico(
    IN pnId BIGINT(20))
BEGIN
/*
    Autor: OPG
    Fecha: 27/06/2016
    Descripcion: Se devuelven los datos del usuario indicado
*/
	SELECT Usu.Usu_Id, Usu.Usu_Alias, Usu.Usu_Usuario
	FROM Usuario Usu
	WHERE Usu.Usu_Id = pnId;
END$$

DROP PROCEDURE IF EXISTS `Prc_Usuario_Obtener`$$
CREATE PROCEDURE `Prc_Usuario_Obtener`(
	IN pnId BIGINT(20),
 	IN pnUsuario BIGINT(20),
	IN pnEquipo BIGINT(20))
BEGIN
/*
	Autor: OPG
    Fecha: 22/02/2016
    Descripcion: Se devuelven los datos del usuario indicado
*/
	-- Definicion de variables

	SELECT Usu.Usu_Id, Usu.Usu_Alias, Usu.Usu_Usuario, EquUsu.EquUsu_Administrador
	FROM Usuario Usu
	INNER JOIN EquipoUsuario EquUsu ON EquUsu.EquUsu_Usuario = Usu.Usu_Id
	WHERE Usu.Usu_Id = pnId
	  AND EquUsu.EquUsu_Equipo = pnEquipo
          AND EXISTS(SELECT EquUsu_Id 
		     FROM EquipoUsuario 
		     WHERE EquUsu_Usuario = pnUsuario
		       AND EquUsu_Equipo = EquUsu.EquUsu_Equipo);
END$$

DROP PROCEDURE IF EXISTS `Prc_Gasto_Modificar`$$
CREATE PROCEDURE `Prc_Gasto_Modificar`(IN pnId BIGINT(20),
				     IN pnUsuario BIGINT(20),
    				     IN pnEquipo BIGINT(20),
				     IN pnLiga BIGINT(20),
				     IN pnJugador BIGINT(20),
				     IN psConcepto VARCHAR(255),
				     IN pnImporte DECIMAL(10, 2),
				     IN pbActivo TINYINT(1))
BEGIN
/*
	Autor: OPG
        Fecha: 30/11/2015
        Descripcion: Se modifica el gasto indicado
*/
	-- Definicion de variables

	-- El usuario ha de ser administrador del equipo
	IF NOT EXISTS(SELECT EquUsu_Id 
		      FROM EquipoUsuario 
		      WHERE EquUsu_Usuario = pnUsuario
		        AND EquUsu_Equipo = pnEquipo
  		        AND EquUsu_Administrador = TRUE) THEN
		CALL raise (55, 'No tiene los privilegios para modificar gasto de este equipo');
	ELSE
		-- Se modifica el registro
		UPDATE Gasto SET
			Gas_Equipo = pnEquipo,
			Gas_Liga = pnLiga,
			Gas_Jugador = pnJugador,
			Gas_Concepto = psConcepto, 
		        Gas_Importe = pnImporte,
			Gas_FechaModificacion = NOW(), 
			Gas_FechaBaja = CASE WHEN pbActivo = TRUE THEN NULL ELSE CASE WHEN Gas_Activo = pbActivo THEN Gas_FechaBaja ELSE NOW() END END, 
			Gas_Activo = pbActivo
		WHERE Gas_id = pnId;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Gasto_Obtener`$$
CREATE PROCEDURE `Prc_Gasto_Obtener`(IN pnId BIGINT(20),
 				   IN pnUsuario BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 19/11/2015
        Descripcion: Se devuelven los datos de la liga indicada
*/
	-- Definicion de variables

	SELECT Gas.Gas_Id, Gas.Gas_Concepto, Gas.Gas_Importe, Gas_FechaAlta, Gas_FechaModificacion, Gas_FechaBaja, Gas_Activo,
	       Equ.Equ_Id, Equ.Equ_Nombre, 
	       Lig.Lig_Id, Lig.Lig_Nombre, 
	       Jug.Jug_Id, Jug.Jug_Nombre
	FROM Gasto Gas
	INNER JOIN Equipo Equ ON Equ.Equ_Id = Gas.Gas_Equipo
	LEFT JOIN Liga Lig ON Lig.Lig_Id = Gas.Gas_Liga
	LEFT JOIN Jugador Jug ON Jug.Jug_Id = Gas.Gas_Jugador
	WHERE Gas.Gas_Id = pnId
          AND EXISTS(SELECT EquUsu_Id 
		     FROM EquipoUsuario 
		     WHERE EquUsu_Usuario = pnUsuario
		       AND EquUsu_Equipo = Equ.Equ_Id);
END$$

DROP PROCEDURE IF EXISTS `Prc_Ingreso_Eliminar`$$
CREATE PROCEDURE `Prc_Ingreso_Eliminar`(IN pnId BIGINT(20),
				      IN pnUsuario BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 02/12/2015
        Descripcion: Se elimina el Ingreso indicado
*/
	-- Definicion de variables
	DECLARE lnEquipo BIGINT(20);

	SET lnEquipo = (SELECT Ing_Equipo FROM Ingreso WHERE Ing_Id = pnId);

	-- El usuario ha de ser administrador del equipo
	IF NOT EXISTS(SELECT EquUsu_Id 
		      FROM EquipoUsuario 
		      WHERE EquUsu_Usuario = pnUsuario
		        AND EquUsu_Equipo = lnEquipo
  		        AND EquUsu_Administrador = TRUE) THEN
		CALL raise (55, 'No tiene los privilegios para eliminar Ingreso de este equipo');
	ELSE
		-- Se elimina el registro
		DELETE FROM Ingreso WHERE Ing_Id = pnId;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Ingreso_Insertar`$$
CREATE PROCEDURE `Prc_Ingreso_Insertar`(IN pnUsuario BIGINT(20),
  				      IN pnEquipo BIGINT(20),
				      IN pnLiga BIGINT(20),
				      IN pnJugador BIGINT(20),
				      IN psConcepto VARCHAR(255),
				      IN pnImporte DECIMAL(10, 2))
BEGIN
/*
	Autor: OPG
        Fecha: 02/12/2015
        Descripcion: Se crea un nuevo Ingreso
*/
	-- Definicion de variables
	DECLARE lnId BIGINT(20);
	DECLARE lsError VARCHAR(255);

	DECLARE exit handler for sqlexception
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);
	END;

	DECLARE exit handler for sqlwarning
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);
	END;

	START TRANSACTION;
        
	-- Se añade el registro
	INSERT INTO Ingreso
		(Ing_Equipo, Ing_Liga, Ing_Jugador, Ing_Concepto, Ing_Importe, Ing_FechaAlta, Ing_FechaModificacion, Ing_FechaBaja, Ing_Activo)
		VALUES
		(pnEquipo, pnLiga, pnJugador, psConcepto, pnImporte, NOW(), NULL, NULL, TRUE);
	
	-- Se devuelve el identificador de registro
        SET lnId = last_insert_id();
	SELECT lnId AS Id;
END$$

DROP PROCEDURE IF EXISTS `Prc_Ingreso_Listar`$$
CREATE PROCEDURE `Prc_Ingreso_Listar`(IN pnUsuario BIGINT(20),
  				    IN pnEquipo BIGINT(20),
				    IN pnLiga BIGINT(20),
				    IN pnJugador BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 02/12/2015
        Descripcion: Se devuelven los Ingresos coincidentes con los filtros indicados
*/
	-- Definicion de variables
	SELECT Ing.Ing_Id, Ing.Ing_Concepto, Ing.Ing_Importe, Ing_FechaAlta, Ing_FechaModificacion, Ing_FechaBaja, Ing_Activo,
	       Equ.Equ_Id, Equ.Equ_Nombre, 
	       Lig.Lig_Id, Lig.Lig_Nombre, 
	       Jug.Jug_Id, Jug.Jug_Nombre, Jug_Apellido1, Jug_Apellido2
	FROM Ingreso Ing
	INNER JOIN Equipo Equ ON Equ.Equ_Id = Ing.Ing_Equipo
	LEFT JOIN Liga Lig ON Lig.Lig_Id = Ing.Ing_Liga
	LEFT JOIN Jugador Jug ON Jug.Jug_Id = Ing.Ing_Jugador
	WHERE (pnEquipo IS NULL OR Equ.Equ_Id = pnEquipo)
  	  AND (pnLiga IS NULL OR Lig.Lig_Id = pnLiga)
  	  AND (pnJugador IS NULL OR Jug.Jug_Id = pnJugador)
	ORDER BY Equ.Equ_Nombre, Lig.Lig_Nombre, Jug.Jug_Nombre, Ing_FechaAlta;
END$$

DROP PROCEDURE IF EXISTS `Prc_Usuario_ObtenerPassword`$$
CREATE PROCEDURE `Prc_Usuario_ObtenerPassword`(IN psUsuario VARCHAR(50))
BEGIN
/*
	Autor: OPG
	Fecha: 16/03/2016
	Descripcion: Se devuelven la contraseña del usuario indicado
*/
	-- Definicion de variables

	SELECT AES_DECRYPT(Usu_Password, Fnc_PasswordPalabra() + Usu_Usuario) AS Password
	FROM Usuario Usu
	WHERE Usu.Usu_Usuario = psUsuario;
END$$

DROP PROCEDURE IF EXISTS `raise`$$
CREATE PROCEDURE `raise`(`errno` BIGINT UNSIGNED, `message` VARCHAR(256))
BEGIN
SIGNAL SQLSTATE
    'ERR0R'
SET
    MESSAGE_TEXT = `message`,
    MYSQL_ERRNO = `errno`;
END$$

DROP PROCEDURE IF EXISTS `Prc_Ingreso_Modificar`$$
CREATE PROCEDURE `Prc_Ingreso_Modificar`(IN pnId BIGINT(20),
				       IN pnUsuario BIGINT(20),
    				       IN pnEquipo BIGINT(20),
				       IN pnLiga BIGINT(20),
				       IN pnJugador BIGINT(20),
				       IN psConcepto VARCHAR(255),
				       IN pnImporte DECIMAL(10, 2),
				       IN pbActivo TINYINT(1))
BEGIN
/*
	Autor: OPG
        Fecha: 02/12/2015
        Descripcion: Se modifica el Ingreso indicado
*/
	-- Definicion de variables

	-- El usuario ha de ser administrador del equipo
	IF NOT EXISTS(SELECT EquUsu_Id 
		      FROM EquipoUsuario 
		      WHERE EquUsu_Usuario = pnUsuario
		        AND EquUsu_Equipo = pnEquipo
  		        AND EquUsu_Administrador = TRUE) THEN
		CALL raise (55, 'No tiene los privilegios para modificar Ingreso de este equipo');
	ELSE
		-- Se modifica el registro
		UPDATE Ingreso SET
			Ing_Equipo = pnEquipo,
			Ing_Liga = pnLiga,
			Ing_Jugador = pnJugador,
			Ing_Concepto = psConcepto, 
		        Ing_Importe = pnImporte,
			Ing_FechaModificacion = NOW(), 
			Ing_FechaBaja = CASE WHEN pbActivo = TRUE THEN NULL ELSE CASE WHEN Ing_Activo = pbActivo THEN Ing_FechaBaja ELSE NOW() END END, 
			Ing_Activo = pbActivo
		WHERE Ing_id = pnId;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Ingreso_Obtener`$$
CREATE PROCEDURE `Prc_Ingreso_Obtener`(IN pnId BIGINT(20),
 				     IN pnUsuario BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 19/11/2015
        Descripcion: Se devuelven los datos de la liga indicada
*/
	-- Definicion de variables

	SELECT Ing.Ing_Id, Ing.Ing_Concepto, Ing.Ing_Jugador, Ing.Ing_Importe, Ing_FechaAlta, Ing_FechaModificacion, Ing_FechaBaja, Ing_Activo,
	       Equ.Equ_Id, Equ.Equ_Nombre, 
	       Lig.Lig_Id, Lig.Lig_Nombre
	FROM Ingreso Ing
	INNER JOIN Equipo Equ ON Equ.Equ_Id = Ing.Ing_Equipo
	LEFT JOIN Liga Lig ON Lig.Lig_Id = Ing.Ing_Liga
	WHERE Ing.Ing_Id = pnId
          AND EXISTS(SELECT EquUsu_Id 
		     FROM EquipoUsuario 
		     WHERE EquUsu_Usuario = pnUsuario
		       AND EquUsu_Equipo = Equ.Equ_Id);
END$$

DROP PROCEDURE IF EXISTS `Prc_Invitacion_Aceptar`$$
CREATE PROCEDURE `Prc_Invitacion_Aceptar`(IN psUsuario VARCHAR(50),
										IN psAlias VARCHAR(50),
										IN psPassword VARCHAR(50),
										IN pnInvitacion BIGINT(20))
BEGIN
/*
	Autor: OPG
	Fecha: 09/03/2016
    Descripcion: Se acepta la invitacion indicada si no está caducada y coincide el usuario
*/
	-- Definicion de variables
    DECLARE lnEquipo BIGINT(20);
    DECLARE lsInvitadoEmail VARCHAR(50);
    DECLARE ldFecha DATETIME;
    DECLARE lbAdministrador TINYINT(1);
	DECLARE lnId BIGINT(20);
	DECLARE lsError VARCHAR(255);

	-- Control de error en caso de no encontrarse el Id indicado
	DECLARE CONTINUE HANDLER FOR 1329 CALL raise (55, 'No se ha encontrado la invitación indicada.');
    
    DECLARE exit handler for sqlexception
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);
		ROLLBACK;
	END;

	DECLARE CONTINUE handler for sqlwarning 
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
	START TRANSACTION;
    
    -- Se buscan los datos de la invitacion
    SELECT Inv_InvitadoEmail, Inv_Fecha, Inv_InvitadoEquipo, Inv_InvitadoAdministrador INTO lsInvitadoEmail, ldFecha, lnEquipo, lbAdministrador
    FROM Invitacion 
    WHERE Inv_Id = pnInvitacion;

	-- Comprovacaciones
	IF lsInvitadoEmail <> psUsuario THEN
		CALL raise (55, 'El usuario indicado no coincide con el de la invitación.');
	ELSEIF DATEDIFF(NOW(), ldFecha) > 30 THEN
		-- Se elimina la invitacion
        DELETE FROM Invitacion
        WHERE Inv_Id = pnInvitacion;
        
		CALL raise (55, 'La invitación ha caducado.');
    ELSE
		-- Se añade el registro de usuario
        IF EXISTS(SELECT Usu_Id
			      FROM Usuario 
                  WHERE Usu_Usuario = psUsuario) THEN
			CALL raise (55, 'Ya existe un usuario con esa misma dirección de correo electrónico.');
        ELSE
			-- Se crea el nuevo registro
	    	INSERT INTO Usuario 
				(Usu_Usuario, Usu_Alias, Usu_Password) 
			VALUES
		        (psUsuario, psAlias, Fnc_Usuario_Password_Codificar(psUsuario, psPassword));	
			SET lnId = last_insert_id();
		END IF;
        
        -- Se añade la relacion con el equipo
        INSERT INTO EquipoUsuario 
			(EquUsu_Equipo, EquUsu_usuario, EquUsu_Administrador)
		VALUES
			(lnEquipo, lnId, lbAdministrador);
	
		-- Se elimina la invitacion
        DELETE FROM Invitacion
        WHERE Inv_Id = pnInvitacion;

		COMMIT;

		SELECT lnId AS Id;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Invitacion_Insertar`$$
CREATE PROCEDURE `Prc_Invitacion_Insertar`(IN pnUsuarioInvitador BIGINT(20),
										 IN psInvitadoEmail VARCHAR(50),
                                         IN pbInvitadoAdministrador TINYINT(1),
										 IN pnInvitadoEquipo BIGINT(20))
BEGIN
/*
	Autor: OPG
	Fecha: 02/03/2016
    Descripcion: Se crea la invitacion indicada
*/
	-- Definicion de variables
	DECLARE lnId BIGINT(20);
	DECLARE lsError VARCHAR(255);

	DECLARE exit handler for sqlexception
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);
		ROLLBACK;
	END;

	DECLARE exit handler for sqlwarning
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);
		ROLLBACK;
	END;

	START TRANSACTION;

	-- El usuario ha de ser administrador del equipo
	IF NOT EXISTS(SELECT EquUsu_Id 
                  FROM EquipoUsuario 
                  WHERE EquUsu_Usuario = pnUsuarioInvitador
		            AND EquUsu_Equipo = pnInvitadoEquipo
  		            AND EquUsu_Administrador = TRUE) THEN
		CALL raise (55, 'No tiene los privilegios para invitar en este equipo');
	ELSE
		-- Se elimina el posible registro para una misma invitacion
        DELETE FROM Invitacion
        WHERE Inv_InvitadoEmail = psInvitadoEmail;
        
		-- Se añade el registro
        INSERT INTO Invitacion
            (Inv_UsuarioInvitador, Inv_InvitadoEmail, Inv_InvitadoAdministrador, Inv_InvitadoEquipo, Inv_Fecha) 
            VALUES 
            (pnUsuarioInvitador, psInvitadoEmail, pbInvitadoAdministrador, pnInvitadoEquipo, NOW());

		-- Se devuelve el identificador de registro
		SET lnId = last_insert_id();

		COMMIT;

		SELECT lnId AS Id;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Jugador_Eliminar`$$
CREATE PROCEDURE `Prc_Jugador_Eliminar`(IN pnJugador BIGINT(20),
				      IN pnUsuario BIGINT(20),
				      IN pnEquipo BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 18/11/2015
        Descripcion: Se pasa a inactivo el jugador indicado
*/
	-- Definicion de variables

	-- El usuario ha de ser administrador del equipo
	IF NOT EXISTS(SELECT EquUsu_Id 
		      FROM Jugador Jug
		      INNER JOIN EquipoUsuario ON Jug.Jug_Equipo = EquUsu_Equipo
		      WHERE Jug.Jug_Id = pnJugador
                        AND EquUsu_Usuario = pnUsuario
		        AND EquUsu_Equipo = pnEquipo
  		        AND EquUsu_Administrador = TRUE) THEN
		CALL raise (55, 'No tiene los privilegios para eliminar jugadores del equipo');
	ELSE
		-- Se modifica el registro
		UPDATE Jugador SET
			Jug_FechaModificacion = NOW(), 
			Jug_FechaBaja = NOW(), 
			Jug_Activo = FALSE
		WHERE Jug_Id = pnJugador;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Jugador_Insertar`$$
CREATE PROCEDURE `Prc_Jugador_Insertar`(IN pnUsuario BIGINT(20),
                                      IN pnEquipo BIGINT(20),
				      IN psNombre VARCHAR(50),
				      IN psApellido1 VARCHAR(50),
				      IN psApellido2 VARCHAR(50),
				      IN psEmail VARCHAR(50))
BEGIN
/*
	Autor: OPG
        Fecha: 17/11/2015
        Descripcion: Se añade el nuevo jugador al equipo indicado
*/
	-- Definicion de variables
	DECLARE lnId BIGINT(20);

	DECLARE exit handler for sqlexception
	BEGIN
		CALL raise (55, 'Se ha producido un error al añadir jugador');
		ROLLBACK;
	END;

	DECLARE exit handler for sqlwarning
	BEGIN
		CALL raise (55, 'Se ha producido un error al añadir jugador');
		ROLLBACK;
	END;

	START TRANSACTION;
        
	-- Se añade el registro
	INSERT INTO Jugador 
		(Jug_Equipo, Jug_Nombre, Jug_Apellido1, Jug_Apellido2, Jug_Email, Jug_FechaAlta, Jug_FechaModificacion, Jug_FechaBaja, Jug_Activo)
		VALUES
		(pnEquipo, psNombre, psApellido1, psApellido2, psEmail, NOW(), NULL, NULL, TRUE);
	
	-- Se devuelve el identificador de registro
        SET lnId = last_insert_id();

	COMMIT;

	SELECT lnId AS Id;
END$$

DROP PROCEDURE IF EXISTS `Prc_Jugador_Liga_Actualizar`$$
CREATE PROCEDURE `Prc_Jugador_Liga_Actualizar`(IN pnUsuario BIGINT(20),
				             IN pnLiga BIGINT(20),
				             IN pnJugador BIGINT(20),
                                             IN pbAdd tinyint(1))
BEGIN
/*
	Autor: OPG
        Fecha: 27/11/2015
        Descripcion: Se añade o elimina la relacion del jugador con la liga
*/
	-- Definicion de variables

	
	-- El usuario ha de ser administrador del equipo de la liga
	IF NOT EXISTS(SELECT EquUsu_Id 
		      FROM Liga Lig
		      INNER JOIN EquipoUsuario ON Lig.Lig_Equipo = EquUsu_Equipo
		      WHERE Lig.Lig_Id = pnLiga
                        AND EquUsu_Usuario = pnUsuario
  		        AND EquUsu_Administrador = TRUE) THEN
		CALL raise (55, 'No tiene los privilegios para gestionar jugadores del equipo de la Liga.');
	ELSE
		-- Se actualiza el registro
		IF pbAdd = 1 THEN
			-- Nueva relacion
			INSERT INTO JugadorLiga (JugLig_Jugador, JugLig_Liga)
				VALUES
				(pnJugador, pnLiga);
		ELSE
			-- Se elimina relacion
			DELETE FROM JugadorLiga
			WHERE JugLig_Jugador = pnJugador
			  AND JugLig_Liga = pnLiga;
		END IF;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Jugador_Listar`$$
CREATE PROCEDURE `Prc_Jugador_Listar`(IN pnUsuario BIGINT(20),
				    IN pnEquipo BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 17/11/2015
        Descripcion: Se devuelven todos los jugadores activos del usuario y equipo actual
*/
	-- Definicion de variables

	-- El usuario ha de ser administrador del equipo
	SELECT Jug.Jug_Id, Jug.Jug_Nombre, Jug.Jug_Apellido1, Jug.Jug_Apellido2, Jug.Jug_Email
	FROM Jugador Jug
	WHERE Jug.Jug_Equipo = pnEquipo
          AND Jug.Jug_Activo = TRUE
          AND EXISTS(SELECT EquUsu_Id 
		     FROM EquipoUsuario 
		     WHERE EquUsu_Usuario = pnUsuario
		       AND EquUsu_Equipo = Jug.Jug_Equipo)
	ORDER BY Jug.Jug_Nombre, Jug.Jug_Apellido1, Jug.Jug_Apellido2;
END$$

DROP PROCEDURE IF EXISTS `Prc_Jugador_ListarPorLiga`$$
CREATE PROCEDURE `Prc_Jugador_ListarPorLiga`(IN pnUsuario BIGINT(20),
				           IN pnLiga BIGINT(20),
                                           IN pbNoASignados tinyint(1))
BEGIN
/*
	Autor: OPG
        Fecha: 20/11/2015
        Descripcion: Se devuelven todos los jugadores activos de la liga indicada
*/
	-- Definicion de variables
	DECLARE lnEquipo BIGINT(20);

	IF (pbNoAsignados = 1 OR pbNoAsignados = TRUE) THEN
		-- Se obtiene el identificador de equipo de la liga
		SET lnEquipo = (SELECT Lig_Equipo FROM Liga WHERE Lig_Id = pnLiga);

	        -- Todos los jugadores del equipo indicando si están en la liga.
		SELECT Jug.Jug_Id, Jug.Jug_Nombre, Jug.Jug_Apellido1, Jug.Jug_Apellido2, Jug.Jug_Email,
		       		       Fnc_Jugador_Liga_Gastos(pnLiga, Jug.Jug_Id) AS Coste,
		       Fnc_Jugador_Liga_Ingresos(pnLiga, Jug.Jug_Id) AS Pagado,
		       CASE WHEN JugLig.JugLig_Id IS NULL THEN FALSE ELSE TRUE END AS EstaEnLiga
		FROM Jugador Jug
		LEFT JOIN JugadorLiga JugLig ON JugLig.JugLig_Jugador = Jug.Jug_Id
		                            AND JugLig.JugLig_Liga = pnLiga
		WHERE Jug.Jug_Activo = TRUE
		  AND Jug.Jug_Equipo = lnEquipo
		  -- El usuario ha de ser administrador del equipo
		  AND EXISTS(SELECT EquUsu_Id 
			     FROM EquipoUsuario 
			     WHERE EquUsu_Usuario = pnUsuario
			       AND EquUsu_Equipo = Jug.Jug_Equipo)
		ORDER BY Jug.Jug_Nombre, Jug.Jug_Apellido1, Jug.Jug_Apellido2;
	ELSE
	        -- Los jugadores asignados a la liga
		SELECT Jug.Jug_Id, Jug.Jug_Nombre, Jug.Jug_Apellido1, Jug.Jug_Apellido2, Jug.Jug_Email, 
		       Fnc_Jugador_Liga_Gastos(pnLiga, Jug.Jug_Id) AS Coste,
		       Fnc_Jugador_Liga_Ingresos(pnLiga, Jug.Jug_Id) AS Pagado
		FROM Jugador Jug
		INNER JOIN JugadorLiga JugLig ON JugLig.JugLig_Jugador = Jug.Jug_Id
					     AND JugLig.JugLig_Liga = pnLiga
		WHERE Jug.Jug_Activo = TRUE
		  -- El usuario ha de ser administrador del equipo
		  AND EXISTS(SELECT EquUsu_Id 
			     FROM EquipoUsuario 
			     WHERE EquUsu_Usuario = pnUsuario
			       AND EquUsu_Equipo = Jug.Jug_Equipo)
		ORDER BY Jug.Jug_Nombre, Jug.Jug_Apellido1, Jug.Jug_Apellido2;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Jugador_Modificar`$$
CREATE PROCEDURE `Prc_Jugador_Modificar`(IN pnJugador BIGINT(20),
                                       IN pnUsuario BIGINT(20),
                                       IN pnEquipo BIGINT(20),
									   IN psNombre VARCHAR(50),
                                       IN psApellido1 VARCHAR(50),
                                       IN psApellido2 VARCHAR(50),
                                       IN psEmail VARCHAR(50))
BEGIN
/*
	Autor: OPG
	Fecha: 18/11/2015
    Descripcion: Se modifica el jugador indicado
*/
	-- Definicion de variables
	DECLARE pbActivo BOOLEAN;
	SET pbActivo = true;

	-- El usuario ha de ser administrador del equipo
	IF NOT EXISTS(SELECT EquUsu_Id 
				  FROM Jugador Jug
				  INNER JOIN EquipoUsuario ON Jug.Jug_Equipo = EquUsu_Equipo
                  INNER JOIN Usuario Usu ON Usu.Usu_Id = EquUsu_Usuario
		          WHERE Jug.Jug_Id = pnJugador
				    AND EquUsu_Usuario = pnUsuario
		            AND EquUsu_Equipo = pnEquipo
  		            AND (EquUsu_Administrador = TRUE
					  OR Jug.Jug_Email = Usu.Usu_Usuario)) THEN
		CALL raise (55, 'No tiene los privilegios para modificar los jugadores del equipo');
	ELSE
		-- Se modifica el registro
		UPDATE Jugador SET
			Jug_Nombre = psNombre,
			Jug_Apellido1 = psApellido1,
			Jug_Apellido2 = psApellido2, 
			Jug_Email = psEmail,  
			Jug_FechaModificacion = NOW(), 
			Jug_FechaBaja = CASE WHEN pbActivo = TRUE THEN NULL ELSE CASE WHEN Jug_Activo = pbActivo THEN Jug_FechaBaja ELSE NOW() END END, 
			Jug_Activo = pbActivo
		WHERE Jug_Id = pnJugador;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Liga_Balance_Listar`$$
CREATE PROCEDURE `Prc_Liga_Balance_Listar`(IN pnLiga BIGINT(20),
				         IN pnUsuario BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 05/12/2015
        Descripcion: Se devuelven ingresos y gastos de la liga indicada
*/
	-- Definicion de variables

	SELECT *
	FROM (
		SELECT 'G' AS Tipo, Gas.Gas_Id AS Id, Gas.Gas_Concepto AS Concepto, Gas.Gas_Importe AS Importe, Jug.Jug_Nombre, Jug.Jug_Apellido1, Jug.Jug_Apellido2
		FROM Gasto Gas
		LEFT JOIN Jugador Jug ON Jug.Jug_Id = Gas.Gas_Jugador
		WHERE Gas.Gas_Liga = pnLiga
		  AND EXISTS(SELECT EquUsu_Id 
		      FROM EquipoUsuario 
		      WHERE EquUsu_Usuario = pnUsuario
		        AND EquUsu_Equipo = Gas.Gas_Equipo)
		UNION
		SELECT 'I' AS Tipo, Ing.Ing_Id AS Id, Ing.Ing_Concepto AS Concepto, Ing.Ing_Importe AS Importe, Jug.Jug_Nombre, Jug.Jug_Apellido1, Jug.Jug_Apellido2
		FROM Ingreso Ing
		LEFT JOIN Jugador Jug ON Jug.Jug_Id = Ing.Ing_Jugador
		WHERE Ing.Ing_Liga = pnLiga
		  AND EXISTS(SELECT EquUsu_Id 
		      FROM EquipoUsuario 
		      WHERE EquUsu_Usuario = pnUsuario
		        AND EquUsu_Equipo = Ing.Ing_Equipo)
	) Balance
	ORDER BY Balance.Tipo, Balance.Concepto, Balance.Jug_Nombre, Balance.Jug_Apellido1;
END$$

DROP PROCEDURE IF EXISTS `Prc_Liga_Eliminar`$$
CREATE PROCEDURE `Prc_Liga_Eliminar`(IN pnLiga BIGINT(20),
				   IN pnUsuario BIGINT(20),
				   IN pnEquipo BIGINT(20))
BEGIN
/*
	Autor: OPG
        Fecha: 19/11/2015
        Descripcion: Se pasa a inactiva la Liga indicada
*/
	-- Definicion de variables

	-- El usuario ha de ser administrador del equipo
	IF NOT EXISTS(SELECT EquUsu_Id 
		      FROM Liga Lig
		      INNER JOIN EquipoUsuario ON Lig.Lig_Equipo = EquUsu_Equipo
		      WHERE Lig.Lig_Id = pnLiga
                        AND EquUsu_Usuario = pnUsuario
		        AND EquUsu_Equipo = pnEquipo
  		        AND EquUsu_Administrador = TRUE) THEN
		CALL raise (55, 'No tiene los privilegios para eliminar Ligas del equipo');
	ELSE
		-- Se modifica el registro
		UPDATE Liga SET
		       Lig_FechaModificacion = NOW(), 
		       Lig_FechaBaja = NOW(), 
		       Lig_Activo = FALSE
		WHERE Lig_Id = pnLiga;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Liga_Insertar`$$
CREATE PROCEDURE `Prc_Liga_Insertar`(IN pnUsuario BIGINT(20),
                                   IN pnEquipo BIGINT(20),
                                   IN psNombre VARCHAR(50),
                                   IN psDescripcion VARCHAR(255))
BEGIN
/*
	Autor: OPG
    Fecha: 19/11/2015
    Descripcion: Se añade nueva liga al equipo indicado
*/
	-- Definicion de variables
	DECLARE lnId BIGINT(20);
	DECLARE lsError VARCHAR(255);

	DECLARE exit handler for sqlexception
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);
	END;

	DECLARE exit handler for sqlwarning
	BEGIN
		GET DIAGNOSTICS CONDITION 1 lsError = MESSAGE_TEXT;
		CALL raise (55, lsError);
	END;

	START TRANSACTION;
        
	-- Se añade el registro
	INSERT INTO Liga 
		(Lig_Equipo, Lig_Nombre, Lig_Descripcion, Lig_FechaAlta, Lig_FechaModificacion, Lig_FechaBaja, Lig_Activo)
		VALUES
		(pnEquipo, psNombre, CASE LENGTH(psDescripcion) WHEN 0 THEN NULL ELSE psDescripcion END, NOW(), NULL, NULL, TRUE);
	
	-- Se devuelve el identificador de registro
        SET lnId = last_insert_id();

	COMMIT;

	SELECT lnId AS Id;
END$$

DROP PROCEDURE IF EXISTS `Prc_Liga_Modificar`$$
CREATE PROCEDURE `Prc_Liga_Modificar`(IN pnLiga BIGINT(20),
			            IN pnUsuario BIGINT(20),
				    IN pnEquipo BIGINT(20),
				    IN psNombre VARCHAR(50),
				    IN psDescripcion VARCHAR(20))
BEGIN
/*
	Autor: OPG
        Fecha: 19/11/2015
        Descripcion: Se modifica el Liga indicado
*/
	-- Definicion de variables
	DECLARE pbActivo BOOLEAN;
	SET pbActivo = true;

	-- El usuario ha de ser administrador del equipo
	IF NOT EXISTS(SELECT EquUsu_Id 
		      FROM Liga Lig
		      INNER JOIN EquipoUsuario ON Lig.Lig_Equipo = EquUsu_Equipo
		      WHERE Lig.Lig_Id = pnLiga
                        AND EquUsu_Usuario = pnUsuario
		        AND EquUsu_Equipo = pnEquipo
  		        AND EquUsu_Administrador = TRUE) THEN
		CALL raise (55, 'No tiene los privilegios para modificar las ligas del equipo');
	ELSE
		-- Se modifica el registro
		UPDATE Liga SET
			Lig_Nombre = psNombre,
			Lig_Descripcion = CASE LENGTH(psDescripcion) WHEN 0 THEN NULL ELSE psDescripcion END,
			Lig_FechaModificacion = NOW(), 
			Lig_FechaBaja = CASE WHEN pbActivo = TRUE THEN NULL ELSE CASE WHEN Lig_Activo = pbActivo THEN Lig_FechaBaja ELSE NOW() END END, 
			Lig_Activo = pbActivo
		WHERE Lig_Id = pnLiga;
	END IF;
END$$

DROP PROCEDURE IF EXISTS `Prc_Usuario_Existe`$$
CREATE PROCEDURE `Prc_Usuario_Existe`(IN psUsuario VARCHAR(50),
				     IN psPassword VARCHAR(50))
BEGIN
/*
	Autor: OPG
        Fecha: 12/11/2015
        Descripcion: Se comprueba si el usuario existe con los datos indicados. Si
        	     existe, se devuelve el Id; si no, se devuelve 0
        
*/
	-- Definicion de variables
        DECLARE lsSeguridad VARCHAR(5);
        DECLARE lnId BIGINT(20);
        
	-- Se recupera el posible Id del usuario
        SET lsSeguridad = 'Team5';
        
        SELECT Usu_Id INTO lnId 
        FROM Usuario 
        WHERE Usu_Usuario = psUsuario
          AND Usu_Password = AES_ENCRYPT(psPassword, lsSeguridad + psUsuario)
        LIMIT 1;
        
	IF lnId IS NULL THEN
        	SET lnId = 0;  
        END IF;
        
        SELECT lnId AS Result;
END$$

DROP PROCEDURE IF EXISTS `Prc_Usuario_Insertar`$$
CREATE PROCEDURE `Prc_Usuario_Insertar`(IN pnUsuario BIGINT(20),
									    IN psUsuario VARCHAR(50),
										IN psAlias VARCHAR(50),
										IN psPassword VARCHAR(50))
BEGIN
/*
	Autor: OPG
	Fecha: 12/11/2015
    Descripcion: Si no existe ningun usuario con el idenmtificador que se encuentra en psUsuario, se añade
        	     uno nuevo y se devuelve el identificador asignado.
        
*/
	-- Definicion de variables
	DECLARE lnId BIGINT(20);

	IF EXISTS(SELECT Usu_Id
			  FROM Usuario 
              WHERE Usu_Usuario = psUsuario) THEN
		CALL raise (55, 'Ya existe un usuario con esa misma dirección de correo electrónico.');
        ELSE
		-- Se crea el nuevo registro
	    	INSERT INTO Usuario 
				(Usu_Usuario, Usu_Alias, Usu_Password) 
			VALUES
		        (psUsuario, psAlias, Fnc_Usuario_Password_Codificar(psUsuario, psPassword));	
		SET lnId = last_insert_id();

		SELECT lnId AS Result;
	END IF;
END$$

--
-- Funciones
--
DROP FUNCTION IF EXISTS `Fnc_Jugador_Liga_Gastos`$$
CREATE DEFINER=`u938118667_admin`@`localhost` FUNCTION `Fnc_Jugador_Liga_Gastos`(pnLiga BIGINT(20), pnJugador BIGINT(20)) RETURNS decimal(10,2)
BEGIN
/*
	Autor: OPG
        Fecha: 24/02/2016
        Descripcion: Se devuelve la suma de gastos para el jugador y liga indicados
*/
	DECLARE lnResultado DECIMAL (10, 2);
	DECLARE lnJugadores BIGINT(20);

	-- Numero de juagdores asignados a la liga
	SET lnJugadores = (SELECT COUNT(*) FROM JugadorLiga WHERE JugLig_Liga = pnLiga);	

	SET lnResultado = (SELECT SUM(CASE WHEN Gas_Jugador IS NULL THEN Gas_Importe/lnJugadores ELSE Gas_Importe END)
			   FROM Gasto
			   WHERE Gas_Liga = pnLiga
			     AND (Gas_Jugador IS NULL OR Gas_Jugador = pnJugador)
			     AND Gas_Activo = TRUE);

	RETURN lnResultado;
END$$

DROP FUNCTION IF EXISTS `Fnc_Jugador_Liga_Ingresos`$$
CREATE DEFINER=`u938118667_admin`@`localhost` FUNCTION `Fnc_Jugador_Liga_Ingresos`(pnLiga BIGINT(20), pnJugador BIGINT(20)) RETURNS decimal(10,2)
BEGIN
/*
	Autor: OPG
        Fecha: 24/02/2016
        Descripcion: Se devuelve la suma de ingresos para el jugador y liga indicados
*/
	DECLARE lnResultado DECIMAL (10, 2);
	DECLARE lnJugadores BIGINT(20);

	-- Numero de juagdores asignados a la liga
	SET lnJugadores = (SELECT COUNT(*) FROM JugadorLiga WHERE JugLig_Liga = pnLiga);	

	SET lnResultado = (SELECT SUM(CASE WHEN Ing_Jugador IS NULL THEN Ing_Importe/lnJugadores ELSE Ing_Importe END)
			   FROM Ingreso
			   WHERE Ing_Liga = pnLiga
			     AND (Ing_Jugador IS NULL OR Ing_Jugador = pnJugador)
			     AND Ing_Activo = TRUE);

	RETURN lnResultado;
END$$

DROP FUNCTION IF EXISTS `Fnc_PasswordPalabra`$$
CREATE DEFINER=`u938118667_admin`@`localhost` FUNCTION `Fnc_PasswordPalabra`() RETURNS varchar(255) CHARSET utf8 COLLATE utf8_unicode_ci
BEGIN
/*
	Autor: OPG
	Fecha: 16/03/2016
    Descripcion: Se devuelve la palabra de codificacion utilizada
*/
	RETURN 'Team5';
END$$

DROP FUNCTION IF EXISTS `Fnc_Usuario_Password_Codificar`$$
CREATE DEFINER=`u938118667_admin`@`localhost` FUNCTION `Fnc_Usuario_Password_Codificar`(psUsuario VARCHAR(50), psPassword VARCHAR(50)) RETURNS blob
BEGIN
/*
	Autor: OPG
	Fecha: 09/03/2016
    Descripcion: Se devuelve la codificacion de la contraseña indicada
*/
	RETURN AES_ENCRYPT(psPassword, Fnc_PasswordPalabra() + psUsuario);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla 'Documentacion'
--

DROP TABLE IF EXISTS Documentacion;
CREATE TABLE IF NOT EXISTS Documentacion (
  Doc_Id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  Doc_Nombre varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  Doc_Descripcion varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  Doc_Tipo bigint(20) NOT NULL,
  Doc_Valor decimal(10,2) DEFAULT NULL,
  Doc_Equipo bigint(20) NOT NULL,
  Doc_Liga bigint(20) DEFAULT NULL,
  Doc_Jugador bigint(20) DEFAULT NULL,
  Doc_FechaAlta datetime NOT NULL,
  Doc_FechaModificacion datetime DEFAULT NULL,
  Doc_FechaBaja datetime DEFAULT NULL,
  Doc_Activo tinyint(1) NOT NULL,
  PRIMARY KEY (Doc_Id)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=4 ;

--
-- Volcado de datos para la tabla 'Documentacion'
--

INSERT INTO Documentacion (Doc_Id, Doc_Nombre, Doc_Descripcion, Doc_Tipo, Doc_Valor, Doc_Equipo, Doc_Liga, Doc_Jugador, Doc_FechaAlta, Doc_FechaModificacion, Doc_FechaBaja, Doc_Activo) VALUES
(2, 'DOCUMENTO con valor', 'PRUEBA valor', 1, '500.55', 3, 2, NULL, '2015-12-11 05:25:57', NULL, NULL, 1),
(3, 'documento modificado', 'cambio', 1, '125.00', 3, 2, 2, '2015-12-15 15:34:38', '2015-12-20 08:23:18', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla 'DocumentacionTipo'
--

DROP TABLE IF EXISTS DocumentacionTipo;
CREATE TABLE IF NOT EXISTS DocumentacionTipo (
  DocTip_Id bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de tabla',
  DocTip_Nombre varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  DocTip_Descripcion varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  DocTip_ValorDocumento tinyint(1) NOT NULL,
  PRIMARY KEY (DocTip_Id),
  UNIQUE KEY DocTip_Nombre (DocTip_Nombre)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Volcado de datos para la tabla 'DocumentacionTipo'
--

INSERT INTO DocumentacionTipo (DocTip_Id, DocTip_Nombre, DocTip_Descripcion, DocTip_ValorDocumento) VALUES
(1, 'Justificante de pago', 'documento justificante de pago realizado. Puede ser pago individual o colectivo', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla 'Equipo'
--

DROP TABLE IF EXISTS Equipo;
CREATE TABLE IF NOT EXISTS Equipo (
  Equ_Id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  Equ_Nombre varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  Equ_Descripcion varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  Equ_FechaAlta datetime NOT NULL,
  Equ_FechaModificacion datetime DEFAULT NULL,
  Equ_FechaBaja datetime DEFAULT NULL,
  Equ_Activo tinyint(1) NOT NULL,
  PRIMARY KEY (Equ_Id)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=11 ;

--
-- Volcado de datos para la tabla 'Equipo'
--

INSERT INTO Equipo (Equ_Id, Equ_Nombre, Equ_Descripcion, Equ_FechaAlta, Equ_FechaModificacion, Equ_FechaBaja, Equ_Activo) VALUES
(1, 'wwCAMBIO', 'HA CAMBIADOww', '2015-11-16 06:26:00', '2016-01-19 09:35:49', '2016-01-19 09:35:49', 0),
(2, 'mas', 'sd lo que quieras', '2015-11-16 06:59:02', '2016-01-19 09:14:59', '2016-01-19 09:14:59', 0),
(3, 'NO VALEN KAKIS', 'Futbol 7 de puretillas', '2015-11-16 14:56:19', '2016-01-14 11:42:12', NULL, 1),
(4, 'más', 'pédro', '2015-11-16 14:56:32', '2016-01-18 18:14:58', '2016-01-18 18:14:58', 0),
(5, 'más', 'pédrosssss', '2015-11-16 18:48:02', '2016-01-18 18:13:50', '2016-01-18 18:13:50', 0),
(6, 'hola', 'adios', '2016-01-18 18:16:02', '2016-01-18 18:16:18', '2016-01-18 18:16:18', 0),
(7, 'pruebas', 'holaaaa', '2016-02-18 14:11:52', '2016-02-18 14:26:03', '2016-02-18 14:26:03', 0),
(8, 'PARA JUGAR', 'EQUIPO DE PRUEBAS. SE PUEDE HACER DE TOO', '2016-03-17 12:54:16', '2016-03-18 09:23:37', NULL, 1),
(9, 'PARA JUGAR', 'EQUIPO DE PRUEBAS. SE PUEDE HACER DE TOO', '2016-03-17 12:54:22', '2016-03-17 12:54:35', '2016-03-17 12:54:35', 0),
(10, 'Equipo dos', 'Prueba Su', '2016-03-18 09:27:24', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla 'EquipoUsuario'
--

DROP TABLE IF EXISTS EquipoUsuario;
CREATE TABLE IF NOT EXISTS EquipoUsuario (
  EquUsu_Id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  EquUsu_Equipo bigint(20) NOT NULL,
  EquUsu_Usuario bigint(20) NOT NULL,
  EquUsu_Administrador tinyint(1) NOT NULL,
  PRIMARY KEY (EquUsu_Id),
  UNIQUE KEY EquUsu_Equipo (EquUsu_Equipo,EquUsu_Usuario),
  KEY EquUsu_Usuario (EquUsu_Usuario)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=26 ;

--
-- Volcado de datos para la tabla 'EquipoUsuario'
--

INSERT INTO EquipoUsuario (EquUsu_Id, EquUsu_Equipo, EquUsu_Usuario, EquUsu_Administrador) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1),
(3, 3, 1, 1),
(4, 4, 1, 1),
(5, 5, 1, 1),
(6, 6, 1, 1),
(7, 7, 1, 1),
(18, 8, 1, 1),
(19, 3, 17, 1),
(23, 8, 17, 1),
(24, 10, 17, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla 'Gasto'
--

DROP TABLE IF EXISTS Gasto;
CREATE TABLE IF NOT EXISTS Gasto (
  Gas_Id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  Gas_Equipo bigint(20) NOT NULL,
  Gas_Liga bigint(20) DEFAULT NULL,
  Gas_Jugador bigint(20) DEFAULT NULL,
  Gas_Concepto varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  Gas_FechaAlta datetime NOT NULL,
  Gas_FechaModificacion datetime DEFAULT NULL,
  Gas_FechaBaja datetime DEFAULT NULL,
  Gas_Activo tinyint(1) NOT NULL,
  Gas_Importe decimal(10,2) NOT NULL,
  PRIMARY KEY (Gas_Id)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=17 ;

--
-- Volcado de datos para la tabla 'Gasto'
--

INSERT INTO Gasto (Gas_Id, Gas_Equipo, Gas_Liga, Gas_Jugador, Gas_Concepto, Gas_FechaAlta, Gas_FechaModificacion, Gas_FechaBaja, Gas_Activo, Gas_Importe) VALUES
(1, 3, 2, NULL, 'MUTUA (16 € por jugador)', '2015-11-30 09:50:11', '2016-02-25 15:26:26', NULL, 1, '144.00'),
(7, 3, 2, NULL, 'Liga (28 minutos)', '2016-02-17 10:25:53', '2016-02-25 15:30:07', NULL, 1, '1820.00'),
(5, 3, 2, NULL, 'Pretemporada (2 particos)', '2015-12-02 06:28:09', '2016-02-25 15:28:01', NULL, 1, '130.00'),
(15, 3, 2, NULL, 'Partido cancelado 27/01/2016', '2016-02-19 10:33:17', '2016-02-25 15:31:51', NULL, 1, '70.00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla 'Ingreso'
--

DROP TABLE IF EXISTS Ingreso;
CREATE TABLE IF NOT EXISTS Ingreso (
  Ing_Id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  Ing_Equipo bigint(20) NOT NULL,
  Ing_Liga bigint(20) DEFAULT NULL,
  Ing_Jugador bigint(20) DEFAULT NULL,
  Ing_Concepto varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  Ing_Documentacion bigint(20) DEFAULT NULL,
  Ing_FechaAlta datetime NOT NULL,
  Ing_FechaModificacion datetime DEFAULT NULL,
  Ing_FechaBaja datetime DEFAULT NULL,
  Ing_Activo tinyint(1) NOT NULL,
  Ing_Importe decimal(10,2) NOT NULL,
  PRIMARY KEY (Ing_Id)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=40 ;

--
-- Volcado de datos para la tabla 'Ingreso'
--

INSERT INTO Ingreso (Ing_Id, Ing_Equipo, Ing_Liga, Ing_Jugador, Ing_Concepto, Ing_Documentacion, Ing_FechaAlta, Ing_FechaModificacion, Ing_FechaBaja, Ing_Activo, Ing_Importe) VALUES
(2, 3, 2, 2, '30-09-2015', 0, '2015-12-03 13:36:18', '2016-02-25 15:40:33', NULL, 1, '20.00'),
(3, 3, 2, NULL, 'Abono Victor Temporada anterior', 0, '2015-12-04 18:50:01', '2016-02-25 15:45:56', NULL, 1, '71.00'),
(5, 3, 2, 12, '30-09-2015', 0, '2016-02-18 08:45:33', '2016-02-25 15:41:10', NULL, 1, '20.00'),
(18, 3, 2, 1, '30-09-2015', NULL, '2016-02-25 15:41:59', NULL, NULL, 1, '20.00'),
(19, 3, 2, 8, '30-09-2015', NULL, '2016-02-25 15:42:22', NULL, NULL, 1, '20.00'),
(20, 3, 2, 9, '04-11-2015', NULL, '2016-02-25 15:59:23', NULL, NULL, 1, '120.00'),
(17, 3, 2, 9, '30-09-2015', NULL, '2016-02-25 15:41:44', NULL, NULL, 1, '20.00'),
(12, 3, 2, 10, '30-09-2015', 0, '2016-02-18 11:25:57', '2016-02-25 15:39:28', NULL, 1, '20.00'),
(14, 3, 2, 13, '30-09-2015', 0, '2016-02-18 12:19:21', '2016-02-25 15:40:54', NULL, 1, '20.00'),
(15, 3, 2, 11, '30-09-2015', 0, '2016-02-18 12:55:33', '2016-02-25 15:41:29', NULL, 1, '20.00'),
(21, 3, 2, 8, '04-11-2015', NULL, '2016-02-25 15:59:37', NULL, NULL, 1, '120.00'),
(22, 3, 2, 12, '04-11-2015', NULL, '2016-02-25 15:59:59', NULL, NULL, 1, '120.00'),
(23, 3, 2, 1, '04-11-2015', NULL, '2016-02-25 16:00:18', NULL, NULL, 1, '120.00'),
(24, 3, 2, 3, '04-11-2015', NULL, '2016-02-25 16:00:31', NULL, NULL, 1, '120.00'),
(25, 3, 2, 10, '11/11/2015', NULL, '2016-02-25 16:01:18', NULL, NULL, 1, '120.00'),
(26, 3, 2, 2, '2/12/2015', NULL, '2016-02-25 16:03:30', NULL, NULL, 1, '120.00'),
(27, 3, 2, 11, '20/01/2016', NULL, '2016-02-25 16:04:02', NULL, NULL, 1, '120.00'),
(28, 3, 2, 13, '20/01/2016', NULL, '2016-02-25 16:04:13', NULL, NULL, 1, '120.00'),
(29, 3, 2, 10, '24-02-2016', NULL, '2016-02-25 16:06:59', NULL, NULL, 1, '93.00'),
(30, 3, 2, 12, '24-02-2016', NULL, '2016-02-25 16:07:21', NULL, NULL, 1, '93.00'),
(31, 3, 2, 11, '24-02-2016', NULL, '2016-02-25 16:07:53', NULL, NULL, 1, '93.00'),
(32, 3, 2, 9, '24-02-2016', NULL, '2016-02-25 16:08:10', NULL, NULL, 1, '93.00'),
(33, 3, 2, 1, '24-02-2016', NULL, '2016-02-25 16:08:30', NULL, NULL, 1, '93.00'),
(34, 3, 2, NULL, 'Cuadre por partidos no jugados', NULL, '2016-06-03 08:18:38', NULL, NULL, 1, '338.00'),
(35, 3, 2, 2, '08/06/2016', NULL, '2016-06-09 08:01:54', NULL, NULL, 1, '25.00'),
(36, 3, 2, 8, '08/06/2016', NULL, '2016-06-09 08:02:13', NULL, NULL, 1, '25.00'),
(37, 3, 2, 2, '15/06/2016', NULL, '2016-06-16 07:19:13', NULL, NULL, 1, '30.00'),
(38, 3, 2, 8, '15/06/2016', NULL, '2016-06-16 07:19:32', NULL, NULL, 1, '30.00'),
(39, 3, 2, 3, '75', NULL, '2016-06-16 07:19:41', NULL, NULL, 1, '75.00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla 'Invitacion'
--

DROP TABLE IF EXISTS Invitacion;
CREATE TABLE IF NOT EXISTS Invitacion (
  Inv_Id bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de tabla',
  Inv_UsuarioInvitador bigint(20) NOT NULL COMMENT 'Identificador de usuario que realiza la invitacion',
  Inv_InvitadoEmail varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Correo electrónico del usuario invitado',
  Inv_InvitadoAdministrador tinyint(1) NOT NULL,
  Inv_InvitadoEquipo bigint(20) NOT NULL,
  Inv_Fecha datetime NOT NULL,
  PRIMARY KEY (Inv_Id)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=23 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla 'Jugador'
--

DROP TABLE IF EXISTS Jugador;
CREATE TABLE IF NOT EXISTS Jugador (
  Jug_Id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la tabla',
  Jug_Equipo bigint(20) NOT NULL,
  Jug_Nombre varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Nombre personal del jugador',
  Jug_Apellido1 varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Primer apellido',
  Jug_Apellido2 varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Segundo apellido',
  Jug_Email varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  Jug_FechaAlta datetime NOT NULL,
  Jug_FechaModificacion datetime DEFAULT NULL,
  Jug_FechaBaja datetime DEFAULT NULL,
  Jug_Activo tinyint(1) NOT NULL,
  PRIMARY KEY (Jug_Id)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=20 ;

--
-- Volcado de datos para la tabla 'Jugador'
--

INSERT INTO Jugador (Jug_Id, Jug_Equipo, Jug_Nombre, Jug_Apellido1, Jug_Apellido2, Jug_Email, Jug_FechaAlta, Jug_FechaModificacion, Jug_FechaBaja, Jug_Activo) VALUES
(1, 3, 'Oscar', 'Perez', 'Garcia', 'oscar@eurocrono.com', '2015-11-17 16:44:47', '2016-03-17 12:13:23', NULL, 1),
(2, 3, 'Carlos', 'Mir', 'Arias', 'litosmirar@gmail.com', '2015-11-17 18:23:23', '2016-02-18 14:29:30', '2016-02-18 14:29:30', 1),
(3, 3, 'pedro', '', '', '', '2015-11-18 05:20:55', '2016-01-19 09:37:49', NULL, 1),
(8, 3, 'Victor', 'Rabasa', 'Simon', '', '2016-01-19 09:38:09', NULL, NULL, 1),
(4, 3, 'pruebas', 'de', 'nuevo jugador', 'dd@hh.jk', '2016-01-15 10:31:45', '2016-01-15 10:35:49', '2016-01-15 10:35:49', 0),
(5, 3, 'pruebas', 'de', 'nuevo jugador', 'dd@hh.jk', '2016-01-15 10:31:55', '2016-01-15 10:35:44', '2016-01-15 10:35:44', 0),
(6, 3, 'pruebas', 'de', 'nuevo jugador', 'dd@hh.jk', '2016-01-15 10:32:10', '2016-01-15 10:35:54', '2016-01-15 10:35:54', 0),
(7, 3, 'pruebas', 'para', 'nuevo jugador', 'tt@ff.lk', '2016-01-15 10:36:23', '2016-01-18 10:57:13', '2016-01-18 10:57:13', 0),
(9, 3, 'Kim', 'bastida', '', '', '2016-01-19 09:38:32', NULL, NULL, 1),
(10, 3, 'Cesc', 'Bastida', '', '', '2016-01-19 09:38:45', NULL, NULL, 1),
(11, 3, 'Jordi', 'Bastida', '', '', '2016-01-19 09:39:03', NULL, NULL, 1),
(12, 3, 'Ferran', 'Martin', 'Novo', '', '2016-01-19 09:39:36', NULL, NULL, 1),
(13, 3, 'Dani', '', '', '', '2016-01-19 09:39:49', NULL, NULL, 1),
(14, 8, 'oscar', 'perez', 'garcia', 'racso80es@gmail.com', '2016-03-17 14:54:47', '2016-03-17 14:54:53', NULL, 1),
(15, 8, 'Su', 'Perez', 'García', 'supega@gmail.com', '2016-03-18 09:23:07', '2016-03-18 09:23:13', '2016-03-18 09:23:13', 0),
(16, 8, 'Su', 'Perez', 'García', 'supega@gmail.com', '2016-03-18 09:23:07', '2016-03-18 09:23:15', '2016-03-18 09:23:15', 0),
(17, 8, 'Su', 'Perez', 'García', 'supega@gmail.com', '2016-03-18 09:23:07', '2016-03-18 09:23:17', '2016-03-18 09:23:17', 0),
(18, 8, 'Su', 'Perez', 'García', 'supega@gmail.com', '2016-03-18 09:23:08', '2016-03-18 09:23:20', '2016-03-18 09:23:20', 0),
(19, 8, 'Su', 'Perez', 'García', 'supega@gmail.com', '2016-03-18 09:23:08', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla 'JugadorLiga'
--

DROP TABLE IF EXISTS JugadorLiga;
CREATE TABLE IF NOT EXISTS JugadorLiga (
  JugLig_Id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la tabla',
  JugLig_Liga bigint(20) NOT NULL COMMENT 'Identificador de la temporada',
  JugLig_Jugador bigint(20) NOT NULL COMMENT 'Identificador del jugador',
  PRIMARY KEY (JugLig_Id),
  UNIQUE KEY TemJug_Temporada (JugLig_Liga,JugLig_Jugador)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=20 ;

--
-- Volcado de datos para la tabla 'JugadorLiga'
--

INSERT INTO JugadorLiga (JugLig_Id, JugLig_Liga, JugLig_Jugador) VALUES
(17, 2, 2),
(11, 2, 1),
(6, 2, 3),
(7, 2, 8),
(8, 2, 10),
(18, 4, 10),
(13, 2, 13),
(14, 2, 12),
(15, 2, 11),
(16, 2, 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla 'Liga'
--

DROP TABLE IF EXISTS Liga;
CREATE TABLE IF NOT EXISTS Liga (
  Lig_Id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Identificador de Tabla',
  Lig_Equipo bigint(20) NOT NULL,
  Lig_Nombre varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Nombre del registro',
  Lig_Descripcion varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Descripción del registro',
  Lig_FechaAlta datetime NOT NULL COMMENT 'Fecha de alta del registro',
  Lig_FechaModificacion datetime DEFAULT NULL COMMENT 'Ultima Fecha de modificación',
  Lig_FechaBaja datetime DEFAULT NULL COMMENT 'Fecha en la que el registro pasa a activo = false',
  Lig_Activo tinyint(1) NOT NULL,
  PRIMARY KEY (Lig_Id),
  UNIQUE KEY Lig_Equipo (Lig_Equipo,Lig_Nombre),
  UNIQUE KEY Lig_Equipo_2 (Lig_Equipo,Lig_Nombre),
  UNIQUE KEY Lig_Equipo_3 (Lig_Equipo,Lig_Nombre)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=7 ;

--
-- Volcado de datos para la tabla 'Liga'
--

INSERT INTO Liga (Lig_Id, Lig_Equipo, Lig_Nombre, Lig_Descripcion, Lig_FechaAlta, Lig_FechaModificacion, Lig_FechaBaja, Lig_Activo) VALUES
(1, 3, 'cambio liga', NULL, '2015-11-19 11:13:29', '2016-01-20 11:48:17', '2016-01-20 11:48:17', 0),
(2, 3, '2015 / 2016', 'Liga de todo el año', '2015-11-19 12:36:37', '2016-02-25 15:06:18', NULL, 1),
(3, 3, '2016', 'Segunda liga del año', '2016-01-20 11:56:15', '2016-02-18 14:29:05', '2016-02-18 14:29:05', 0),
(4, 3, '2017', 'ss', '2016-02-26 20:47:25', '2016-02-26 20:51:29', '2016-02-26 20:51:29', 0),
(5, 8, '2016', 'PRIMERA LIGA', '2016-03-17 14:52:23', '2016-03-18 09:22:03', NULL, 1),
(6, 8, '2017', 'Mi prueba Su', '2016-03-18 09:22:36', '2016-03-18 09:22:46', '2016-03-18 09:22:46', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla 'Usuario'
--

DROP TABLE IF EXISTS Usuario;
CREATE TABLE IF NOT EXISTS Usuario (
  Usu_Id bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la tabla',
  Usu_Usuario varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Nombre unico de usuario',
  Usu_Alias varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'Nombre para el mismo usuario',
  Usu_Password blob NOT NULL COMMENT 'Contraseña del usuario',
  PRIMARY KEY (Usu_Id)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=18 ;

--
-- Volcado de datos para la tabla 'Usuario'
--

INSERT INTO Usuario (Usu_Id, Usu_Usuario, Usu_Alias, Usu_Password) VALUES
(1, 'racso80es@gmail.com', 'Aliasss', 0xca691d8106bb1d7b570fdad53376ad7b),
(16, 'oscar@eurocrono.com', 'contrasenya', 0xca691d8106bb1d7b570fdad53376ad7b),
(17, 'supega@gmail.com', 'sus', 0xdf0a22dc7d7f6023feec1e4c5b3bbbd1);
