/*
 * OPG 11/12/2015
 * Simulacion de clase para contener documentacion
 */
function Documentacion(){
	// Viariables
	var nId = 0;
	var nEquipo = 0;
	var nLiga = 0;
	var nJugador = 0;
	var sNombre = '';
	var sDescripcion = '';
	var nTipo = 0;
	var nValor = 0;
	
	// Propiedades
	Documentacion.prototype.IdGet = function() {		
		return nId;
	};
	Documentacion.prototype.IdSet = function(pnId) {
		nId = pnId;
	};
	
	Documentacion.prototype.EquipoGet = function() {
		return nEquipo;
	};
	Documentacion.prototype.EquipoSet = function(pnEquipo) {
		nEquipo = pnEquipo;
	};
	
	Documentacion.prototype.LigaGet = function() {
		return nLiga;
	};
	Documentacion.prototype.LigaSet = function(pnLiga) {
		nLiga = pnLiga;
	};
	
	Documentacion.prototype.JugadorGet = function() {
		return nJugador;
	};
	Documentacion.prototype.JugadorSet = function(pnJugador) {
		nJugador = pnJugador;
	};
	
	Documentacion.prototype.NombreGet = function() {
		return sNombre;
	};
	Documentacion.prototype.NombreSet = function(psNombre) {
		sNombre = psNombre;
	};
	
	Documentacion.prototype.DescripcionGet = function() {
		return sDescripcion;
	};
	Documentacion.prototype.DescripcionSet = function(psDescripcion) {
		sDescripcion = psDescripcion;
	};
	
	Documentacion.prototype.TipoGet = function() {
		return nTipo;
	};
	Documentacion.prototype.TipoSet = function(pnTipo) {
		nTipo = pnTipo;
	};
	
	Documentacion.prototype.ValorGet = function() {
		return nValor;
	};
	Documentacion.prototype.ValorSet = function(pnValor) {
		nValor = pnValor;
	};
	
	function Cargar_Retorno (poDatos) {
	        /*
			 * OPG 11/12/2015
			 * Se carga la ficha del Documentacion
			 */
			var loDatos = JSON.parse(poDatos);
			var loTitulo = document.getElementById("LblDocTit");
			var loNombre = document.getElementById("TxtDocNom");
			var loDescripcion = document.getElementById("TxtDocDes");
			var loCmbTip = document.getElementById("CmbDocTip");
			var loValor = document.getElementById("TxtDocVal");
			var loCmbJug = document.getElementById("CmbDocJug");
			var loBtnAcc = document.getElementById("BtnDocAcc");
			
			loTitulo.innerHTML = "Modificación de Documentación";
			loNombre.value = loDatos.Doc_Nombre;
			loDescripcion.value = loDatos.Doc_Descripcion;
			loValor.value = loDatos.Doc_Valor;
			ComboPosicionar ("CmbDocTip", loDatos.DocTip_Id);
			ComboPosicionar ("CmbDocJug", loDatos.Jug_Id);
			loBtnAcc.innerHTML = "Modificar Documentación";
			loBtnAcc.setAttribute('onclick', 'Documentacion_Actualizar(' + loDatos.Doc_Id + ');');
	}
	
	function Actualizar_Retorno (poRetorno, psNombre, psDescripcion, pnTipo, pnValor, pnJugador) {
		/*
		 * OPG 11/12/2015
		 * Se trata el resultado de actualizar la documentacion 
		 */
		//var loResult = JSON.parse(poRetorno);
		var loError;
		var loContenedor;
		
		switch (poRetorno.Correcto) {
	    case false: // Error
	    	loError = new UserException();
	    	loError.Set(1, poRetorno.Descripcion);
	    	ControlarError (loError);
	    	loError = null;
	    	//alert(poRetorno.Descripcion);
	        break;
	    case true: // correcto
	    	switch (poRetorno.Resultado.Accion){
	    	case "N": // Nuevo
	    		loContenedor = document.getElementById("EquipoLiga_Cuerpo");
	    		Documentacion_FichaBasica(loContenedor, poRetorno.Resultado.Id, psNombre, psDescripcion, pnTipo, pnValor, pnJugador);
	    		break;
	    	case "M": // Modificacion
		    	document.getElementById("LblDocTit").innerHTML ='Añadir Documentación';
		    	document.getElementById("TxtDocNom").value = '';
		    	document.getElementById("TxtDocDes").value = '';
		    	document.getElementById("TxtDocVal").value = '0';
		    	ComboPosicionar ("CmbDocTip", 0);
				ComboPosicionar ("CmbDocJug", 0);
				
		    	var loBtnAcc = document.getElementById("BtnDocAcc");
		    	loBtnAcc.innerHTML = "Nueva Documentacion";
		    	loBtnAcc.setAttribute('onclick', 'Documentacion_Actualizar(0);');
		    	
		    	var loLink = document.getElementById("TxtDoc" + poRetorno.Resultado.Id);
		    	loLink.title = psNombre;
		    	loLink.innerHTML = psNombre + ' ' + pnValor;
		        break;	
	    	}
		}
	}
	
	function Eliminar_Retorno(pnId, paResultado){
		/*
		 * OPG 11/12/2015
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
			// Se quita de pantalla lo relacionado con el Documentacion
			loContenedor = document.getElementById('Doc' + pnId);	
			loPadre = loContenedor.parentNode;
			loPadre.removeChild(loContenedor);
		};
	}
	
	// Metodos 
	Documentacion.prototype.Inicializa = function() {
	/*
	 * OPG 11/12/2015
	 * Se inicializan los datos de la clase
	 */		
		nId = 0;
		nEquipo = 0;
		nLiga = 0;
		nJugador = 0;
		nNombre = "";
		nDescripcion = "";
		nTipo = 0;
		nValor = 0;
	};
	
	Documentacion.prototype.Listar = function(pnEquipo, pnLiga, pnJugador) {
		/*
		 * 11/12/2015
		 * Se devuelven las documentaciones coincidentes con los filtros
		 */
		var loRes;
		
		$.ajax({
			url: "Documentacion_Listar.php",
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
	
	Documentacion.prototype.Cargar = function(pnId) {
		/*
		 * 11/12/2015
		 * Se carga el Documentacion indicado
		 */
		$.ajax({
			url: "Documentacion_Cargar.php",
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
	
	Documentacion.prototype.Actualizar = function(pnId, 
												  pnEquipo, 
												  pnLiga, 
												  pnJugador, 
												  psNombre, 
												  psDescripcion, 
												  pnTipo, 
												  pnValor) {
		/*
		 * 11/12/2015
		 * Se actualiza la documentacion indicada
		 */
		var laResult;
		
		if (psNombre.length==0){
			laResult = '{"Correcto":false,"Descripcion":"Ha de indicar un Nombre para la documentacion."}';
			Actualizar_Retorno.call(this, JSON.parse(laResult), psNombre, psDescripcion, pnTipo, pnValor);
		}
		else{
			$.ajax({
				url: "Documentacion_Actualizar.php",
				data:{ 
					    "pnId": pnId,
					    "pnEquipo": pnEquipo,
					    "pnLiga": pnLiga,
					    "pnJugador": pnJugador,
						"psNombre": psNombre,
						"psDescripcion": psDescripcion,
						"pnTipo": pnTipo,
						"pnValor": pnValor,
						"pbActivo": 1
					},
				async:true,    
	            cache:false,   
	            dataType:"html",
	            type: 'POST',
	            success:  function(Retorno){
	            	Actualizar_Retorno.call(this, JSON.parse(Retorno), psNombre, psDescripcion, pnTipo, pnValor);
	            },
	            beforeSend:function(){},
	            error:function(objXMLHttpRequest){
	            	throw objXMLHttpRequest;
	            }
			});
		}
	};
	
	Documentacion.prototype.Eliminar = function(pnId) {
		/*
		 * OPG 11/12/2015
		 * Se elimina la documentacion indicada
		 */
		
		$.ajax({
			url: "Documentacion_Eliminar.php",
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