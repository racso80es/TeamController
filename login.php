<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="racsoft">
    <meta name="keyword" content="TeamController, Team Controller, Team, Equipo, control, racsoft, Responsive, Fluid, Retina">

    <title>TEAM CONTROLLER - Gestion de equipos</title>

    <!-- Bootstrap core CSS -->
    <link href="assets/css/bootstrap.css" rel="stylesheet">
    <!--external css-->
    <link href="assets/font-awesome/css/font-awesome.css" rel="stylesheet" />
        
    <!-- Custom styles for this template -->
    <link href="assets/css/style.css" rel="stylesheet">
    <link href="assets/css/style-responsive.css" rel="stylesheet">

    <script type="text/javascript" src="js/UserException.js"></script>
    <script type="text/javascript" src="js/Usuario.js"></script>
    <script type="text/javascript" src="js/General.js"></script>
    <script type="text/javascript" src="js/index.js"></script>
    <script type="text/javascript" src="js/Main.js"></script>

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>
   <?php
    session_start();
    require_once "class/usuario.php"; 
    require_once "class/Retorno.php";
    require_once "class/Aplicacion.php";
    function verificar_login ($psUsuario, $psPassword){

      $loUsuario = new Usuario();
      $loRetorno = new Retorno();
      $lnUsuId = 0;
      $loRetorno = $loUsuario::Usuario_Correcto($psUsuario, $psPassword);
      return $loRetorno->Resultado["Id"];
    }
    
    if ($_GET['Accion'] === 'OUT'){
    	$_SESSION['userid'] = null;
    }
    
    if(!isset($_SESSION['userid']))
    { 
      if(isset($_POST['login']))
      {
        $lnUsuId = verificar_login($_POST['user'], $_POST['password']);
        if ($lnUsuId > 0)
        {
          $_SESSION['userid'] = $lnUsuId;
          header("location:index.php");
        }
        else
        {
        	$_SESSION['userid'] = 0;
        }
      }
    } else {
      header("location:index.php");
    }
?>

      <!-- **********************************************************************************************************************************************************
      MAIN CONTENT
      *********************************************************************************************************************************************************** -->

	  <div id="login-page">
	  	<div class="container">
	  	
		      <form class="form-login" action="" method="post">
		        <h2 class="form-login-heading">
              ACCEDER A <?php echo Aplicacion::$Titulo ?> 
            </h2>
		        <?php
			        if ($_SESSION['userid'] === 0){
			    		 echo '<h4 id="LblMensaje" class="form-login-Mensaje">Usuario con contraseña inexistente.</h4>';
			        }
		        ?>
		        
		        <div class="login-wrap">
		            <input type="text" id="TxtUsu" name="user" class="form-control" placeholder="Usuario" autofocus>
		            <br>
		            <input type="password" name="password" class="form-control" placeholder="Contraseña">
		            <label class="checkbox">
		                <span class="pull-right">
		                    <a data-toggle="modal" href="login.php#myModal">¿Olvidó su contraseña?</a>
		                </span>
		            </label>
		            <button name="login" class="btn btn-theme btn-block" href="index.php" type="submit"><i class="fa fa-lock"></i> ACCEDER</button>
		            <hr>
		            
		            <div class="login-social-link centered">
		            <p>o puede acceder con una cuenta de las siguientes redes sociales</p>
		                <button class="btn btn-facebook" type="submit"><i class="fa fa-facebook"></i> Facebook</button>
		                <button class="btn btn-twitter" type="submit"><i class="fa fa-twitter"></i> Twitter</button>
		            </div>
		            <div class="registration">
		                ¿Aun no tiene una cuenta?<br/>
		                <a class="" href="#">
		                    Crear cuenta
		                </a>
		            </div>
		        </div>
		
		          <!-- Modal -->
		          <div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="myModal" class="modal fade">
		              <div class="modal-dialog">
		                  <div class="modal-content">
		                      <div class="modal-header">
		                          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		                          <h4 class="modal-title">¿Olvidó su contraseña?</h4>
		                      </div>
		                      <div class="modal-body">
		                          <p>Introduzca su dirección de correo electrónico para restablecer la contraseña.</p>
		                          <input id="TxtUsuRec" type="text" name="email" placeholder="Email" autocomplete="off" class="form-control placeholder-no-fix">
		
		                      </div>
		                      <div class="modal-footer">
		                          <button data-dismiss="modal" class="btn btn-default" type="button">Cancelar</button>
		                          <button class="btn btn-theme" type="button" onclick="Usuario_ReenviarPassword();">Enviar</button>
		                      </div>
		                  </div>
		              </div>
		          </div>
		          <!-- modal -->
		
		      </form>	  	
	  	
	  	</div>
	  </div>

    <!-- js placed at the end of the document so the pages load faster -->
    <script src="assets/js/jquery.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>

    <!--BACKSTRETCH-->
    <!-- You can use an image of whatever size. This script will stretch to fit in any screen size.-->
    <script type="text/javascript" src="assets/js/jquery.backstretch.min.js"></script>
    <script>
        $.backstretch("assets/img/login-bg.jpg", {speed: 500});
    </script>


  </body>
</html>
