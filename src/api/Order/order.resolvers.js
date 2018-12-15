import axios from "axios";
import { parseString } from "xml2js";
import qs from "qs";
import {
  PAGSEGURO_WS_API,
  PAGSEGURO_AUTH_EMAIL,
  PAGSEGURO_AUTH_TOKEN
} from "../../config";

export default {
  Query: {
    getSessionId: async function(_, args) {
      const data = {
        email: PAGSEGURO_AUTH_EMAIL,
        token: PAGSEGURO_AUTH_TOKEN
      };

      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(data),
        url: `${PAGSEGURO_WS_API}/v2/sessions`
      };

      return await axios(options)
        .then(async function(response) {
          let id = "";
          await parseString(response.data, (err, result) => {
            if (err) console.log(err);
            id = result.session.id[0];
          });
          return id;
        })
        .catch(function(error) {
          console.log(error);
          throw new Error("getSessionId error");
        });
    }
  },
  Mutation: {
    createOrder: async function(_, args, { db, userId }) {
      console.log(args, userId);

      const cart = await db.cart.find({ userId }).sort("createdAt");

      const data = {
        extraAmount: "0.00",
        itemId1: "0001",
        itemDescription1: "Notebook Prata",
        itemAmount1: "2430.00",
        itemQuantity1: 1,
        notificationURL: "https://sualoja.com.br/notifica.html",
        reference: "REF1234",

        email: PAGSEGURO_AUTH_EMAIL,
        token: PAGSEGURO_AUTH_TOKEN,

        ...args.data,
        paymentMode: "default",
        receiverEmail: "xpdaniel2011@gmail.com",
        currency: "BRL",

        senderAreaCode: 11,
        senderPhone: 56273440,
        shippingAddressState: "PB",
        shippingAddressCountry: "BRA",
        shippingType: 1,
        shippingCost: "1.00"
      };

      console.log(data, cart);

      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(data),
        url: `${PAGSEGURO_WS_API}/v2/transactions`
      };

      return await axios(options)
        .then(function(response) {
          parseString(response.data, (err, result) => {
            if (err) console.log(err);
            // console.log(result);
          });

          return true;
        })
        .catch(function(error) {
          console.log(error);
          return false;
        });
    }
  }
};
