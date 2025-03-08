export const CommonsResponses = {
  en: {
    200: {
      emailSent:
        "If the email exists in our records you will receive a confirmation email",
    },
    400: {
      generic: "Bad Request",
    },
    401: {
      generic: "You do not have permissions to perform this action",
      invalidCredentials: "Invalid credentials",
    },
    403: {
      generic: "Forbidden action",
    },
    404: {
      generic: "Resource not found",
      session: "Session not found",
    },
    406: {},
    409: {
      generic: "Conflict",
      email: "Email already used",
      username: "Username already used",
    },
    417: {
      generic: "Action expected failed",
    },
    500: {
      generic: "Internal Server Error",
    },
  },
  es: {
    200: {
      emailSent:
        "Si el email existe en nuestros registros, recibirás un email de confirmación",
    },
    400: {
      generic: "Solicitud Incorrecta",
    },
    401: {
      generic: "No tienes permisos para realizar esta acción",
      invalidCredentials: "Credenciales inválidas",
    },
    403: {
      generic: "Acción prohibida",
    },
    404: {
      generic: "Recurso no encontrado",
      session: "No existe la sesión",
    },
    406: {},
    409: {
      generic: "Conflicto",
      email: "Email usado actualmente",
      username: "Nombre de usuario usado actualmente",
    },
    417: {
      generic: "Acción esperada fallida",
    },
    500: {
      generic: "Error interno",
    },
  },
};
