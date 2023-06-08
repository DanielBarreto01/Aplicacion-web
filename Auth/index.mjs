const bcrypt = require("bcryptjs");
var mysql = require("mysql");
const util = require("util");

var connection = mysql.createConnection({
  host: "test.cncsjtyrkpwn.us-east-2.rds.amazonaws.com",
  user: "admin",
  port: "3306",
  password: "pedropicapiedra",
  database: "test",
});
// node native promisify
const query = util.promisify(connection.query).bind(connection);
// Encriptar contraseña
const saltRounds = 10;
const jwt = require("jsonwebtoken");

exports.handler = async (event, context, callback) => {
  let evento = event;
  console.log("Evento:", evento);
  console.log("Evento body:", evento.body);
  console.log("Evento headers:", evento.headers);
  var email;
  var password;
  var token;
  if (evento.headers) {
    token = evento.headers.authorizationToken
      ? evento.headers.authorizationToken
      : "";
  }
  if (evento.body) {
    email = evento.body.email;
    password = evento.body.password;
  }
  if (email) {
    context.callbackWaitsForEmptyEvenLoop = false;
    return await postLogin({ email, password });
  } else if (token) {
    let resToken = verifyToken(token);
    console.log('Resultado de verificar Token:',resToken);
    switch (resToken) {
      case "allow":
        callback(null, generatePolicy("user", "Allow", event.methodArn));
        break;
      case "deny":
        callback(null, generatePolicy("user", "Deny", event.methodArn));
        break;
      case "unauthorized":
        callback("Unauthorized"); // Return a 401 Unauthorized response
        break;
      default:
        callback("Error: Invalid token"); // Return a 500 Invalid token response
    }
  }
};

// Help function to generate an IAM policy
var generatePolicy = function (principalId, effect, resource) {
  var authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    stringKey: "stringval",
    numberKey: 123,
    booleanKey: true,
  };
  return authResponse;
};

/**generea metodo para verificar la sesion con la tabla credenciales y genera un jwt */
const postLogin = async (req) => {
  let res;
  const sql = "SELECT * FROM estudiantes";
  let resUser = []

  try {
    const { email, password } = req;
    const busqueda = "SELECT * FROM credenciales c, usuarios u WHERE u.correo_electronico = '" + email + "' AND c.usuario = '" + email + "'";
    const user = await query(busqueda);

    var string = JSON.stringify(user);
    resUser =  JSON.parse(string);

    console.log("Respuesta DB", resUser[0]);
    // bcrypt.compare(password, resUser[0].contrasena, function (err, result) {
    //   // result == true
    //   console.log('Resultado de Comparacion',result);
    // });
    if (resUser[0] && (await bcrypt.compare(password, resUser[0].contrasena) == true)) {
      console.log('contrasena correcta')
    }
    else
    return JSON.stringify({ error: "Sesion incorrecta/token no generado" });

  } finally {
    console.log('Termina comparacion');
    //connection.end();
  }

  try {
 
      const token = jwt.sign(
        {
          usuario: resUser[0].usuario,
          id: resUser[0].id,
          contrasena: resUser[0].contrasena
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '180s',
        }
      );
    // Devolver una respuesta JSON con el usuario creado

    res = JSON.stringify({
      message: "Usuario logeado correctamente",
      body: {
        token: token
      },
    });
  } catch (error) {
    console.error(error);
    res = JSON.stringify({ error: "Sesion incorrecta/token no generado" });
  }

  console.log("Respuesta Autenticacion:", res);

  return res;
};

const verifyToken = (req) => {
  let token = req.split(" ")[1];
  console.log('Token puro:',token);
  let res;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res = "allow";
  } catch (err) {
    res = "deny";
  }
  return res;
};
