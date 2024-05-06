"use server"

import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from '../utils';

export async function scrapeAmazonProduct(url: string) {
  if(!url) return;

  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  }

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // Extract the product title
    const title = $('#productTitle').text().trim();
    //console.log({title})
    const currentPrice = extractPrice(
      $('.priceToPay span.a-price-whole'),
      $('.a.size.base.a-color-price'),
      $('.a-button-selected .a-color-base'),
    );

    const originalPrice = extractPrice(
      $('#priceblock_ourprice'),
      $('.a-price.a-text-price span.a-offscreen'),
      $('#listPrice'),
      $('#priceblock_dealprice'),
      $('.a-size-base.a-color-price')
    );

    const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

    const images = 
      $('#imgBlkFront').attr('data-a-dynamic-image') || 
      $('#landingImage').attr('data-a-dynamic-image') ||
      '{}'

    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($('.a-price-symbol'))
    const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

    const description = extractDescription($)

    // Construct data object with scraped information
    const data = {
      url,
      currency: currency || '$',
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: 'category',
      reviewsCount:100,
      stars: 4.5,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    }

    return data;
  } catch (error: any) {
    console.log(error);
  }
}






// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import { extractCurrency, extractDescription, extractPrice } from '../utils';

// // BrightData proxy configuration
// const username = String(process.env.BRIGHT_DATA_USERNAME);
// const password = String(process.env.BRIGHT_DATA_PASSWORD);
// const port = 22225;

// export async function scrapeAmazonProduct(url: string) {
//   if (!url) return;

//   const session_id = (1000000 * Math.random()) | 0;

//   const options = {
//     auth: {
//       username: `${username}-session-${session_id}`,
//       password,
//     },
//     host: 'brd.superproxy.io',
//     port,
//     rejectUnauthorized: false,
//   };

//   try {
//     // Fetch the product page
//     const response = await axios.get(url, options);
//     const $ = cheerio.load(response.data);

//     // Extract the product title
//     const title = $('#productTitle').text().trim();

//     // Extract current price
//     const currentPrice = extractPrice(
//       $('.priceToPay span.a-price-whole'),
//       $('.a.size.base.a-color-price'),
//       $('.a-button-selected .a-color-base'),
//     );

//     // Extract original price (if available)
//     const originalPrice = extractPrice(
//       $('#priceblock_ourprice'),
//       $('.a-price.a-text-price span.a-offscreen'),
//       $('#listPrice'),
//       $('#priceblock_dealprice'),
//       $('.a-size-base.a-color-price')
//     );

//     // Check if the product is out of stock
//     const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

//     // Extract product images
//     const images =
//       $('#imgBlkFront').attr('data-a-dynamic-image') ||
//       $('#landingImage').attr('data-a-dynamic-image') ||
//       '{}';

//     const imageUrls = Object.keys(JSON.parse(images));

//     // Extract currency
//     const currency = extractCurrency($('.a-price-symbol'))
//     const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

//     // Extract product description
//     const description = extractDescription($)

//     // Construct data object with scraped information
//     const data = {
//       url,
//       currency: currency || '$',
//       image: imageUrls[0],
//       title,
//       currentPrice: Number(currentPrice) || Number(originalPrice),
//       originalPrice: Number(originalPrice) || Number(currentPrice),
//       priceHistory: [],
//       discountRate: Number(discountRate),
//       category: 'category',
//       reviewsCount: 100,
//       stars: 4.5,
//       isOutOfStock: outOfStock,
//       description,
//       lowestPrice: Number(currentPrice) || Number(originalPrice),
//       highestPrice: Number(originalPrice) || Number(currentPrice),
//       averagePrice: Number(currentPrice) || Number(originalPrice),
//     };
//     // console.log("AMAZONNN")
//     return data;
//   } catch (error: any) {
//     console.log(error);
//   }
// }

// export async function scrapeFlipkartProduct(url: string) {
//   if (!url) return;

//   const session_id = (1000000 * Math.random()) | 0;

//   const options = {
//     auth: {
//       username: `${username}-session-${session_id}`,
//       password,
//     },
//     host: 'brd.superproxy.io',
//     port,
//     rejectUnauthorized: false,
//   };

//   try {
//     // Fetch the product page
//     console.log(url);
//     const response = await axios.get(url, options);
//     console.log(response)

//     const $ = cheerio.load(response.data);

//     // Extract the product title
//     const title = $('.VU-ZEz').text().trim();

//     // Extract current price
//     const currentPrice = extractPrice(
//       $('.Nx9bqj CxhGGd')//, // Selector for current price
//       // $('._16Jk6d .g9WBhN') // Additional selectors if needed
//     );

//     // Extract original price (if available)
//     const originalPrice = extractPrice(
//        $('.yRaY8j A6+E6v')//, // Selector for original price
//       // $('._3qQ9m1 .g9WBhN') // Additional selectors if needed
//     );

//     // Check if the product is out of stock
//     const outOfStock = $('._16FRp0').text().trim().toLowerCase() === 'out of stock';

//     // Extract product images
//     const images = $('.DByuf4 IZexXJ jLEJ7H').attr('src');

//     // Extract currency
//     const currency = "₹";

//     // Extract discount rate
//     const discountRate = $('.UkUFwK WW8yVX').text().replace(/[-%]/g, "");

//     // Extract product description
//     const description = extractDescription($('.yN+eNk w9jEaj'));

//     // Construct data object with scraped information
//     const data = {
//       url,
//       currency: currency || 'INR', // Assuming Indian Rupee if currency not found
//       image: images,
//       title,
//       currentPrice: Number(currentPrice),
//       originalPrice: Number(originalPrice),
//       priceHistory: [],
//       discountRate: Number(discountRate),
//       category: 'category', // You might need to dynamically extract this from the page
//       reviewsCount: 100, // Placeholder value
//       stars: 4.5, // Placeholder value
//       isOutOfStock: outOfStock,
//       description,
//       lowestPrice: Number(currentPrice),
//       highestPrice: Number(originalPrice),
//       averagePrice: (Number(currentPrice) + Number(originalPrice)) / 2, // Placeholder value
//     };

//     return data;
//   } catch (error: any) {
//     console.log(error);
//   }
// }
