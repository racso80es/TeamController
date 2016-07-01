<?php

/**
 * Representa el la estructura de las ligas
 * almacenadas en la base de datos
 */
require 'Database.php';

class Liga
{	
	// Variables internas
	private $nId = 0;
	private $nEquipo = 0;
	private $sNombre = "";
	private $sDescripcion = "";
	
	// Propiedades
	public function IdGet(){
		return $this->nId;
	}
	public function IdSet($pnId){
		$this->nId = $pnId;
	}
	
	public function EquipoGet(){
		return $this->nEquipo;
	}
	public function EquipoSet($pnEquipo){
		$this->nEquipo = $pnEquipo;
	}
	
	public function NombreGet(){
		return $this->sNombre;
	}
	public function NombreSet($psNombre){
		$this->sNombre = $psNombre;
	}
	
	public function DescripcionGet(){
		return $this->sDescripcion;
	}
	public function DescripcionSet($psDescripcion){
		$this->sDescripcion = $psDescripcion;
	}
	
    function __construct()
    {
    	$this->nId = 0;
    	$this->nEquipo = 0;
    	$this->sNombre = "";
    	$this->sDescripcion = "";
    }
    
    /**
     * Añade el jugador indicado
     */
    public static function Insertar($pnUsuario,
							        $pnEquipo,
    				                $psNombre,
    				                $psDescripcion)
    {
    	$loRetorno = new Retorno();
    	$lnId = 0;
    	
    	// Si todo es correcto, se devuelve el identificador de liga
    	$lsSql = "CALL Prc_Liga_Insertar (:pnUsuario, :pnEquipo, :psNombre, :psDescripcion)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->bindParam(':psNombre', $psNombre);
    		$loCmd->bindParam(':psDescripcion', $psDescripcion);
    		$loCmd->execute();
    		$lnId = $loCmd->fetch(PDO::FETCH_COLUMN);
    		
    		$loRetorno->ResultadoAdd($lnId, "Id");
    		$loRetorno->ResultadoAdd("N", "Accion");    
    	} catch (PDOException $e) {
    		$loRetorno->Inicializa(false, $e->getMessage());
    	}
    	
    	return $loRetorno;
    }
    
    /**
     * Modifica los datos del registro.
     */
    public static function Modificar($pnId,
									 $pnUsuario,
    				                 $pnEquipo,
    				                 $psNombre,
       				                 $psDescripcion)
    {
    	// Si todo es correcto, se devuelve el identificador del registro
    	$loRetorno = new Retorno();
    	$lsSql = "CALL Prc_Liga_Modificar (:pnJugador, :pnUsuario, :pnEquipo, :psNombre, :psDescripcion)";
    	
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnJugador', $pnId);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->bindParam(':psNombre', $psNombre);
    		$loCmd->bindParam(':psDescripcion', $psDescripcion);
    		$loCmd->execute();
    		
    		$loRetorno->ResultadoAdd($pnId, "Id");
    		$loRetorno->ResultadoAdd("M", "Accion");
    	} catch (PDOException $e) {
    		$loRetorno->Inicializa(false, $e->getMessage());
    	}
    	
    	return $loRetorno;
    }
    
    /**
     * Se buscan todas las ligas del equipo 
     */
    public static function Listar($pnUsuario,
                                  $pnEquipo)
    {
    	$lsSql = "CALL Prc_Liga_Listar (:pnUsuario, :pnEquipo)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->execute();
    		return $loCmd->fetchAll(PDO::FETCH_ASSOC);
    
    	} catch (PDOException $e) {
    		return $e->getMessage();
    	}
    }
    
    /**
     * Se busca la liga indicada y se devuelve en JSON
     */
    public function Obtener($pnUsuario,  
    		                $pnId)
    {
    	$lsSql = "CALL Prc_Liga_Obtener (:pnUsuario, :pnId)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnId', $pnId);
    		$loCmd->execute();
    		
    		// Se recuperan los valores como objeto, para pasarlos al tipo equipo
    		return $loCmd->fetch(PDO::FETCH_ASSOC);

    	} catch (PDOException $e) {
    		return $e->getMessage();
    	}
    }
    
    /**
     * Elimina el registro indicado
     */
    public static function Eliminar($pnId,
						    		$pnUsuario,
						    		$pnEquipo)
    {
    	$lsSql = "CALL Prc_Liga_Eliminar (:pnLiga, :pnUsuario, :pnEquipo)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnLiga', $pnId);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->execute();
    		return '';
    	} catch (PDOException $e) {
    		return $e->getMessage();
    	}
    }
    
    /**
     * OPG - 08/12/2015
     * Se recupera el balance de la liga indicada
     */
    public static function Balance_Listar($pnLiga,
    									  $pnUsuario)
    {
    	$lsSql = "CALL Prc_Liga_Balance_Listar (:pnLiga, :pnUsuario)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnLiga', $pnLiga);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->execute();
    		return $loCmd->fetchAll(PDO::FETCH_ASSOC);
    
    	} catch (PDOException $e) {
    		return $e->getMessage();
    	}
    }
}
?>