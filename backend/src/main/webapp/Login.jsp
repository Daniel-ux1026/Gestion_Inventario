<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
  <title>Bienvenido al Login</title>
  <!-- Añadimos Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    header {
      text-align: center;
      padding: 20px;
      background-color: #ffffff;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 30px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }

    .login-icon {
      text-align: center;
      margin-bottom: 30px;
    }

    .login-icon i {
      font-size: 50px;
      color: #4CAF50;
    }

    .form-group {
      margin-bottom: 20px;
      position: relative;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
      color: #333;
    }

    .form-group input {
      width: 100%;
      padding: 12px 40px 12px 40px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 16px;
    }

    .form-group i {
      position: absolute;
      left: 12px;
      top: 40px;
      color: #666;
    }

    .btn-login {
      background-color: #4CAF50;
      color: white;
      padding: 12px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      font-size: 16px;
      transition: background-color 0.3s;
    }

    .btn-login i {
      margin-right: 8px;
    }

    .btn-login:hover {
      background-color: #45a049;
    }

    .error-message {
      color: #ff3333;
      background-color: #ffe6e6;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }

    .error-message i {
      margin-right: 8px;
    }

    .social-login {
      text-align: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }

    .social-login p {
      margin-bottom: 15px;
      color: #666;
    }

    .social-icons {
      display: flex;
      justify-content: center;
      gap: 15px;
    }

    .social-icons a {
      color: #fff;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: transform 0.3s;
    }

    .social-icons a:hover {
      transform: scale(1.1);
    }

    .facebook {
      background: #3b5998;
    }

    .google {
      background: #db4a39;
    }

    .twitter {
      background: #1DA1F2;
    }
  </style>
</head>
<body>
<header>
  <h1>Bienvenido al Login</h1>
</header>

<div class="login-container">
  <div class="login-icon">
    <i class="fas fa-user-circle"></i>
  </div>

  <form action="login" method="POST">
    <div class="form-group">
      <label for="username">Usuario:</label>
      <i class="fas fa-user"></i>
      <input type="text" id="username" name="username" required placeholder="Ingrese su usuario">
    </div>

    <div class="form-group">
      <label for="password">Contraseña:</label>
      <i class="fas fa-lock"></i>
      <input type="password" id="password" name="password" required placeholder="Ingrese su contraseña">
    </div>

    <%-- Mostrar mensaje de error si existe --%>
    <% if(request.getAttribute("error") != null) { %>
    <div class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      <%= request.getAttribute("error") %>
    </div>
    <% } %>

    <div class="form-group">
      <button type="submit" class="btn-login">
        <i class="fas fa-sign-in-alt"></i>
        Iniciar Sesión
      </button>
    </div>
  </form>

  <div class="social-login">
    <p>O inicia sesión con:</p>
    <div class="social-icons">
      <a href="#" class="facebook">
        <i class="fab fa-facebook-f"></i>
      </a>
      <a href="#" class="google">
        <i class="fab fa-google"></i>
      </a>
      <a href="#" class="twitter">
        <i class="fab fa-twitter"></i>
      </a>
    </div>
  </div>
</div>
</body>
</html>