"use client"

import { scrapeAndStoreProduct } from '@/lib/actions';
import { FormEvent, useState } from 'react'

const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if(
      hostname.includes('amazon.com') || 
      hostname.includes ('amazon.') || 
      hostname.includes ('amzn.') || 
      hostname.endsWith('amazon')
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
}

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if(!isValidLink) return alert('Please provide a valid Amazon link')

    try {
      setIsLoading(true);

      // Scrape the product page
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form 
      className="flex flex-wrap gap-4 mt-12" 
      onSubmit={handleSubmit}
    >
      <input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />

      <button 
        type="submit" 
        className="searchbar-btn"
        disabled={searchPrompt === ''}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default Searchbar


// "use client"

// import { scrapeAndStoreProduct } from '@/lib/actions';
// import { FormEvent, useState } from 'react'

// const isValidAmazonProductURL = (url: string) => {
//   try {
//     const parsedURL = new URL(url);
//     const hostname = parsedURL.hostname;

//     if(
//       hostname.includes('amazon.com') || 
//       hostname.includes('amazon.') || 
//       hostname.includes('amzn.') || 
//       hostname.endsWith('amazon')
//     ) {
//       return true;
//     }
//   } catch (error) {
//     return false;
//   }

//   return false;
// }

// const isValidFlipkartProductURL = (url: string) => {
//   try {
//     const parsedURL = new URL(url);
//     const hostname = parsedURL.hostname;

//     if(
//       hostname.includes('flipkart.com') || 
//       hostname.includes('flipkart.') || 
//       hostname.includes('flipkart') 
//     ) {
//       return true;
//     }
//   } catch (error) {
//     return false;
//   }

//   return false;
// }

// const Searchbar = () => {
//   const [searchPrompt, setSearchPrompt] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const isValidAmazonLink = isValidAmazonProductURL(searchPrompt);
//     const isValidFlipkartLink = isValidFlipkartProductURL(searchPrompt);

//     if (!isValidAmazonLink && !isValidFlipkartLink) {
//       return alert('Please provide a valid Amazon or Flipkart link');
//     }

//     try {
//       setIsLoading(true);

//       // Scrape the product page
//       const product = await scrapeAndStoreProduct(searchPrompt);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <form 
//       className="flex flex-wrap gap-4 mt-12" 
//       onSubmit={handleSubmit}
//     >
//       <input 
//         type="text"
//         value={searchPrompt}
//         onChange={(e) => setSearchPrompt(e.target.value)}
//         placeholder="Enter product link"
//         className="searchbar-input"
//       />

//       <button 
//         type="submit" 
//         className="searchbar-btn"
//         disabled={searchPrompt === ''}
//       >
//         {isLoading ? 'Searching...' : 'Search'}
//       </button>
//     </form>
//   )
// }

// export default Searchbar
