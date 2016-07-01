<?php

/**
 * OPG 17/12/2015
 * Clase contenedora del retorno de llamadas a PHP
 */
class Retorno
{	
	var $Correcto;
	var $Descripcion;
	var $Resultado;
	function __construct(){
		$this->CorrectoSet(true);
		$this->DescripcionSet("");
	}
	function Inicializa($pbCorrecto,$psDescripcion){
		$this->CorrectoSet($pbCorrecto);
		$this->DescripcionSet($psDescripcion);
	}
	
	function CorrectoSet ($pbCorrecto){
		$this->Correcto = $pbCorrecto;
	}
	function DescripcionSet ($psDescripcion){
		$this->Descripcion = $psDescripcion;
	}
	
	function ResultadoAdd($poResultado, $psId){   //añadir un nuevo resultado
		if (!isset($this->Resultado)){
			$this->Resultado = array();
		}
		$this->Resultado[$psId] = $poResultado;
	}
	
	function ToJson(){
		// Se devuelve la cadena Json de la clase
		return json_encode($this);
	}
}
?>