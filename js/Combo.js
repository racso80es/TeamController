/*
 * OPG 11/12/2015
 * Simulacion de clase metodos de combos
 */
function Combo(){
	// Viariables

	// Metodos
	Combo.prototype.Posicionar = function(psComboId, psValue) {
		/*
		 * 11/12/2015
		 * Seselecciona la opcion indicada del select en base al psValue indicado
	    */
		var loCmb = document.getElementById(psComboId);
		var lnCon;
		var lbSeguir;
		
		lnCon = 0;
		lbSeguir = true;
		
		while (lbSeguir && lnCon < loCmb.length){
			if (loCmb.options[lnCon].value == psValue){
				loCmb.options[lnCon].selected = true;
				lbSeguir = false;
			}
			else{
				lnCon++;
			};
		};
	};
	
	DocumentacionTipo.prototype.ToCombo = function(psId,			       
			   									   pnValorDefecto,
			   									   pbMostrarSinSeleccionar,
			   									   poDatos,
			   									   psCampoId,
			   									   psCampoNombre){
		/*
		* OPG 11/12/2015
		* Se crea desplegable con los valores indicados
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
