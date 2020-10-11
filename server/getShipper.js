const axios = require('axios');

const getShipper = async (ctx) => {

  var data = null;
  const { shop, accessToken } = ctx.session;
  
  const host = `https://${shop}/admin/api/2020-07/carrier_services.json`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      "X-Shopify-Access-Token": accessToken
    }
  };

  await axios.get(host, config)
      .then(result => {
        //console.log(result.data)
        data = result.data
      })
      .catch( error => console.log(error))

  return data;

  };
  
  module.exports = getShipper;