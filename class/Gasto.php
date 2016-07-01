<?php

/**
 * Representa el la estructura de los gastos
 * almacenadas en la base de datos
 */
require 'Database.php';

class Gasto
{	
	// Variables internas
	private $nId = 0;
	private $nEquipo = 0;
	private $nLiga = 0;
	private $nJugador = 0;
	private $sConcepto = "";
	private $nImporte = 0;
	
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
	
	public function CenceptoGet(){
		return $this->sConcepto;
	}
	public function ConceptoSet($psConcepto){
		$this->sConcepto = $psConcepto;
	}
	
	public function ImporteGet(){
		return $this->nImporte;
	}
	public function ImporteSet($pnImporte){
		$this->nImporte = $pnImporte;
	}
	
    function __construct()
    {
    	$this->nId = 0;
    	$this->nEquipo = 0;
		$this->nLiga = 0;
		$this->nJugador = 0;
    	$this->sConcepto = "";
    	$this->nImporte = 0;
    }
    
    /**
     * Añade el gasto indicado
     */
    public static function Insertar($pnUsuario,
							        $pnEquipo,
    								$pnLiga,
    								$pnJugador,
    				                $psConcepto,
    				                $pnImporte)
    {
    	$loRetorno = new Retorno();
    	$lnId = 0;
    	
    	// Si todo es correcto, se devuelve el identificador de gasto
    	$lsSql = "CALL Prc_Gasto_Insertar (:pnUsuario, :pnEquipo, :pnLiga, :pnJugador, :psConcepto, :pnImporte)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->bindParam(':pnLiga', $pnLiga);
    		$loCmd->bindParam(':pnJugador', $pnJugador);
    		$loCmd->bindParam(':psConcepto', $psConcepto);
    		$loCmd->bindParam(':pnImporte', $pnImporte);
    		$loCmd->execute();
    		$lnId = $loCmd->fetch(PDO::FETCH_COLUMN);
    		
    		$loRetorno->ResultadoAdd($lnId, "Gas_Id");
    		$loRetorno->ResultadoAdd("N", "Accion");    
    	} catch (PDOException $e) {
    		$loRetorno->Inicializa(false, $e->getMessage());
    	}
    	
    	return $loRetorno;
    }
    
    /**
     * Se buscan los gastos con los filtros indicados
     */
    public static function Listar($pnUsuario,
                                  $pnEquipo, 
    							  $pnLiga,
    							  $pnJugador)
    {
    	$lsSql = "CALL Prc_Gasto_Listar (:pnUsuario, :pnEquipo, :pnLiga, :pnJugador)";
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
     * Se busca el gasto indicado
     */
    public function Obtener($pnId,  
    		                $pnUsuario)
    {
    	$lsSql = "CALL Prc_Gasto_Obtener (:pnId, :pnUsuario)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnId', $pnId);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->execute();
    		
    		// Se recuperan los valores como objeto.
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
						    		$pnUsuario)
    {
    	$lsSql = "CALL Prc_Gasto_Eliminar (:pnId, :pnUsuario)";
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
     * OPG 30/11/2015
     * Modificacion de registro
     */
    public static function Modificar($pnId,
    								 $pnUsuario,
    								 $pnEquipo,
    								 $pnLiga,
    							     $pnJugador,
    								 $psConcepto,
    							     $pnImporte,
    								 $pbActivo)
    {
    	$loRetorno = new Retorno();
    	
    	$lsSql = "CALL Prc_Gasto_Modificar (:pnId, :pnUsuario, :pnEquipo, :pnLiga, :pnJugador, :psConcepto, :pnImporte, :pbActivo)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnId', $pnId);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->bindParam(':pnLiga', $pnLiga);
    		$loCmd->bindParam(':pnJugador', $pnJugador);
    		$loCmd->bindParam(':psConcepto', $psConcepto);
    		$loCmd->bindParam(':pnImporte', $pnImporte);
    		$loCmd->bindParam(':pbActivo', $pbActivo);
    		$loCmd->execute();  
    		
    		$loRetorno->ResultadoAdd($pnId, "Gas_Id");
    		$loRetorno->ResultadoAdd("M", "Accion");
    	} catch (PDOException $e) {
    		$loRetorno->Inicializa(false, $e->getMessage());
    	}
    		 
    	return $loRetorno;
    }
}
?>