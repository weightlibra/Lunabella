const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;

const connectionString =
  "mongodb+srv://shuliakivskyi:123@cluster0.fjkkmek.mongodb.net/Lunabella";

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const Product = mongoose.model("products", {});

app.use(express.json());

app.get("/product", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const SoldProduct = mongoose.model("soldProducts", {
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  product: {
    name: String,
    price: Number,
  },
  customer: {
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    address: String,
    deliveryOption: String,
  },
});

app.post("/sold-product", async (req, res) => {
  try {
    const { productId, product, customer } = req.body;
    const soldProduct = new SoldProduct({ Id: productId, product, customer });
    await soldProduct.save();
    res.status(201).json({ message: "Product sold successfully" });
  } catch (error) {
    console.error("Error selling product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
