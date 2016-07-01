/*
 * OPG 27/12/2015
 * Simulacion de clase para contener documentacion
 */
function Usuario(){
	// Viariables
	var nId = 0;
	var sUsuario = '';
	var sAlias = '';
	var sPassword = '';
	var bAdministrador = false;
	
	// Propiedades
	Usuario.prototype.IdGet = function() {		
		return nId;
	};
	Usuario.prototype.IdSet = function(pnId) {
		nId = pnId;
	};
	
	Usuario.prototype.UsuarioGet = function() {
		return sUsuario;
	};
	Usuario.prototype.UsuarioSet = function(psUsuario) {
		sUsuario = psUsuario;
	};
	
	Usuario.prototype.AliasGet = function() {
		return sAlias;
	};
	Usuario.prototype.AliasSet = function(psAlias) {
		sAlias = psAlias;
	};
	
	Usuario.prototype.PasswordGet = function() {
		return sPassword;
	};
	Usuario.prototype.PasswordSet = function(psPassword) {
		sPassword = psPassword;
	};
	Usuario.prototype.AdministradorGet = function() {		
		return bAdministrador;
	};
	Usuario.prototype.AdministradorSet = function(pbAdministrador) {
		bAdministrador = pbAdministrador;
	};
	
	function Actualizar_Retorno (poRetorno, psUsuario, psAlias) {
		/*
		 * OPG 27/12/2015
		 * Se trata el resultado de actualizar el usuario 
		 */
		var loError;
		var loContenedor;
		
		switch (poRetorno.Correcto) {
	    case false: // Error
	    	loError = new UserException();
	    	loError.Set(1, poRetorno.Descripcion);
	    	ControlarError (loError);
	    	loError = null;
	        break;
	    case true: // correcto
			PopUp_Ocultar();
	    	 break;
		}
	}
	
	// Metodos 
	Usuario.prototype.Inicializa = function() {
	/*
	 * OPG 27/12/2015
	 * Se inicializan los datos de la clase
	 */		
		nId = 0;
		sUsuario = '';
		sAlias = '';
		sPassword = '';
		bAdministrador = false;
	};
	
	Usuario.prototype.Obtener = function(pnId, pnEquipo) {
		/*
		 * 22/02/2016
		 * Se rellena la clase con el contenido de la BD
		 */
		var loRes;
		$.ajax({
			url: "Usuario_Obtener.php",
			data: {"pnId" : pnId,
				   "pnEquipo" : pnEquipo},
            async:false,    
            cache:false,   
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	loRes = JSON.parse(Retorno);
            	sUsuario = loRes.Usu_Usuario;
            	sAlias = loRes.Usu_Alias;
            	bAdministrador = loRes.EquUsu_Administrador;
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){
            	ControlarError (objXMLHttpRequest);
            }
		});
	};

	Usuario.prototype.ObtenerBasico = function(pnId) {
		/*
		 * 28/06/2016
		 * Se rellena la clase con el contenido de la BD
		 */
		var loRes;
		$.ajax({
			url: "FuncionesAjax.php",
			data: {"psAccion" : "Usuario_ObtenerBasico",
				   "pnId" : pnId},
            async:false,    
            type: 'POST',
            success:  function(Retorno){
            	loRes = JSON.parse(Retorno);
            	sUsuario = loRes.Usu_Usuario;
            	sAlias = loRes.Usu_Alias;
            	bAdministrador = false;
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){
            	ControlarError (objXMLHttpRequest);
            }
		});
	};
	
	Usuario.prototype.FichaCargar = function(pnId, pnEquipo) {
		/*
		 * 22/02/2016
		 * Se compone la ficha básica del usuario indicado
		 */
		var loRes;
		$.ajax({
			url: "Usuario_Cargar.php",
			data: {"pnId" : pnId,
				   "pnEquipo" : pnEquipo},
            async:true,    
            cache:false,   
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	FichaCargar_Retorno.call(this, JSON.parse(Retorno), pnEquipo);
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){
            	ControlarError (objXMLHttpRequest);
            }
		});
	};
	function FichaCargar_Retorno(poUsuario, pnEquipo){
		/*
		 * OPG 22/02/2016
		 * Se pasan los datos al detalle de usuario
		 */
	 	var loContenedor = document.getElementById("PopUp_Cuerpo");
		var loBtnAceptar = document.createElement("BUTTON");
		var loBtnCancelar = document.createElement("BUTTON");
		var loDivLinea = document.createElement('div');
		var loLabel = document.createElement("label"); 
		var loText = document.createElement("input");
		var loImgErr = document.createElement("img");
		var loCheck = document.createElement("input");
		
		loContenedor.parentNode.style.width = "375px";
		loContenedor.innerHTML = "";

		// Se crean las lineas y contenido
		// Usuario
		loLabel.className = "LblNuevoUsuario";
		loLabel.innerHTML = "Usuario :";
		loDivLinea.display = 'block';
		loDivLinea.appendChild(loLabel);
		loText.setAttribute("type", "text");
		loText.setAttribute("value", poUsuario.Usu_Usuario);
		loText.maxLength = 50;
		loText.id = "TxtUsuUsu";
		loDivLinea.appendChild(loText);
		loImgErr.id = "ImgErr_TxtUsuUsu";
		loImgErr.src = "images/CampoErroneo_16x16.gif";
		loImgErr.className = "ImgErr_Correcto";
		loImgErr.style.visibility = "hidden";
		loDivLinea.appendChild(loImgErr);
		loContenedor.appendChild(loDivLinea);
		
		// Alias
		loDivLinea = document.createElement('div');
		loDivLinea.display = 'block';
		loLabel = document.createElement("label");
		loLabel.innerHTML = "Alias :";
		loLabel.className = "LblNuevoUsuario";
		loDivLinea.appendChild(loLabel);
		loText = document.createElement("input");
		loText.setAttribute("type", "text");
		loText.setAttribute("value", poUsuario.Usu_Alias);
		loText.maxLength = 50;
		loText.id = "TxtUsuAli";
		loDivLinea.appendChild(loText);
		loImgErr = document.createElement("img");
		loImgErr.id = "ImgErr_TxtUsuAli"
		loImgErr.src = "images/CampoErroneo_16x16.gif";
		loImgErr.className = "ImgErr_Correcto";
		loImgErr.style.visibility = "hidden";
		loDivLinea.appendChild(loImgErr);
		loContenedor.appendChild(loDivLinea);
		
		// Check Administrador
		loDivLinea = document.createElement('div');
		loDivLinea.display = 'block';
		loLabel = document.createElement("label");
		loLabel.innerHTML = "Es administrador :";
		loLabel.className = "LblNuevoUsuario";
		loDivLinea.appendChild(loLabel);
		loCheck = document.createElement("input");
		loCheck.setAttribute("type", "checkbox");
		loCheck.checked = poUsuario.EquUsu_Administrador;
		loCheck.id = "ChkUsuAdm";
		loDivLinea.appendChild(loCheck);
		loContenedor.appendChild(loDivLinea);
		
		// botones
		loDivLinea = document.createElement('div');
		loDivLinea.display = 'block';
		loBtnAceptar.setAttribute('onclick', 'Usuario_Actualizar(' + poUsuario.Usu_Id + ',' + pnEquipo + ');');
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
	
	Usuario.prototype.Actualizar = function(pnId, 
											psUsuario,
											psAlias,
											psPassword) {
		/*
		 * 27/12/2015
		 * Se actualiza el usuario indicado
		 */
		var lsUsuario = "";
		var lsAlias = "";
		var lsPassword = "";
		
	    // Se recogen los datos de pantalla		
		$.ajax({
			url: "Usuario_Actualizar.php",
			data:{ 
				    "pnId": pnId,
					"psUsuario": psUsuario,
					"psAlias": psAlias,
					"psPassword": psPassword
				},
			async:true,
            cache:false,
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	Actualizar_Retorno.call(this, JSON.parse(Retorno), psUsuario, psAlias);
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){
            	throw objXMLHttpRequest;
            }
		});
	};

	Usuario.prototype.Listar = function(pnEquipo) {
		/*
		 * 22/02/2016
		 * Se listan los usuarios con los filtros indicados
		 */
		$.ajax({
			url: "Usuario_Listar.php",
			data: {"pnEquipo" : pnEquipo},
            async:true,    
            cache:false,   
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	Listar_Retorno.call(this, JSON.parse(Retorno), pnEquipo);
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){
            	throw objXMLHttpRequest;
            }
		});
	};
	function Listar_Retorno (poDatos, pnEquipo) {
        /*
		 * OPG 22/02/2016
		 * Se cargan en pantalla los usuarios obtenidos
		 */
		var lnCon = 0;
		var lnMax = 0;
		
		lnMax = poDatos.length;
		
		for (lnCon=0;lnCon<lnMax;lnCon++) {
			FichaBasica (poDatos[lnCon], pnEquipo);
		};
	}
	
	Usuario.prototype.Invitar_Preparar = function() {
		/*
		 * 26/02/2016
		 * Se prepara la pantalla para poder realizar la invitación a otros usuarios para el equipo actual
		 */
		var loContenedor = document.getElementById("PopUp_Cuerpo");
		var loTitulo = document.getElementById("PopUp_Titulo");
		var loBtnAceptar = document.createElement("BUTTON");
		var loBtnCancelar = document.createElement("BUTTON");
		var loDivLinea = document.createElement('div');
		var loLabel = document.createElement("label"); 
		var loText = document.createElement("input");
		var loImgErr = document.createElement("img");
		var loCheck = document.createElement("input");
		
		loContenedor.parentNode.style.width = "375px";
		loContenedor.innerHTML = "";
		loTitulo.innerHTML = "Modificación de usuario";
	
		// Se crean las lineas y contenido
		// Usuario
		loLabel.className = "LblNuevoUsuario";
		loLabel.innerHTML = "Usuarios (C@rreo) separados por ;";
		loDivLinea.display = 'block';
		loDivLinea.appendChild(loLabel);
		loText.setAttribute("type", "text");
		loText.setAttribute("value", "");
		loText.maxLength = 100;
		loText.id = "TxtUsuUsu";
		loDivLinea.appendChild(loText);
		loImgErr.id = "ImgErr_TxtUsuUsu";
		loImgErr.src = "images/CampoErroneo_16x16.gif";
		loImgErr.className = "ImgErr_Correcto";
		loImgErr.style.visibility = "hidden";
		loDivLinea.appendChild(loImgErr);
		loContenedor.appendChild(loDivLinea);
		
		// Check Administrador
		loDivLinea = document.createElement('div');
		loDivLinea.display = 'block';
		loLabel = document.createElement("label");
		loLabel.innerHTML = "Como administrador :";
		loLabel.className = "LblNuevoUsuario";
		loDivLinea.appendChild(loLabel);
		loCheck = document.createElement("input");
		loCheck.setAttribute("type", "checkbox");
		loCheck.checked = 0;
		loCheck.id = "ChkUsuAdm";
		loDivLinea.appendChild(loCheck);
		loContenedor.appendChild(loDivLinea);
		
		// botones
		loDivLinea = document.createElement('div');
		loDivLinea.display = 'block';
		loBtnAceptar.setAttribute('onclick', 'Usuario_Invitar();');
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
	};

	Usuario.prototype.Invitar = function(pnEquipo,
									     psUsuarios,
										 pbAdministrador) {
		/*
		 * 26/02/2016
		 * Se envia a servidor la peticion de invitacion a usuarios indicados
		 */		
		var loResult;
		
		if (psUsuarios.length==0){
	    	ControlarError ("Ha de indicar algun usuario a invitar.");
		}
		else{
			$.ajax({
				url: "Usuario_Invitar.php",
				data:{ 
					    "pnEquipo": pnEquipo,
						"psUsuarios": psUsuarios,
						"pbAdministrador": pbAdministrador ? 1 : 0
					},
				async:true,
	            cache:false,
	            dataType:"html",
	            type: 'POST',
	            success:  function(Retorno){
	            	loResult = JSON.parse(Retorno)
	            	if (loResult.Correcto == true){
	            		alert("Invitación enviada correctamente.");
	            		PopUp_Cerrar();
	            	}else{
	            		ControlarError (loResult);
	            	}
	            },
	            beforeSend:function(){},
	            error:function(objXMLHttpRequest){
	            	throw objXMLHttpRequest;
	            }
			});
		};
		loResult = null;
	};
	
	Usuario.prototype.Invitacion_Aceptar = function(psUsuario,
													psAlias,
													psPassword,
													pnInvitacion) {
		/*
		* OPG 09/03/2016
		* Se acepta la invitación indicada
		*/
		
		$.ajax({
			url: "Usuario_Invitacion_Aceptar.php",
			data:{ 
				"psUsuario": psUsuario,
				"psAlias": psAlias,
				"psPassword": psPassword,
				"pnInvitacion": pnInvitacion
			},
			async:true,
			cache:false,
			dataType:"html",
			type: 'POST',
			success:  function(Retorno){
				Invitacion_Aceptar_Retorno.call(this, JSON.parse(Retorno), psUsuario, psPassword);
			},
			beforeSend:function(){},
			error:function(objXMLHttpRequest){
			throw objXMLHttpRequest;
			}
		});
	};
	function Invitacion_Aceptar_Retorno (poDatos, psUsuario, psPassword) {
        /*
		 * OPG 09/03/2016
		 * Si todo es correcto, se realiza el login con el nuevo usuario invitado
		 */
    	if (poDatos.Correcto == true){
    		alert("Se ha creado el usuario correctamente.");
    		var loTxtUsu = document.getElementById("TxtUsu");
    		var loTxtPas = document.getElementById("TxtPas");
    		loTxtUsu.setAttribute("value", psUsuario);
    		loTxtPas.setAttribute("value", psPassword);
    		loTxtUsu = null;
    		loTxtPas = null;
    		PopUp_Cerrar();
    	}else{
    		ControlarError (poDatos);
    	}
	}
	
	function FichaBasica (poUsuario, pnEquipo) {
        /*
		 * OPG 22/02/2016
		 * Se compone la ficha básica del registro
		 */
		var loBtn;
		var loContenedor = document.getElementById("SecUsu");
		var loUsuario = document.createElement('div');
		var loLblUsu = document.createElement('label');
		var loLblNom = document.createElement('label');
		
		loUsuario.className = "DivJugadorBasico";
		loUsuario.id = "Usu" + poUsuario.Usu_Id;
		loUsuario.setAttribute('Usuario', poUsuario.Usu_Id);
		
		loBtn = document.createElement("img");
		loBtn.src = "images/PerfilPersona_48x48.png";
		loBtn.className = "ImgJugador";
		loUsuario.appendChild(loBtn);
		
		loLblNom.id = "LblUsuNom" + poUsuario.Usu_Id;
		loLblNom.innerHTML = poUsuario.Usu_Alias;
		loLblNom.className = "DetalleNombre";
		loUsuario.appendChild(loLblNom);
		
		loLblUsu.id = "LblUsuUsu" + poUsuario.Usu_Id;
		loLblUsu.innerHTML = poUsuario.Usu_Usuario;
		loLblUsu.className = "DetalleNombre";
		loUsuario.appendChild(loLblUsu);
		
		// 	Solo administradores o el mismo usurio pueden modificar y eliminar
		if (CookieObtener("Admin") == true || CookieObtener("Usuario") ==  poUsuario.Usu_Usuario){
			// Botón para modificar 
			loBtn = document.createElement("img");
			loBtn.src = "images/boton_lupa_hover.png";
			loBtn.title = "Modificar el usuario."
			loBtn.style.cursor = "pointer";
			loBtn.setAttribute('onclick', 'Usuario_FichaCargar(' + poUsuario.Usu_Id + ',' + pnEquipo + ');');
			loBtn.className = "DetalleBoton";
			loUsuario.appendChild(loBtn);
	
			// Boton para eliminar
			loBtn = document.createElement("img");
			loBtn.src = "images/Boton_Eliminar_26x26.png";
			loBtn.title = "Eliminar usuario."
			loBtn.style.cursor = "pointer";
			loBtn.setAttribute('onclick', 'EquipoUsuario_Eliminar(' + poUsuario.Usu_Id + ');');
			loBtn.className = "DetalleBoton";	
			loUsuario.appendChild(loBtn);
		}
		
		loContenedor.appendChild(loUsuario);
		
		loContenedor = null;
		loUsuario = null;
		loLblUsu = null;
		loLblNom = null;
	}
	
	Usuario.prototype.EnviarPassword = function(psUsuario) {
		/*
		* 15/03/2016
		* Se envia la contraseña del usuario indicada
		*/		
		var loResult;
		
		$.ajax({
			url: "Usuario_EnviarPassword.php",
			data:{ 
				"psUsuario": psUsuario
			},
		async:true,
		cache:false,
		dataType:"html",
		type: 'POST',
		success:  function(Retorno){
			loResult = JSON.parse(Retorno)
			if (loResult.Correcto == true){
				alert("Contraseña enviada correctamente.");
				PopUp_Cerrar();
			}else{
				ControlarError (loResult);
			}
		},
		beforeSend:function(){},
		error:function(objXMLHttpRequest){
		throw objXMLHttpRequest;
		}
		});

		loResult = null;
	};
	
	Usuario.prototype.EquipoUsuario_Eliminar = function(pnUsuario, pnEquipo) {
		/*
		 * OPG 29/03/2016
		 * Se elimina la relación entre el usuario y equipo indicado
		 */
		
		$.ajax({
			url: "EquipoUsuario_Eliminar.php",
			data:{ 
				    "pnUsuario": pnUsuario,
				    "pnEquipo": pnEquipo
				},
            async:true,    
            cache:false,   
            dataType:"html",
            type: 'POST',
            success:  function(Retorno){
            	EquipoUsuario_Eliminar_Retorno.call(this, pnUsuario, JSON.parse(Retorno));
            },
            beforeSend:function(){},
            error:function(objXMLHttpRequest){
            	throw objXMLHttpRequest;
            }
		});
	}
	function EquipoUsuario_Eliminar_Retorno(pnUsuario, poRetorno){
		/*
		 * OPG 29/03/2016
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
			/*
			RefrescarImporteTotal (parseFloat('-' + document.getElementById('LblGasImp' + pnId).innerHTML.replace(" €", "")));
			loContenedor = document.getElementById('Gas' + pnId);	
			loPadre = loContenedor.parentNode;
			loPadre.removeChild(loContenedor);
			*/
			alert("Relación entre usuario y equipo eliminada correctamente");
		};
	}
}

