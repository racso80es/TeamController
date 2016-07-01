function CargarEquipo(pnEquipo){   
    /// OPG 13/11/2015
	/// Se carga la parte central con la información del equipo indicada. En caso de ser 0,
	/// se considera como nuevo equipo
	var lsTextoSoloAdmin = "";
	
	Usuario_GuardarLocal(pnEquipo);
	// Se cambia el color del boton pulsado y se descarcan el resto
	var nodes = document.getElementById('Botones').childNodes;
	for(var i=0; i<nodes.length; i++) {
		//nodes[i].style.background = "red";
		if (nodes[i].nodeName.toLowerCase() == 'a'){
			if(nodes[i].id == "Equ" + pnEquipo){
				nodes[i].style.background = "rgb(93, 107, 143) none repeat scroll 0% 0%";
			}else{
				nodes[i].style.background = "";
			}
		}
	}

	$.post("Equipo_Cargar.php", { pnEquipo: pnEquipo }, function(data){
		var loResult = JSON.parse(data);
		var lsHtml = '';

		lsHtml = '<section id="SecGeneral">';
		
		// Cabecera de equipo
		lsHtml = lsHtml +
		 '<section id="SecId" class="SeccionDetalle">' +
			 '<div><label id="LblEquTit" class="SeccionDetalleTitulo">DETALLE DEL EQUIPO</label></div>' +
			 '<a class="LinkNuevo" onclick="Equipo_Eliminar(' + pnEquipo + ')">Abandonar equipo</a></div>' +
		     '<div><label class="SeccionDetalleLabel">Equipo</label><input id="TxtEquNom" type="text" class="SeccionDetalleTxt300" required></div>' +
			 '<div><label class="SeccionDetalleLabel">Descripción</label><textarea id="TxtEquDes" rows="5" cols="40" class="SeccionDetalleTxt300"></textarea></div>' +
		 '</section>';

		if (pnEquipo > 0){
			// Gestion de las ligas
			if (CookieObtener("Admin") == true){
				lsTextoSoloAdmin = '<a class="LinkNuevo" onclick="Liga_FichaCargar(0,' + pnEquipo + ')">Añadir liga</a></div>';
			}
			else{
				lsTextoSoloAdmin = '';
			}
			lsHtml = lsHtml +
			 '<section id="SecLig" class="SeccionDetalle">' +
				 '<div><label id="LblLigTit" class="SeccionDetalleTitulo">GESTIÓN DE LAS LIGAS DEL EQUIPO</label>' + 
				 lsTextoSoloAdmin +
			 '</section>';
			CargarLigas(pnEquipo);
			
			// Gestion de jugadores
			if (CookieObtener("Admin") == true){
				lsTextoSoloAdmin = '<a class="LinkNuevo" onclick="Jugador_FichaCargar(0,' + pnEquipo + ')">Añadir jugador</a></div>';
			}
			else{
				lsTextoSoloAdmin = '';
			}
			lsHtml = lsHtml +
			 '<section id="SecJug" class="SeccionDetalle">' +
				 '<div><label id="LblJugTit" class="SeccionDetalleTitulo">JUGADORES DEL EQUIPO</label>' + 
				 lsTextoSoloAdmin +
			 '</section>';
			CargarJugadores(pnEquipo);
					
			// Gestión de usuarios
			if (CookieObtener("Admin") == true){
				lsTextoSoloAdmin = '<a class="LinkNuevo" onclick="Usuario_Invitar_Preparar()">Invitar a usuarios</a></div>';
			}
			else{
				lsTextoSoloAdmin = '';
			}
			var loUsuario = new Usuario();
			lsHtml = lsHtml +
			 '<section id="SecUsu" class="SeccionDetalle">' +
				 '<div><label id="LblUsuTit" class="SeccionDetalleTitulo">USUARIOS DEL EQUIPO</label>' +
				 lsTextoSoloAdmin +
			 '</section>';
			loUsuario.Listar(pnEquipo);
			loUsuario = null;
		}
		
		// Se añade botón de accion
		if (CookieObtener("Admin") == true || pnEquipo == 0){
			lsHtml = lsHtml +
				     '<div><button onclick="Equipo_Actualizar(' + pnEquipo + ')">Aceptar</button></div>' +
				     '</section>';
		};
		
		// Se crea el contenido HTML
		$("#Cuerpo").html(lsHtml);
		document.getElementById("TxtEquNom").value = loResult.Equ_Nombre;
		document.getElementById("TxtEquDes").value = loResult.Equ_Descripcion;
		
		// Se guarda el identificador de equipo
		document.getElementById("TablaCuerpo").setAttribute("Equipo", pnEquipo);
	});

	nodes = null;
}
function Equipo_Eliminar (pnId){
	/*
	 * OPG 18/01/2016
	 * Se elimina el equipo indicado
	 */
	var loEquipo = new Equipo();
	
	try {
		if (confirm('Se dispone a abandonar el equipo seleccionado. ¿Está seguro?') == true) {
			loEquipo.Eliminar(pnId);
		};
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loEquipo = null;
	}
	
}

