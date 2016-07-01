/**
 * 
 * 
 */

function isString(s) {
    return typeof(s) === 'string' || s instanceof String;
}

function ValidarEmail(mail){
	return(/^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+.)+[A-Z]{2,4}$/i.test(mail));
}

function ControlarError(poError){
	/*
	 * Recepcion de control de errores
	 */
	var lsMsg = '';
	if (poError instanceof ReferenceError == true){
		lsMsg = poError.message;
	}
	else if(poError instanceof UserException == true){
		lsMsg = poError.DescripcionGet();
	}
	else{
		if (isString(poError)){
			
			lsMsg = poError;
		}
		else{
			lsMsg = poError.Descripcion;
		}
	}
	alert(lsMsg);
}

function ComboPosicionar (psComboId, psValue){
	/*
	 * OPG 04/12/2015
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
}

function PersonaComponerNombreCompleto (psNombre, psApellido1, psApellido2){
	/*
	 * OPG 04/12/2015
	 * Se devuelve la composicion del nombre + apellido 1 + Apellido2
	 */
	if (psNombre == null){
		psNombre = '';
	}
	
	if (psApellido1 == null){
		psApellido1 = '';
	}
	else{
		psApellido1 = ' ' + psApellido1;
	}
	if (psApellido2 == null){
		psApellido2 = '';
	}
	else{
		psApellido2 = ' ' + psApellido2;
	}
	
	return psNombre + psApellido1 + psApellido2;
}

function Formato_Importe (pnImporte){
	/*
	 * OPG 09/12/2015
	 * Se devuelve el formato adecuado para los importes
	 */	
	if (pnImporte == null){
		pnImporte = 0;
	}
	return Number(pnImporte).toFixed(2) + ' €';
}

function Informar_Tecnico (psValor){
	/*
	 * Se muestra a nivel informativo tecnico el mensaje indicado
	 */
	
	$("#Informativo").html(psValor);
}

function EliminarObjeto(psIdObjeto){
	/*
	 * OPG 18/01/2016
	 * Se elimina el objeto con el id indicado
	 */
	var loElement = document.getElementById(psIdObjeto);
	loElement.outerHTML = "";
	delete loElement;
}

/*
	TEMAS Cookie 
*/
function CookieCrear(psClave, psValor, pnDiasExpiracion) {
	var lsExpires = "";
	var d = new Date();
	
	if (pnDiasExpiracion>0){
    	d.setTime(d.getTime() + (pnDiasExpiracion*24*60*60*1000));
    	lsExpires = "expires="+d.toUTCString();
	}
    document.cookie = psClave + "=" + psValor + "; " + lsExpires;
}
 
function CookieObtener(psClave) {
    var name = psClave + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
 
function CookieComprobar(psClave) {
    var clave = CookieObtener(psClave);
    var lbRes = false;
    if (clave!="") {
        // La cookie existe.
    	lbRes = true;
    }else{
        // La cookie no existe.
    	lbRes = false;
    }
}