/*
 * OPG 11/12/2015
 * Simulacion de clase para contener tipos de documentacion
 */
function DocumentacionTipo(){
	DocumentacionTipo.prototype.Listar = function() {
		/*
		 * 11/12/2015
		 * Se devuelven los tipos documentaciones coincidentes con los filtros
		 */
		var loRes;
		
		$.ajax({
			url: "DocumentacionTipo_Listar.php",
			data: {},
            async:false,    
            cache:false,   
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	loRes = JSON.parse(Retorno);
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){
            	alert (objXMLHttpRequest);
            }
		});
		return loRes;
	};
	
	DocumentacionTipo.prototype.ToCombo = function(psId,			       
			 									   pnValorDefecto,
			 									   pbMostrarSinSeleccionar){
		/*
		* OPG 11/12/2015
		* Se crea desplegable con con los tipos de documentacion indicados
		*/
		var lnCon = 0;
		var loDatos;
		var loItem;
		var loCmb = document.createElement("select");
		
		loCmb.setAttribute("id", psId);
		loDatos = this.Listar ();
		
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
			loItem = document.createElement("option");
			loItem.id = loDatos[lnCon].DocTip_Id;
			loItem.value = loDatos[lnCon].DocTip_Id;
			loItem.text = loDatos[lnCon].DocTip_Nombre;
			if (pnValorDefecto == loDatos[lnCon].DocTip_Id){
				loItem.selected = true;
			} 
			loCmb.appendChild(loItem);
			loItem = null;
		}
		return loCmb;
	}
}