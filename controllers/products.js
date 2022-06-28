const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({})
    .limit(10)
    .sort({ name: -1, price: -1 })
    .select({ name: 1, rating: 1 });
  res
    .status(200)
    .json({ status: "success", length: products.length, products });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  //   --- numeric filteration
  if (numericFilters) {
    const operatorMap = {
      "=": "$eq",
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
    };

    const regEx = /\b(<|>|<=|>=|=)\b/g;

    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);

  //    --- sorting ---
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  //   --- selecting ---
  if (fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  //   --- limiting ---
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;
  res
    .status(200)
    .json({ status: "success", length: products.length, products });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
