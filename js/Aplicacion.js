function InicializaGeneral(){
	/*
	 * OPG 28/06/2016
	 * Se hace comprovaciones básicas y guarda en local la informacion del usuario
	 */
	var loError = new UserException();
	var loUsuario = new Usuario();
	var loAplicacion = new ClsAplicacion();

	try {
		if (CompruebaCompatibilidadAlamcenamientoLocal()===false){
			alert ("El navegador no puede guardar los datos con HTML5, a saber como funciona esto.");	
		}
		else{
			loUsuario.ObtenerBasico(-1);
			// Si es necesario, se guardan los datos en local
			UsuarioGuardar (loUsuario);

			// Si es posible, se posiciona en el equipo y liga indicados
			alert(loAplicacion.GetEquipo());
			loAplicacion.SetEquipo(5);
			alert(loAplicacion.GetEquipo());
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
	var loLiga = new Liga();
	var loJugador = new Jugador();
	var lnEquipo = poEquipoLabel.getAttribute("Equipo");
	var lsHTML = "";
	var laLigas;
	var laJugadores;
	var lnCon = 0;

	try{
		//  Se obtiene los datos necesarios
		lsHTML = "";
		loEquipo.Cargar(lnEquipo);
		loLiga.Listar(lnEquipo);
		laLigas = loLiga.ListaGet();
		loJugador.Listar(lnEquipo);
		laJugadores = loJugador.ListaGet();

		// Se crea la estructura HTML necesaria para el cuerpo
		lsHTML = "<h3><i class=\'fa fa-angle-right\'></i>" + loEquipo.NombreGet() + " - " + loEquipo.DescripcionGet() + " - " + "</h3><hr>";
		$("#DivCuerpo").html(lsHTML);

		// Se crea la estructura HTML necesaria para las ligas
		lsHTML = "<h3>LIGAS</h3>";

		for (lnCon=0;lnCon<laLigas.length;lnCon++) {
			lsHTML = lsHTML + 
					 '<div class="desc"><div class="thumb"><span class="badge bg-theme"><i class="fa fa-clock-o"></i></span></div>' +
                      	'<div class="details">' +
                      		'<p><muted>' + laLigas[lnCon].Lig_Descripcion + '</muted><br/>' +
                      		    laLigas[lnCon].Lig_Nombre + '<br/>' +
                      		'</p></div>' +
                      '</div>';
		}

		// Ultimo punto para añadir una nueva liga
		lsHTML = lsHTML + 
					 '<div class="desc"><div class="thumb"><span class="badge bg-theme"><i class="fa fa-clock-o"></i></span></div>' +
                      	'<div class="details">' +
                      		'<p><muted>Crear una nueva liga</muted><br/>' +
                      		    'CREAR LIGA' + '<br/>' +
                      		'</p></div>' +
                      '</div>';

        // Se cargan los jugadores del equipo actual
        lsHTML = lsHTML +
        	     "<h3>JUGADORES</h3>";

		for (lnCon=0;lnCon<laJugadores.length;lnCon++) {
			lsHTML = lsHTML + 
					'<div class="desc"><div class="thumb">' +
		          		'<img class="img-circle" src="assets/img/ui-divya.jpg" width="35px" height="35px" align="">' +
			          	'</div>' +
			          	'<div class="details">' +
			          		'<p><a href="#">' + laJugadores[lnCon].Jug_Nombre + ' ' + laJugadores[lnCon].Jug_Apellido1 + ' ' + laJugadores[lnCon].Jug_Apellido2 + '</a><br/>' +
			          		   '<muted>' + laJugadores[lnCon].Jug_Email + '</muted>' +
			          		'</p></div>' +
		        	'</div>';
		}

		// Ultimo punto para añadir un nuevo jugador
		lsHTML = lsHTML + 
					 '<div class="desc"><div class="thumb"><span class="badge bg-theme"><i class="fa fa-clock-o"></i></span></div>' +
                      	'<div class="details">' +
                      		'<p><muted>Crear un nuevo jugador</muted><br/>' +
                      		    'CREAR JUGADOR' + '<br/>' +
                      		'</p></div>' +
                      '</div>'

		$("#DivLateral").html(lsHTML);
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

function ClsAplicacion(){
	// Viariables

	// Propiedades
	ClsAplicacion.prototype.GetEquipo = function() {		
		return window.localStorage.getItem('Aplicacion_Equipo') || -1;
	};
	ClsAplicacion.prototype.SetEquipo = function(pnEquipo) {
		window.localStorage.setItem('Aplicacion_Equipo', pnEquipo);
	};

	ClsAplicacion.prototype.GetLiga = function() {		
		return window.localStorage.getItem('Aplicacion_Liga') || -1;
	};
	ClsAplicacion.prototype.SetLiga = function(pnLiga) {
		window.localStorage.setItem('Aplicacion_Liga', pnLiga);
	};
}