function Equipo_Actualizar(pnEquipo){   
    /// OPG 13/11/2015
	/// Se recogen los valores necesarios para actualizar (crear o modificar) el equipo indicado
	var lsNombre = "";
	var lsDescripcion = "";
	var lnEquipo = pnEquipo;
	var laResult;
	
	// se recogen los valores en pantalla
	lsNombre = document.getElementById("TxtEquNom").value;
	lsDescripcion = document.getElementById("TxtEquDes").value;
	
	if (lsNombre.length==0){
		laResult = '{"Resultado":0,"Accion":0, "Id":0, "Descripcion":"Ha de indicar un nombre para el equipo."}';
		Equipo_Actualizar_Result (laResult, lsNombre, lsDescripcion);
	}
	else{
		$.post("Equipo_Actualizar.php", 
			{ 
				pnEquipo: lnEquipo,
				psNombre: lsNombre,
				psDescripcion: lsDescripcion
			}, function(Datos){
				var laResult = Datos;
				laResult = laResult.replace("?>", "");
				Equipo_Actualizar_Result (laResult, lsNombre, lsDescripcion);
			});
	}
}

function Equipo_Actualizar_Result(poResult, psNombre, psDescripcion){
/*
 * OPG 14/11/2015
 * Se trata el resultado de actualizar el equipo 
 */
	
	var loResult = JSON.parse(poResult);
	$("#Informativo").html(psNombre);
	//$("#Informativo").html(loResult.Resultado);
	
	switch (loResult.Accion) {
    case 0: // Error
    	$("#Informativo").html(loResult.Descripcion);
        break;
    case 1: // Nuevo
    	Equipo_BotonNuevo(loResult.Id, psNombre, psDescripcion);
        break;
    case 2: // Modificacion
    	document.getElementById("Equ" + loResult.Id).innerHTML = psNombre;
        break;	
	}
}

function Equipo_BotonNuevo(pnId, psNombre, psDescripcion){
	/*
	 * OPG 17/11/2015
	 * Se añade el botón para el equipo indicado
	 */
	var loBotones = document.getElementById("Botones");	
	var laLink = document.createElement('a');
	var lalinkText = document.createTextNode(psNombre);	
	laLink.appendChild(lalinkText);
	laLink.title = psNombre;
	laLink.href = '#';
	laLink.id = "Equ" + pnId;
	laLink.setAttribute('onclick', 'CargarEquipo(' + pnId + ');');
	laLink.setAttribute('class', 'btn btn-primary');

	loBotones.appendChild(laLink);
}

function CargarEquipos(){   
    /*
     * OPG 17/11/2015
     * Se buscsan los equipos activos del usuario actual y se añade un item por cada uno de ellos 
     */	
	var lnCon = 0;
	$.post("Equipo_Listar.php", 
			{ 
			}, function(Datos){
				var laResult = Datos;
				laResult = laResult.replace("?>", "");
				var loResult = JSON.parse(laResult);

				for (lnCon=0;lnCon<loResult.length;lnCon++) {
					Equipo_BotonNuevo (loResult[lnCon].Equ_Id, loResult[lnCon].Equ_nombre, loResult[lnCon].Equ_Descripcion);
				}
				
				Equipo_BotonNuevo (0, 'Nuevo Equipo', 'Añadir un nuevo equipo');
				
				// Si solo hay un equipo, se muestra directamente este
				if (lnCon==1){
					CargarEquipo (loResult[0].Equ_Id);
				};
			});
}

function CargarJugadores(pnEquipo){
	/*
	 * OPG 17/11/2015
	 * Se devuelve la estructura html con los jugadores del equipo indicado
	 */
	
	var lnCon = 0;
	
	$.post("Jugador_Listar.php", 
			{ 
				pnEquipo: pnEquipo
			}, function(Datos){
				var loResult = JSON.parse(Datos);
				for (lnCon=0;lnCon<loResult.length;lnCon++) {
					Jugador_FichaBasica (loResult[lnCon].Jug_Id, pnEquipo, loResult[lnCon].Jug_Nombre, loResult[lnCon].Jug_Apellido1, loResult[lnCon].Jug_Apellido2, loResult[lnCon].Jug_Email);
				}				
			});
}

function Jugador_Actualizar (pnEquipo, pnJugador){
	/*
	 * OPG 17/11/2015
	 * Se actualiza la informacion del jugador indicado
	 */
	var lsNombre = "";
	var lsApellido1 = "";
	var lsApellido2 = "";
	var lsEmail = "";
	var lnId = "";
	var laResult;
	
	// se recogen los valores en pantalla
	lnId = pnJugador;
	lsNombre = document.getElementById("TxtJugNom").value;
	lsApellido1 = document.getElementById("TxtJugApe1").value;
	lsApellido2 = document.getElementById("TxtJugApe2").value;
	lsEmail = document.getElementById("TxtJugEma").value;
	
	if (lsNombre.length==0){
		laResult = '{"Resultado":0,"Accion":0, "Id":0, "Descripcion":"Ha de indicar un nombre para el jugador."}';
		Jugador_Actualizar_Result (laResult, pnEquipo, lsNombre, lsApellido1, lsApellido2, lsEmail);
	}
	else{
		$.post("Jugador_Actualizar.php", 
			{ 
			    pnId: lnId,
				pnEquipo: pnEquipo,
				psNombre: lsNombre,
				psApellido1: lsApellido1,
				psApellido2: lsApellido2,
				psEmail: lsEmail
			}, function(poRetorno){
				//var laResult = Datos;
				//laResult = laResult.replace("?>", "");
				Jugador_Actualizar_Result (JSON.parse(poRetorno), pnEquipo, lsNombre, lsApellido1, lsApellido2, lsEmail);
			});
	}
}

