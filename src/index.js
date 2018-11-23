import { GraphQLServer } from "graphql-yoga";
import express from "express";
import axios from "axios";
import { parseString } from "xml2js";
import qs from "qs";
import "./database";

import {
  PORT,
  DEBUG,
  PLAYGROUND,
  PAGSEGURO_WS_API,
  PAGSEGURO_AUTH_EMAIL,
  PAGSEGURO_AUTH_TOKEN
} from "./config";
import { middlewares } from "./middlewares";
import { typeDefs, resolvers, context } from "./api";

String.prototype.isEmpty = function() {
  return this.length === 0 || !this.trim();
};

// const data = {
//   email: PAGSEGURO_AUTH_EMAIL,
//   token: PAGSEGURO_AUTH_TOKEN,
//   paymentMode: "default",
//   paymentMethod: "boleto",
//   receiverEmail: "xpdaniel2011@gmail.com",
//   currency: "BRL",
//   extraAmount: "0.00",
//   itemId1: "0001",
//   itemDescription1: "Notebook Prata",
//   itemAmount1: "2430.00",
//   itemQuantity1: 1,
//   notificationURL: "https://sualoja.com.br/notifica.html",
//   reference: "REF1234",
//   senderName: "Jose Comprador",
//   senderCPF: 22111944785,
//   senderAreaCode: 11,
//   senderPhone: 56273440,
//   senderEmail: "c78055435142952201445@sandbox.pagseguro.com.br",
//   senderHash:
//     "cb4a1da10abb2449b257d0974541bf5bd6fbdb657c20dfbeb90ad676cdb61b95",
//   shippingAddressStreet: "Av. Brig. Faria Lima",
//   shippingAddressNumber: 1384,
//   shippingAddressComplement: "5o andar",
//   shippingAddressDistrict: "Jardim Paulistano",
//   shippingAddressPostalCode: "01452002",
//   shippingAddressCity: "Sao Paulo",
//   shippingAddressState: "SP",
//   shippingAddressCountry: "BRA",
//   shippingType: 1,
//   shippingCost: "1.00"
// };

// const options = {
//   method: "POST",
//   headers: { "content-type": "application/x-www-form-urlencoded" },
//   data: qs.stringify(data),
//   url: `${PAGSEGURO_WS_API}/v2/transactions`
// };
// axios(options)
//   .then(function(response) {
//     // console.log(response.data);
//     parseString(response.data, (err, result) => {
//       if (err) console.log(err);

//       console.log(result);
//     });
//   })
//   .catch(function(error) {
//     console.log(error);
//   });

const opts = {
  port: PORT,
  debug: DEBUG,
  playground: PLAYGROUND
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  middlewares,
  context
});

server.express.use("/assets", express.static("assets"));
server.start(opts, ({ port }) =>
  console.log(`Server is running on http://localhost:${port}`)
);
