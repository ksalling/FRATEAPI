// App and Server Requirements
require('isomorphic-fetch');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const next = require('next');
// const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const dotenv = require('dotenv');
// const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const koaBody = require('koa-body');
// const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
// const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const bodyParser = require('koa-bodyparser');
const crypto = require('crypto');
const Cryptr = require('cryptr');

dotenv.config();

// WebApp Initialization
// const port = parseInt(process.env.APP_PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
// const handle = app.getRequestHandler();

// Hook Server Initialization
const hookPort = parseInt(process.env.HOOK_PORT, 10) || 3001;
const hookHandle = app.getRequestHandler();

// Load .env Variables and Create KOA Routers
const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, CRYPTO_KEY } = process.env;
// const router = new KoaRouter();
const hookRouter = new KoaRouter();

//////   Imports   ////////
const mongoModel = require('./server/models.js');

//////   API Functions   ////////
//const installCheck = require('./server/apiFunctions/installCheck');


//const getRawBody = require('raw-body');
//var bodyParser = require('body-parser')

// const getSubscriptionUrl = require('./server/getSubscriptionUrl');
// const createShipper = require('./server/createShipper');
// const getShipper = require('./server/getShipper');
// const updateShipper = require('./server/updateShipper');
// const deleteShipper = require('./server/deleteShipper');
// const safeCompare = require('safe-compare');



//require('./server/models/location');

// const mongoose = require('mongoose');
// ObjectId = mongoose.Types.ObjectId;



const axios = require('axios');



/////////////////////////////////////////////////////////////////////////////////
            /* MongoDB and Mongoose Schemas and Settings */
            /*       Requires ./server/models.js         */
/////////////////////////////////////////////////////////////////////////////////
const mongoose = require('mongoose');
ObjectId = mongoose.Types.ObjectId;

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

// const Carrier = mongoModel.carrierModel(mongoose);
// const Site = mongoModel.siteModel(mongoose);
// const CarrierData = mongoModel.carrierDataModel(mongoose);
// const Location = mongoModel.locationModel(mongoose);
// const Product = mongoModel.productModel(mongoose);