function Jugador_Actualizar_Result(poRetorno, pnEquipo, psNombre, psApellido1, psApellido2, psEmail){
/*
 * OPG 14/11/2015
 * Se trata el resultado de actualizar el equipo 
 */
	//var loError;
	var loContenedor;
	
	switch (poRetorno.Correcto) {
    case false: // Error
    	/*
    	loError = new UserException();
    	loError.Set(1, poRetorno.Descripcion);
    	ControlarError (loError);
    	loError = null;
    	*/
    	ControlarError (poRetorno);
        break;
    case true: // correcto
    	switch (poRetorno.Resultado.Accion){
	    	case "N": // Nuevo
	    		Jugador_FichaBasica(poRetorno.Resultado.Id, pnEquipo, psNombre, psApellido1, psApellido2, psEmail);
	    		break;
	    	case "M": // Modificacion
	    		var lsNombre = PersonaComponerNombreCompleto(psNombre, psApellido1, psApellido2);
	        	var loLink = document.getElementById("LblJugNom" + poRetorno.Resultado.Id);
	        	loLink.title = lsNombre;
	        	loLink.innerHTML = lsNombre;
	        	loLink = null;
		        break;	
	    	}
    	PopUp_Cerrar();
    	break;
	}
}

function Jugador_FichaBasica(pnJugador,
							 pnEquipo,
							 psNombre,
							 psApellido1,
							 psApellido2,
							 psEmail){
	/*
	 * OPG 18/11/2015
	 * Se añade la ficha básica del jugador
	 */
	var loBtn;
	var lsPersona = PersonaComponerNombreCompleto(psNombre, psApellido1, psApellido2);
	var loContenedor = document.getElementById("SecJug");
	var loJugador = document.createElement('div');
	var laLink = document.createElement('a');
	var lalinkText = document.createTextNode(lsPersona);
	var loNombre = document.createElement('label');

	loJugador.className = "DivJugadorBasico";
	loJugador.id = "Jug" + pnJugador;
	
	loBtn = document.createElement("img");
	loBtn.src = "images/PerfilPersona_48x48.png";
	loBtn.className = "ImgJugador";
	loJugador.appendChild(loBtn);
	
	loNombre.id = "LblJugNom" + pnJugador;
	loNombre.innerHTML = lsPersona;
	loNombre.className = "DetalleNombre";
	loJugador.appendChild(loNombre);
	
	if (CookieObtener("Admin") == true || CookieObtener("Usuario") ==  psEmail){
		// Botón para modificar	
		loBtn = document.createElement("img");
		loBtn.src = "images/boton_lupa_hover.png";
		loBtn.title = "Modificar el jugador."
		loBtn.style.cursor = "pointer";
		loBtn.setAttribute('onclick', 'Jugador_FichaCargar(' + pnJugador + ',' + pnEquipo + ');');
		loBtn.className = "DetalleBoton";
		loJugador.appendChild(loBtn);
	
		// Boton para eliminar
		loBtn = document.createElement("img");
		loBtn.src = "images/Boton_Eliminar_26x26.png";
		loBtn.title = "Eliminar jugador."
		loBtn.style.cursor = "pointer";
		loBtn.setAttribute('onclick', 'Jugador_Eliminar(' + pnJugador + ',' + pnEquipo + ');');
		loBtn.className = "DetalleBoton";	
		loJugador.appendChild(loBtn);
	}
	
	loContenedor.appendChild(loJugador);	
}

function Jugador_FichaCargar(pnJugador, pnEquipo){
	/*
	 * OPG 18/11/2015
	 * Se buscan los datos del jugador indicado para cargar el detalle de este.
	 */
	
	$.post("Jugador_Cargar.php", {pnJugador: pnJugador}, function(data){
		var loResult = JSON.parse(data);
		var lsHtml = '';
		
		Jugador_FichaDetalle(pnJugador, pnEquipo, loResult.Jug_Nombre, loResult.Jug_Apellido1, loResult.Jug_Apellido2, loResult.Jug_Email);
	});
}

