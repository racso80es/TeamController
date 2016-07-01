/*
 * OPG 02/12/2015
 * Simulacion de clase para contener Ingresos
 */
function Ingreso(){
	// Viariables
	var nId = 0;
	var nEquipo = 0;
	var nLiga = 0;
	var nJugador = 0;
	var sConcepto = '';
	var nImporte = 0;
	
	// Propiedades
	Ingreso.prototype.IdGet = function() {		
		return nId;
	};
	Ingreso.prototype.IdSet = function(pnId) {
		nId = pnId;
	};
	
	Ingreso.prototype.EquipoGet = function() {
		return nEquipo;
	};
	Ingreso.prototype.EquipoSet = function(pnEquipo) {
		nEquipo = pnEquipo;
	};
	
	Ingreso.prototype.LigaGet = function() {
		return nLiga;
	};
	Ingreso.prototype.LigaSet = function(pnLiga) {
		nLiga = pnLiga;
	};
	
	Ingreso.prototype.JugadorGet = function() {
		return nJugador;
	};
	Ingreso.prototype.JugadorSet = function(pnJugador) {
		nJugador = pnJugador;
	};
	
	Ingreso.prototype.ConceptoGet = function() {
		return sConcepto;
	};
	Ingreso.prototype.ConceptoSet = function(psConcepto) {
		sConcepto = psConcepto;
	};
	
	Ingreso.prototype.ImporteGet = function() {
		return nJImporte;
	};
	Ingreso.prototype.ImporteSet = function(pnImporte) {
		nImporte = pnImporte;
	};
	
	Ingreso.prototype.ListarPorLiga = function(pnEquipo, pnLiga, pnJugador) {
		/*
		 * 05/12/2015
		 * Se listan los ingresos de los filtros indicados
		 */
		$.ajax({
			url: "Ingreso_Listar.php",
			data: {"pnEquipo" : pnEquipo, 
				   "pnLiga" : pnLiga, 
				   "pnJugador" : pnJugador},
            async:true,    
            cache:false,   
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	ListarPorLiga_Retorno.call(this, JSON.parse(Retorno));
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){
            	throw objXMLHttpRequest;
            }
		});
	};
	function ListarPorLiga_Retorno (poDatos) {
        /*
		 * OPG 05/12/2015
		 * Se cargan en pantalla los ingresos obtenidos
		 */
		var lnCon = 0;
		var lnMax = 0;
		var loContenedor = document.getElementById("EquipoLiga_Cuerpo");
		var loIngreso = document.createElement("SECTION");
		var loCabecera = document.createElement("SECTION");
		var lnImpTotal = 0;
		var lsSoloAdmin = "";
		
		lnMax = poDatos.length;
		loContenedor.innerHTML = '';
		loIngreso.className = "SeccionDetalle";
		loIngreso.id = "SeccionDetalle";
		
		// Solo para administradores
		if (CookieObtener("Admin") == true){
			lsSoloAdmin = '<a class="LinkNuevo" onclick="Ingreso_GestionCargar(0)">Añadir ingreso</a></div>';
		}
		else{
			lsSoloAdmin = "";
		}
		// Titulo y Cabecera de columnas
		loContenedor.innerHTML = '<section class="SeccionDetalle">' +
		 							'<div><label class="SeccionDetalleTitulo">GESTIÓN DE INGRESOS</label>' + 
		 							lsSoloAdmin +
		 						 '</section>';
		loCabecera = document.createElement("SECTION");
		loCabecera.innerHTML = '<label class="Liga_Ingreso_Concepto Liga_Ingreso_Normal">Concepto</label>' +
							   '<label class="Liga_Ingreso_Jugador Liga_Ingreso_Normal">Jugador</label>' +
							   '<label class="Liga_Ingreso_Importe Liga_Ingreso_Normal">Importe</label>' +
							   '<label class="Liga_Ingreso_Acciones Liga_Ingreso_Normal">Acciones</label>';
		loCabecera.className = "Liga_Ingreso_FilaTitulo";
	    loIngreso.appendChild(loCabecera);
		
		for (lnCon=0;lnCon<lnMax;lnCon++) {
			FichaBasica (loIngreso, poDatos[lnCon]);
			loContenedor.appendChild(loIngreso)
			// Se suma el importe
			lnImpTotal += parseFloat(poDatos[lnCon].Ing_Importe);
		};
		
		// Se añaden totales
		loCabecera = document.createElement("SECTION");
		loCabecera.innerHTML = '<label id="LblTotal" Importe="' + lnImpTotal + '" class="Liga_Ingreso_Total Liga_Ingreso_Normal">IMPORTE TOTAL ' + Formato_Importe(lnImpTotal) + '</label>';
		loCabecera.className = "Liga_Ingreso_FilaPie";
	    loIngreso.appendChild(loCabecera);
	    
		loContenedor = null;
		loIngreso = null;
		loCabecera = null;
	}
	
	function Cargar_Retorno (poDatos) {
	        /*
			 * OPG 02/12/2015
			 * Se carga la ficha del Ingreso
			 */
			alert (poDatos);
			var loDatos = JSON.parse(poDatos);
			var loTitulo = document.getElementById("LblIngTit");
			var loConcepto = document.getElementById("TxtIngCon");
			var loImporte = document.getElementById("TxtIngImp");
			var loCmbJug = document.getElementById("CmbIngJug");
			var loBtnAcc = document.getElementById("BtnIngAcc");
			
			loTitulo.innerHTML = "Modificación de Ingreso";
			loConcepto.value = loDatos.Ing_Concepto;
			loImporte.value = loDatos.Ing_Importe;
			ComboPosicionar ("CmbIngJug", loDatos.Jug_Id);
			loBtnAcc.innerHTML = "Modificar Ingreso";
			loBtnAcc.setAttribute('onclick', 'Ingreso_Actualizar(' + loDatos.Ing_Id + ');');
	}
	
	// Metodos 
	Ingreso.prototype.Inicializa = function() {
	/*
	 * OPG 02/12/2015
	 * Se inicializan los datos de la clase
	 */		
		nId = 0;
		nEquipo = 0;
		nLiga = 0;
		nJugador = 0;
		sConcepto = '';
		nImporte = 0;
	};
	
	Ingreso.prototype.Actualizar = function(pnId, pnEquipo, pnLiga, psConcepto, pnJugador, psJugador, pnImporte) {
		/*
		 * 02/12/2015
		 * Se actualiza el Ingreso indicado
		 */
		var loResult;
		
		if (psConcepto.length==0){
			loResult = '{"Correcto":false,"Accion":0, "Id":0, "Descripcion":"Ha de indicar un concepto para el Ingreso."}';
			ControlarError (loResult);
		}
		else{
			$.ajax({
				url: "Ingreso_Actualizar.php",
				data:{ 
					    "pnId": pnId,
					    "pnEquipo": pnEquipo,
					    "pnLiga": pnLiga,
					    "pnJugador": pnJugador,
						"psConcepto": psConcepto,
						"pnImporte": pnImporte,
						"pbActivo": 1
					},
	            async:true,    
	            cache:false,   
	            dataType:"html",
	            type: 'POST',
	            success:  function(Retorno){
	        		// Se indica en el objeto Json los atributos que no vuelven de servidor
	            	loResult = JSON.parse(Retorno)
	            	if (loResult.Correcto == true){
	            		loResult.Resultado.Ing_Concepto = psConcepto;
		            	loResult.Resultado.Jug_Nombre = psJugador;
		            	loResult.Resultado.Ing_Importe = pnImporte;
		            	Actualizar_Retorno.call(this, loResult);
	            	}else{
	            		ControlarError (loResult);
	            	}
	            	
	            },
	            beforeSend:function(){},
	            error:function(objXMLHttpRequest){
	            	throw objXMLHttpRequest;
	            }
			});
		}
	};
	function Actualizar_Retorno (poRetorno) {
		/*
		 * OPG 01/12/2015
		 * Se trata el resultado de actualizar el ingreso 
		 */
		var loControl;		

		switch (poRetorno.Correcto) {
	    case false: // Error
	    	ControlarError (poRetorno);
	        break;
	    case true: // correcto
	    	switch (poRetorno.Resultado.Accion){
		    	case "N": // Nuevo
		    		FichaBasica (document.getElementById("SeccionDetalle"), poRetorno.Resultado);
		    		RefrescarImporteTotal (poRetorno.Resultado.Ing_Importe);
		    		break;
		    	case "M": // Modificacion
		    		loControl = document.getElementById("LblIngCon" + poRetorno.Resultado.Ing_Id);
		    		loControl.innerHTML = poRetorno.Resultado.Ing_Concepto;
		    		loControl = document.getElementById("LblIngJug" + poRetorno.Resultado.Ing_Id);
		    		loControl.innerHTML = poRetorno.Resultado.Jug_Nombre;
		    		loControl = document.getElementById("LblIngImp" + poRetorno.Resultado.Ing_Id);
		    		RefrescarImporteTotal (poRetorno.Resultado.Ing_Importe - parseFloat(loControl.innerHTML.replace(" €", "")));
		    		loControl.innerHTML = Formato_Importe(poRetorno.Resultado.Ing_Importe);
			        break;	
		    	}
	    	PopUp_Cerrar();
	    	break;
		}
		
		loControl = null;
	};
	
	Ingreso.prototype.Eliminar = function(pnId) {
		/*
		 * OPG 02/12/2015
		 * Se elimina el Ingreso indicado
		 */
		
		$.ajax({
			url: "Ingreso_Eliminar.php",
			data:{ 
				    "pnId": pnId
				},
            async:true,    
            cache:false,   
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	Eliminar_Retorno.call(this, pnId, JSON.parse(Retorno));
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){
            	throw objXMLHttpRequest;
            }
		});
	}
	function Eliminar_Retorno(pnId, poRetorno){
		/*
		 * OPG 02/12/2015
		 * Se actua en función del resultado de la llamada al servidor
		 */
		var loContenedor;
		var loPadre;
		
		// Se se ha producido un error, se muestra por pantalla
		if (poRetorno.Resultado == 0) {
			// Fallo
			ControlarError (poRetorno);
		}	
		else{
			// Se quita de pantalla lo relacionado con el Ingreso
			RefrescarImporteTotal (parseFloat('-' + document.getElementById('LblIngImp' + pnId).innerHTML.replace(" €", "")));
			loContenedor = document.getElementById('Ing' + pnId);	
			loPadre = loContenedor.parentNode;
			loPadre.removeChild(loContenedor);
		};
	}
	
	Ingreso.prototype.GestionCargar = function(pnIngreso) {
		/*
		 * OPG 16/02/2016
		 * Se cargan todos los datos del ingreso indicado
		 */
		$.ajax({
			url: "Ingreso_Cargar.php",
			data: {"pnId" : pnIngreso},
            async:true,    
            cache:false,   
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	GestionCargar_Retorno.call(this, JSON.parse(Retorno));
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){
            	throw objXMLHttpRequest;
            }
		});
	}
	function GestionCargar_Retorno(poIngreso){
		/*
		 * OPG 19/11/2015
		 * Se pasan los datos al detalle del ingreso
		 */
	 	var loContenedor = document.getElementById("PopUp_Cuerpo");
		var loBtnAceptar = document.createElement("BUTTON");
		var loBtnCancelar = document.createElement("BUTTON");
		var loDivLinea = document.createElement('div');
		var loLabel = document.createElement("label"); 
		var loText = document.createElement("input");
		var loImgErr = document.createElement("img");
		var loCmbJug;
		var lnLiga = ObtenerLigaId();
		var loJugLig = new JugadorLiga();
		
		loContenedor.parentNode.style.width = "375px";
		loContenedor.innerHTML = "";

		// Se crean las lineas y contenido
		// Concepto
		loLabel.className = "LblNuevoUsuario";
		loLabel.innerHTML = "Ingreso :";
		loDivLinea.display = 'block';
		loDivLinea.appendChild(loLabel);
		loText.setAttribute("type", "text");
		loText.setAttribute("value", poIngreso.Ing_Concepto);
		loText.maxLength = 50;
		loText.id = "TxtIngCon";
		loDivLinea.appendChild(loText);
		loImgErr.id = "ImgErr_TxtIngCon";
		loImgErr.src = "images/CampoErroneo_16x16.gif";
		loImgErr.className = "ImgErr_Correcto";
		loImgErr.style.visibility = "hidden";
		loDivLinea.appendChild(loImgErr);
		loContenedor.appendChild(loDivLinea);
		
		// Jugador
		loCmbJug = loJugLig.ToCombo("CmbIngJug", lnLiga, poIngreso.Ing_Jugador, true);
		loDivLinea = document.createElement('div');
		loDivLinea.display = 'block';
		loLabel = document.createElement("label");
		loLabel.innerHTML = "Jugador :";
		loLabel.className = "LblNuevoUsuario";
		loDivLinea.appendChild(loLabel);
		loDivLinea.appendChild(loCmbJug);
		loImgErr = document.createElement("img");
		loImgErr.id = "ImgErr_TxtIngImp"
		loImgErr.src = "images/CampoErroneo_16x16.gif";
		loImgErr.className = "ImgErr_Correcto";
		loImgErr.style.visibility = "hidden";
		loDivLinea.appendChild(loImgErr);
		loContenedor.appendChild(loDivLinea);
		
		// Importe
		loDivLinea = document.createElement('div');
		loDivLinea.display = 'block';
		loLabel = document.createElement("label");
		loLabel.innerHTML = "Importe :";
		loLabel.className = "LblNuevoUsuario";
		loDivLinea.appendChild(loLabel);
		loText = document.createElement("input");
		loText.setAttribute("type", "textarea");
		loText.setAttribute("value", poIngreso.Ing_Importe);
		loText.maxLength = 10;
		loText.id = "TxtIngImp";
		loDivLinea.appendChild(loText);
		loImgErr = document.createElement("img");
		loImgErr.id = "ImgErr_TxtIngImp"
		loImgErr.src = "images/CampoErroneo_16x16.gif";
		loImgErr.className = "ImgErr_Correcto";
		loImgErr.style.visibility = "hidden";
		loDivLinea.appendChild(loImgErr);
		loContenedor.appendChild(loDivLinea);
		
		// botones
		loDivLinea = document.createElement('div');
		loDivLinea.display = 'block';
		loBtnAceptar.setAttribute('onclick', 'Ingreso_Actualizar(' + poIngreso.Ing_Id + ');');
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
		loJugLig = null;
		loCmbJug = null;
	}
}

