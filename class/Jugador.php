<?php

/**
 * Representa el la estructura de los jugadores
 * almacenadas en la base de datos
 */
require 'Database.php';

class Jugador
{	
	// Variables internas
	private $nId = 0;
	private $nEquipo = 0;
	private $sNombre = "";
	private $sApellido1 = "";
	private $sApellido2 = "";
	private $sEmail = "";
	
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
	
	public function Apellido1Get(){
		return $this->sApellido1;
	}
	public function Apellido1Set($psApellido1){
		$this->sApellido1 = $psApellido1;
	}

	public function Apellido2Get(){
		return $this->sApellido2;
	}
	public function Apellido2Set($psApellido2){
		$this->sApellido2 = $psApellido2;
	}
	
	public function EmailGet(){
		return $this->sEmail;
	}
	public function EmailSet($psEmail){
		$this->sEmail = $psEmail;
	}
	
    function __construct()
    {
    	$this->nId = 0;
    	$this->nEquipo = 0;
    	$this->sNombre = "";
    	$this->sApellido1 = "";
	    $this->sApellido2 = "";
    	$this->sEmail = "";
    }
    
    /**
     * Añade el jugador indicado
     */
    public static function Insertar($pnUsuario,
							        $pnEquipo,
    				                $psNombre,
    				                $psApellido1,
				                    $psApellido2,
    				                $psEmail)
    {
    	$lnId = 0;
    	$loRetorno = new Retorno();
    	
    	// Si todo es correcto, se devuelve el identificador de jugador
    	$lsSql = "CALL Prc_Jugador_Insertar (:pnUsuario, :pnEquipo, :psNombre, :psApellido1, :psApellido2, :psEmail)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->bindParam(':psNombre', $psNombre);
    		$loCmd->bindParam(':psApellido1', $psApellido1);
    		$loCmd->bindParam(':psApellido2', $psApellido2);
    		$loCmd->bindParam(':psEmail', $psEmail);
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
       				                 $psApellido1,
				                     $psApellido2,
                                     $psEmail)
    {
    	// Si todo es correcto, se devuelve el identificador de equipo
    	$loRetorno = new Retorno();
    	$lsSql = "CALL Prc_Jugador_Modificar (:pnJugador, :pnUsuario, :pnEquipo, :psNombre, :psApellido1, :psApellido2, :psEmail)";
    	
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnJugador', $pnId);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->bindParam(':psNombre', $psNombre);
    		$loCmd->bindParam(':psApellido1', $psApellido1);
    		$loCmd->bindParam(':psApellido2', $psApellido2);
    		$loCmd->bindParam(':psEmail', $psEmail);
    		$loCmd->execute();
    		
    		$loRetorno->ResultadoAdd($pnId, "Id");
    		$loRetorno->ResultadoAdd("M", "Accion");
    	} catch (PDOException $e) {
    		$loRetorno->Inicializa(false, $e->getMessage());
    	}
    	
    	return $loRetorno;
    }
    
    /**
     * Se buscan todos los jugadores del equipo 
     * determinado
     */
    public static function Listar($pnUsuario,
                                  $pnEquipo)
    {
    	$lsSql = "CALL Prc_Jugador_Listar (:pnUsuario, :pnEquipo)";
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
     * Se busca el jugador indicado y se devuelve en JSON
     */
    public function Obtener($pnUsuario,  
    		                $pnId)
    {
    	$lsSql = "CALL Prc_Jugador_Obtener (:pnUsuario, :pnId)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnId', $pnId);
    		$loCmd->execute();
    		
    		// Se recuperan los valores como objeto, para pasarlos al tipo equipo
    		return $loCmd->fetch(PDO::FETCH_ASSOC);

    	} catch (PDOException $e) {
    		echo $e;
    		return 0;
    	}
    }
    
    /**
     * Elimina el registro indicado
     */
    public static function Eliminar($pnId,
						    		$pnUsuario,
						    		$pnEquipo)
    {
    	$lsSql = "CALL Prc_Jugador_Eliminar (:pnJugador, :pnUsuario, :pnEquipo)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnJugador', $pnId);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->execute();
    		return '';
    	} catch (PDOException $e) {
    		return $e->getMessage();
    	}
    }
    
    /*
     * OPG 20/11/2015
     * Se devuelve un listado con los jugadores de la liga indicada
     */
    public static function ListarPorLiga($pnUsuario,
    									 $pnLiga,
    									 $pbNoASignados)
    {
    	$lsSql = "CALL Prc_Jugador_ListarPorLiga (:pnUsuario, :pnLiga, :pbNoASignados)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnLiga', $pnLiga);
    		$loCmd->bindParam(':pbNoASignados', $pbNoASignados);
    		$loCmd->execute();
    		return $loCmd->fetchAll(PDO::FETCH_ASSOC);
    
    	} catch (PDOException $e) {
    		return $e->getMessage();
    	}
    }
    
    /*
     * OPG 27/11/2015
     * Se añade o quita la relacion del jugador con la liga
     */
    public static function Liga_Actualizar($pnUsuario,
    									   $pnLiga,
    									   $pnJugador,
    									   $pbAdd)
    {
    	$lsSql = "CALL Prc_Jugador_Liga_Actualizar (:pnUsuario, :pnLiga, :pnJugador, :pbAdd)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnLiga', $pnLiga);
    		$loCmd->bindParam(':pnJugador', $pnJugador);
    		$loCmd->bindParam(':pbAdd', $pbAdd);
    		$loCmd->execute();    
    	} catch (PDOException $e) {
    		return $e->getMessage();
    	}
    }
}
?>