function Jugador_FichaDetalle(pnId, pnEquipo, psNombre, psApellido1, psApellido2, psEmail){
	/*
	 * OPG 17/11/2015
	 * Se pasan los datos al detalle de jugador
	 */
 	var loContenedor = document.getElementById("PopUp_Cuerpo");
	var loBtnAceptar = document.createElement("BUTTON");
	var loBtnCancelar = document.createElement("BUTTON");
	var loDivLinea = document.createElement('div');
	var loLabel = document.createElement("label"); 
	var loText = document.createElement("input");
	var loImgErr = document.createElement("img");
	
	loContenedor.parentNode.style.width = "375px";
	loContenedor.innerHTML = "";

	// Se crean las lineas y contenido
	// Nombre
	loLabel.className = "LblNuevoUsuario";
	loLabel.innerHTML = "Nombre :";
	loDivLinea.display = 'block';
	loDivLinea.appendChild(loLabel);
	loText.setAttribute("type", "text");
	loText.setAttribute("value", psNombre);
	loText.maxLength = 50;
	loText.id = "TxtJugNom";
	//loText.className = "Email";
	loDivLinea.appendChild(loText);
	loImgErr.id = "ImgErr_TxtJugNom";
	loImgErr.src = "images/CampoErroneo_16x16.gif";
	loImgErr.className = "ImgErr_Correcto";
	loImgErr.style.visibility = "hidden";
	loDivLinea.appendChild(loImgErr);
	loContenedor.appendChild(loDivLinea);
	
	// 1er Apellido
	loDivLinea = document.createElement('div');
	loDivLinea.display = 'block';
	loLabel = document.createElement("label");
	loLabel.innerHTML = "1er Apellido :";
	loLabel.className = "LblNuevoUsuario";
	loDivLinea.appendChild(loLabel);
	loText = document.createElement("input");
	loText.setAttribute("type", "text");
	loText.setAttribute("value", psApellido1);
	loText.maxLength = 50;
	loText.id = "TxtJugApe1";
	//loText.className = "Password";
	loDivLinea.appendChild(loText);
	loImgErr = document.createElement("img");
	loImgErr.id = "ImgErr_TxtJugApe1"
	loImgErr.src = "images/CampoErroneo_16x16.gif";
	loImgErr.className = "ImgErr_Correcto";
	loImgErr.style.visibility = "hidden";
	loDivLinea.appendChild(loImgErr);
	loContenedor.appendChild(loDivLinea);
	
	//2º Apellido
	loDivLinea = document.createElement('div');
	loDivLinea.display = 'block';
	loLabel = document.createElement("label");
	loLabel.innerHTML = "2º Apellido :";
	loLabel.className = "LblNuevoUsuario";
	loDivLinea.appendChild(loLabel);
	loText = document.createElement("input");
	loText.setAttribute("type", "text");
	loText.setAttribute("value", psApellido2);
	loText.maxLength = 50;
	loText.id = "TxtJugApe2";
	//loText.className = "Password";
	loDivLinea.appendChild(loText);
	loImgErr = document.createElement("img");
	loImgErr.id = "ImgErr_TxtJugApe2"
	loImgErr.src = "images/CampoErroneo_16x16.gif";
	loImgErr.className = "ImgErr_Correcto";
	loImgErr.style.visibility = "hidden";
	loDivLinea.appendChild(loImgErr);
	loContenedor.appendChild(loDivLinea);
	
	// Email
	loDivLinea = document.createElement('div');
	loDivLinea.display = 'block';
	loLabel = document.createElement("label");
	loLabel.innerHTML = "Email :";
	loLabel.className = "LblNuevoUsuario";
	loDivLinea.appendChild(loLabel);
	loText = document.createElement("input");
	loText.setAttribute("type", "email");
	loText.setAttribute("value", psEmail);
	loText.maxLength = 50;
	loText.id = "TxtJugEma";
	//loText.className = "Password";
	loDivLinea.appendChild(loText);
	loImgErr = document.createElement("img");
	loImgErr.id = "ImgErr_TxtJugEma"
	loImgErr.src = "images/CampoErroneo_16x16.gif";
	loImgErr.className = "ImgErr_Correcto";
	loImgErr.style.visibility = "hidden";
	loDivLinea.appendChild(loImgErr);
	loContenedor.appendChild(loDivLinea);
	
	// botones
	loDivLinea = document.createElement('div');
	loDivLinea.display = 'block';
	loBtnAceptar.setAttribute('onclick', 'Jugador_Actualizar(' + pnEquipo + ',' + pnId + ');');
	loBtnAceptar.innerHTML = 'Aceptar';
	loDivLinea.appendChild(loBtnAceptar);
	loBtnCancelar.setAttribute('onclick', 'PopUp_Cerrar()');
	loBtnCancelar.innerHTML = 'Cancelar';
	loDivLinea.appendChild(loBtnCancelar);
	loContenedor.appendChild(loDivLinea);
	
	PopUp_Abrir();
	
	// Se cierra todo lo posible
	loContenedor = null;
	loBtnAceptar = null;
	loBtnCancelar = null;
	loDivLinea = null;
	loLabel = null;
	loText = null;
}

function Jugador_Eliminar(pnId, pnEquipo){
	/*
	 * OPG 18/11/2015
	 * Se elimina el jugador indicado
	 */
	if (confirm('Se dispone a eliminar al jugador seleccionado. ¿Está seguro?') == true) {
		$.post("Jugador_Eliminar.php", 
				{ 
				    pnId: pnId,
					pnEquipo: pnEquipo
				}, function(Datos){
					//var laResult = Datos;
					//laResult = laResult.replace("?>", "");
					Jugador_Eliminar_Result (pnId, JSON.parse(Datos));
				});
	}
}

function Jugador_Eliminar_Result(pnId, paResultado){
	/*
	 * OPG 18/11/2015
	 * Se actua en función del resultado de la llamada al servidor
	 */
	var loContenedor;
	var loPadre;
	
	// Se se ha producido un error, se muestra por pantalla
	if (paResultado.Resultado == 0) {
		// Fallo
		$("#Informativo").html(paResultado.Descripcion);
	}	
	else{
		// Se quita de pantalla lo relacionado con el jugador
		loContenedor = document.getElementById('Jug' + pnId);	
		loPadre = loContenedor.parentNode;
		loPadre.removeChild(loContenedor);
	};
}

