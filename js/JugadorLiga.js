/*
 * OPG 20/11/2015
 * Simulacion de clase para contener lo relacionado con el jugador de liga
 */
function JugadorLiga(){
	// Viariables provadas
	var nId = 0;
	var nLiga = 0;
	var nJugador = 0;
	
	// Propiedades
	JugadorLiga.prototype.IdGet = function() {		
		return nId;
	};
	JugadorLiga.prototype.IdSet = function(pnId) {
		nId = pnId;
	};
	
	JugadorLiga.prototype.LigaGet = function() {
		return nLiga;
	};
	JugadorLiga.prototype.LigaSet = function(pnLiga) {
		nLiga = pnLiga;
	};
	
	JugadorLiga.prototype.JugadorGet = function() {
		return nJugador;
	};
	JugadorLiga.prototype.JugadorSet = function(pnJugador) {
		nJugador = pnJugador;
	};
	
	// Metodos 
	JugadorLiga.prototype.Inicializa = function() {
	/*
	 * OPG 20/11/2015
	 * Se inicializan los datos de la clase
	 */		
		nId = 0;
		nLiga = 0;
		nJugador = 0;
	};
	
	JugadorLiga.prototype.ToCombo = function(psId,
											 pnLiga,			       
				     			  			 pnValorDefecto,
				     			  			 pbMostrarSinSeleccionar){
		/*
		 * OPG 03/12/2015
		 * Se crea desplegable con con los jugadores indicados
		 */
		var lnCon = 0;
		var loDatos;
		var loItem;
		//var loCmb = document.createElement("DATALIST");
		var loCmb = document.createElement("select");
		/*option1.value="1";
		option1.innerHTML="sample1";
		element4.appendChild(option1);
		 */
		loCmb.setAttribute("id", psId);
		loDatos = this.ListarJugadores (pnLiga, false);
		
		if (pbMostrarSinSeleccionar){
			loItem = document.createElement("option");
			loItem.id = 0;
			loItem.value = '0';
			loItem.text = '<sin seleccionar>';
			if (pnValorDefecto == 0){
				loItem.selected = true;
			} 
		    loCmb.appendChild(loItem);
		}
		
		for (lnCon=0;lnCon<loDatos.length;lnCon++) {
			//JugadorLiga_FichaBasica (loContenedor, loDatos[lnCon].Jug_Id, loDatos[lnCon].Jug_Nombre, loDatos[lnCon].Jug_Apellido1, loDatos[lnCon].Jug_Apellido2, loDatos[lnCon].Jug_Email, false);
			loItem = document.createElement("option");
			loItem.id = loDatos[lnCon].Jug_Id;
			loItem.value = loDatos[lnCon].Jug_Id;
			loItem.text = loDatos[lnCon].Jug_Nombre + ' ' + loDatos[lnCon].Jug_Apellido1 + ' ' + loDatos[lnCon].Jug_Apellido2;
			if (pnValorDefecto == loDatos[lnCon].Jug_Id){
				loItem.selected = true;
			} 
		    loCmb.appendChild(loItem);
		    loItem = null;
		}
		return loCmb;
	}
	
	JugadorLiga.prototype.ListarJugadores = function(pnLiga, pbNoAsignados) {
		/*
		 * 20/11/2015
		 * Se devuelven todos los jugadores de la liga indicada
		 */
		var loRes;
		var lnNoAsignados = 0;
		
		lnNoAsignados = (pbNoAsignados == true ? 1 : 0);
		
		$.ajax({
			url: "JugadorLiga_Listar.php",
			data: {"pnLiga" : pnLiga, "pbNoAsignados" : lnNoAsignados},
            async:false,    
            cache:false,   
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	loRes = JSON.parse(Retorno);
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){}
		});
		return loRes;
	};
	
	JugadorLiga.prototype.Jugador_Actualizar = function(pnLiga, pnJugador, pbAdd) {
		/*
		 * 27/11/2015
		 * Se añade o quita de la liga el jugador indicado
		 */
		var loRes;
		
		$.ajax({
			url: "JugadorLiga_Actualizar.php",
			data: {
				"pnLiga" : pnLiga, 
				"pnJugador" : pnJugador,
				"pbAdd" : pbAdd
					},
            async:false,    
            cache:false,   
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	loRes = JSON.parse(Retorno);
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){}
		});
		return loRes;
	};
	
	JugadorLiga.prototype.FichaBasica = function(poContenedor, poJugador, pbSeleccionable){
		/*
		 * OPG 20/11/2015
		 * Se crea la ficha detallada del jugador de la liga
		 */
		var lsJugador = PersonaComponerNombreCompleto(poJugador.Jug_Nombre, poJugador.Jug_Apellido1, poJugador.Jug_Apellido2);
		var loJugador = document.createElement('div');
		var loLbl = document.createElement('label');
		var lnId = poJugador.Jug_Id;
		
		loJugador.setAttribute('JugId', lnId);
		loJugador.className = "Liga_Jugador";
		if (pbSeleccionable === true){
			loJugador.innerHTML = '<label class="Liga_Jugador_Nombre"><input type="checkbox" id="JugaSel' + lnId + '" value="' + lnId + '" onclick="JugadorLiga_Add(this.id)" ' + 
								  (poJugador.EstaEnLiga == true ? 'checked' : '') + ' />' + lsJugador + '</label>';
		}
		else{
			// Nombre
			loLbl = document.createElement('label');
			loLbl.innerHTML = lsJugador;
			loLbl.title = "Nombre completo del jugador";
			loLbl.className = "Liga_Jugador_Nombre ";
			loJugador.appendChild(loLbl);
		};
		
		// Gastos
		loLbl = document.createElement('label');
		loLbl.innerHTML = Formato_Importe(poJugador.Coste);
		loLbl.title = "Nombre completo del jugador";
		loLbl.className = "Liga_Jugador_Importe Liga_Jugador_Normal";
		loJugador.appendChild(loLbl);
		
		// Pagado
		loLbl = document.createElement('label');
		loLbl.innerHTML = Formato_Importe(poJugador.Pagado);
		loLbl.title = "Nombre completo del jugador";
		loLbl.className = "Liga_Jugador_Importe Liga_Jugador_Normal";
		loJugador.appendChild(loLbl);
		
		// Por Pagar
		loLbl = document.createElement('label');
		loLbl.innerHTML = Formato_Importe(poJugador.Coste - poJugador.Pagado);
		loLbl.title = "Nombre completo del jugador";
		loLbl.className = "Liga_Jugador_Importe Liga_Jugador_Normal";
		loJugador.appendChild(loLbl);
		
		poContenedor.appendChild(loJugador);
		
		loLbl = null;
		loJugador = null;
	}

}

