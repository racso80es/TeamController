function InicializaGeneral(){
	/*
	 * OPG 28/06/2016
	 * Se hace comprovaciones básicas y guarda en local la informacion del usuario
	 */
	var loError = new UserException();
	var loUsuario = new Usuario();
	try {
		if (CompruebaCompatibilidadAlamcenamientoLocal()===false){
			alert ("El navegador no puede guardar los datos con HTML5, a saber como funciona esto.");	
		}
		else{
			loUsuario.ObtenerBasico(-1);
			// Si es necesario, se guardan los datos en local
			UsuarioGuardar (loUsuario);
		}

		// Si hay algún equipo, se selecciona el primero de ellos.
	} catch(e) {  
		if (e instanceof UserException){
			ControlarError(e); // Si ocurre un error es manejado
		}else{
			loError.Set(55, e.message);
			ControlarError(loError);
		}
	} finally {
		loError = null;
		loUsuario = null;	
	}	
}

function CompruebaCompatibilidadAlamcenamientoLocal() {
	if (window.sessionStorage && window.localStorage) {			
		return true;
	} 
	else {			
		return false;
	}	
}

function Equipo_Cargar(poEquipoLabel){
	/*
	* OPG 30/06/2016
	* Se Muestra en pantalla la ficha del equipo indicado
	*/
	var loError = new UserException();
	var loEquipo = new Equipo();
	var lnEquipo = poEquipoLabel.getAttribute("Equipo");
	var lsHTML = "";

	try{
		loEquipo.Cargar(lnEquipo);
		lsHTML = "<h3><i class=\'fa fa-angle-right\'></i>" + loEquipo.NombreGet() + " - " + loEquipo.DescripcionGet() + " - " + "</h3><hr>";
		$("#DivCuerpo").html(lsHTML);
	} catch(e) {  
		if (e instanceof UserException){
			ControlarError(e); // Si ocurre un error es manejado
		}else{
			loError.Set(55, e.message);
			ControlarError(loError);
		}
	} finally {
		loError = null;
		loEquipo = null;	
	}
}

function NuevoEquipo_Mostrar(){
	/*
	 * OPG 29/06/2016
	 * Se Muestra formulario para dar de alta nuevo equipo
	 */
	 alert('Que prisa tienes?? aun lo estoy desarrollando.');
}