function CargarLigas(pnEquipo){
	/*
	 * OPG 19/11/2015
	 * Se devuelve la estructura html con las ligas del equipo indicado
	 */
	
	var lnCon = 0;
	$.post("Liga_Listar.php", 
			{ 
				pnEquipo: pnEquipo
			}, function(Datos){
				var loResult = JSON.parse(Datos);
				for (lnCon=0;lnCon<loResult.length;lnCon++) {
					Liga_FichaBasica (loResult[lnCon].Lig_Id, pnEquipo, loResult[lnCon].Lig_Nombre, loResult[lnCon].Lig_Descripcion);
				}
			});
}

function Liga_Actualizar (pnEquipo, pnLiga){
	/*
	 * OPG 19/11/2015
	 * Se actualiza la informacion de la Liga indicada
	 */
	var lsNombre = "";
	var lsDescripcion = "";
	var lnId = 0;
	var laResult;
	
	// se recogen los valores en pantalla
	lnId = pnLiga;
	lsNombre = document.getElementById("TxtLigNom").value;
	lsDescripcion = document.getElementById("TxtLigDes").value;
	
	if (lsNombre.length==0){
		laResult = '{"Resultado":0,"Accion":0, "Id":0, "Descripcion":"Ha de indicar un nombre para la Liga."}';
		Liga_Actualizar_Result (laResult, pnEquipo, lsNombre, lsDescripcion);
	}
	else{
		$.post("Liga_Actualizar.php", 
			{ 
			    pnId: lnId,
				pnEquipo: pnEquipo,
				psNombre: lsNombre,
				psDescripcion: lsDescripcion
			}, function(poRetorno){
				Liga_Actualizar_Result (JSON.parse(poRetorno), pnEquipo, lsNombre, lsDescripcion);
			});
	}
}
function Liga_Actualizar_Result(poRetorno, pnEquipo, psNombre, psDescripcion){
	/*
	 * OPG 19/11/2015
	 * Se trata el resultado de actualizar la liga 
	 */	
	switch (poRetorno.Correcto) {
    case false: // Error
    	ControlarError (poRetorno);
        break;
    case true: // correcto
    	switch (poRetorno.Resultado.Accion){
	    	case "N": // Nuevo
	    		Liga_FichaBasica(poRetorno.Resultado.Id, pnEquipo, psNombre, psDescripcion);
	    		break;
	    	case "M": // Modificacion
	        	var loLink = document.getElementById("LblLigNom" + poRetorno.Resultado.Id);
	        	loLink.title = psNombre;
	        	loLink.innerHTML = psNombre + ' - ' + psDescripcion;
	        	loLink = null;
		        break;	
	    	}
    	PopUp_Cerrar();
    	break;
	}
}

function Liga_FichaBasica(pnLiga,
						  pnEquipo,
						  psNombre,
						  psDescripcion){
	/*
	 * OPG 19/11/2015
	 * Se añade la ficha básica de la Liga
	 */	
	
	var loBtn;
	var loContenedor = document.getElementById("SecLig");
	var loLiga = document.createElement('div');
	var laLink = document.createElement('a');
	var lalinkText = document.createTextNode(psNombre);
	var loNombre = document.createElement('label');

	loLiga.className = "DivLigaBasico";
	loLiga.id = "Lig" + pnLiga;
	
	loNombre.id = "LblLigNom" + pnLiga;
	loNombre.innerHTML = psNombre + ' - ' + psDescripcion;
	loNombre.className = "DetalleNombre";
	loLiga.appendChild(loNombre);
	
	// Solo los administradores pueden eliminar o modificar
	if (CookieObtener("Admin") == true){
		// Botón para modificar	
		loBtn = document.createElement("img");
		loBtn.src = "images/Gestionar_26x26.png";
		loBtn.title = "Modificar la liga."
		loBtn.setAttribute('onclick', 'Liga_FichaCargar(' + pnLiga + ',' + pnEquipo + ');');
		loBtn.className = "DetalleBoton";
		loLiga.appendChild(loBtn);
	
		// Boton para eliminar
		loBtn = document.createElement("img");
		loBtn.src = "images/Boton_Eliminar_26x26.png";
		loBtn.title = "Eliminar la liga."
		loBtn.setAttribute('onclick', 'Liga_Eliminar(' + pnLiga + ',' + pnEquipo + ');');
		loBtn.className = "DetalleBoton";	
		loLiga.appendChild(loBtn);
	}
	
	// Botón gestionar
	loBtn = document.createElement("img");
	loBtn.src = "images/boton_lupa_hover.png";
	loBtn.setAttribute('onclick', 'Liga_GestionCargar(' + pnLiga + ',' + pnEquipo + ');');
	loBtn.className = "DetalleBoton";
	loLiga.appendChild(loBtn);
	
	loContenedor.appendChild(loLiga);
}

function Liga_FichaCargar(pnLiga, pnEquipo){
	/*
	 * OPG 19/11/2015
	 * Se buscan los datos de la Liga indicada para cargar el detalle de esta.
	 */
	
	$.post("Liga_Cargar.php", {pnLiga: pnLiga}, function(data){
		var loResult = JSON.parse(data);
		
		Liga_FichaDetalle(pnLiga, pnEquipo, loResult.Lig_Nombre, loResult.Lig_Descripcion);
	});
}

