import { z } from 'zod/v4';

const validateSchema = (schmema) => (req, res, next) => {
  const { error, data } = schmema.safeParse(req.body);

  if (error) {
    const prettyErrorMessage = z.prettifyError(error);
    throw new Error(prettyErrorMessage, { cause: 400 });
  }

  next();
};

// Alternative Schreibweise für diese Factory Funktion
// Wir erzeugen dynamisch eine Middleware, in die wir das gebrauchte Schema einsetzen.

// function validateSchema(schema) {
//   return function validationMiddleware(req, res, next) {
//     const { error, data } = schema.safeParse(req.body);
//     if (error) {
//        const prettyErrorMessage = z.prettifyError(error);
//        throw new Error(prettyErrorMessage, { cause: 400 });
//     }
//     console.log(data);
//     next();
//   };
// }

export default validateSchema;