function Ingresos_CargarPorliga(){
	/*
	 * OPG 02/12/2015
	 * Se cargan todas las fichas de los ingresos del equipo para la liga actual.
	 */
	var loIngreso = new Ingreso();
	var lnEquipo = 0;
	var lnLiga = 0;
	var lnJugador = 0;
	
	try {
		lnLiga = ObtenerLigaId();
		loIngreso.ListarPorLiga(lnEquipo, lnLiga, lnJugador);
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loIngreso = null;
	}
}

function FichaBasica(poContenedor,
		 		     poIngreso){
	/*
	* OPG 09/12/2015
	* Se añade la ficha básica del gasto
	*/	
	
	var loIngreso = document.createElement('div');
	var loBtn;
	var loLbl;
	var loAcciones = document.createElement('div');
	var lnId = 0;
	
	lnId = poIngreso.Ing_Id;
	loIngreso.id = "Ing" + lnId;
	loIngreso.className = "Liga_Ingreso";
	
	// Concepto
	loLbl = document.createElement("label");
	loLbl.innerHTML = poIngreso.Ing_Concepto;
	loLbl.id = "LblIngCon" + poIngreso.Ing_Id;
	loLbl.title = "Motivo por el que se realiza el ingreso";
	loLbl.className = "Liga_Ingreso_Concepto Liga_Ingreso_Item";
	loIngreso.appendChild(loLbl);
	
	// Jugador
	loLbl = document.createElement("label");
	loLbl.innerHTML = PersonaComponerNombreCompleto(poIngreso.Jug_Nombre, poIngreso.Jug_Apellido1, poIngreso.Jug_Apellido2);
	loLbl.id = "LblIngJug" + poIngreso.Ing_Id;
	loLbl.title = "Jugador que realiza el ingreso";
	loLbl.className = "Liga_Ingreso_Jugador Liga_Ingreso_Item";
	loIngreso.appendChild(loLbl);
	
	// Importe
	loLbl = document.createElement("label");
	loLbl.innerHTML = Formato_Importe(poIngreso.Ing_Importe);
	loLbl.id = "LblIngImp" + poIngreso.Ing_Id;
	loLbl.title = "Importe indicado en el ingreso";
	loLbl.className = "Liga_Ingreso_Importe Liga_Ingreso_Item";
	loIngreso.appendChild(loLbl);
	
	// Solo para administradores
	if (CookieObtener("Admin") == true){
		// Acciones
		loAcciones.className = "Liga_Ingreso_Acciones";
		// Botón para gestionar
		loBtn = document.createElement("img");
		loBtn.src = "images/Gestionar_26x26.png";
		loBtn.title = "Modificar el ingreso."
		loBtn.style.cursor = "pointer";
		loBtn.setAttribute('onclick', 'Ingreso_GestionCargar(' + lnId + ');');
		loAcciones.appendChild(loBtn);
		// Boton para eliminar
		loBtn = document.createElement("img");
		loBtn.src = "images/Boton_Eliminar_26x26.png";
		loBtn.title = "Eliminar el ingreso."
		loBtn.style.cursor = "pointer";
		loBtn.setAttribute('onclick', 'Ingreso_Eliminar(' + lnId + ');');
		loAcciones.appendChild(loBtn);
		loIngreso.appendChild(loAcciones);
	}
	
	poContenedor.appendChild(loIngreso);
	loAcciones = null;
	loBtn = null;
	loIngreso = null;
	loLbl = null;
}