function Liga_FichaDetalle(pnId, pnEquipo, psNombre, psDescripcion){
	/*
	 * OPG 19/11/2015
	 * Se pasan los datos al detalle de la Liga
	 */
	
 	var loContenedor = document.getElementById("PopUp_Cuerpo");
	var loBtnAceptar = document.createElement("BUTTON");
	var loBtnCancelar = document.createElement("BUTTON");
	var loDivLinea = document.createElement('div');
	var loLabel = document.createElement("label"); 
	var loText = document.createElement("input");
	var loTextArea = document.createElement("textarea");
	var loImgErr = document.createElement("img");
	
	loContenedor.parentNode.style.width = "375px";
	loContenedor.innerHTML = "";

	// Se crean las lineas y contenido
	// Nombre
	loLabel.className = "LblNuevoUsuario";
	loLabel.innerHTML = "Liga :";
	loDivLinea.display = 'block';
	loDivLinea.appendChild(loLabel);
	loText.setAttribute("type", "text");
	loText.setAttribute("value", psNombre);
	loText.maxLength = 50;
	loText.id = "TxtLigNom";
	loDivLinea.appendChild(loText);
	loImgErr.id = "ImgErr_TxtLigNom";
	loImgErr.src = "images/CampoErroneo_16x16.gif";
	loImgErr.className = "ImgErr_Correcto";
	loImgErr.style.visibility = "hidden";
	loDivLinea.appendChild(loImgErr);
	loContenedor.appendChild(loDivLinea);
	
	// Descripcion
	loDivLinea = document.createElement('div');
	loDivLinea.display = 'block';
	loLabel = document.createElement("label");
	loLabel.innerHTML = "Descripción :";
	loLabel.className = "LblNuevoUsuario";
	loDivLinea.appendChild(loLabel);
	loText = document.createElement("input");
	loText.setAttribute("type", "textarea");
	loText.setAttribute("value", psDescripcion);
	loText.maxLength = 255;
	loText.id = "TxtLigDes";
	loDivLinea.appendChild(loText);
	loImgErr = document.createElement("img");
	loImgErr.id = "ImgErr_TxtLigDes"
	loImgErr.src = "images/CampoErroneo_16x16.gif";
	loImgErr.className = "ImgErr_Correcto";
	loImgErr.style.visibility = "hidden";
	loDivLinea.appendChild(loImgErr);
	loContenedor.appendChild(loDivLinea);
	
	// botones
	loDivLinea = document.createElement('div');
	loDivLinea.display = 'block';
	loBtnAceptar.setAttribute('onclick', 'Liga_Actualizar(' + pnEquipo + ',' + pnId + ');');
	loBtnAceptar.innerHTML = 'Aceptar';
	loDivLinea.appendChild(loBtnAceptar);
	loBtnCancelar.setAttribute('onclick', 'PopUp_Cerrar()');
	loBtnCancelar.innerHTML = 'Cancelar';
	loDivLinea.appendChild(loBtnCancelar);
	loContenedor.appendChild(loDivLinea);
	
	PopUp_Abrir();
	
	// Se cierra todo lo posible
	loContenedor = null;
	loBtnAceptar = null;
	loBtnCancelar = null;
	loDivLinea = null;
	loLabel = null;
	loText = null;
	loTextArea = null;
}

function Liga_Eliminar(pnId, pnEquipo){
	/*
	 * OPG 19/11/2015
	 * Se elimina la Liga indicada
	 */
	if (confirm('Se dispone a eliminar la liga seleccionada. ¿Está seguro?') == true) {
		$.post("Liga_Eliminar.php", 
				{ 
				    pnId: pnId,
					pnEquipo: pnEquipo
				}, function(Datos){
					Liga_Eliminar_Result (pnId, JSON.parse(Datos));
				});
	};
}
function Liga_Eliminar_Result(pnId, paResultado){
	/*
	 * OPG 19/11/2015
	 * Se actua en función del resultado de la llamada al servidor
	 */
	var loContenedor;
	var loPadre;
	
	// Se se ha producido un error, se muestra por pantalla
	if (paResultado.Resultado == 0) {
		// Fallo
		$("#Informativo").html(paResultado.Descripcion);
	}	
	else{
		// Se quita de pantalla lo relacionado con el Liga
		loContenedor = document.getElementById('Lig' + pnId);	
		loPadre = loContenedor.parentNode;
		loPadre.removeChild(loContenedor);
	};
}

