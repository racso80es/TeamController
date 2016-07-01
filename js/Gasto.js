/*
 * OPG 01/12/2015
 * Simulacion de clase para contener gastos
 */
function Gasto(){
	// Viariables
	var nId = 0;
	var nEquipo = 0;
	var nLiga = 0;
	var nJugador = 0;
	var sConcepto = '';
	var nImporte = 0;
	
	// Propiedades
	Gasto.prototype.IdGet = function() {		
		return nId;
	};
	Gasto.prototype.IdSet = function(pnId) {
		nId = pnId;
	};
	
	Gasto.prototype.EquipoGet = function() {
		return nEquipo;
	};
	Gasto.prototype.EquipoSet = function(pnEquipo) {
		nEquipo = pnEquipo;
	};
	
	Gasto.prototype.LigaGet = function() {
		return nLiga;
	};
	Gasto.prototype.LigaSet = function(pnLiga) {
		nLiga = pnLiga;
	};
	
	Gasto.prototype.JugadorGet = function() {
		return nJugador;
	};
	Gasto.prototype.JugadorSet = function(pnJugador) {
		nJugador = pnJugador;
	};
	
	Gasto.prototype.ConceptoGet = function() {
		return sConcepto;
	};
	Gasto.prototype.ConceptoSet = function(psConcepto) {
		sConcepto = psConcepto;
	};
	
	Gasto.prototype.ImporteGet = function() {
		return nJImporte;
	};
	Gasto.prototype.ImporteSet = function(pnImporte) {
		nImporte = pnImporte;
	};
	
	function Cargar_Retorno (poDatos) {
	        /*
			 * OPG 01/12/2015
			 * Se carga la ficha del gasto
			 */
			var loDatos = JSON.parse(poDatos);
			var loTitulo = document.getElementById("LblGasTit");
			var loConcepto = document.getElementById("TxtGasCon");
			var loImporte = document.getElementById("TxtGasImp");
			var loBtnAcc = document.getElementById("BtnGasAcc");
			
			loTitulo.innerHTML = "Modificación de gasto";
			loConcepto.value = loDatos.Gas_Concepto;
			loImporte.value = loDatos.Gas_Importe;
			loBtnAcc.innerHTML = "Modificar gasto";
			loBtnAcc.setAttribute('onclick', 'Gasto_Actualizar(' + loDatos.Gas_Id + ');');
	}
	
	// Metodos 
	Gasto.prototype.Inicializa = function() {
	/*
	 * OPG 01/12/2015
	 * Se inicializan los datos de la clase
	 */		
		nId = 0;
		nEquipo = 0;
		nLiga = 0;
		nJugador = 0;
		nConcepto = '';
		nImporte = 0;
	};
	
	Gasto.prototype.Listar = function(pnEquipo, pnLiga, pnJugador) {
		/*
		 * 01/12/2015
		 * Se devuelven los gastos coincidentes con los filtros
		 */
		var loRes;
		
		$.ajax({
			url: "Gasto_Listar.php",
			data: {"pnEquipo" : pnEquipo, "pnLiga" : pnLiga, "pnJugador" : pnJugador},
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
	
	Gasto.prototype.Cargar = function(pnId) {
		/*
		 * 01/12/2015
		 * Se carga el gasto indicado
		 */
		$.ajax({
			url: "Gasto_Cargar.php",
			data: {"pnId" : pnId},
            async:true,    
            cache:false,   
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	Cargar_Retorno.call(this, Retorno);
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){
            	throw objXMLHttpRequest;
            }
		});
	};
	
	Gasto.prototype.Actualizar = function(pnId, pnEquipo, pnLiga, pnJugador, psConcepto, pnImporte) {
		/*
		 * 01/12/2015
		 * Se actualiza el gasto indicado
		 */
		var loResult;
		
		if (psConcepto.length==0){
			loResult = '{"Correcto":false,"Accion":0, "Id":0, "Descripcion":"Ha de indicar un concepto para el gasto."}';
			ControlarError (loResult);
		}
		else{
			$.ajax({
				url: "Gasto_Actualizar.php",
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
	            	loResult = JSON.parse(Retorno)
	            	if (loResult.Correcto == true){
	            		loResult.Resultado.Gas_Concepto = psConcepto;
		            	loResult.Resultado.Gas_Importe = pnImporte;
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
		 * Se trata el resultado de actualizar el gasto 
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
		    		RefrescarImporteTotal (poRetorno.Resultado.Gas_Importe);
		    		break;
		    	case "M": // Modificacion
		    		loControl = document.getElementById("LblGasCon" + poRetorno.Resultado.Gas_Id);
		    		loControl.innerHTML = poRetorno.Resultado.Gas_Concepto;
		    		loControl = document.getElementById("LblGasImp" + poRetorno.Resultado.Gas_Id);
		    		RefrescarImporteTotal (poRetorno.Resultado.Gas_Importe - parseFloat(loControl.innerHTML.replace(" €", "")));
		    		loControl.innerHTML = Formato_Importe(poRetorno.Resultado.Gas_Importe);
			        break;	
		    	}
	    	PopUp_Cerrar();
	    	break;
		}
		
		loControl = null;
	};
	
	Gasto.prototype.Eliminar = function(pnId) {
		/*
		 * OPG 01/12/2015
		 * Se elimina el gasto indicado
		 */
		
		$.ajax({
			url: "Gasto_Eliminar.php",
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
		 * OPG 01/12/2015
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
			// Se quita de pantalla lo relacionado con el gasto
			RefrescarImporteTotal (parseFloat('-' + document.getElementById('LblGasImp' + pnId).innerHTML.replace(" €", "")));
			loContenedor = document.getElementById('Gas' + pnId);	
			loPadre = loContenedor.parentNode;
			loPadre.removeChild(loContenedor);
		};
	}
	
	Gasto.prototype.ListarPorLiga = function(pnEquipo, pnLiga, pnJugador) {
		/*
		 * 05/12/2015
		 * Se listan los gastos de los filtros indicados
		 */
		$.ajax({
			url: "Gasto_Listar.php",
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
		 * Se cargan en pantalla los gastos obtenidos
		 */
		var lnCon = 0;
		var lnMax = 0;
		var loContenedor = document.getElementById("EquipoLiga_Cuerpo");
		var loGasto = document.createElement("SECTION");
		var loCabecera = document.createElement("SECTION");
		var lnImpTotal = 0;
		var lsSoloAdmin = "";
		
		lnMax = poDatos.length;
		loContenedor.innerHTML = '';
		loGasto.className = "SeccionDetalle";
		loGasto.id = "SeccionDetalle";
		
		// Solo para administradores
		if (CookieObtener("Admin") == true){
			lsSoloAdmin = '<a class="LinkNuevo" onclick="Gasto_GestionCargar(0)">Añadir gasto</a></div>';
		}
		else{
			lsSoloAdmin = "";
		}
		// Titulo y Cabecera de columnas
		loContenedor.innerHTML = '<section class="SeccionDetalle">' +
		 							'<div><label class="SeccionDetalleTitulo">GESTIÓN DE GASTOS</label>' + 
		 							lsSoloAdmin +
		 						 '</section>';
		loCabecera = document.createElement("SECTION");
		loCabecera.innerHTML = '<label class="Liga_Gasto_Concepto Liga_Gasto_Normal">Concepto</label>' +
							   '<label class="Liga_Gasto_Importe Liga_Gasto_Normal">Importe</label>' +
							   '<label class="Liga_Gasto_Acciones Liga_Gasto_Normal">Acciones</label>';
		loCabecera.className = "Liga_Gasto_FilaTitulo";
	    loGasto.appendChild(loCabecera);
		
		for (lnCon=0;lnCon<lnMax;lnCon++) {
			FichaBasica (loGasto, poDatos[lnCon]);
			loContenedor.appendChild(loGasto)
			// Se suma el importe
			lnImpTotal += parseFloat(poDatos[lnCon].Gas_Importe);
		};
		
		// Se añaden totales
		loCabecera = document.createElement("SECTION");
		loCabecera.innerHTML = '<label id="LblTotal" Importe="' + lnImpTotal + '" class="Liga_Gasto_Total Liga_Gasto_Normal">IMPORTE TOTAL ' + Formato_Importe(lnImpTotal) + '</label>';
		loCabecera.className = "Liga_Gasto_FilaPie";
	    loGasto.appendChild(loCabecera);
	    
		loContenedor = null;
		loGasto = null;
		loCabecera = null;
	}
	
	function FichaBasica(poContenedor,
				 		 poGasto){
		/*
		* OPG 09/12/2015
		* Se añade la ficha básica del gasto
		*/	
		
		var loGasto = document.createElement('div');
		var loBtn;
		var loLbl;
		var loAcciones = document.createElement('div');
		var lnId = 0;
		
		lnId = poGasto.Gas_Id;
		loGasto.id = "Gas" + lnId;
		loGasto.className = "Liga_Gasto";
		
		// Concepto
		loLbl = document.createElement("label");
		loLbl.innerHTML = poGasto.Gas_Concepto;
		loLbl.id = "LblGasCon" + poGasto.Gas_Id;
		loLbl.title = "Motivo por el que se realiza el gasto";
		loLbl.className = "Liga_Gasto_Concepto Liga_Gasto_Item";
		loGasto.appendChild(loLbl);
		
		// Importe
		loLbl = document.createElement("label");
		loLbl.innerHTML = Formato_Importe(poGasto.Gas_Importe);
		loLbl.id = "LblGasImp" + poGasto.Gas_Id;
		loLbl.title = "Importe asignado al gasto"
		loLbl.className = "Liga_Gasto_Importe Liga_Gasto_Item";
		loGasto.appendChild(loLbl);
		
		// Solo para administradores
		if (CookieObtener("Admin") == true){
			// Acciones
			loAcciones.className = "Liga_Gasto_Acciones";
			// Botón para gestionar
			loBtn = document.createElement("img");
			loBtn.src = "images/Gestionar_26x26.png";
			loBtn.title = "Modificar gasto."
			loBtn.style.cursor = "pointer";
			loBtn.setAttribute('onclick', 'Gasto_GestionCargar(' + lnId + ');');
			loAcciones.appendChild(loBtn);
			// Boton para eliminar
			loBtn = document.createElement("img");
			loBtn.src = "images/Boton_Eliminar_26x26.png";
			loBtn.title = "Eliminar gasto."
			loBtn.style.cursor = "pointer";
			loBtn.setAttribute('onclick', 'Gasto_Eliminar(' + lnId + ');');
			loAcciones.appendChild(loBtn);
			loGasto.appendChild(loAcciones);
		}

		poContenedor.appendChild(loGasto);
		loAcciones = null;
		loBtn = null;
		loGasto = null;
		loLbl = null;
	}
	
	Gasto.prototype.GestionCargar = function(pnGasto) {
		/*
		 * OPG 16/02/2016
		 * Se cargan todos los datos del gasto indicado
		 */
		$.ajax({
			url: "Gasto_Cargar.php",
			data: {"pnId" : pnGasto},
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
	function GestionCargar_Retorno(poGasto){
		/*
		 * OPG 19/11/2015
		 * Se pasan los datos al detalle del gasto
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
		// Concepto
		loLabel.className = "LblNuevoUsuario";
		loLabel.innerHTML = "Gasto :";
		loDivLinea.display = 'block';
		loDivLinea.appendChild(loLabel);
		loText.setAttribute("type", "text");
		loText.setAttribute("value", poGasto.Gas_Concepto);
		loText.maxLength = 50;
		loText.id = "TxtGasCon";
		loDivLinea.appendChild(loText);
		loImgErr.id = "ImgErr_TxtGasCon";
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
		loText.setAttribute("value", poGasto.Gas_Importe);
		loText.maxLength = 10;
		loText.id = "TxtGasImp";
		loDivLinea.appendChild(loText);
		loImgErr = document.createElement("img");
		loImgErr.id = "ImgErr_TxtGasImp"
		loImgErr.src = "images/CampoErroneo_16x16.gif";
		loImgErr.className = "ImgErr_Correcto";
		loImgErr.style.visibility = "hidden";
		loDivLinea.appendChild(loImgErr);
		loContenedor.appendChild(loDivLinea);
		
		// botones
		loDivLinea = document.createElement('div');
		loDivLinea.display = 'block';
		loBtnAceptar.setAttribute('onclick', 'Gasto_Actualizar(' + poGasto.Gas_Id + ');');
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
}

function Gastos_CargarPorLiga(){
	/*
	 * OPG 27/11/2015
	 * Se cargan todas las fichas de los gastos del equipo para la liga actual.
	 */
	var loGasto = new Gasto();
	var lnEquipo = 0;
	var lnLiga = 0;
	var lnJugador = 0;
	
	try {
		lnLiga = ObtenerLigaId();
		loGasto.ListarPorLiga(lnEquipo, lnLiga, lnJugador);
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loGasto = null;
	}
}

function Gasto_GestionCargar(pnId){
	/*
	 * OPG 01/12/2015
	 * Se buscan los datos del gasto para cargarlos
	 */
	var loGasto = new Gasto();
	
	try {
		loGasto.GestionCargar(pnId);
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loGasto = null;
	}
}

function Gasto_Cargar(pnId){
	/*
	 * OPG 01/12/2015
	 * Se buscan los datos del gasto para cargarlos
	 */
	var loGasto = new Gasto();
	
	try {
		loGasto.Cargar(pnId);
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loGasto = null;
	}
}

function Gasto_Actualizar (pnId){
	/*
	 * OPG 01/12/2015
	 * Se actualiza la informacion del gasto indicado
	 */
	var loGasto = new Gasto();
	var lnEquipo = 0;
	var lnLiga = 0;
	var lnJugador = 0;
	var lsConcepto = "";
	var lnImporte = 0;
	var lnId = 0;
	
	try {
		//se recogen los valores en pantalla
		lnId = pnId;
		lnEquipo = ObtenerEquipoId();
		lnLiga = ObtenerLigaId();
		lnJugador = 0;
		lsConcepto = document.getElementById("TxtGasCon").value;
		lnImporte = document.getElementById("TxtGasImp").value;
		
		loGasto.Actualizar(lnId, lnEquipo, lnLiga, lnJugador, lsConcepto, lnImporte);
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loGasto = null;
	}
}

function Gasto_Eliminar (pnId){
	/*
	 * OPG 01/12/2015
	 * Se elimina el gasto indicado
	 */
	var loGasto = new Gasto();
	
	try {
		if (confirm('Se dispone a eliminar el gasto seleccionado. ¿Está seguro?') == true) {
			loGasto.Eliminar(pnId);
		}
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loGasto = null;
	}
}