const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports.run = async (event, context) => {

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'cfbg1999@gmail.com',
      pass: 'tfberwcmpjvuzreo'
    },
    tls: {
      rejectUnauthorized: false // Ignorar errores de certificado
    }
  });

  const fechaActual = new Date();
  fechaActual.setHours(0, 0, 0, 0);
  const formattedFechaActual = fechaActual.toISOString().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(formattedFechaActual)) {
    console.log(fechaActual, "= ", formattedFechaActual);
  }
  const fecha = new Date(formattedFechaActual);

  try {
    const estudiantes = await prisma.estudiantes.findMany({
      where: {
        inscripciones: {
          some: {
            fecha_inscripcion: {
              equals: fecha
            }
          }
        }
      },
      include: {
        inscripciones: {
          include: {
            materias: true
          }
        }
      }
    });

    const usuarios = await prisma.usuarios.findMany({
      select: {
        correo_electronico: true
      }
    });
    for (const usuario of usuarios) {
      const { correo_electronico } = usuario;

      let tableBody = '';
      for (const estudiante of estudiantes) {
        const { nombre, apellido, numero_documento, inscripciones } = estudiante;
        // Generar las filas de la tabla para cada estudiante
        const inscripcionesHtml = inscripciones
          .map(inscripcion => {
            const fechaInscripcion = new Date(inscripcion.fecha_inscripcion);
            const dia = (fechaInscripcion.getDate() + 1).toString().padStart(2, '0');
            const mes = (fechaInscripcion.getMonth() + 1).toString().padStart(2, '0');
            const anio = fechaInscripcion.getFullYear().toString();
            return `<li>${inscripcion.materias.nombre} - ${dia}/${mes}/${anio}</li>`;
          })
          .join('');// Modifica esta línea
        const row = `
    <tr>
      <td>${nombre}</td>
      <td>${apellido}</td>
      <td>${numero_documento}</td>
      <td>
        <ul>
          ${inscripcionesHtml}
        </ul>
      </td>
    </tr>
  `;

        tableBody += row;

        // Generar el cuerpo completo del correo
        const correoBody = `
    <h2>Estimado ${"Admin"},\n\nlas incripciones por estudiantes del dia de hoy son las siguientes:\n\n </h2>
    <h2>Tabla de Estudiantes e Inscripciones</h2>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Número de Documento</th>
          <th>Inscripciones</th>
        </tr>
      </thead>
      <tbody>
        ${tableBody}
      </tbody>
    </table>
  `;


        // Crea el contenido del correo electrónico con las inscripciones del estudiante
        let contenidoCorreo = `Estimado ${"Admin"},\n\nlas incripciones por estudiantes del dia de hoy son las siguientes:\n\n`;
        // for (const estudiante of estudiantes) {
        //     contenidoCorreo += `- ${estudiante.nombre} ${estudiante.apellido}\n`;
        // }
        const mailOptions = {
          from: 'cfbg1999@gmail.com',
          to: correo_electronico,
          subject: 'Inscripciones a materias',
          text: contenidoCorreo,
          html: correoBody
        };

        // Envía el correo electrónico

        const info = await transporter.sendMail(mailOptions);
        console.log(info)
      }
    }
    console.log(usuarios);
  } catch (error) {
    console.error(error);
    const time = new Date();
    console.log(`Your cron function "${context.functionName}" ran at ${time}`);
  }
};
