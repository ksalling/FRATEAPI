const axios = require('axios');

const deleteShipper = async (ctx, carrierId) => {

  var data = null;
  const { shop, accessToken } = ctx.session;

 //console.log("Delete shipper");

  // "active": true,
  //     "carrier_service_type": "api",
  //     "format": "json",

  //const id = 50811601053;

  const shipperInfo = {
    "carrier_service": {
      "id": carrierId,
      "callback_url": "https://kyle.loca.lt/api/getrate/"
    }
  }
  const host = `https://${shop}/admin/api/2020-07/carrier_services/${carrierId}.json`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      "X-Shopify-Access-Token": accessToken
    }
  };

  await axios.delete(host, config)
      .then(result => {
        //console.log(result)
        data = result.statusText;
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
  
  module.exports = deleteShipper;