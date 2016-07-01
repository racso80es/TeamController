<?php

/**
 * Representa el la estructura de los equipos
 * almacenadas en la base de datos
 */
require 'Database.php';

class Equipo
{	
	// Variables internas
	private $nId = 0;
	private $sNombre = "";
	private $sDescripcion = "";
	
	// Propiedades
	public function IdGet(){
		return $this->nId;
	}
	public function IdSet($pnId){
		$this->nId = $pnId;
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
    	$this->sNombre = "";
    	$this->sDescripcion = "";
    }
    
    /**
     * Añade el equipo indicado
     * determinado
     */
    public static function Equipo_Insertar($pnUsuario,
    									   $psNombre,
    									   $psDescripcion)
    {
    	$lnId = 0;
    	// Si todo es correcto, se devuelve el identificador de equipo
    	$lsSql = "CALL Prc_Equipo_Insertar (:pnUsuario, :psNombre, :psDescripcion)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':psNombre', $psNombre);
    		$loCmd->bindParam(':psDescripcion', $psDescripcion);
    		$loCmd->execute();
    		$lnId = $loCmd->fetch(PDO::FETCH_COLUMN);
    		
    		return $lnId;
    
    	} catch (PDOException $e) {
    		echo $e;
    		return 0;
    	}
    }
    
    /**
     * Modifica los datos del retgistro.
     */
    public static function Equipo_Modificar($pnUsuario,
    									   $pnEquipo,
    									   $psNombre,
    									   $psDescripcion)
    {
    	// Si todo es correcto, se devuelve el identificador de equipo
    	$lsSql = "CALL Prc_Equipo_Modificar (:pnEquipo, :pnUsuario, :psNombre, :psDescripcion)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':psNombre', $psNombre);
    		$loCmd->bindParam(':psDescripcion', $psDescripcion);
    		$loCmd->execute();
    	} catch (PDOException $e) {
    		echo $e;
    		return $e;
    	}
    }
    
    /*
     * Se buscan todos los equipos activos del usuario 
     * determinado
     */
    public static function Equipos_Listar($pnUsuario)
    {
    	$lsSql = "CALL Prc_Equipos_Listar (:pnUsuario)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->execute();
    		return $loCmd->fetchAll(PDO::FETCH_ASSOC);
    
    	} catch (PDOException $e) {
    		echo $e;
    		return 0;
    	}
    }
    
    /*
     * Se busca el equipo indicado y se guarda en la clase
     */
    public static function Obtener($pnUsuario, $pnEquipo)
    {
    	$lsSql = "CALL Prc_Equipo_Obtener (:pnUsuario, :pnEquipo)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		$loCmd->execute();
    		
    		// Se recuperan los valores como objeto, para pasarlos al tipo equipo
    		return $loCmd->fetch(PDO::FETCH_ASSOC);
    		
    		/*$loResult = $loCmd->fetch(PDO::FETCH_OBJ);
    		$this->nId = $loResult->Equ_Id; 
    		$this->sNombre = $loResult->Equ_Nombre;
    		$this->sDescripcion = $loResult->Equ_Descripcion;*/
    	} catch (PDOException $e) {
    		echo $e;
    		return 0;
    	}
    }
    
    /*
     * Elimina el registro indicado
     */
    public static function Eliminar($pnEquipo,
    								$pnUsuario)
    {
    	$lsSql = "CALL Prc_Equipo_Eliminar (:pnUsuario, :pnEquipo)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->bindParam(':pnEquipo', $pnEquipo);
    		
    		$loCmd->execute();
    		return '';
    	} catch (PDOException $e) {
    		return $e->getMessage();
    	}
    }

    /*
     * Se crean los botones para los equipos
     */
    public static function CrearBotones($pnUsuario){
        $laEquipos = Equipo::Equipos_Listar($pnUsuario);

        foreach ($laEquipos as $laItem) {
            $lsId = 'Equipo'.$laItem['Equ_Id'];
            echo '<li><a id="'.$lsId.'" name="SelectorEquipo[]" Equipo="'.$laItem['Equ_Id'].'" href="javascript:Equipo_Cargar('.$lsId.');">'.$laItem['Equ_nombre'].'</a></li>';
        };
    }
}
?>