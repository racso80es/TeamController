/*
 * OPG 02/12/2015
 * Simulacion de clase para contener Jugadors
 */
function Jugador(){
	// Viariables
	var nId = 0;
	var nEquipo = 0;
	var sNombre = 0;
	var sApellido1 = '';
	var sApellido2 = '';
	var sEmail = '';
	var nImporte = 0;
	var aLista;
	
	// Propiedades
	Jugador.prototype.IdGet = function() {		
		return nId;
	};
	Jugador.prototype.IdSet = function(pnId) {
		nId = pnId;
	};
	
	Jugador.prototype.EquipoGet = function() {
		return nEquipo;
	};
	Jugador.prototype.EquipoSet = function(pnEquipo) {
		nEquipo = pnEquipo;
	};
	
	Jugador.prototype.NombreGet = function() {
		return sNombre;
	};
	Jugador.prototype.NombreSet = function(psNombre) {
		sNombre = psNombre;
	};
	
	Jugador.prototype.Apellido1Get = function() {
		return sApellido1;
	};
	Jugador.prototype.Apellido1Set = function(psApellido1) {
		sApellido1 = psApellido1;
	};
	
	Jugador.prototype.Apellido2Get = function() {
		return sApellido2;
	};
	Jugador.prototype.Apellido2Set = function(psApellido2) {
		sApellido2 = psApellido2;
	};
	
	Jugador.prototype.EmailGet = function() {
		return sEmail;
	};
	Jugador.prototype.EmailSet = function(psEmail) {
		sEmail = psEmail;
	};

	Jugador.prototype.ListaGet = function() {		
		return aLista;
	};
	Jugador.prototype.ListaSet = function(paLista) {
		aLista = paLista;
	};
	
	function Cargar_Retorno (poDatos) {
	        /*
			 * OPG 02/12/2015
			 * Se carga la ficha del Jugador
			 */
			alert (poDatos);
			var loDatos = JSON.parse(poDatos);
			var loTitulo = document.getElementById("LblIngTit");
			var loConcepto = document.getElementById("TxtIngCon");
			var loImporte = document.getElementById("TxtIngImp");
			var loCmbJug = document.getElementById("CmbIngJug");
			var loBtnAcc = document.getElementById("BtnIngAcc");
			
			loTitulo.innerHTML = "Modificación de Jugador";
			loConcepto.value = loDatos.Ing_Concepto;
			loImporte.value = loDatos.Ing_Importe;
			ComboPosicionar ("CmbIngJug", loDatos.Jug_Id);
			loBtnAcc.innerHTML = "Modificar Jugador";
			loBtnAcc.setAttribute('onclick', 'Jugador_Actualizar(' + loDatos.Ing_Id + ');');
	}
	
	function Actualizar_Retorno (poResult, psConcepto, pnImporte) {
		/*
		 * OPG 02/12/2015
		 * Se trata el resultado de actualizar el Jugador 
		 */
		var loResult = JSON.parse(poResult);
		var loContenedor;
		
		switch (loResult.Accion) {
	    case 0: // Error
	    	ControlarError (loResult);
	        break;
	    case 1: // Nuevo
	    	loContenedor = document.getElementById("EquipoLiga_Cuerpo");
	    	Jugador_FichaBasica(loContenedor, loResult.Id, psConcepto, pnImporte);
	        break;
	    case 2: // Modificacion
	    	document.getElementById("LblIngTit").innerHTML ='Añadir Jugador';
	    	document.getElementById("TxtIngCon").value = '';
	    	document.getElementById("TxtIngImp").value = '0';
	    	var loBtnAcc = document.getElementById("BtnIngAcc");
	    	loBtnAcc.innerHTML = "Nuevo Jugador";
	    	loBtnAcc.setAttribute('onclick', 'Jugador_Actualizar(0);');
	    	
	    	var loLink = document.getElementById("TxtIng" + loResult.Id);
	    	loLink.title = psConcepto;
	    	loLink.innerHTML = psConcepto + ' ' + pnImporte;
	        break;	
		}
	}
	
	function Eliminar_Retorno(pnId, paResultado){
		/*
		 * OPG 02/12/2015
		 * Se actua en función del resultado de la llamada al servidor
		 */
		var loContenedor;
		var loPadre;
		
		// Se se ha producido un error, se muestra por pantalla
		if (paResultado.Resultado == 0) {
			// Fallo
			ControlarError (paResultado);
		}	
		else{
			// Se quita de pantalla lo relacionado con el Jugador
			loContenedor = document.getElementById('Ing' + pnId);	
			loPadre = loContenedor.parentNode;
			loPadre.removeChild(loContenedor);
		};
	}
	
	// Metodos 
	Jugador.prototype.Inicializa = function() {
	/*
	 * OPG 02/12/2015
	 * Se inicializan los datos de la clase
	 */		
		nId = 0;
		nEquipo = 0;
		nLiga = 0;
		nJugador = 0;
		nConcepto = '';
		nImporte = 0;
	};

	Jugador.prototype.Listar = function(pnEquipo) {
		/*
		 * 01/07/2015
		 * Se devuelven los jugadores del equipo indicado
		 */
		$.ajax({
			url: "FuncionesAjax.php",
			data: {"psAccion" : "Jugador_Listar",
				   "pnEquipo" : pnEquipo},
            async:false,    
            cache:false,   
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	aLista = JSON.parse(Retorno);
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){
            	throw objXMLHttpRequest;
            }
		});
	};
	
	Jugador.prototype.Cargar = function(pnId) {
		/*
		 * 02/12/2015
		 * Se carga el Jugador indicado
		 */
		$.ajax({
			url: "Jugador_Cargar.php",
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
	
	Jugador.prototype.Actualizar = function(pnId, pnEquipo, pnLiga, pnJugador, psConcepto, pnImporte) {
		/*
		 * 02/12/2015
		 * Se actualiza el Jugador indicado
		 */
		var laResult;
		
		if (psConcepto.length==0){
			laResult = '{"Resultado":0,"Accion":0, "Id":0, "Descripcion":"Ha de indicar un concepto para el Jugador."}';
			Actualizar_Retorno.call(this, laResult, lsConcepto, lnImporte);
		}
		else{
			$.ajax({
				url: "Jugador_Actualizar.php",
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
	            	Actualizar_Retorno.call(this, Retorno, psConcepto, pnImporte);
	            },
	            beforeSend:function(){},
	            error:function(objXMLHttpRequest){
	            	throw objXMLHttpRequest;
	            }
			});
		}
	};
	
	Jugador.prototype.Eliminar = function(pnId) {
		/*
		 * OPG 02/12/2015
		 * Se elimina el Jugador indicado
		 */
		
		$.ajax({
			url: "Jugador_Eliminar.php",
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
}