function Liga_GestionCargar(pnLiga, pnEquipo){
	/*
	 * OPG 19/11/2015
	 * Se carga todo el cuerpo con la info de la liga del equipo indicado
	 */
	var loContenedor = document.getElementById("Cuerpo");
	var loDiv_Cabecera = document.createElement('div');
	var loDiv_Cuerpo = document.createElement('div');
	var loLiga = new Liga();
    
	// Se recogen los datos basicos de la liga
	loLiga.Obtener(pnLiga);
	
	// Cabecera
	loDiv_Cabecera.setAttribute('id', 'EquipoLiga_Cabecera');
	loDiv_Cabecera.setAttribute('liga', pnLiga);
	loDiv_Cabecera.setAttribute('Equipo', pnEquipo);
	loDiv_Cabecera.innerHTML = '<table id="TablaLigaHeader">' +
    								'<tr id="TablaLigaHeaderFila">' + 
    									'<td id="TablaLigaHeaderTitulo">' + loLiga.NombreGet() + '</td>' + 
    									'<td class="EquipoLiga_Acciones">' +
    										'<img class="EquipoLiga_AccionPrincipal" onclick="Balance_CargarPorLiga();" style="cursor: pointer;" src="images/Balance_48x48.png" alt="Balance Contable" title="Balance Contable">' +
    										'<img class="EquipoLiga_AccionPrincipal" onclick="Jugadores_CargarPorLiga(false);" style="cursor: pointer;" src="images/Jugador_48x48.png" alt="Jugadores" title="Jugadores">' +
    							   			'<img class="EquipoLiga_AccionPrincipal" onclick="Gastos_CargarPorLiga();" style="cursor: pointer;" src="images/Gasto_48x48.png" alt="Gastos" title="Gastos">' +
    							   			'<img class="EquipoLiga_AccionPrincipal" onclick="Ingresos_CargarPorliga();" style="cursor: pointer;" src="images/Ingreso_48x48.png" alt="Ingresos" title="Ingresos">' +
    							   			//'<img class="EquipoLiga_AccionPrincipal" onclick="Documentacion_CargarPorliga();" style="cursor: pointer;" src="images/Documentacion_48x48.png" alt="Documentación" title="Documentación">' +
    									'</td>' +
    								'</tr>' +
								'</table>';

	// Cuerpo
	loDiv_Cuerpo.setAttribute('id', 'EquipoLiga_Cuerpo')
	loContenedor.innerHTML = '';
	loContenedor.appendChild(loDiv_Cabecera);
	loContenedor.appendChild(loDiv_Cuerpo);
	
	// Se carga la pantalla principal para la liga
	Balance_CargarPorLiga()
	
	loLiga = null;
}



function ObtenerLigaId(){
	/*
	 * OPG 25/11/2015
	 * Se devuelve el identificador de liga que se encue
	 */
	return document.getElementById("EquipoLiga_Cabecera").getAttribute("liga");
}

function JugadorLiga_Add (psIdObjeto){
	var lnLiga = 0;
	var lnJugador = 0;
	var lbAdd = 0;
	var loJugLig = new JugadorLiga();
	var loCheck = document.getElementById(psIdObjeto);
	var lnCon = 0;
	var loDatos;
	
	lnJugador = loCheck.value; 
	lnLiga = ObtenerLigaId();
	lbAdd = loCheck.checked === true ? 1 : 0;
	loDatos = loJugLig.Jugador_Actualizar (lnLiga, lnJugador, lbAdd);
	alert(loDatos);
}





function Documentacion_CargarPorliga(){
	/*
	 * OPG 11/12/2015
	 * Se cargan todas las fichas de las documentaciones del equipo para la liga actual.
	 */
	var lnEquipo = 0;
	var lnLiga = 0;
	var lnJugador = 0;
	var lnCon = 0;
	var loDocumentacion = new Documentacion();
	var loJugLig = new JugadorLiga();
	var loTipo = new DocumentacionTipo();
	var loDatos;
	var loCmbJug;
	var loCmbTip;
	var loContenedor = document.getElementById("EquipoLiga_Cuerpo");
	var loContenedorDetalle;
	try {
		lnLiga = ObtenerLigaId();
		
		loContenedor.innerHTML = '';
		loDatos = loDocumentacion.Listar (lnEquipo, lnLiga, lnJugador);
		
		for (lnCon=0;lnCon<loDatos.length;lnCon++) {
			Documentacion_FichaBasica (loContenedor, 
							           loDatos[lnCon].Doc_Id, 
							           loDatos[lnCon].Doc_Nombre,
							           loDatos[lnCon].Doc_Descripcion,
							           loDatos[lnCon].DocTip_Nombre,
							           loDatos[lnCon].Jug_Nombre,
							           loDatos[lnCon].Doc_Valor);
		};
		
		// Se generan los desplegables necesarios
		loCmbJug = loJugLig.ToCombo("CmbDocJug", lnLiga, 0, true);
		loCmbTip = loTipo.ToCombo("CmbDocTip", 0, true);
		
		loContenedor.innerHTML = loContenedor.innerHTML +
			'<div>' +
			 	'<div><label id="LblDocTit">Añadir nueva documentación</label></div>' +
			 	'<div><label>Nombre</label><input id="TxtDocNom" type="text" required></div>' +
			 	'<div><label>Descripción</label><textarea rows="5" cols="40" id="TxtDocDes"></textarea></div>' +
			 	'<div id="DivDocTip"><label>Tipo</label></div>' +
			 	'<div><label>Valor</label><input id="TxtDocVal" type="text" required></div>' +
			 	'<div id="DivDocJug"><label>Jugador</label></div>' +
		    	'<div><label>Documento (pendiente de funcionar)</label><input name="archivo" type="file" id="FicDoc"/></div>' +
			 	'<div><button id="BtnDocAcc" onclick="Documentacion_Actualizar(0)">Nueva Documentación</button></div>' +
		 	'</div>';
		
		loContenedorDetalle = document.getElementById("DivDocTip");
		loContenedorDetalle.appendChild(loCmbTip);
		
		loContenedorDetalle = document.getElementById("DivDocJug");
		loContenedorDetalle.appendChild(loCmbJug);
		
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loDatos = null;
		loCmbJug = null;
		loCmbTip = null;
		loContenedor = null;
		loContenedorDetalle = null;
		loDocumentacion = null;
		loTipo = null;
		loJugLig = null;
	}
}

