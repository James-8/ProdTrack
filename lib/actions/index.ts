"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {
  if(!productUrl) return;

  try {
    console.log("hgfhfew");
    connectToDB();

    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if(!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ title: scrapedProduct.title });

    if(existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice }
      ]

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      }
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`)
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();

    const product = await Product.findOne({ _id: productId });

    if(!product) return null;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    connectToDB();

    const products = await Product.find();

    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();

    const currentProduct = await Product.findById(productId);

    if(!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
  try {
    const product = await Product.findById(productId);

    if(!product) return;

    const userExists = product.users.some((user: User) => user.email === userEmail);

    if(!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}

// import { revalidatePath } from "next/cache";
// import Product from "../models/product.model";
// import { connectToDB } from "../mongoose";
// import { scrapeAmazonProduct, scrapeFlipkartProduct } from "../scraper"; // Import the Flipkart scraping function
// import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
// import { User } from "@/types";
// import { generateEmailBody, sendEmail } from "../nodemailer";

// export async function scrapeAndStoreProduct(productUrl: string) {
//   if (!productUrl) return;

//   try {
//     connectToDB();

//     let scrapedProduct;

//     // Check if the URL is from Amazon or Flipkart
//     if (isAmazonUrl(productUrl)) {
//       scrapedProduct = await scrapeAmazonProduct(productUrl);
//     } else if (isFlipkartUrl(productUrl)) {
//       scrapedProduct = await scrapeFlipkartProduct(productUrl);
//     } else {
//       throw new Error("Unsupported URL");
//     }

//     if (!scrapedProduct) return;

//     let product = scrapedProduct;

//     const existingProduct = await Product.findOne({ title: scrapedProduct.title });

//     if (existingProduct) {
//       const updatedPriceHistory: any = [
//         ...existingProduct.priceHistory,
//         { price: scrapedProduct.currentPrice }
//       ];

//       product = {
//         ...scrapedProduct,
//         priceHistory: updatedPriceHistory,
//         lowestPrice: getLowestPrice(updatedPriceHistory),
//         highestPrice: getHighestPrice(updatedPriceHistory),
//         averagePrice: getAveragePrice(updatedPriceHistory),
//       };
//     }

//     const newProduct = await Product.findOneAndUpdate(
//       { url: scrapedProduct.url },
//       product,
//       { upsert: true, new: true }
//     );

//     revalidatePath(`/products/${newProduct._id}`);
//   } catch (error: any) {
//     throw new Error(`Failed to create/update product: ${error.message}`);
//   }
// }

// // Function to check if the URL is from Amazon
// function isAmazonUrl(url: string) {
//   return url.includes('amazon');
// }

// // Function to check if the URL is from Flipkart
// function isFlipkartUrl(url: string) {
//   return url.includes('flipkart');
// }

// // The rest of the functions remain the same
// export async function getProductById(productId: string) {
//   try {
//     connectToDB();

//     const product = await Product.findOne({ _id: productId });

//     if (!product) return null;

//     return product;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function getAllProducts() {
//   try {
//     connectToDB();

//     const products = await Product.find();

//     return products;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function getSimilarProducts(productId: string) {
//   try {
//     connectToDB();

//     const currentProduct = await Product.findById(productId);

//     if (!currentProduct) return null;

//     const similarProducts = await Product.find({
//       _id: { $ne: productId },
//     }).limit(3);

//     return similarProducts;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function addUserEmailToProduct(productId: string, userEmail: string) {
//   try {
//     const product = await Product.findById(productId);

//     if (!product) return;

//     const userExists = product.users.some((user: User) => user.email === userEmail);

//     if (!userExists) {
//       product.users.push({ email: userEmail });

//       await product.save();

//       const emailContent = await generateEmailBody(product, "WELCOME");

//       await sendEmail(emailContent, [userEmail]);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// // Import necessary modules and dependencies

// export async function removeProduct(productId: string) {
//   try {
//     // Connect to the database
//     connectToDB();

//     // Find the product by ID and remove it from the database
//     const deletedProduct = await Product.findByIdAndDelete(productId);

//     if (!deletedProduct) {
//       throw new Error('Product not found');
//     }

//     // Optionally, you can revalidate paths or perform any other actions after deletion

//     return deletedProduct;
//   } catch (error) {
//     // Handle errors appropriately
//     console.error('Error removing product:', error);
//     throw error;
//   }
// }

