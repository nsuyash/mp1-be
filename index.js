const express = require("express");
const { initalizeDatabase } = require("./db/db.connect");

const Products = require("./models/products.models");
const Wishlist = require("./models/wishlists.models");
const Cart = require("./models/cartProducts.models");
const Address = require("./models/buyingAddress.models")

const app = express();
const cors = require("cors");

const corsOpt = {
  origin: "*",
  credentials: true,
};

initalizeDatabase();

app.use(express.json());
app.use(cors(corsOpt));

// To get all data route
async function obtainAllProducts() {
  try {
    const products = await Products.find();
    return products;
  } catch (error) {
    throw error;
  }
}

// Route to get filtered products
app.get("/products", async (req, res) => {
  try {
    // Fetch filtered products from the database
    const products = await obtainAllProducts();

    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ error: "Products Not Found." });
    }
  } catch (err) {
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});

// To get product by Id route

async function obtainProductById(productId) {
  try {
    const product = await Products.findById(productId);
    return product;
  } catch (error) {
    throw error;
  }
}

app.get("/products/:productId", async (req, res) => {
  try {
    const product = await obtainProductById(req.params.productId);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Products Not Found." });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch Products: ${error}.` });
  }
});

// Function to get products by category with filters
async function getAllProductOfMobilesAndTablets(filters) {
  try {
    // Include both category and filters in the query object
    const query = { collectionType: "mobiles&tablets", ...filters };
    const products = await Products.find(query);
    return products;
  } catch (error) {
    throw error;
  }
}

// Route to handle GET request for "Mobiles & Tablets" collection
app.get("/collection/mobiles&tablets", async (req, res) => {
  try {
    const {
      brand,
      ram,
      internalXstorage,
      primaryXcamera,
      secondaryXcamera,
      processorXbrand,
    } = req.query;

    let filters = {};

    // Apply brand filter
    if (brand) {
      const brandName = brand.split(",").map((value) => value.trim());
      filters["features.brand"] = { $in: brandName };
    }

    // Apply RAM filter
    if (ram) {
      const ramValues = ram.split(",").map((value) => value.trim());
      filters["features.ram"] = { $in: ramValues };
    }

    // Apply internal storage filter
    if (internalXstorage) {
      const internalStorageValues = internalXstorage
        .split(",")
        .map((value) => value.trim());
      filters["features.internalStorage"] = { $in: internalStorageValues };
    }

    // Apply primary camera filter
    if (primaryXcamera) {
      const primaryCameraValues = primaryXcamera
        .split(",")
        .map((value) => value.trim());
      filters["features.primaryCamera"] = { $in: primaryCameraValues };
    }

    // Apply secondary camera filter
    if (secondaryXcamera) {
      const secondaryCameraValues = secondaryXcamera
        .split(",")
        .map((value) => value.trim());
      filters["features.secondaryCamera"] = { $in: secondaryCameraValues };
    }

    // Apply processor filter
    if (processorXbrand) {
      const processorName = processorXbrand.split(",");
      filters["features.processor"] = { $in: processorName };
    }

    // Fetch products based on category and filters
    const products = await getAllProductOfMobilesAndTablets(filters);

    // Check if products are found and return response
    const availableSubCollectionType = await Products.distinct(
      "subCollectionType",
      { collectionType: "mobiles&tablets" },
    );
    const availableBrand = await Products.distinct("features.brand", {
      collectionType: "mobiles&tablets",
    });
    const availableRam = await Products.distinct("features.ram", {
      collectionType: "mobiles&tablets",
    });
    const availablePrimaryCamera = await Products.distinct(
      "features.primaryCamera",
      { collectionType: "mobiles&tablets" },
    );
    const availableSecondaryCamera = await Products.distinct(
      "features.secondaryCamera",
      { collectionType: "mobiles&tablets" },
    );
    const availableInternalStorage = await Products.distinct(
      "features.internalStorage",
      { collectionType: "mobiles&tablets" },
    );
    const availableProcessor = await Products.distinct("features.processor", {
      collectionType: "mobiles&tablets",
    });

    if (products && products.length > 0) {
      res.status(200).json({
        products,
        collection: availableSubCollectionType,
        filters: {
          brand: availableBrand,
          ram: availableRam,
          internalXstorage: availableInternalStorage,
          primaryXcamera: availablePrimaryCamera,
          secondaryXcamera: availableSecondaryCamera,
          processorXbrand: availableProcessor,
        },
      });
    } else {
      res.status(404).json({
        message: "No products found matching the criteria.",
        filters: {
          brand: availableBrand,
          ram: availableRam,
          internalXstorage: availableInternalStorage,
          primaryXcamera: availablePrimaryCamera,
          secondaryXcamera: availableSecondaryCamera,
          processorXbrand: availableProcessor,
        },
      });
    }
  } catch (error) {
    // Handle errors and return a 500 status with the error message
    res.status(500).json({
      error: `An error occurred while fetching products: ${error.message}`,
    });
  }
});

