function PopUp_UsuarioRecordar_Generar (){
	/*
	 * OPG 15/03/2016
	 * Se genera toda la estructura HTML para recordar la contraseña de usuario 
	 */
	var loContenedor = document.getElementById("PopUp_Cuerpo");
	var loTitulo = document.getElementById("PopUp_Titulo");
	var loBtnAceptar = document.createElement("BUTTON");
	var loBtnCancelar = document.createElement("BUTTON");
	var loDivLinea = document.createElement('div');
	var loLabel = document.createElement("label"); 
	var loText = document.createElement("input");
	var loImgErr = document.createElement("img");
	var lsTitulo = "";
	
	loContenedor.parentNode.style.width = "375px";
	loContenedor.innerHTML = "";
	
	lsTitulo = "Recordar contraseña";
	loTitulo.innerHTML = lsTitulo;

	// Se crean las lienas y contenido para el usuario
	// Usuario
	loLabel.className = "LblNuevoUsuario";
	loLabel.innerHTML = "Usuario :";
	loDivLinea.display = 'block';
	loDivLinea.appendChild(loLabel);
	loText.setAttribute("type", "email");
	loText.maxLength = 50;
	loText.id = "TxtUsuRec";
	loText.className = "Email";
	loText.placeholder="Indique email."
	loDivLinea.appendChild(loText);
	loImgErr.id = "ImgErr_TxtUsuRec"
	loImgErr.src = "images/CampoErroneo_16x16.gif";
	loImgErr.className = "ImgErr_Correcto";
	loImgErr.style.visibility = "hidden";
	loDivLinea.appendChild(loImgErr);
	loContenedor.appendChild(loDivLinea);
		
	// Se indican las acciones para los botones
	// botones
	loDivLinea = document.createElement('div');
	loDivLinea.display = 'block';
	loBtnAceptar.setAttribute('onclick', 'Usuario_ReenviarPassword();');
	loBtnAceptar.innerHTML = 'Aceptar';
	loDivLinea.appendChild(loBtnAceptar);
	loBtnCancelar.setAttribute('onclick', 'PopUp_Cerrar()');
	loBtnCancelar.innerHTML = 'Cancelar';
	loDivLinea.appendChild(loBtnCancelar);
	loContenedor.appendChild(loDivLinea);
	
	// Se cierra todo lo posible
	loContenedor = null;
	loBtnAceptar = null;
	loBtnCancelar = null;
	loDivLinea = null;
	loLabel = null;
	loText = null;
	
	PopUp_Abrir();
}

