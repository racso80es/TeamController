$(document).ready(function() {
	
	$('.button').click(function() {
		
		type = $(this).attr('data-type');
		
		$('.overlay-container').fadeIn(function() {
			
			window.setTimeout(function(){
				$('.window-container.'+type).addClass('window-container-visible');
			}, 100);
			
		});
	});
	
	$('.close').click(function() {
		//$('.overlay-container').fadeOut().end().find('.window-container').removeClass('window-container-visible');
	});
	
});

function PopUp_Ocultar(){
	/*
	 * OPG 23/12/2015
	 * Se oculta el posible popup de pantalla
	 */
	$('.overlay-container').fadeOut().end().find('.window-container').removeClass('window-container-visible');
}

function PopUp_Mostrar(){
	/*
	 * OPG 07/01/2016
	 * Se muestra el posible popup de pantalla
	 */
	$('.overlay-container').fadeOut().end().find('.window-container').addClass('window-container-visible');
}

function PopUp_Abrir()
{
	document.getElementById("PopUp_Fondo").style.visibility="visible";
	document.getElementById("PopUp_Ventana").style.visibility="visible";
}
 
function PopUp_Cerrar()
{
	document.getElementById("PopUp_Fondo").style.visibility="hidden";
	document.getElementById("PopUp_Ventana").style.visibility="hidden";
}