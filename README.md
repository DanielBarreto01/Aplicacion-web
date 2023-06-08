# Aplicacion-web
##node js , JavaScrip ,Angular
Despliegue en Amazon Web Servicie (API RETS)

Sistema gestor para incricripciones de materia

FuncInalidades
JWT (Json Web Token autentucacion para seguridad se evia con cada solicitud HTTP),
Correo(Envia correo con las incripciones de dia a los administradores),
Redis(cache carga mas rapida),
Almacenamito en block storage (Front),

Despliegue AWS con Serverless Framework(Back),

lAMBDAS
Estudintes,,
Usiarios,
Materias,
Incripciones,
Auth( FUNCION QUE INTERCEPTA LAS SOLICITUDES A LAS DEMAS FUNCIONES VALIDANDO QUE JWT),
MailTO(fUNCION CON CLOUDWACTH QUE ENVIA CORREO EN UNA HORA EN ESPESIFICA DEL DIA),
IMG(fUNICON QUUE ALMACENA LA IMAGEN EN S3 Y EL ENLACE DE LA IMAGEN EN PATH(BASE DE DATOS)),

S3

Almacenamiro estatico de Front,
Almcaneamieto de imagenes,


Base de Datos en DBS (AWS)
DB(mySQL)

