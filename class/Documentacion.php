<?php

/**
 * Representa el la estructura de las documentaciones
 * almacenadas en la base de datos
 */
require 'Database.php';
require_once "Retorno.php";

class Documentacion
{	
	// Variables internas
	private $nId = 0;
	private $nEquipo = 0;
	private $nLiga = 0;
	private $nJugador = 0;
	private $sNombre = "";
	private $sDescripcion = "";
	private $nTipo = 0;
	private $nValor = 0;
	
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
	
	public function LigaGet(){
		return $this->nLiga;
	}
	public function LigaSet($pnLiga){
		$this->nLiga = $pnLiga;
	}
	
	public function JugadorGet(){
		return $this->nJugador;
	}
	public function JugadorSet($pnJugador){
		$this->nJugador = $pnJugador;
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
	
	public function TipoGet(){
		return $this->nTipo;
	}
	public function TipoSet($pnTipo){
		$this->nTipo = $pnTipo;
	}
	
	public function ValorGet(){
		return $this->nValor;
	}
	public function ValorSet($pnValor){
		$this->nValor = $pnValor;
	}
	
    function __construct()
    {
    	$this->nId = 0;
    	$this->nEquipo = 0;
		$this->nLiga = 0;
		$this->nJugador = 0;
    	$this->sNombre = "";
    	$this->sDescripcion = "";
    	$this->nTipo = 0;
    	$this->nValor = 0;
    }
    
    /**
     * OPG 11/12/2015
     * Añade el registro indicado
     */
    public static function Insertar($pnUsuario,
							        $pnEquipo,
    								$pnLiga,
    								$pnJugador,
    				                $psNombre,
    						        $psDescripcion,
    							    $pnTipo,
    				                $pnValor)
    {
    	$lnId = 0;
    	
    	// Si todo es correcto, se devuelve el identificador de Documentacion
    	$lsSql = "CALL Prc_Documentacion_Insertar (:pnUsuario, :pnEquipo, :pnLiga, :pnJugador, :psNombre, :psDescripcion, :pnTipo, :pnValor)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->bindParam(':pnLiga', $pnLiga);
    		$loCmd->bindParam(':pnJugador', $pnJugador);
    		$loCmd->bindParam(':psNombre', $psNombre);
    		$loCmd->bindParam(':psDescripcion', $psDescripcion);
    		$loCmd->bindParam(':pnTipo', $pnTipo);
    		$loCmd->bindParam(':pnValor', $pnValor);
    		$loCmd->execute();
    		$lnId = $loCmd->fetch(PDO::FETCH_COLUMN);
    		
    		return $lnId;
    
    	} catch (PDOException $e) {
    		return $e->getMessage();
    	}
    }
    
    /**
     * Se buscan los registros con los filtros indicados
     */
    public static function Listar($pnUsuario,
                                  $pnEquipo, 
    							  $pnLiga,
    							  $pnJugador)
    {
    	$lsSql = "CALL Prc_Documentacion_Listar (:pnUsuario, :pnEquipo, :pnLiga, :pnJugador)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindValue(':pnUsuario', $pnUsuario);
    		$loCmd->bindValue(':pnEquipo', $pnEquipo, PDO::PARAM_NULL);
    		$loCmd->bindValue(':pnLiga', $pnLiga, PDO::PARAM_NULL);
    		$loCmd->bindValue(':pnJugador', $pnJugador, PDO::PARAM_NULL);
    		$loCmd->execute();
    		return $loCmd->fetchAll(PDO::FETCH_ASSOC);
    
    	} catch (PDOException $e) {
    		return $e->getMessage();
    	}
    }
    
    /**
     * Se busca el registro indicado
     */
    public function Obtener($pnId,  
    		                $pnUsuario)
    {
    	$lsSql = "CALL Prc_Documentacion_Obtener (:pnId, :pnUsuario)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnId', $pnId);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->execute();
    		
    		// Se recuperan los valores como objeto.
    		return $loCmd->fetch(PDO::FETCH_ASSOC);

    	} catch (PDOException $e) {
    		return $e;
    	}
    }
    
    /**
     * Elimina el registro indicado
     */
    public static function Eliminar($pnId,
						    		$pnUsuario)
    {
    	$lsSql = "CALL Prc_Documentacion_Eliminar (:pnId, :pnUsuario)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnId', $pnId);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->execute();
    		return '';
    	} catch (PDOException $e) {
    		return $e->getMessage();
    	}
    }
    
    /*
     * OPG 11/12/2015
     * Modificacion de registro
     */
    public static function Modificar($pnId,
    								 $pnUsuario,
    								 $pnEquipo,
    								 $pnLiga,
    							     $pnJugador,
    								 $psNombre,
    							     $psDescripcion,
    								 $pnTipo,
    							     $pnValor,
    								 $pbActivo)
    {  	
    	$loRetorno = new Retorno();
    	$loRetorno->ResultadoAdd($pnId, "Id");
    	$loRetorno->ResultadoAdd("M", "Accion");
    	$lsSql = "CALL Prc_Documentacion_Modificar (:pnId, :pnUsuario, :pnEquipo, :pnLiga, :pnJugador, :psNombre, :psDescripcion, :pnTipo, :pnValor, :pbActivo)";
    	
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnId', $pnId);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->bindParam(':pnLiga', $pnLiga);
    		$loCmd->bindParam(':pnJugador', $pnJugador);
    		$loCmd->bindParam(':psNombre', $psNombre);
    		$loCmd->bindParam(':psDescripcion', $psDescripcion);
    		$loCmd->bindParam(':pnTipo', $pnTipo);
    		$loCmd->bindParam(':pnValor', $pnValor);
    		$loCmd->bindParam(':pbActivo', $pbActivo);
    		$loCmd->execute();
    	} catch (PDOException $e) {
    		$loRetorno->Inicializa(false, $e->getMessage());
    	}
    	return $loRetorno;
    }
}
?>