function Jugadores_CargarPorLiga(pbAusentes){
	/*
	 * OPG 19/11/2015
	 * Se cargan todas las fichas de los jugadores del equipo para la liga actual.
	 */
	var lnLiga = 0;
	var lnCon = 0;
	var loJugLig = new JugadorLiga();
	var loDatos;
	var loContenedor = document.getElementById("EquipoLiga_Cuerpo");
	var loJugadores = document.createElement("SECTION");
	var loCabecera = document.createElement("SECTION");
	var lsTitulo = "";
	var lsBoton = "";
	var lbAusentes = false;
	
	// Se recoge el equipo y la liga
	lnLiga = ObtenerLigaId();
	loDatos = loJugLig.ListarJugadores (lnLiga, pbAusentes);
	loContenedor.innerHTML = '';
	loJugadores.className = "SeccionDetalle";
	
	if (pbAusentes == true){
		lsTitulo = "MODIFICANDO JUGADORES ASIGNADOS A LA LIGA";
		lbAusentes = false;
		lsBoton = "Ver solo asignados";
	}else{
		lsTitulo = "JUGADORES DE LA LIGA";
		lbAusentes = true;
		lsBoton = "Añadir o quitar jugadores";
	}
	
	// Titulo
	loContenedor.innerHTML = '<section class="SeccionDetalle">' +
								'<div><label class="SeccionDetalleTitulo">' + lsTitulo + '</label>' + 
								'</div>' +
							'</section>';
	loCabecera = document.createElement("SECTION");
	loCabecera.innerHTML = '<label class="Liga_Jugador_Nombre">Jugador</label>' +
						   '<label class="Liga_Jugador_Importe Liga_Jugador_Normal">Gastos</label>' +
						   '<label class="Liga_Jugador_Importe Liga_Jugador_Normal">Pagado</label>' +
						   '<label class="Liga_Jugador_Importe Liga_Jugador_Normal">Pendiente</label>' +
						   '</div>';
	loCabecera.className = "Liga_Jugador_FilaTitulo";
    loJugadores.appendChild(loCabecera);
    
	for (lnCon=0;lnCon<loDatos.length;lnCon++) {
		loJugLig.FichaBasica (loJugadores, loDatos[lnCon], pbAusentes);
	}
	
	// Solo para administradores
	if (CookieObtener("Admin") == true){
		// Se añade la opción para seleccionar otros jugadores del equipo
		loJugadores.innerHTML = loJugadores.innerHTML + 
							     '<div><button id="BtnJugSel" onclick="Jugadores_CargarPorLiga(' + lbAusentes +')">' + lsBoton + '</button></div>';
	}
	
	loContenedor.appendChild(loJugadores);
	
	loJugLig = null;
	loContenedor = null;
	loJugadores = null;
	loCabecera = null;
}

function JugadoresLiga_Seleccionar() { 
	/*
	 * 25/11/2015
	 * Se muestran los jugadores del equipo indicado que no están seleccionados en la liga, para poder hacerlo
	 */
	var loDatos;
	var lnLiga = 0;
	var loJugLig = new JugadorLiga();
	var lnCon = 0;
	var loContenedor = document.getElementById("EquipoLiga_Cuerpo");
	
	loContenedor.innerHTML = '';		
	lnLiga = ObtenerLigaId();
	loDatos = loJugLig.ListarJugadores (lnLiga, 1);
	
	// Se cargan los jugadores a elegir
	for (lnCon=0;lnCon<loDatos.length;lnCon++) { 
		JugadorLiga_FichaBasica (loContenedor, loDatos[lnCon], true);
	}
};