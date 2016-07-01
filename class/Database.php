<?php
/**
 * Clase que envuelve una instancia de la clase PDO
 * para el manejo de la base de datos
 */

require_once './mysql_login.php';


class Database
{

    /**
     * �nica instancia de la clase
     */
    private static $db = null;

    /**
     * Instancia de PDO
     */
    private static $pdo;

    final private function __construct()
    {
        try {
            // Crear nueva conexi�n PDO
            self::getDb();
        } catch (PDOException $e) {
            // Manejo de excepciones
        }


    }

    /**
     * Retorna en la �nica instancia de la clase
     * @return Database|null
     */
    public static function getInstance()
    {
        if (self::$db === null) {
            self::$db = new self();
        }
        return self::$db;
    }

    /**
     * Crear una nueva conexi�n PDO basada
     * en los datos de conexi�n
     * @return PDO Objeto PDO
     */
    public function getDb()
    {
    	//DECLARE $usuario, $contraseña, $Host, $Bd;
    	$host = HOSTNAME;
    	$bd = DATABASE;
    	$usuario = USERNAME;
    	$contraseña = PASSWORD;
        if (self::$pdo == null) {
        	//self::$pdo = new PDO('mysql:host=$host;dbname=$bd, $usuario, $contraseña');
        	self::$pdo = new PDO('mysql:host=' . HOSTNAME .';dbname=' . DATABASE, USERNAME, PASSWORD);
            // Habilitar excepciones
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }

        return self::$pdo;
    }

    /**
     * Evita la clonaci�n del objeto
     */
    final protected function __clone()
    {
    }

    function _destructor()
    {
        self::$pdo = null;
    }
}
/*
 * Ejemplo de creacion de store procedure MySql
  DELIMITER //
	CREATE PROCEDURE Prc_Usuario_Obtener (IN pnId BIGINT)
	BEGIN
	  SELECT  Usu_Id,
	  	  Usu_Usuario,
	          Usu_Email
	  FROM Usuario
	  WHERE Usu_Id = pnId;
	END //
	DELIMITER ;
 */
?>