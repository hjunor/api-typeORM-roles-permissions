// export namespace Express {
//   export interface Response {
//     jsonOK: Parameters;
//     jsonBadRequest: any;
//     jsonUnauthorized: object;
//     jsonNotFound: object;
//     jsonServerError: function;
//   }
//   export interface Request {
//     id: string;
//   }
// }

// eslint-disable-next-line @ typescript-eslint / no-namespace
namespace Express {
  interface Request {
    id: string;
    roles: string[];
    decoded: any;
  }
  interface Response {
    status: {
      json: any;
    };

    jsonOK: any;
    jsonBadRequest: any;
    jsonUnauthorized: object;
    jsonNotFound: object;
    jsonServerError: function;
  }
}
