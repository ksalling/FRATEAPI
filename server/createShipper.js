const axios = require('axios');

const createShipper = async (ctx, URL) => {

  var data = null;
  const { shop, accessToken } = ctx.session;

  //console.log("create shipper");

  // "active": true,
  //     "carrier_service_type": "api",
  //     "format": "json",

  const shipperInfo = {
    "carrier_service": {
      "name": "FRATE",
      "callback_url": URL + "/api/getrate",
      "service_discovery": true,
    }
  }
  const host = `https://${shop}/admin/api/2020-07/carrier_services.json`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      "X-Shopify-Access-Token": accessToken
    }
  };

  await axios.post(host, shipperInfo, config)
      .then(result => {
        //console.log(result)
        data = result.data;
      })
      .catch( error => console.log(error))
  
  
  return data;
  
    // const response = await fetch(`https://${shop}/admin/api/2020-07/products.json`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     "X-Shopify-Access-Token": accessToken,
    //   },
    //   body: shipperInfo
    // })
  
    //const responseJson = await response.json();
    //console.log(await response.json());
    //const confirmationUrl = responseJson.data.appSubscriptionCreate.confirmationUrl
    //return ctx.redirect('/');
  };
  
  module.exports = createShipper;