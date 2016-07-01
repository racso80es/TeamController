<?php

/**
 * Representa el la estructura de los usuarios
 * almacenadas en la base de datos
 */


require 'Database.php';
require_once "Retorno.php";

class Usuario
{
    function __construct()
    {
    }
    
    /**
     * Obtiene los campos de un usuario con un identificador
     * determinado
     *
     * @param $UsuarioId Identificador del usuario
     * @return mixed
     */
    public static function Usuario_Correcto($psUsuario,
    										$psPassword)
    {
    	$lnId = 0;
    	$loRetorno = new Retorno();
    	
    	// Se comprueba si el usuario indicado existe en BD. Si es así, devuelve su identificador
    	$lsSql = "CALL Prc_Usuario_Correcto (:psUsuario, :psPassword)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':psUsuario', $psUsuario);
    		$loCmd->bindParam(':psPassword', $psPassword);
    		$loCmd->execute();
    		$lnId = $loCmd->fetch(PDO::FETCH_COLUMN);
    		$loRetorno->ResultadoAdd($lnId, "Id");
    		$loRetorno->ResultadoAdd("N", "Accion");    
    	} catch (PDOException $e) {
    		// Aqu� puedes clasificar el error dependiendo de la excepci�n
    		// para presentarlo en la respuesta Json
    		//return -1;
    		$loRetorno->Inicializa(false, $e->getMessage());
    		$loRetorno->ResultadoAdd(0, "Id");
    		$loRetorno->ResultadoAdd("N", "Accion");
    	}
   		return $loRetorno;
    }
    
   /*
    * OPG 02/03/2016
    * Se devuelve el identificador del usuario indicado si existe
    */
    public static function Usuario_Existente($psUsuario)
    {
    	$lnId = 0;
    	$loRetorno = new Retorno();
    	 
    	// Se comprueba si el usuario indicado existe en BD. Si es así, devuelve su identificador
    	$lsSql = "CALL Prc_Usuario_Existente (:psUsuario)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':psUsuario', $psUsuario);
    		$loCmd->execute();
    		$lnId = $loCmd->fetch(PDO::FETCH_COLUMN);
    		$loRetorno->ResultadoAdd($lnId, "Id");
    		$loRetorno->ResultadoAdd("C", "Accion");
    	} catch (PDOException $e) {
    		// Aqu� puedes clasificar el error dependiendo de la excepci�n
    		// para presentarlo en la respuesta Json
    		//return -1;
    		$loRetorno->Inicializa(false, $e->getMessage());
    		$loRetorno->ResultadoAdd(0, "Id");
    		$loRetorno->ResultadoAdd("C", "Accion");
    	}
    	return $loRetorno;
    }
    
    /*
     * OPG 27/12/2015
     * Nuevo usuario
     */
    public static function Insertar($pnUsuario,
    							    $psUsuario,
    								$psAlias,
    								$psPassword)
    {
    	$lnId = 0;
    	$loRetorno = new Retorno();
    	
    	// Si todo es correcto, se devuelve el identificador de Ingreso
    	$lsSql = "CALL Prc_Usuario_Insertar (:pnUsuario, :psUsuario, :psAlias, :psPassword)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':psUsuario', $psUsuario);
    		$loCmd->bindParam(':psAlias', $psAlias);
    		$loCmd->bindParam(':psPassword', $psPassword);
    		$loCmd->execute();
    		$lnId = $loCmd->fetch(PDO::FETCH_COLUMN);
    
    		$loRetorno->ResultadoAdd($lnId, "Id");
    		$loRetorno->ResultadoAdd("N", "Accion");
    	} catch (PDOException $e) {
    		$loRetorno->Inicializa(false, $e->getMessage());
    	}
    	return $loRetorno;
    }
    
    /*
     * OPG 17/03/2016
     * Se crea una nueva relación entre usuario y equipo
     */
    public static function EquipoUsuario_Insertar($pnUsuario,
                                                  $pnEquipo,
                                                  $pbAdministrador)
    {
    	$lnId = 0;
    	$loRetorno = new Retorno();
    	 
    	// Si todo es correcto, se devuelve el identificador de Ingreso
    	$lsSql = "CALL Prc_EquipoUsuario_Insertar (:pnUsuario, :pnEquipo, :pbAdministrador)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->bindParam(':pbAdministrador', $pbAdministrador);
    		$loCmd->execute();
    		$lnId = $loCmd->fetch(PDO::FETCH_COLUMN);
    
    		$loRetorno->ResultadoAdd($lnId, "Id");
    		$loRetorno->ResultadoAdd("N", "Accion");
    	} catch (PDOException $e) {
    		$loRetorno->Inicializa(false, $e->getMessage());
    	}
    	return $loRetorno;
    }
    
    
    /*
     * OPG 27/12/2015
     * modificacion de usuario existente
     */
    public static function Modificar($pnId,
    								 $pnUsuario,
    							     $psUsuario,
    							     $psAlias,
    								 $psPassword)
    {
    	$loRetorno = new Retorno();
    	$loRetorno->ResultadoAdd($pnId, "Id");
    	$loRetorno->ResultadoAdd("M", "Accion");
    	$lsSql = "CALL Prc_Usuario_Modificar (:pnId, :pnUsuario, :psUsuario, :psAlias, :psPassword)";
    	
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnId', $pnId);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':psUsuario', $psUsuario);
    		$loCmd->bindParam(':psAlias', $psAlias);
    		$loCmd->bindParam(':psPassword', $psPassword);
    		$loCmd->execute();
    	} catch (PDOException $e) {
    		$loRetorno->Inicializa(false, $e->getMessage());
    	}
    	return $loRetorno;
    }
    
    /**
     * OPG 22/02/2016
     * Se buscan los usuarios con los filtros indicados
     */
    public static function Listar($pnUsuario,
    							  $pnEquipo)
    {
    	$lsSql = "CALL Prc_Usuario_Listar (:pnUsuario, :pnEquipo)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindValue(':pnUsuario', $pnUsuario);
    		$loCmd->bindValue(':pnEquipo', $pnEquipo, PDO::PARAM_NULL);
    		$loCmd->execute();
    		return $loCmd->fetchAll(PDO::FETCH_ASSOC);
    
    	} catch (PDOException $e) {
    		return $e->getMessage();
    	}
    }
    
    /**
     * OPG 22/02/2016
     * Se busca el usuario indicado
     */
    public function Obtener($pnId,
    						$pnEquipo,
    		                $pnUsuario)
    {
    	$loRetorno = new Retorno();
    	
    	$lsSql = "CALL Prc_Usuario_Obtener (:pnId, :pnUsuario, :pnEquipo)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnId', $pnId);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->execute();
    
    		// Se recuperan los valores como objeto.
    		return $loCmd->fetch(PDO::FETCH_ASSOC);
    
    	} catch (PDOException $e) {
    		$loRetorno->Inicializa(false, $e->getMessage());
    	}
    }

    /**
     * OPG 28/06/2016
     * Se busca el usuario indicado
     */
    public static function ObtenerBasico($pnId)
    {
        $loRetorno = new Retorno();
        
        $lsSql = "CALL Prc_Usuario_ObtenerBasico (:pnId)";
        try {
            $loDb = Database::getInstance()->getDb();
            $loCmd = $loDb->prepare($lsSql);
            $loCmd->bindParam(':pnId', $pnId);
            $loCmd->execute();
    
            // Se recuperan los valores como objeto.
            return $loCmd->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $loRetorno->Inicializa(false, $e->getMessage());
        }
    }
    
    /*
     * OPG 02/03/2016
     * Se guarda la nueva invitacion.
     */
    public static function Invitacion_Insertar($pnUsuarioInvitador,
    										   $psInvitadoEmail,			
    										   $pbInvitadoAdministrador,
    										   $pnInvitadoEquipo)
    {
    	$loRetorno = new Retorno();
    	$lsSql = "CALL Prc_Invitacion_Insertar (:pnUsuarioInvitador, :psInvitadoEmail, :pbInvitadoAdministrador, :pnInvitadoEquipo)";
    	try{    		
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuarioInvitador', $pnUsuarioInvitador);
    		$loCmd->bindParam(':psInvitadoEmail', $psInvitadoEmail);
    		$loCmd->bindParam(':pbInvitadoAdministrador', $pbInvitadoAdministrador);
    		$loCmd->bindParam(':pnInvitadoEquipo', $pnInvitadoEquipo);
    		$loCmd->execute();
    		$lnId = $loCmd->fetch(PDO::FETCH_COLUMN);
    
    		$loRetorno->ResultadoAdd($lnId, "Id");
    	} catch (PDOException $e) {
    		$loRetorno->Inicializa(false, $e->getMessage());
    	}
    	return $loRetorno;
    }
    
    /*
     * OPG 09/03/2016
     * Se acepta la invitacion indicada
     */
    public static function Invitacion_Aceptar($psUsuario,
									    	  $psAlias,
									    	  $psPassword,
    										  $pnInvitacion)
    {
    	$loRetorno = new Retorno();
    	$lsSql = "CALL Prc_Invitacion_Aceptar (:psUsuario, :psAlias, :psPassword, :pnInvitacion)";
    	try{
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':psUsuario', $psUsuario);
    		$loCmd->bindParam(':psAlias', $psAlias);
    		$loCmd->bindParam(':psPassword', $psPassword);
    		$loCmd->bindParam(':pnInvitacion', $pnInvitacion);
    		$loCmd->execute();
    		$lnId = $loCmd->fetch(PDO::FETCH_COLUMN);
    
    		$loRetorno->CorrectoSet(true);
    		$loRetorno->ResultadoAdd($lnId, "Id");
    	} catch (PDOException $e) {
    		$loRetorno->Inicializa(false, $e->getMessage());
    	}
    	return $loRetorno;
    }
    
    /*
     * OPG 16/03/2016
     * Se obtiene la contraseña del usuario indicado.
     */
    public static function ObtenerPassword($psUsuario)
    {
    	$loRetorno = new Retorno();
    	$lsSql = "CALL Prc_Usuario_ObtenerPassword (:psUsuario)";
    	try{
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':psUsuario', $psUsuario);
    		$loCmd->execute();
    		$lsPassword = $loCmd->fetch(PDO::FETCH_COLUMN);
    		
    		if ($lsPassword == null){
    			// Usuario no encontrado
    			$loRetorno->Inicializa(false, "No se ha encontrado el usuario indicado.");
    		}
    		else{
    			$loRetorno->ResultadoAdd($lsPassword, "Password");
    		};
    
    	} catch (PDOException $e) {
    		$loRetorno->Inicializa(false, $e->getMessage());
    	}
    	return $loRetorno;
    }
    
    /*
     * OPG 29/03/2016
     * Se elimina la relacion entre el usuario y equipo indicado
     */
    public static function EquipoUsuario_Eliminar($pnUsuario,
    										      $pnEquipo,
    										      $pnUsuarioAccion)
    {
    	$loRetorno = new Retorno();
    	$lsSql = "CALL Prc_EquipoUsuario_Eliminar (:pnUsuario, :pnEquipo, :pnUsuarioAccion)";
    	try{
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->bindParam(':pnUsuarioAccion', $pnUsuarioAccion);
    		$loCmd->execute();
    		$lnId = $loCmd->fetch(PDO::FETCH_COLUMN);
    
    		$loRetorno->CorrectoSet(true);
    	} catch (PDOException $e) {
    		$loRetorno->Inicializa(false, $e->getMessage());
    	}
    	return $loRetorno;
    }
}
