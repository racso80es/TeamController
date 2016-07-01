/*
 * OPG 18/01/2016
 * Simulacion de clase para contener equipos
 */
function Equipo(){
	// Viariables
	var nId = 0;
	var sNombre = '';
	var sDescripcion = '';
	
	// Propiedades
	Equipo.prototype.IdGet = function() {		
		alert(nId);
		return nId;
	};
	Equipo.prototype.IdSet = function(pnId) {
		nId = pnId;
	};
	
	Equipo.prototype.NombreGet = function() {
		return sNombre;
	};
	Equipo.prototype.NombreSet = function(psNombre) {
		sNombre = psNombre;
	};
	
	Equipo.prototype.DescripcionGet = function() {
		return sDescripcion;
	};
	Equipo.prototype.DescripcionSet = function(psDescripcion) {
		sDescripcion = psDescripcion;
	};
	
	
	function Eliminar_Retorno(pnId, paResultado){
		/*
		 * OPG 18/01/2016
		 * Se actua en función del resultado de la llamada al servidor
		 */
		
		// Se se ha producido un error, se muestra por pantalla
		if (paResultado.Resultado == 0) {
			// Fallo
			ControlarError (paResultado);
		}	
		else{
			// Se quita de pantalla lo relacionado con el Equipo
			EliminarObjeto ('Equ' + pnId);
			$("#Cuerpo").html('');
		};
	}
	
	// Metodos 
	Equipo.prototype.Inicializa = function() {
	/*
	 * OPG 18/01/2016
	 * Se inicializan los datos de la clase
	 */		
		nId = 0;
		sNombre = '';
		sDescripcion = '';
	};

	Equipo.prototype.Cargar = function(pnId) {
		/*
		 * 30/06/2015
		 * Se carga el equipo indicado
		 */
		$.ajax({
			url: "FuncionesAjax.php",
			data: {"psAccion" : "Equipo_Obtener",
				   "pnId" : pnId},
            async:false,    
            cache:false,   
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	loRes = JSON.parse(Retorno);
            	nId = loRes.Equ_Id;
            	sNombre = loRes.Equ_Nombre;
            	sDescripcion = loRes.Equ_Descripcion;
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){
            	throw objXMLHttpRequest;
            }
		});
	};
	
	Equipo.prototype.Eliminar = function(pnId) {
		/*
		 * OPG 18/01/2016
		 * Se elimina el Equipo indicado
		 */
		
		$.ajax({
			url: "Equipo_Eliminar.php",
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