//Function to get products by category with filters
async function getAllProductOfLaptops(filters) {
  try {
    console.log(filters);
    const query = { collectionType: "laptops", ...filters };
    const products = await Products.find(query);
    return products;
  } catch (err) {
    throw err;
  }
}

// Route to handle GET request for "laptops" collection
app.get("/collection/laptops", async (req, res) => {
  try {
    const {
      brand,
      ram,
      ssd,
      type,
      processorXbrand,
      processorXgeneration,
      processorXname,
    } = req.query;
    const filters = {};

    if (brand) {
      const brandNames = brand.split(",").map((name) => name.trim());
      filters["features.brand"] = { $in: brandNames };
    }

    if (ram) {
      const ramValues = ram.split(",").map((value) => parseInt(value.trim()));
      filters["features.ram"] = { $in: ramValues };
    }

    if (ssd) {
      const ssdValues = ssd.split(",").map((value) => parseInt(value.trim()));
      filters["features.ssd"] = { $in: ssdValues };
    }

    if (type) {
      const typeNames = type.split(",").map((name) => name.trim());
      filters["features.type"] = { $in: typeNames };
    }

    if (processorXbrand) {
      const processorBrandNames = processorXbrand
        .split(",")
        .map((name) => name.trim());
      filters["features.processorBrand"] = { $in: processorBrandNames };
    }

    if (processorXgeneration) {
      const processorGenerationNames = processorXgeneration
        .split(",")
        .map((name) => name.trim());
      filters["features.processorGeneration"] = {
        $in: processorGenerationNames,
      };
    }

    if (processorXname) {
      const processorNames = processorXname
        .split(",")
        .map((name) => name.trim());
      filters["features.processor"] = { $in: processorNames };
    }

    const products = await getAllProductOfLaptops(filters);

    const availableSubCollectionType = await Products.distinct(
      "subCollectionType",
      { collectionType: "laptops" },
    );
    const availableBrands = await Products.distinct("features.brand", {
      collectionType: "laptops",
    });
    const availableRams = await Products.distinct("features.ram", {
      collectionType: "laptops",
    });
    const availableType = await Products.distinct("features.type", {
      collectionType: "laptops",
    });
    const availableSsds = await Products.distinct("features.ssd", {
      collectionType: "laptops",
    });
    const availableProcessorBrands = await Products.distinct(
      "features.processorBrand",
      { collectionType: "laptops" },
    );
    const availableProcessorGeneration = await Products.distinct(
      "features.processorGeneration",
      { collectionType: "laptops" },
    );
    const availableProcessorNames = await Products.distinct(
      "features.processor",
      { collectionType: "laptops" },
    );

    if (products && products.length > 0) {
      res.status(200).json({
        products,
        collection: availableSubCollectionType,
        filters: {
          brand: availableBrands,
          ram: availableRams,
          type: availableType,
          ssd: availableSsds,
          processorXbrand: availableProcessorBrands,
          processorXgeneration: availableProcessorGeneration,
          processorXname: availableProcessorNames,
        },
      });
    } else {
      res.status(404).json({
        message: "No products found matching the criteria.",
        filters: {
          brand: availableBrands,
          ram: availableRams,
          type: availableType,
          ssd: availableSsds,
          processorXbrand: availableProcessorBrands,
          processorXgeneration: availableProcessorGeneration,
          processorXname: availableProcessorNames,
        },
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching products." });
  }
});

// To seed multiple product data at once route
async function seedAllProductsAtOnce(products) {
  try {
    let savedProduct = [];
    for (let product of products) {
      const newProduct = new Products(product);
      await newProduct.save();
      savedProduct.push(newProduct);
    }
    return savedProduct;
  } catch (error) {
    throw error;
  }
}

app.post("/seedProduct/allProducts", async (req, res) => {
  try {
    const newProducts = await seedAllProductsAtOnce(req.body);

    if (newProducts) {
      res
        .status(200)
        .json({ message: "Data Added Successfully!", data: newProducts });
    } else {
      res.status(400).json({
        error: "Failed to add product. Check input data is in correct format.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to add Products: ${error}.` });
  }
});

// To seed single product one data at once route

async function seedProducts(product) {
  try {
    const newProduct = new Products(product);
    const savedProduct = newProduct.save();
    return savedProduct;
  } catch (error) {
    throw error;
  }
}

app.post("/seedProduct/product", async (req, res) => {
  try {
    const newProduct = await seedProducts(req.body);

    if (newProduct) {
      res.status(200).json(newProduct);
    } else {
      res.status(400).json({
        error: "Failed to add product. Check input data is in correct format.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to add Products: ${error}.` });
  }
});

async function seedWishlistProducts(product) {
  try {
    const newProduct = new Wishlist(product);
    const saveProduct = newProduct.save();
    return saveProduct;
  } catch (error) {
    throw error;
  }
}

// To get all data route
async function obtainAllWishlistProducts() {
  try {
    const products = await Wishlist.find();
    return products;
  } catch (error) {
    throw error;
  }
}


app.get("/wishlist", async (req, res) => {
  try {
    const products = await obtainAllWishlistProducts();

    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ error: "Products Not Found." });
    }
  } catch (err) {
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});

app.post("/wishlist/wishlistProduct", async (req, res) => {
  try {
    const newProduct = await seedWishlistProducts(req.body);

    if (newProduct) {
      res.status(200).json(newProduct);
    } else {
      res.status(400).json({
        error: "Failed to add product. Check input data is in correct format.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: `Failed to add Products: ${error}.` });
  }
});


async function deleteWishlistProducts(id){
    try {
        const wishlist = await Wishlist.findByIdAndDelete(id)
        return wishlist
    } catch (error){
        throw error
    }
}

app.delete("/wishlist/:wishlistId", async (req, res) => {
    try {
        const wishlist = await deleteWishlistProducts(req.params.wishlistId)

        if(wishlist){
            res.status(200).json({message: "Product deleted successfully.", product: wishlist})
        } else {
            res.status(404).json({message: "Failed to delete wishlist product not found."})
        }
    } catch (error) {
        res.status(500).json({error: `Failed to delete Products: ${error}.`})
    }
})

async function obtainAllCartProducts(){
  try {
    const products = await Cart.find()
    return products || []
  } catch (error) {
    throw error
  }
}

app.get('/cart/products', async (req, res) => {
  try{                                                      
    const products = await obtainAllCartProducts();

    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ error: "Products Not Found." });
    }  
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
})

async function seedCartProducts(productData){
  try {
    const product = new Cart(productData)
    const savedProduct = await product.save()
    return savedProduct
  } catch (error){
    throw error
  }
}

app.post('/cart/product', async (req, res) => {
  try {
    const product = await seedCartProducts(req.body)

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(400).json({
        error: "Failed to add product. Check input data is in correct format.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
})

async function deleteCartProducts(id){
  try {
      const product = await Cart.findByIdAndDelete(id)
      return product
  } catch (error){
      throw error
  }
}

app.delete("/cart/product/:productId", async (req, res) => {
  try {
      const product = await deleteCartProducts(req.params.productId)

      if(product){
          res.status(200).json({message: "Product deleted successfully.", product: product})
      } else {
          res.status(404).json({message: "Failed to delete cart product not found."})
      }
  } catch (error) {
      res.status(500).json({error: `Failed to delete Products: ${error}.`})
  }
})

const updateCartProduct = async (productId, quantity) => {
 try{ 
    const product = await Cart.findByIdAndUpdate(productId, { quantity }, {new: true})
    return product;
 } catch (error) {
  throw error
 }
}

app.put("/cart/product/:productId", async (req, res) => {
  try{
    const { quantity } = req.body
    const product = await updateCartProduct(req.params.productId, quantity)

    if(product){
      res.status(200).json({message: "Product update successfully.", product: product})
  } else {
      res.status(404).json({message: "Failed to update cart product not found."})
  }
  } catch (error) {
    res.status(500).json({error: `Failed to update product: ${error}.`})
  }
})

const obtainAllAddress = async () => {
  try {
    const addresses = await Address.find()
    return addresses
  } catch (error) {
    throw error
  }
}

app.get("/address", async (req, res) => {
  try { 
    const addresses = await obtainAllAddress()

    if(addresses){
      res.status(200).json(addresses)
    } else {
      res.status(404).json({error: "Address not found."})
    }
  } catch (error) {
    res.status(500).josn({error: `Server error: ${error}`})
  }
})

const seedAddress = async (addressInfo) => {
  try {
    const addresses = new Address(addressInfo)
    const saveAddress = await addresses.save()
    return saveAddress
  } catch (error) {
    throw error
  }
}

app.post("/address", async (req, res) => {
  try{
    const addresses = await seedAddress(req.body)
    console.log(req.body)

    if(addresses){
      res.status(201).json(addresses)
    } else {
      res.status(400).json({
        error: "Failed to add address. Check input data is in correct format.",
      });
    }
  } catch (error) {
    res.status(500).json({error: `Server error: ${error}`})
  }
})

const deleteAddressById = async (addressId) => {
  try {
    const addresses = await Address.findByIdAndDelete(addressId)
    return addresses
  } catch (error) {
    throw error
  }
}

app.delete("/address/:addressId", async (req, res) => {
  try {
    const addresses = await deleteAddressById(req.params.addressId)

    if(addresses){
      res.status(200).json({message: "Successfully deleted address", address: addresses})
    } else {
      res.status(400).json({message: "Address not found."})
    }
  } catch (error) {
    res.status(500).json({error: `Server error: ${error}`})
  }
})


const updateBuyingAddress = async (AddressId, data) => {
  try{ 
     const product = await Address.findByIdAndUpdate(AddressId, data, {new: true})
     return product;
  } catch (error) {
   throw error
  }
 }


app.put("/address/:addressId", async (req, res) => {
  try{
    const addresses = await updateBuyingAddress(req.params.addressId, req.body)
    if(addresses){
      res.status(200).json({message: "addresses update successfully.", address: addresses})
  } else {
      res.status(404).json({message: "Failed to update. Address not found."})
  }
  } catch (error) {
    res.status(500).json({error: `Server error: ${error}`})
  }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sever is running on port ${PORT}`);
});
