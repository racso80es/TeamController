/*
 * OPG 18/12/2015
 * Simulacion de clase para contener las excepciones
 */
function UserException(){
	// Variables
	var nNumero = 0;
	var sDescripcion = '';
	
	UserException.prototype.IdGet = function() {		
		return nId;
	};
	
	UserException.prototype.Set = function(pnNumero,
										   psDescripcion) {
		/*
		 * 18/12/2015
		 * Se guardan los valores en la clase
		 */
		nNumero = pnNumero;
		sDescripcion = psDescripcion;
	};
	
	UserException.prototype.NumeroGet = function() {
		/*
		* 18/12/2015
		* Se devuelve el número de la clase
		*/
		return nNumero;
	};
	
	UserException.prototype.DescripcionGet = function() {
		/*
		* 18/12/2015
		* Se devuelve la descripcion de la clase
		*/
		return sDescripcion;
	};
}