function PopUp_NuevoUsuario_Generar (psUsuario, pnId){
	/*
	 * OPG 22/12/2015
	 * Se genera toda la estructura HTML para contener el alta de usuario 
	 */
	var loContenedor = document.getElementById("PopUp_Cuerpo");
	var loTitulo = document.getElementById("PopUp_Titulo");
	var loBtnAceptar = document.createElement("BUTTON");
	var loBtnCancelar = document.createElement("BUTTON");
	var loDivLinea = document.createElement('div');
	var loLabel = document.createElement("label"); 
	var loText = document.createElement("input");
	var loImgErr = document.createElement("img");
	var lsTitulo = "";
	var lsEmail = "";
	var lnId = 0;
	var lbSoloLectura = false;
	
	loContenedor.parentNode.style.width = "375px";
	loContenedor.innerHTML = "";
	
	if (psUsuario == null){
		lsTitulo = "Alta de usuario";
		lsEmail = "";
		lbSoloLectura = false;
		lnId = 0;
	}
	else{
		lsTitulo = "Invitación de usuario";
		lsEmail = psUsuario;
		lbSoloLectura = true;
		lnId = pnId;
	};
	
	loTitulo.innerHTML = lsTitulo;

	' Se crean las lienas y contenido para email y contraseña'
	// Email
	loLabel.className = "LblNuevoUsuario";
	loLabel.innerHTML = "Correo electrónico :";
	loDivLinea.display = 'block';
	loDivLinea.appendChild(loLabel);
	loText.setAttribute("type", "email");
	loText.setAttribute("value", lsEmail);
	loText.readOnly = lbSoloLectura;
	loText.maxLength = 50;
	loText.id = "TxtNueUsuEmail";
	loText.className = "Email";
	loDivLinea.appendChild(loText);
	loImgErr.id = "ImgErr_TxtNueUsuEmail"
	loImgErr.src = "images/CampoErroneo_16x16.gif";
	loImgErr.className = "ImgErr_Correcto";
	loImgErr.style.visibility = "hidden";
	loDivLinea.appendChild(loImgErr);
	loContenedor.appendChild(loDivLinea);
	
	// Contraseña
	loDivLinea = document.createElement('div');
	loDivLinea.display = 'block';
	loLabel = document.createElement("label");
	loLabel.innerHTML = "Contraseña :";
	loLabel.className = "LblNuevoUsuario";
	loDivLinea.appendChild(loLabel);
	loText = document.createElement("input");
	loText.setAttribute("type", "password");
	loText.setAttribute("value", "");
	loText.maxLength = 50;
	loText.id = "TxtNueUsuPass";
	loText.className = "Password";
	loDivLinea.appendChild(loText);
	loImgErr = document.createElement("img");
	loImgErr.id = "ImgErr_TxtNueUsuPass"
	loImgErr.src = "images/CampoErroneo_16x16.gif";
	loImgErr.className = "ImgErr_Correcto";
	loImgErr.style.visibility = "hidden";
	loDivLinea.appendChild(loImgErr);
	loContenedor.appendChild(loDivLinea);
	
	//Alias
	loDivLinea = document.createElement('div');
	loDivLinea.display = 'block';
	loLabel = document.createElement("label");
	loLabel.innerHTML = "Alias :";
	loLabel.className = "LblNuevoUsuario";
	loDivLinea.appendChild(loLabel);
	loText = document.createElement("input");
	loText.setAttribute("type", "text");
	loText.setAttribute("value", "");
	loText.maxLength = 50;
	loText.id = "TxtNueUsuAlias";
	loText.className = "Alias";
	loDivLinea.appendChild(loText);
	loImgErr = document.createElement("img");
	loImgErr.id = "ImgErr_TxtNueUsuAlias"
	loImgErr.src = "images/CampoErroneo_16x16.gif";
	loImgErr.className = "ImgErr_Correcto";
	loImgErr.style.visibility = "hidden";
	loDivLinea.appendChild(loImgErr);
	loContenedor.appendChild(loDivLinea);
	
	// Se indican las acciones para los botones
	// botones
	loDivLinea = document.createElement('div');
	loDivLinea.display = 'block';
	loBtnAceptar.setAttribute('onclick', 'PopUp_NuevoUsuario_Aceptar(' + lnId + ');');
	loBtnAceptar.innerHTML = 'Aceptar';
	loDivLinea.appendChild(loBtnAceptar);
	loBtnCancelar.setAttribute('onclick', 'PopUp_Cerrar()');
	loBtnCancelar.innerHTML = 'Cancelar';
	loDivLinea.appendChild(loBtnCancelar);
	loContenedor.appendChild(loDivLinea);
	
	// Se cierra todo lo posible
	loContenedor = null;
	loBtnAceptar = null;
	loBtnCancelar = null;
	loDivLinea = null;
	loLabel = null;
	loText = null;
	
	PopUp_Abrir();
}

function PopUp_NuevoUsuario_Aceptar(pnInvitacion) {
	/*
	 * OPG 24/12/2015
	 * Si todo es correcto, se crea el usuario indicado
	 */
	var loEmail = document.getElementById("TxtNueUsuEmail");
	var loImgErrEma = document.getElementById("ImgErr_TxtNueUsuEmail");
	var loAlias = document.getElementById("TxtNueUsuAlias");
	var loPass = document.getElementById("TxtNueUsuPass");
	var loImgErrPass = document.getElementById("ImgErr_TxtNueUsuPass");
	var loResult;
	var loError = new UserException();
	var loUsuario = new Usuario();
	try {
		// Validacion de campos
		if (loEmail.value.length === 0){
			loImgErrEma.style.visibility = "visible";
			loError.Set(55, "Ha de indicar un correo válido");
			throw loError;
		}else{
			loImgErrEma.style.visibility = "hidden";
		}
		if (loPass.value.length < 5){
			loImgErrPass.style.visibility = "visible";
			loError.Set(55, "Ha de indicar una contraseña válida superior a 4 carácteres");
			throw loError;
		}else{
			loImgErrPass.style.visibility = "hidden";
		}
		
		// Todo correcto
		if (pnInvitacion == 0){
			loUsuario.Actualizar(0, loEmail.value, loAlias.value, loPass.value);
		}
		else{
			loUsuario.Invitacion_Aceptar(loEmail.value, loAlias.value, loPass.value, pnInvitacion);
		}
	} catch(e) {  
		if (e instanceof UserException){
			ControlarError(e); // Si ocurre un error es manejado
		}else{
			loError.Set(55, e.message);
			ControlarError(loError);
		}
	} finally {
		loError = null;
		loEmail = null;
		loAlias = null;
		loPass = null;
		loImgErrEma = null;
		loImgErrPass = null;
		loUsuario = null;
	}
};
