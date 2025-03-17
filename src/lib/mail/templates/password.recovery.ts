type Props = {
  code: number;
};

export const passwordRecoveryTemplate = ({ code }: Props) => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Recovery</title>
    <style>
        /* Estilos básicos */
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
        }

        td {
            text-align: center;
            padding: 20px;
        }

        .header img {
            max-width: 150px;
            height: auto;
        }

        .verification-code {
            font-size: 36px;
            font-weight: bold;
            color: #007bff;
            letter-spacing: 5px;
            margin: 20px 0;
        }

        .body-content p {
            font-size: 16px;
            color: #666666;
            line-height: 1.6;
        }

        .footer {
            font-size: 14px;
            color: #999999;
            padding: 20px;
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    <!-- Contenedor principal con fondo -->
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="background-image: url('http://localhost:4000/backgrounds/bg.png'); background-size: cover; background-position: center; width: 100%; max-width: 600px; margin: 0 auto;">
        <!-- Fila para el fondo -->
        <tr>
            <td style="background-color: rgba(255, 255, 255, 0.8); padding: 20px; text-align: center;">
                <!-- Header con logo -->
                <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
                    <tr>
                        <td class="header" style="padding: 20px;">
                            <img src="https://via.placeholder.com/150" alt="App Logo">
                        </td>
                    </tr>
                </table>

                <!-- Cuerpo del correo -->
                <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
                    <tr>
                        <td class="body-content" style="padding: 30px; background-color: rgba(255, 255, 255, 0.9);">
                            <h1 style="font-size: 24px; color: #333333; margin-bottom: 20px;">Verification Code</h1>
                            <div class="verification-code">${code}</div> <!-- Aquí va el código de verificación -->
                            <p>Este es tu código de verificación para recuperar tu contraseña. Por favor, ingrésalo en la aplicación para continuar.</p>
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
                    <tr>
                        <td class="footer" style="padding: 20px; background-color: rgba(255, 255, 255, 0.8);">
                            <p>Si no solicitaste este correo, puedes ignorarlo. Gracias por usar nuestra aplicación.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