function Usuario_FichaCargar(pnUsuario, pnEquipo){
	/*
	 * OPG 22/02/2016
	 * Se buscan los datos del usuario indicado para cargar el detalle de este.
	 */
	var loUsuario = new Usuario();
	
	loUsuario.FichaCargar (pnUsuario, pnEquipo);
	
	loUsuario = null;
};

function Usuario_Invitar_Preparar(){
	/*
	 * OPG 26/02/2016
	 * Se muestran los campos necesarios para permitir la invitación a usuario
	 */
	var loUsuario = new Usuario();
	
	loUsuario.Invitar_Preparar ();
	
	loUsuario = null;
};

function Usuario_Invitar(){
	/*
	 * OPG 26/02/2016
	 * Si los datos son correctos, se invita a todos los usuario / emails indicados
	 */
	var loUsuario = new Usuario();
	
	loUsuario.Invitar (ObtenerEquipoId(),
				       document.getElementById("TxtUsuUsu").value,
					   document.getElementById("ChkUsuAdm").checked);
	loUsuario = null;
};

function Usuario_Actualizar (pnUsuario, pnEquipo){
	/*
	 * OPG 22/02/2016
	 * Se actualiza la informacion del usuario indicado
	 */
	var loUsuario = new Usuario();
	
	loUsuario.Actualizar(pnUsuario, pnEquipo);
	
	loUsuario = null;
	
	
	var lsApellido2 = "";
	var lsEmail = "";
	var lnId = "";
	var laResult;
	
	// se recogen los valores en pantalla
	lnId = pnJugador;
//	lsNombre = document.getElementById("TxtJugNom").value;
//	lsApellido1 = document.getElementById("TxtJugApe1").value;
	lsApellido2 = document.getElementById("TxtJugApe2").value;
	lsEmail = document.getElementById("TxtJugEma").value;
	
	if (lsNombre.length==0){
		laResult = '{"Resultado":0,"Accion":0, "Id":0, "Descripcion":"Ha de indicar un nombre para el jugador."}';
		aler("MAL");
		Jugador_Actualizar_Result (laResult, pnEquipo, lsNombre, lsApellido1, lsApellido2, lsEmail);
	}
	else{
		$.post("Jugador_Actualizar.php", 
			{ 
			    pnId: lnId,
				pnEquipo: pnEquipo,
				psNombre: lsNombre,
				psApellido1: lsApellido1,
				psApellido2: lsApellido2,
				psEmail: lsEmail
			}, function(poRetorno){
				//var laResult = Datos;
				//laResult = laResult.replace("?>", "");
				Jugador_Actualizar_Result (JSON.parse(poRetorno), pnEquipo, lsNombre, lsApellido1, lsApellido2, lsEmail);
			});
	}
};

