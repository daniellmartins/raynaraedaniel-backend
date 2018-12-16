import axios from "axios";
import { parseString } from "xml2js";
import qs from "qs";
import fs from "fs";
import _keyBy from "lodash/keyBy";

import {
  PAGSEGURO_WS_API,
  PAGSEGURO_AUTH_EMAIL,
  PAGSEGURO_AUTH_TOKEN
} from "../../config";
import { formatMoney } from "../../utils";

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
    createOrder: async (_, args, { db, userId, pubSub }) => {
      const carts = await db.cart.find({ userId }).sort("createdAt");

      const cartByIds = _keyBy(carts, "productId");
      let products = await db.product.find({
        _id: {
          $in: Object.keys(cartByIds)
        }
      });
      const productByIds = _keyBy(products, "_id");

      const total = await carts.reduce((tally, item) => {
        if (!item.quantity) return tally;
        return tally + item.quantity * productByIds[item.productId].price;
      }, 0);

      let items = {};
      await carts.map((cart, index) => {
        items[`itemId${index + 1}`] = `${cart.productId}`;
        items[`itemDescription${index + 1}`] =
          productByIds[cart.productId].name;
        items[`itemAmount${index + 1}`] = formatMoney(
          productByIds[cart.productId].price,
          ",",
          "."
        );
        items[`itemQuantity${index + 1}`] = cart.quantity;
      });
      console.log(items);

      const totalFinal = formatMoney(total, ",", ".");

      const data = {
        extraAmount: "0.00",
        ...items,
        notificationURL: "https://sualoja.com.br/notifica.html",
        reference: `${userId}_${Date.now()}`,
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
        shippingCost: "0.00",
        creditCardHolderName: args.data.senderName,
        creditCardHolderCPF: args.data.senderCPF,
        creditCardHolderBirthDate: "27/10/1987",
        billingAddressStreet: args.data.shippingAddressStreet,
        billingAddressNumber: args.data.shippingAddressNumber,
        billingAddressComplement: args.data.shippingAddressComplement,
        billingAddressDistrict: args.data.shippingAddressDistrict,
        billingAddressPostalCode: args.data.shippingAddressPostalCode,
        billingAddressCity: args.data.shippingAddressCity,
        billingAddressState: "PB",
        billingAddressCountry: "BRA"
      };

      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(data),
        url: `${PAGSEGURO_WS_API}/v2/transactions`
      };

      return await axios(options)
        .then(async response => {
          let link = "";
          let transaction = "";
          await parseString(response.data, (err, result) => {
            if (err) console.log(err);
            console.log(result);

            transaction = JSON.stringify({ data, result });

            if (args.data.paymentMethod === "boleto") {
              link = result.transaction.paymentLink[0];
            }
          });

          await carts.map(async cart => {
            const product = await db.product.findById(cart.productId);
            product.stock = product.stock - cart.quantity;
            await product.save();

            await pubSub.publish("PRODUCT", {
              product: { mutation: "UPDATED", node: product }
            });

            const allCarts = await db.cart.find({ productId: cart.productId });
            await allCarts.map(async allCart => {
              if (allCart.quantity === cart.quantity) {
                const cartdelete = await db.cart.findByIdAndDelete(allCart._id);
                await pubSub.publish("CART", {
                  cart: { mutation: "DELETED", node: cartdelete }
                });
              } else {
                const updateCart = await db.cart.findById(allCart._id);
                updateCart.quantity = updateCart.quantity - cart.quantity;
                const cartupdate = await updateCart.save();
                await pubSub.publish("CART", {
                  cart: { mutation: "UPDATED", node: cartupdate }
                });
              }
            });
          });

          await db.order.create({ transaction, ...args.data });
          return link;
        })
        .catch(error => {
          console.log(error);
          return "false";
        });
    }
  }
};
