import React, { useState, useEffect, useContext } from 'react';
import { Admincontext } from './AdminContext';
import { FaStar, FaRegStar } from 'react-icons/fa'; // Star icons for filled and empty stars

function RatingPage() {
  const { products } = useContext(Admincontext);
  const [ratings, setRatings] = useState({});

  // Load ratings from localStorage when the component mounts
  useEffect(() => {
    const storedRatings = JSON.parse(localStorage.getItem('ratings'));
    if (storedRatings) {
      setRatings(storedRatings);
    }
  }, []);

  // Function to handle the rating change
  const productRating = (productId, index) => {
    const newRatings = {
      ...ratings,
      [productId]: index,
    };
    setRatings(newRatings);

    // Save the updated ratings to localStorage
    localStorage.setItem('ratings', JSON.stringify(newRatings));
  };

  // Function to render stars based on the rating value
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400" />
        ) : (
          <FaRegStar key={i} className="text-gray-300" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-2">
      <h1 className="text-4xl font-bold text-center text-rose-500 mb-4">
        Product Ratings
      </h1>
      <div className="w-full mx-auto my-4 overflow-x-auto p-2 max-h-[calc(100vh-150px)] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              {/* Product Info */}
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-700">{item.name}</p>
                <p className="text-lg text-gray-500 mb-4">${item.price}</p>
              </div>

              {/* Rating Section */}
              <div className="flex justify-center gap-2 mb-4">
                {/* Render current rating stars */}
                {renderStars(ratings[item.id] || item.rating)}
              </div>

              {/* Editable Rating Section (Click on a star to change the rating) */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div
                    key={rating}
                    onClick={() => productRating(item.id, rating)}
                    className="cursor-pointer w-10 h-10 flex items-center justify-center"
                  >
                    {rating <= (ratings[item.id] || item.rating) ? (
                      <FaStar className="text-yellow-400" />
                    ) : (
                      <FaRegStar className="text-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RatingPage;







// import React, { useState, useContext } from 'react';
// import { Admincontext } from './AdminContext';

// function RatingPage() {
//     const { products } = useContext(Admincontext);
//     const [ratings, setRatings] = useState({});

//     const productRating = (productId, index) => {
//         setRatings((prevRatings) => ({
//             ...prevRatings,
//             [productId]: index,
//         }));
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 p-8 pt-2">
//             <h1 className="text-4xl font-bold text-center text-rose-500 mb-4">
//                 Product Ratings
//             </h1>
//             <div className="w-full mx-auto my-4 overflow-x-auto p-2 max-h-[calc(100vh-150px)] overflow-y-auto">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {products.map((item) => (
//                         <div
//                             key={item.id}
//                             className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
//                         >
//                             {/* Product Image */}
//                             <img
//                                 src={item.url}
//                                 alt={item.name}
//                                 className="w-full h-48 object-cover rounded-lg mb-4"
//                             />

//                             {/* Product Info */}
//                             <div className="text-center">
//                                 <p className="text-xl font-semibold text-gray-700">
//                                     {item.name}
//                                 </p>
//                                 <p className="text-lg text-gray-500 mb-4">
//                                     ${item.price}
//                                 </p>
//                             </div>

//                             {/* Rating Section */}
//                             <div className="flex justify-center gap-2">
//                                 {[1, 2, 3, 4, 5].map((rating) => (
//                                     <div
//                                         key={rating}
//                                         onClick={() => productRating(item.id, rating)}
//                                         className={`${ratings[item.id] >= rating
//                                                 ? 'bg-yellow-400'
//                                                 : 'bg-gray-300'
//                                             } w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors hover:bg-yellow-500`}
//                                     >
//                                         {rating}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default RatingPage;