function Usuario_ReenviarPassword(){
	/*
	 * OPG 15/03/2016
	 * Se envia la contraseña al correo de usuario indicado
	 */
	var loTxtUsu = document.getElementById("TxtUsuRec");
	//var loImgErrUsu = document.getElementById("ImgErr_TxtUsuRec");
	var loResult;
	var loError = new UserException();
	var loUsuario = new Usuario();
	try {
		// Validacion de campos
		if (ValidarEmail(loTxtUsu.value) == false){
			//loImgErrUsu.style.visibility = "visible";
			loError.Set(55, "Ha de indicar un correo válido");
			throw loError;
		}else{
			//loImgErrUsu.style.visibility = "hidden";
			loUsuario.EnviarPassword(loTxtUsu.value);
		}
		
		// Todo correcto
		//loUsuario.EnviarPassword(loTxtUsu.value);
	} catch(e) {  
		if (e instanceof UserException){
			//ControlarError(e); // Si ocurre un error es manejado
			alert ("ERROR")
		}else{
			//loError.Set(55, e.message);
			alert (e.message);
			//ControlarError(loError);
		}
	} finally {
		loError = null;
		loTxtUsu = null;
		loImgErrUsu = null;
		loUsuario = null;
	}
};

function Usuario_GuardarLocal(pnEquipo){
	/*
	 * OPG 17/03/2016
	 * Se guarda en una cookie la informacion necesaria del usuario
	 */
	var loError = new UserException();
	var loUsuario = new Usuario();
	try {
		loUsuario.Obtener(-1, pnEquipo);
		CookieCrear("Usuario",loUsuario.UsuarioGet(), 0);
		CookieCrear("Alias",loUsuario.AliasGet(), 0);
		CookieCrear("Admin",loUsuario.AdministradorGet(), 0);
	} catch(e) {  
		if (e instanceof UserException){
			ControlarError(e); // Si ocurre un error es manejado
		}else{
			loError.Set(55, e.message);
			ControlarError(loError);
		}
	} finally {
		loError = null;
		loUsuario = null;	
	}
};

function EquipoUsuario_Eliminar (pnUsuario){
	/*
	 * OPG 29/03/2016
	 * Se elimina la relación entre usuario y equipo indicados
	 */
	var loUsuario = new Usuario();
	
	try {
		alert(window.event.target.title);
		if (confirm('Se dispone a eliminar al usuario del equipo. ¿Está segur@?') == true) {
			loUsuario.EquipoUsuario_Eliminar(pnUsuario, ObtenerEquipoId());
		}
	} catch(e) {  
		ControlarError(e); // Si ocurre un error es manejado
	} finally {
		loUsuario = null;
	}
};

function UsuarioGuardar(poUsuario){
	/*
	 * OPG 29/06/2016
	 * Se guardan los datos de la clase en el cliente
	*/
	window.sessionStorage.setItem('Usuario_Usuario', poUsuario.UsuarioGet());
	window.sessionStorage.setItem('Usuario_Alias', poUsuario.AliasGet());
};