import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface Props {
  product: Product;
}
 
const ProductCard = ({ product }: Props) => {
  return (
    <Link href={`/products/${product._id}`} className="product-card">
      <div className="product-card_img-container">
        <Image 
          src={product.image}
          alt={product.title}
          width={200}
          height={200}
          className="product-card_img"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="product-title">{product.title}</h3>

        <div className="flex justify-between">
          <p className="text-blue opacity-80 text-lg capitalize">
            {product.discountRate}%
          </p>

          <p className="text-black text-lg font-semibold">
            <span>{product?.currency}</span>
            <span>{product?.currentPrice}</span>
          </p>
        </div>
      </div>
    </Link>
  )
}

 export default ProductCard

// import { Product } from '@/types';
// import Image from 'next/image';
// import Link from 'next/link';
// import React from 'react';

// interface Props {
//   product: Product;
//   onRemove: (productId: string) => void; // Callback function to handle removal
// }

// const ProductCard = ({ product, onRemove }: Props) => {
//   const handleRemoveClick = () => {
//     // Call the onRemove callback with the product ID
//     onRemove(productId);
//   };  return (
//     <div className="relative"> {/* Add relative positioning to position the remove button */}
//       <Link href={`/products/${product._id}`} className="product-card">
//         <div className="product-card_img-container">
//           <Image 
//             src={product.image}
//             alt={product.title}
//             width={200}
//             height={200}
//             className="product-card_img"
//           />
//         </div>

//         <div className="flex flex-col gap-3">
//           <h3 className="product-title">{product.title}</h3>

//           <div className="flex justify-between">
//             <p className="text-black opacity-80 text-lg capitalize">
//               {product.discountRate}%
//             </p>

//             <p className="text-black text-lg font-semibold">
//               <span>{product?.currency}</span>
//               <span>{product?.currentPrice}</span>
//             </p>
//           </div>
//         </div>
//       </Link>
      
//       <button onClick={onRemove} className="absolute top-0 right-0 p-2 text-gray-600 hover:text-red-600 focus:outline-none">
//         x
//       </button>
//     </div>
//   );
// }

// export default ProductCard;