function Documentacion_FichaBasica(poContenedor,
					               pnId, 
					               psNombre,
					               psDescripcion,
					               psTipo,
					               psJugador,
					               pnValor){
/*
* OPG 11/12/2015
* Se añade la ficha básica de la documentación
*/	
	var loBtn;
	var loDocumentacion = document.createElement('div');
	var laLink = document.createElement('a');
	var lalinkText = document.createTextNode('Nombre: ' + psNombre + ' // Descripcion: ' + psDescripcion + ' // Tipo: ' + psTipo + ' // Jugador: ' + psJugador + ' // Valor: ' + pnValor);
	
	loDocumentacion.id = "Doc" + pnId;
	
	// Botón gestionar
	loBtn = document.createElement("img");
	loBtn.src = "images/Gestionar_26x26.png";
	loBtn.style.cursor = "pointer";
	loBtn.setAttribute('onclick', 'Documentacion_GestionCargar(' + pnId + ');');
	loDocumentacion.appendChild(loBtn);
	
	laLink.appendChild(lalinkText);
	laLink.title = psNombre;
	laLink.href = '#';
	laLink.id = "TxtDoc" + pnId;
	loDocumentacion.appendChild(laLink);
	
	// Botón para modificar
	loBtn = document.createElement("img");
	loBtn.src = "images/boton_lupa_hover.png";
	loBtn.title = "Modificar la documentación."
	loBtn.style.cursor = "pointer";
	loBtn.setAttribute('onclick', 'Documentacion_FichaCargar(' + pnId + ');');
	loDocumentacion.appendChild(loBtn);
	
	// Boton para eliminar
	loBtn = document.createElement("img");
	loBtn.src = "images/Boton_Eliminar_26x26.png";
	loBtn.title = "Eliminar la documentación."
	loBtn.style.cursor = "pointer";
	loBtn.setAttribute('onclick', 'Documentacion_Eliminar(' + pnId + ');');
	loDocumentacion.appendChild(loBtn);
	
	poContenedor.appendChild(loDocumentacion);	
}

function Documentacion_FichaCargar(pnId){
	/*
	 * OPG 11/12/2015
	 * Se buscan los datos de la documentacion para cargarlos
	 */
	var loDocumentacion = new Documentacion();
	
	try {
		loDocumentacion.Cargar(pnId);
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loDocumentacion = null;
	}
}

function Documentacion_Actualizar (pnId){
	/*
	 * OPG 11/12/2015
	 * Se actualiza la informacion de la documentacion indicada
	 */
	var loDocumentacion = new Documentacion();
	var lnEquipo = 0;
	var lnLiga = 0;
	var lnJugador = 0;
	var lsNombre = "";
	var lsDescripcion = "";
	var lnTipo = 0;
	var lnValor = 0;
	var lnId = 0;
	//var lsArchivo = "";
	
	try {
		//se recogen los valores en pantalla
		lnId = pnId;
		lnEquipo = ObtenerEquipoId();
		lnLiga = ObtenerLigaId();
		lnJugador = document.getElementById("CmbDocJug").value;
		lnTipo = document.getElementById("CmbDocTip").value;
		lsNombre = document.getElementById("TxtDocNom").value;
		lsDescripcion = document.getElementById("TxtDocDes").value;
		lnValor = document.getElementById("TxtDocVal").value;
		loDocumentacion.Actualizar(lnId, lnEquipo, lnLiga, lnJugador, lsNombre, lsDescripcion, lnTipo, lnValor);
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loDocumentacion = null;
	}
}

function Documentacion_Eliminar (pnId){
	/*
	 * OPG 11/12/2015
	 * Se elimina la documentacion indicada
	 */
	var loDocumentacion = new Documentacion();
	
	try {		
		loDocumentacion.Eliminar(pnId);
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loDocumentacion = null;
	}
}

function ObtenerEquipoId(){
	/*
	 * OPG 01/12/2015
	 * Se devuelve el identificador del equipo
	 */
	// return document.getElementById("EquipoLiga_Cabecera").getAttribute("Equipo");
	return document.getElementById("TablaCuerpo").getAttribute("Equipo");
}

function Salir(){
	window.location="login.php?Accion=OUT";
}

function RefrescarImporteTotal (pnImporte){
	/*
	 * OPG 17/02/2016
	 * Se modifica la información mostrada en el total de la lista existente
	 */
	var loLabel = document.getElementById("LblTotal");
	var lnImporte = 0;
	
	lnImporte = parseFloat(loLabel.getAttribute("Importe")) + parseFloat(pnImporte);
	loLabel.setAttribute("Importe", lnImporte);
	loLabel.innerHTML = "IMPORTE TOTAL " + Formato_Importe (lnImporte);
	loLabel = null;
}