function Ingreso_GestionCargar(pnId){
	/*
	 * OPG 01/12/2015
	 * Se buscan los datos del ingreso para cargarlos
	 */
	var loIngreso = new Ingreso();
	
	try {
		loIngreso.GestionCargar(pnId);
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loIngreso = null;
	}
}

function Ingreso_Actualizar (pnId){
	/*
	 * OPG 02/12/2015
	 * Se actualiza la informacion del Ingreso indicado
	 */
	var loIngreso = new Ingreso();
	var lnEquipo = 0;
	var lnLiga = 0;
	var loJugador = document.getElementById("CmbIngJug");
	var lnJugador = 0;
	var lsJugador = 0;
	var lsConcepto = "";
	var lnImporte = 0;
	var lnId = 0;
	
	try {
		//se recogen los valores en pantalla
		lnId = pnId;
		lnEquipo = ObtenerEquipoId();
		lnLiga = ObtenerLigaId();
		lnJugador = loJugador.value;
		lsJugador = loJugador.options[loJugador.selectedIndex].text;
		lsConcepto = document.getElementById("TxtIngCon").value;
		lnImporte = document.getElementById("TxtIngImp").value;
		
		loIngreso.Actualizar(lnId, lnEquipo, lnLiga, lsConcepto, lnJugador, lsJugador, lnImporte);
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loIngreso = null;
		loJugador = null;
	}
}

function Ingreso_Eliminar (pnId){
	/*
	 * OPG 02/12/2015
	 * Se elimina el Ingreso indicado
	 */
	var loIngreso = new Ingreso();
	
	try {		
		if (confirm('Se dispone a eliminar el ingreso seleccionado. ¿Está seguro?') == true) {
			loIngreso.Eliminar(pnId);
		}
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loIngreso = null;
	}
}