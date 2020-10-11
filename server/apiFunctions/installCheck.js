//###   /components/index.js
//###   /components/settings.js
//###   /modals/CarrierModal.js
//###   /modals/LocationModal.js
//###   /pages/index-2-installcheck.js
async function func(ctx, models, cryptr) {
    
    console.log(ctx.request.body)
    const shopId = ctx.request.body.shopId;
    console.log(shopId)
    const siteDb = await models.Site.find({shopId: shopId}).exec();
    const carrierDb = await models.CarrierData.find({shopId: shopId}).exec();
    const locationDb = await models.Location.find({shopId: shopId}).exec();
    const productDb = await models.Product.find({shopId: shopId}).exec();
    const shippers = await models.Carrier.find({}).exec();
    var shopExists = null;
  
      // console.log((carrierDb.length > 0) ? false : true)
      // console.log((siteDb.length > 0) ? false : true)
      // console.log((locationDb.length > 0) ? false : true)
      // console.log(carrierDb);
      
  
    if (siteDb.length > 0 && carrierDb.length > 0 && locationDb.length > 0) {
    shopExists = true;
    } else {
    shopExists = false;
    }
  
    const body = { 
    action: "install check",
    appSettings: {
        shopID: shopId,
        install: {
          shopExists: shopExists,
          location: ((locationDb.length > 0) ? false : true),
          carrier: ((carrierDb.length > 0) ? false : true),
          units: ((siteDb.length > 0) ? false : true)
        },
        settings: {
        units: siteDb,
        carriers: carrierDb,
        locations: locationDb,
        products: productDb,
        shippers: shippers
        }
    }
    };

    return body;
}
  exports.func = func
