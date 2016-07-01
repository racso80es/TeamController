<?php

/**
 * Representa el la estructura de los tipos documentaciones
 * almacenadas en la base de datos
 */
require 'Database.php';

class DocumentacionTipo
{	
    public static function Listar($pnUsuario)
    {
    	$lsSql = "CALL Prc_DocumentacionTipo_Listar (:pnUsuario)";
    	try {
    		$loDb = Database::getInstance()->getDb();
    		$loCmd = $loDb->prepare($lsSql);
    		$loCmd->bindParam(':pnUsuario', $pnUsuario);
    		$loCmd->execute();
    		return $loCmd->fetchAll(PDO::FETCH_ASSOC);
    
    	} catch (PDOException $e) {
    		return $e->getMessage();
    	}
    }
}
?>