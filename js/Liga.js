/*
 * OPG 05/12/2015
 * Simulacion de clase para contener Ligas
 */
function Liga(){
	// Viariables
	var nId = 0;
	var nEquipo = 0;
	var sNombre = '';
	var sDescripcion = '';
	
	// Propiedades
	Liga.prototype.IdGet = function() {		
		return nId;
	};
	Liga.prototype.IdSet = function(pnId) {
		nId = pnId;
	};
	
	Liga.prototype.EquipoGet = function() {
		return nEquipo;
	};
	Liga.prototype.EquipoSet = function(pnEquipo) {
		nEquipo = pnEquipo;
	};
	
	Liga.prototype.NombreGet = function() {
		return sNombre;
	};
	Liga.prototype.NombreSet = function(psNombre) {
		sNombre = psNombre;
	};
	
	Liga.prototype.DescripcionGet = function() {
		return sDescripcion;
	};
	Liga.prototype.DescripcionSet = function(psDescripcion) {
		sDescripcion = psDescripcion;
	};
	
	function Balance_FichaBasica(poContenedor,
		       					 poBalance){
		/*
		* OPG 09/12/2015
		* Se añade la ficha básica el balance
		*/	
		
		var lsJugador = PersonaComponerNombreCompleto(poBalance.Jug_Nombre, poBalance.Jug_Apellido1, poBalance.Jug_Apellido2);
		var loBalance = document.createElement('div');
		var loLbl;
		var lsCssItem = "";
		
		loBalance.id = "Bal" + poBalance.Id;
		loBalance.setAttribute('Tipo', poBalance.Tipo);
		loBalance.className = "Liga_BalanceContable";
		if (poBalance.Tipo == 'I'){
			lsCssItem = " Liga_BalanceContable_Ingreso"; 
		}
		else{
			lsCssItem = " Liga_BalanceContable_Gasto";
		} 
		
		// Concepto
		loLbl = document.createElement('label');
		loLbl.innerHTML = poBalance.Concepto
		loLbl.title = "Motivo por el que se realiza el ingreso o gasto";
		loLbl.className = "Liga_BalanceContable_Concepto " + lsCssItem;
		loBalance.appendChild(loLbl);
		
		// Importe
		loLbl = document.createElement('label');
		loLbl.innerHTML = Formato_Importe(poBalance.Importe);
		loLbl.title = "Importe del movimiento";
		loLbl.className = "Liga_BalanceContable_Importe " + lsCssItem;
		loBalance.appendChild(loLbl);
		
		// Jugador
		loLbl = document.createElement('label');
		loLbl.innerHTML = lsJugador;
		loLbl.title = "Jugador que realiza el movimiento";
		loLbl.className = "Liga_BalanceContable_Jugador " + lsCssItem;
		loBalance.appendChild(loLbl);
				
		poContenedor.appendChild(loBalance);
		
		loLbl = null;
		loBalance = null;
	}
	
	// Metodos 
	Liga.prototype.Inicializa = function() {
	/*
	 * OPG 02/12/2015
	 * Se inicializan los datos de la clase
	 */	
		nId = 0;
		nEquipo = 0;
		sNombre = '';
		sDescripcion = '';
	};

	Liga.prototype.Obtener = function(pnId) {
		/*
		 * 22/01/2016
		 * Se buscan los datos de la liga indica
		 */
		$.ajax({
			url: "Liga_Cargar.php",
			data: {"pnLiga" : pnId},
            async:false,    
            cache:false,   
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	Obtener_Retorno.call(this, JSON.parse(Retorno));
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){
            	throw objXMLHttpRequest;
            }
		});
	};
	function Obtener_Retorno (poDatos) {
        /*
		 * OPG 22/01/2016
		 * Se pasa la informacion de BD a la clase
		 */
		sNombre  = poDatos.Lig_Nombre;
		sDescripcion = poDatos.Lig_Descripcion;
	}
	
	Liga.prototype.Balance_Listar = function(pnLiga) {
		/*
		 * 05/12/2015
		 * Se lista en pantalla las ingresos y los gastos de la liga indicada
		 */
		
		$.ajax({
			url: "Liga_Balance_Listar.php",
			data: {"pnLiga" : pnLiga},
            async:true,    
            cache:false,   
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	Balance_Listar_Retorno.call(this, JSON.parse(Retorno));
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){
            	throw objXMLHttpRequest;
            }
		});
	};
	function Balance_Listar_Retorno (poDatos) {
        /*
		 * OPG 05/12/2015
		 * Se cargan en pantalla el balance de ingresos y gastos 
		 */
		var lnCon = 0;
		var lnMax = 0;
		var loContenedor = document.getElementById("EquipoLiga_Cuerpo");
		var loBalance = document.createElement("SECTION");
		var loCabecera = document.createElement("SECTION");
		var lnImpTotal = 0;
		var lnSigno = 1;
		var lsCssItem = '';
		
		lnMax = poDatos.length;
		loContenedor.innerHTML = '';
		loBalance.className = "SeccionDetalle";
		
		// Titulo y Cabecera de columnas
		loContenedor.innerHTML = '<section class="SeccionDetalle">' +
									'<div><label class="SeccionDetalleTitulo">BALANCE CONTABLE</label>' + 
									'</div>' +
								'</section>';
		loCabecera = document.createElement("SECTION");
		loCabecera.innerHTML = '<label class="Liga_BalanceContable_Concepto Liga_BalanceContable_Normal">Concepto</label>' +
							   '<label class="Liga_BalanceContable_Importe Liga_BalanceContable_Normal">Importe</label>' +
							   '<label class="Liga_BalanceContable_Jugador Liga_BalanceContable_Normal">Jugador</label>';
		loCabecera.className = "Liga_BalanceContable_FilaTitulo";
	    loBalance.appendChild(loCabecera);
		
		for (lnCon=0;lnCon<lnMax;lnCon++) {
			Balance_FichaBasica (loBalance, poDatos[lnCon]);
			loContenedor.appendChild(loBalance)
			// Se suma o se resta el importe
			if (poDatos[lnCon].Tipo=='G'){
				lnSigno = -1;
			}
			else{
				lnSigno = 1;
			}
			lnImpTotal += parseFloat(poDatos[lnCon].Importe) * lnSigno;
		};
		
		// Se añaden totales
		if (lnImpTotal < 0){
			lsCssItem = " Liga_BalanceContable_Gasto"; 
		}
		else{
			lsCssItem = " Liga_BalanceContable_Ingreso";
		}
		
		loCabecera = document.createElement("SECTION");
		loCabecera.innerHTML = '<label class="Liga_BalanceContable_Total' + lsCssItem + '">IMPORTE TOTAL ' + Formato_Importe(lnImpTotal) + '</label>';
		loCabecera.className = "Liga_BalanceContable_FilaPie";
	    loBalance.appendChild(loCabecera);
	    
		loContenedor = null;
		loBalance = null;
		loCabecera = null;
	}
}

function Balance_CargarPorLiga(){
	/*
	 * OPG 05/12/2015
	 * Se cargan los datos de gastos / ingresos
	 */
	var loLiga = new Liga();
	var lnLiga = 0;
	
	try {
		lnLiga = ObtenerLigaId();
		loLiga.Balance_Listar(lnLiga);
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loLiga = null;
	}
}