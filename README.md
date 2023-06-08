# Aplicacion-web
Despliegue en Amazon Web Servicie

Sistema gestor para incricripciones de materia

FuncInalidades
JWT (Json Web Token autentucacion para seguridad se evia con cada solicitud HTTP)
Correo(Envia correo con las incripciones de dia a los administradores)
Redis(cache carga mas rapida)
Almacenamito en block storage (Back)

Despliegue AWS con Serverless Framework

lAMBDAS
Estudintes
Usiarios
Materias
Incripciones
Auth( FUNCION QUE INTERCEPTA LAS SOLICITUDES A LAS DEMAS FUNCIONES VALIDANDO QUE JWT)
MailTO(fUNCION CON CLOUDWACTH QUE ENVIA CORREO EN UNA HORA EN ESPESIFICA DEL DIA)

Base de Datos
DB(mySQL)

