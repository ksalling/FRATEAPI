const axios = require('axios');

const updateShipper = async (ctx, accessToken, shop) => {

  

  console.log("create shipper");

  // "active": true,
  //     "carrier_service_type": "api",
  //     "format": "json",

  const id = 49776165021;

  const shipperInfo = {
    "carrier_service": {
      "id": id,
      "callback_url": "https://kyle.loca.lt/api/getrate/"
    }
  }
  const host = `https://${shop}/admin/api/2020-07/carrier_services/${id}.json`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      "X-Shopify-Access-Token": accessToken
    }
  };

  axios.put(host, shipperInfo, config)
      .then(result => {
        console.log(result)
        return result;
      })
      .catch( error => console.log(error))


    
  
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
  
  module.exports = updateShipper;