const allModels = {
  Carrier: mongoModel.carrierModel(mongoose),
  Site: mongoModel.siteModel(mongoose),
  CarrierData: mongoModel.carrierDataModel(mongoose),
  Location: mongoModel.locationModel(mongoose),
  Product: mongoModel.productModel(mongoose)
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

/////////////////////////////////////////////////////////////////////////////////
                       /* Security Functions */
/////////////////////////////////////////////////////////////////////////////////
//const algorithm = 'aes-256-cbc';
const password = CRYPTO_KEY;
//const key = crypto.scryptSync(password, 'salt', 32);
//const iv = crypto.randomBytes(16);
const cryptr = new Cryptr(password);

function verifyShopifyHook(ctx) {
  const { headers, request } = ctx;
  const { "x-shopify-hmac-sha256": hmac } = headers;
  const { rawBody } = request;
  const digest = crypto
    .createHmac("SHA256", process.env.SHOPIFY_API_SECRET_KEY)
    .update(new Buffer.from(rawBody, "utf8"))
    .digest("base64");

  return safeCompare(digest, hmac);
}

// const encryptedString = cryptr.encrypt('bacon');
// const decryptedString = cryptr.decrypt(encryptedString);

// function encrypt(text) {
//   var cipher = crypto.createCipheriv(algorithm, key, iv);  
//   var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
//   return encrypted
// }
 
//  function decrypt(encrypted) {
//   var decipher = crypto.createDecipheriv(algorithm, key, iv);
//   var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
//   return decrypted
// }

/////////////////////////////////////////////////////////////////////////////////
                       /* START - API Routes */
/////////////////////////////////////////////////////////////////////////////////

// // Checks to see if database entries exist and returns data
// //###   /components/index.js
// //###   /components/settings.js
// //###   /modals/CarrierModal.js
// //###   /modals/LocationModal.js
// //###   /pages/index-2-installcheck.js
// router.post('/api/installcheck', koaBody(), async (ctx) => {
//   try {
//     ctx.body = await installCheck.func(ctx, allModels)
//   } catch(error) {
//     console.log(error)
//   }
// })

// // Install Route that adds Unit info to the database
// //###   /modals/UnitModal.js
// router.post('/api/addunits', koaBody(), async (ctx) => {
//   try {
//     //const data = ctx.request.body
//     const hookURL = process.env.HOOK_URL;
//     //const shopId = ctx.request.body.shopId;
//     //console.log(ctx.request.body)

//     const result = await createShipper(ctx, hookURL);

//     const formData = {
//       shopId: ctx.request.body.shopId,
//       carrierServiceId: result.carrier_service.id,
//       forceRes: ctx.request.body.forceRes,
//       forceGate: ctx.request.body.forceGate,
//       upcharge: ctx.request.body.upCharge,
//       upChargeType: ctx.request.body.upChargeType,
//       useGeo: ctx.request.body.useGeo,
//       dimensionUnits: {
//         label: ctx.request.body.dimensionUnits.label,
//         value: ctx.request.body.dimensionUnits.value
//       },
//       weightUnits: {
//         label: ctx.request.body.weightUnits.label,
//         value: ctx.request.body.weightUnits.value
//       }
//     }
//     //console.log(formData);
//     const location = new allModels.Site(formData).save(function (err, location) {
//       if (err) return console.log(err);
//     })
//     ctx.body = {
//       action: "add site units"
//     }
//   } catch(error) {
//     ctx.body = {
//       action: "add site units",
//       result: error
//     }
//     console.log(error)
//   }
// })

// // Adds location to the database
// //###   /modals/LocationModal.js
// router.post('/api/addlocation', koaBody(), async (ctx) => {
//   try {
//     //console.log(ctx.request.body);
//     const formData = {
//       shopId: ctx.request.body.shopId,
//       name: ctx.request.body.name,
//       street: ctx.request.body.street,
//       city: ctx.request.body.city,
//       state: ctx.request.body.state,
//       zip: ctx.request.body.zip,
//       liftgate: ctx.request.body.liftgate,
//       residential: ctx.request.body.residential
//     }
//     const location = new allModels.Location(formData).save(function (err, location) {
//       if (err) return console.log(err);
//     })
//     ctx.body = {
//       action: "add location"
//     }
//   } catch(error) {
//     ctx.body = {
//       action: "add location",
//       result: error
//     }
//     console.log(error)
//   }
// })

// // Edits location to the database
// //###   /components/Location.js
// router.post('/api/editlocation', koaBody(), async (ctx) => {
//   try {
//     const data = {
//       id: ctx.request.body.id,
//       shopId: ctx.request.body.shopId,
//       name: ctx.request.body.name,
//       street: ctx.request.body.street,
//       city: ctx.request.body.city,
//       state: ctx.request.body.state,
//       zip: ctx.request.body.zip
//     }
//     //console.log(data);

//     await allModels.Location.findOneAndUpdate({ '_id': ObjectId(data.id) }, {
//       shopId: data.shopId,
//       name: data.name,
//       street: data.street,
//       city: data.city,
//       state: data.state,
//       zip: data.zip
//     }).exec();

//     ctx.body = {
//       action: "add location"
//     }
  
  
//   } catch(error) {
//     ctx.body = {
//       action: "add location",
//       result: error
//     }
//     console.log(error)
//   }
// })


// // Deletes product to the database
// //###   /components/ProductCard.js
// router.post('/api/deleteproduct', koaBody(), async (ctx) => {
//   try {
//     //console.log(ctx.request.body);
//     const productId = ctx.request.body.id
//     const result = await allModels.Product.deleteOne({ '_id': ObjectId(productId) }).exec()
//     // const location = new allModels.Product(ctx.request.body).save(function (err, location) {
//     //   if (err) return console.log(err);
//     // })
//     ctx.body = {
//       action: "delete product",
//       result: result
//     }
//   } catch(error) {
//     ctx.body = {
//       action: "add product",
//       result: error
//     }
//     console.log(error)
//   }
// })

// // Adds product to the database
// //###   /components/index.js
// router.post('/api/addproduct', koaBody(), async (ctx) => {
//   try {
//     //console.log(ctx.request.body);
//     const location = new allModels.Product(ctx.request.body).save(function (err, location) {
//       if (err) return console.log(err);
//     })
//     ctx.body = {
//       action: "add product"
//     }
//   } catch(error) {
//     ctx.body = {
//       action: "add product",
//       result: error
//     }
//     console.log(error)
//   }
// })


// router.post('/api/updateproduct', koaBody(), async (ctx) => {
//   try {
//     const update = ctx.request.body;
//     //console.log(update);
//     await allModels.Product.findOneAndUpdate(
//       { '_id': ObjectId(update.id) }, 
//       {
//         shopId: update.shopID,
//         productId: update.productId,
//         len: update.len,
//         width: update.width,
//         height: update.height,
//         weight: update.weight,
//         carrier: update.carrier,
//         location: update.location
//       }
//     ).exec();
//     ctx.body = {
//       action: 'Update Product'
//     }
//   } catch(error) {
//     console.log(error);
//   }
// })

// router.post('/api/getcarloc', koaBody(), async (ctx) => {
//   try {
//     const shopId = ctx.request.body.shopId;
//     const locations = await allModels.Location.find({ shopId:shopId }).exec();
//     const carriers = await allModels.CarrierData.find({ shopId: shopId }).exec();
//     ctx.body = {
//       action: 'Get Carriers and Locations',
//       locations: locations,
//       carriers: carriers
//     }
//   } catch(error) {
//     console.log(error);
//   }
// })



// // Gets a list of the available carriers
// //###   /modals/CarrierModal.js
// router.get('/api/carrierlist', koaBody(), async (ctx) => {
//   try {
//     const carrierList = await allModels.Carrier.find({}).exec()
//     ctx.body = {
//       action: 'Get Carrier List',
//       carrierList: carrierList
//     }
//   } catch(error) {
//     console.log(error)
//   }
// })

// //  Updates the dimension and weight units on the settings page
// //###   /components/DimensionUnits.js
// //###   /components/WeightUnits.js
// router.post('/api/settingsupdate', koaBody(), async (ctx) => {
//   try {
//     var myShop = null;
//     //console.log(ctx.request.body)
//     const query = ctx.request.body
//     ctx.body = ctx.request.body

//     switch(query.item) {
//       case 'weight':
//         await allModels.Site.findOneAndUpdate(
//           {shopId: query.filter.shopId}, 
//           {weightUnits: {
//             label: query.update.weightUnits.label,
//             value: query.update.weightUnits.value}}
//         ).exec();
//         break;
//       case 'dimension':
//         await allModels.Site.findOneAndUpdate(
//           {shopId: query.filter.shopId}, 
//           {dimensionUnits: {
//             label: query.update.dimensionUnits.label,
//             value: query.update.dimensionUnits.value}}
//         ).exec();
//         break;
//     }
    
//   } catch(error) {
//     console.log(error)
//   }

// })

// // Deletes a location from the settings page
// //###   /components/Locations.js
// router.post('/api/deletelocation', koaBody(), async (ctx) => {
//   try {
//     //console.log(ctx.request.body.location);
//     //await Location.find({ '_id': ObjectId(ctx.request.body._id) }).exec()
//     const locationId = ctx.request.body.id
//     const result = await allModels.Location.deleteOne({ '_id': ObjectId(locationId) }).exec()
//     ctx.body = {
//       action: 'Location Deleted',
//       result: result
//     }
//   } catch(error) {
//     console.log(error)
//     //console.log(ctx.request.body)
//   }
// })

// // Deletes a carrier from the settings page
// //###   /components/Carriers.js
// router.post('/api/deletecarrier', koaBody(), async (ctx) => {
//   try {
//     console.log(ctx.request.body);
//     //await Location.find({ '_id': ObjectId(ctx.request.body._id) }).exec()
//     const carrierId = ctx.request.body.id
//     const result = await allModels.CarrierData.deleteOne({ '_id': ObjectId(carrierId) }).exec()
//     ctx.body = {
//       action: 'Carrier Deleted',
//       result: result
//     }
//   } catch(error) {
//     console.log(error)
//     //console.log(ctx.request.body)
//   }
// })

// // Adds a carrier to the list
// //###   /modals/CarrierModal.js
// router.post('/api/addcarrier', koaBody(), async (ctx) => {
//   try {

//     var encText = cryptr.encrypt(ctx.request.body.apiSecret);

//     const data = {
//       shopId: ctx.request.body.shopId,
//         name: ctx.request.body.name,
//         carrierId: ctx.request.body.carrierId,
//         active: ctx.request.body.active,
//         apiKey: ctx.request.body.apiKey,
//         apiSecret: encText
//     }

//     const location = new allModels.CarrierData(data).save(function (err, location) {
//       if (err) return console.log(err);
//     })
//     ctx.body = {
//       action: "add carrier"
//     }
//   } catch(error) {
//     ctx.body = {
//       action: "add carrier",
//       result: error
//     }
//     console.log(error)
//   }
// })

// // Looks up the Carriers used by the shop
// // Also queries the list of carriers that are available for use
// //### /components/Carriers.JS
// router.post('/api/carriers', koaBody(), async (ctx) => {
//   try {
//     //console.log(ctx.request.body);
//     const formData = ctx.request.body;
//     ctx.body = "API Working";
//     const carrierId = await allModels.Carrier.find({name: ctx.request.body.name}).exec()
//     //const inCarrier = await Site.find({shopId: formData.shopId, carriers : {name: formData.name}}).exec()
//     //console.log(inCarrier)
//     var encText = cryptr.encrypt(formData.apiSecret);
    
//     await allModels.CarrierData.findOneAndUpdate({shopId: formData.shopId}, {$push: { carriers: {
//       name: formData.name,
//       carrierId: carrierId.id,
//       active: true,
//       apiKey: formData.apiKey,
//       apiSecret: encText
//     }}}).exec();

//   } catch(error) {
//     console.log(error);
//   }
// })

// // Edits a carrier
// //###   /components/Carriers.js
// router.post('/api/editcarrier', koaBody(), async (ctx) => {
//   try {

//     //console.log(ctx.request.body)

//     var encText = cryptr.encrypt(ctx.request.body.apiSecret);

//     const data = {
//       id: ctx.request.body.id,
//       shopId: ctx.request.body.shopId,
//       name: ctx.request.body.name,
//       carrierId: ctx.request.body.carrierId,
//       active: ctx.request.body.active,
//       apiKey: ctx.request.body.apiKey,
//       apiSecret: encText
//     }

//     await allModels.CarrierData.findOneAndUpdate({ '_id': ObjectId(data.id) }, {
//       shopId: data.shopId,
//       name: data.name,
//       carrierId: data.carrierId,
//       active: data.active,
//       apiKey: data.apiKey,
//       apiSecret: data.apiSecret
//     }).exec();

//     ctx.body = {
//       action: "add carrier"
//     }
//   } catch(error) {
//     ctx.body = {
//       action: "add carrier",
//       result: error
//     }
//     console.log(error)
//   }
// })



/////////////////////////////////////////////////////////////////////////////////
                      /* End - Production API Routes */                       
                      /* Begin - Test API Routes */
/////////////////////////////////////////////////////////////////////////////////

// Gets a list of the available carriers
//###   /modals/CarrierModal.js
hookRouter.post('/api/test', async (ctx) => {
  try {
    console.log('Rate API Test');
    ctx.body = {
      action: 'Rate API Test'
    }
  } catch(error) {
    console.log(error)
  }
})


hookRouter.post('/api/getrate/', async(ctx) => {
  try{
    

    //  1. Receive Request
    console.log("FRATE Quote Requested");
    console.log(ctx.request.body);

    //  2. Lookup Products
    console.log("Lookup Producs");

    //  3. If Found Create Ship Request

    //    3a. Determine which carrier or carriers
    //    3b. Get API Keys and Decrypt
    //    3c. Determine if residential 
    //    3d. Get rate quote via API call
    //    3e. Send rates back to Shopify

    //  4. If Not Found Return Body



    //console.log(ctx.request);
    
    //console.log(ctx.request.rawBody);

    console.log(verifyShopifyHook(ctx));

    //const verifyShopifyHook = ctx => {
      // const { headers, request } = ctx;
      // const { "x-shopify-hmac-sha256": hmac } = headers;
      // const { rawBody } = request;
    
      // console.log("Verify");
    
      // const digest = crypto
      //   .createHmac("SHA256", process.env.SHOPIFY_API_SECRET_KEY)
      //   .update(new Buffer.from(rawBody, "utf8"))
      //   .digest("base64");
    
      // console.log(digest);
      // console.log(hmac);
    
      // console.log(safeCompare(digest, hmac));
    //};

    const shippers = await allModels.Carrier.find({}).exec();
    console.log(shippers);




    //const hmacHeader = ctx.request.header['x-shopify-hmac-sha256'];
    //const rawBody = ctx.request.rawBody;
    //const verified = verifyShopifyHook;
    //console.log(verifyShopifyHook);
    //console.log(verified);
    ctx.body = {
        "rates": [
            {
                "service_name": "canadapost-overnight",
                "service_code": "ON",
                "total_price": "1295",
                "description": "This is the fastest option by far",
                "currency": "CAD",
                "min_delivery_date": "2013-04-12 14:48:45 -0400",
                "max_delivery_date": "2013-04-12 14:48:45 -0400"
            },
            {
                "service_name": "fedex-2dayground",
                "service_code": "2D",
                "total_price": "2934",
                "currency": "USD",
                "min_delivery_date": "2013-04-12 14:48:45 -0400",
                "max_delivery_date": "2013-04-12 14:48:45 -0400"
            },
            {
                "service_name": "fedex-priorityovernight",
                "service_code": "1D",
                "total_price": "4563587",
                "currency": "USD",
                "min_delivery_date": "2013-04-12 14:48:45 -0400",
                "max_delivery_date": "2013-04-12 14:48:45 -0400"
            }
        ]
     }
    
  }catch(error) {
    console.log(error);
  }
})

// router.post('/api/uninstall', koaBody(), async (ctx) => {
//   try {

//     //console.log(ctx.request);
//     //console.log(ctx.request.shopId);
//     console.log(ctx.request.body);
//     const shopId = ctx.request.body.shopId;
//     const carrierId = await allModels.Site.findOne({ shopId: shopId }).exec()
//     const result = await deleteShipper(ctx, carrierId.carrierServiceId);
//     console.log(result);
//     if (result != null && result == 'OK') {
//       //allModels.Site.findOneAndUpdate({ shopId: shopId }, { carrierServiceId: "null" }).exec();
    
//       const siteDb = await allModels.Site.deleteMany({shopId: shopId}).exec();
//       const carrierDb = await allModels.CarrierData.deleteMany({shopId: shopId}).exec();
//       const locationDb = await allModels.Location.deleteMany({shopId: shopId}).exec();
//       const productDb = await allModels.Product.deleteMany({shopId: shopId}).exec();
//       //const shippers = await Carrier.find({}).exec();
//       //const { shop, accessToken } = ctx.session;
//       //deleteShipper(ctx, accessToken, shop);
//       ctx.body = "complete";
//     } else {
//       ctx.body = "FAIL";
//     }
//     //ctx.body = "complete";

//   } catch(error) {
//     console.log(error);
//   }
// });

// router.post('/api/getshipper', koaBody(), async (ctx) => {
//   try {
    
//     const shopId = ctx.request.body.shopId;
//     //console.log(ctx.request);
//     //const { shop, accessToken } = ctx.session;
//     const result = await getShipper(ctx)

//     console.log(result)

//     //await allModels.Site.findOneAndUpdate({ shopId: shopId }, { carrierServiceId: result }).exec();

//     ctx.body = {
//       action: 'Get Shipper',
//       result: result
//     }

//   } catch(error) {
//     console.log(error);
//   }
//  })

//  router.post('/api/deleteshipper', koaBody(), async (ctx) => {
//    try {
    
//     const shopId = ctx.request.body.shopId;
//     const carrierId = await allModels.Site.findOne({ shopId: shopId }).exec()
//     const result = await deleteShipper(ctx, carrierId.carrierServiceId);
//     console.log(result);
//     if (result != null && result.statusText == 'OK') {
//       allModels.Site.findOneAndUpdate({ shopId: shopId }, { carrierServiceId: "null" }).exec();
//     }
    
//     ctx.body = {
//       action: 'Delete Shipper',
//       result: result
//     }
//    } catch (error) {
//      console.log(error)
//    }
//  })

//  router.post('/api/updateshipper', koaBody(), async (ctx) => {
//    try {
    
//     const shopId = ctx.request.body.shopId;
//     const { shop, accessToken } = ctx.session;
//     const result = await updateShipper(ctx, accessToken, shop);
//     ctx.body = {
//       action: 'Delete Shipper',
//       result: result
//     }
//    } catch(error) {
//      console.log(error)
//    }
//  })

// router.post('/api/create', koaBody(), async (ctx) => {
//   try {
    
//     const hookURL = process.env.HOOK_URL;
//     const shopId = ctx.request.body.shopId;

//     const result = await createShipper(ctx, hookURL);
//     console.log(result.carrier_service.id);

//     await allModels.Site.findOneAndUpdate({ shopId: shopId }, { carrierServiceId: result.carrier_service.id }).exec();

    
//     //updateShipper(ctx, accessToken, shop);

//   //   var api = '/admin/api/2020-07/carrier_services.json'
//   //   // var host = 'https://' + shop + api;
//   //   // //var host = 'https://' + SHOPIFY_API_KEY + ':' + SHOPIFY_API_SECRET_KEY + '@' + ctx.cookies.get('shopOrigin') + api;
//   //   // const config = {
//   //   //   headers: {
//   //   //     'Content-Type': 'application/json',
//   //   //     "X-Shopify-Access-Token": accessToken
//   //   //   }
//   //   // };

//   //   const host = `https://${shop}/admin/api/2020-07/products.json`;

//   // const config = {
//   //   headers: {
//   //     'Content-Type': 'application/json',
//   //     "X-Shopify-Access-Token": accessToken
//   //   }
//   // };

//   //   console.log(host);

//   //   // const response = await fetch(`https://${shop}/admin/api/2020-07/carrier_services.json`, {
//   //   //   method: 'GET',
//   //   //   headers: {
//   //   //     'Content-Type': 'application/json',
//   //   //     "X-Shopify-Access-Token": accessToken,
//   //   //   },
//   //   //   body: shipperInfo
//   //   // })
  
//   //   // const responseJson = await response.json();
//   //   // await console.log(responseJson);

//   //   axios.get(host, config)
//   //     .then(result => {
//   //       console.log(result)
//   //     })
//   //     .catch( error => console.log(error))

  



//     //await Location.find({ '_id': ObjectId(ctx.request.body._id) }).exec()
//     //const locationId = ctx.request.body.id
//     //const result = await Location.deleteOne({ '_id': ObjectId(locationId) }).exec()
//     ctx.body = {
//       action: 'Get Shipper',
//       result: result
//     }
//   } catch(error) {
//     console.log(error)
//     //console.log(ctx.request.body)
//   }
// })




/////////////////////////////////////////////////////////////////////////////////
                       /* END - API Routes */
/////////////////////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////////////////////
           /* Server Initialization and Authentication */
/////////////////////////////////////////////////////////////////////////////////

app.prepare().then(() => {
  //const server = new Koa();
  const hookServer = new Koa();

  // server.use(session({ sameSite: 'none', secure: true }, server));
  // server.keys = [SHOPIFY_API_SECRET_KEY];

  // server.use(
  //   createShopifyAuth({
  //     apiKey: SHOPIFY_API_KEY,
  //     secret: SHOPIFY_API_SECRET_KEY,
  //     scopes: [
  //           'read_products',
  //           'read_script_tags',
  //           'write_script_tags',
  //           'write_products',
  //           'write_shipping',
  //           'read_shipping'
  //       ],
  //     async afterAuth(ctx) {
  //       const { shop, accessToken } = ctx.session;
  //       ctx.cookies.set('shopOrigin', shop, {
  //           httpOnly: false,
  //           secure: true,
  //           sameSite:'none'
  //       })
  //       ctx.redirect('/');
  //     },
  //   }),
  // );

  // server.use(graphQLProxy({ version: ApiVersion.July20 }));
  // server.use(verifyRequest());

  // //Router Middleware
  // server.use(router.allowedMethods());
  // server.use(router.routes());

  // server.use(async (ctx) => {
  //   await handle(ctx.req, ctx.res);
  //   ctx.respond = false;
  //   ctx.res.statusCode = 200;

  // });

  // Hook Server
  hookServer.use(bodyParser());
  hookServer.use(hookRouter.allowedMethods());
  hookServer.use(hookRouter.routes());

  hookServer.use(async (ctx) => {
    await hookHandle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  // server.listen(port, () => {
  //   console.log(`> Ready on http://localhost:${port}`);
  // });

  hookServer.listen(hookPort, () => {
    console.log(`> Ready on http://localhost:${hookPort}`);
  });

});