const locationModel = (mongoose) => {
    const locationDataSchema = mongoose.Schema({
      shopId: { type: String, unique: false, required: true, dropDups: false },
      name: String,
      street: String,
      city: String,
      state: String,
      zip: String,
      liftgate: Boolean,
      residential: Boolean
    })
    locationDataSchema.method('transform', function() {
      var obj = this.toObject();
      //Rename fields
      obj.id = obj._id;
      delete obj._id;
      return obj;
    });
    const Location = mongoose.model("Location", locationDataSchema);
    return Location;
}
exports.locationModel = locationModel;


const carrierModel = (mongoose) => {
    const carrierSchema = mongoose.Schema({
        name: String,
        apiAddress: String
    })
    carrierSchema.method('transform', function() {
        var obj = this.toObject();
        //Rename fields
        obj.id = obj._id;
        delete obj._id;
        return obj;
    });
    const Carrier = mongoose.model("Carrier", carrierSchema);
    return Carrier;
}
exports.carrierModel = carrierModel;


const carrierDataModel = (mongoose) => {
    const carrierDataSchema = mongoose.Schema({
        shopId: { type: String, unique: false, required: true, dropDups: false },
        name: String,
        carrierId: String,
        active: Boolean,
        apiKey: String,
        apiSecret: String
    })
    carrierDataSchema.method('transform', function() {
        var obj = this.toObject();
        //Rename fields
        obj.id = obj._id;
        delete obj._id;
        return obj;
    });
    const CarrierData = mongoose.model("CarrierData", carrierDataSchema);
    return CarrierData;
}
exports.carrierDataModel = carrierDataModel;

const siteModel = (mongoose) => {
    const siteDataSchema = mongoose.Schema({
        shopId: { type: String, unique: true, required: true, dropDups: true },
        shopName: String,
        carrierServiceId: String,
        forceRes: Boolean,
        forceGate: Boolean,
        upCharge: String,
        upChargeType: String,
        useGeo: Boolean,
        dimensionUnits: {
          label: String,
          value: String
        },
        weightUnits: {
          label: String,
          value: String
        }
    })
    const Site = mongoose.model("Site", siteDataSchema);
    return Site;
}
exports.siteModel = siteModel;

const productModel = (mongoose) => {
    const productDataSchema = mongoose.Schema({
        shopId: { type: String, unique: false, required: true, dropDups: false },
        productId: String,
        weight: String,
        len: String,
        width: String,
        height: String,
        carrier: String,
        location: String
    })
    productDataSchema.method('transform', function() {
        var obj = this.toObject();
        //Rename fields
        obj.id = obj._id;
        delete obj._id;
        return obj;
    });
    const Product = mongoose.model("Product", productDataSchema);
    return Product;
}
exports.productModel = productModel;