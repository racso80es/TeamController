<?php

/*
    Se controla por si se ha llamado para el uso de una acción en concreto
*/

if(isset($_POST['psAccion']) && !empty($_POST['psAccion'])) {
	session_start();
    $psAction = $_POST['psAccion'];
    switch($psAction) {
        case 'Usuario_ObtenerBasico': 
        	Usuario_ObtenerBasico($_POST['pnId']);
        	break;
        case 'Equipo_Obtener': 
        	Equipo_Obtener($_SESSION['userid'], $_POST['pnId']);
        	break;
        default: 
        	echo 'Se ha llamado a AJAX con un nombre de funcion inesxistente.';
        	break;
    }
}
else{
	echo 'Se ha llamado a AJAX sin el parametro accion.';
}

/*
 	OPG - 28/06/2016
	Se encarga de devolver la estructura necesaria para el usuario seleccionado. Si el Id es -1, se quiere el usuario actual
*/
	function Usuario_ObtenerBasico ($pnId)
	{
		require_once "class/usuario.php";		

		if ($pnId == 0){
			$laUsuario = array("Usu_Id" => 0, "Usu_Alias" => "", "Usu_Usuario" => "");
		}
		else{
			if ($pnId == -1){
				$pnId = $_SESSION['userid'];
			};
			$laUsuario = Usuario::ObtenerBasico ($pnId);
		};

		echo json_encode($laUsuario, JSON_PRETTY_PRINT);
	}

	function Equipo_Obtener ($pnUsuario, $pnId)
	{
		require_once "class/Equipo.php";
		$laDatos = Equipo::Obtener($pnUsuario, $pnId);

		echo json_encode($laDatos, JSON_PRETTY_PRINT);
	}
?>