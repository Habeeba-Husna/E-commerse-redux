import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../../Context/UserContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { toast, ToastContainer } from 'react-toastify';
import Navbar from '../Navbar/Navbar';
import { WishlistContext } from '../../Context/WishlistContext';
import Footer from './Footer';
import { FaStar, FaRegStar } from 'react-icons/fa'; // Import the star icons for rating
import {useDispatch, useSelector} from 'react-redux'
import { fetchProducts } from '../Redux/productSlice';
import { addToCart, removeFromWishlist,addToWishlist } from '../Redux/userSlice';
import { updateRating } from '../Redux/userSlice';  // Adjust the path if necessary


const ProductDetails = () => {
  const { id } = useParams();
  // const { products, ratings, addRating, addToCart, loadingProducts } = useContext(UserContext);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [finalPrice, setFinalPrice] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [discountCodeValid, setDiscountCodeValid] = useState(true);
  
  // const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const {wishlist}=useSelector((state)=>state.user)
  const { products } = useSelector((state) => state.product);
  const [userRating, setUserRating] = useState(0)
  const [rating, setRating] = useState(0);
  const couponRef = useRef(null);
 

  useEffect(()=>{
    dispatch(fetchProducts())
  },[])
  // Fetch the specific product
  useEffect(() => {
    if ( products.length > 0) {
      const foundProduct = products.find((item) => item.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        // setRating(rating[id] || 0);
        setFinalPrice(foundProduct.price);

        // Check if the product has size options
        if (!foundProduct.size || foundProduct.size.length === 0) {
          setSelectedSize('No Size Available');  // Disable size selection if size is null or empty
        }
        // Filter related products based on category
        const related = products.filter(
          (item) => item.category === foundProduct.category && item.id !== foundProduct.id
        );
        setRelatedProducts(related);
        // Retrieve the saved rating from localStorage or set default
        const savedRating = localStorage.getItem(`rating-${id}`);
        if (savedRating) {
          setUserRating(Number(savedRating));
        }
      } else {
        console.error(`Product not found for ID: ${id}`);
      }
    }
    
  }, [id, products]);

  
  if (!product) return <p className="text-center text-lg font-semibold">Product not found!</p>;

  // Determine if the product is in the wishlist
  const isFavorite = wishlist.some((item) => item.id === product.id);

  // const handleSizeClick = (size) => setSelectedSize(size);

  // Handle size selection (disable if no size options available)
  const handleSizeClick = (size) => {
    if (size === 'No Size Available') {
      return toast.info('No size options available for this product.');
    }
    setSelectedSize(size);
  };


  // Handle discount application
  const applyDiscount = (percentage) => {
    if (!discountApplied) {
      const discountedPrice = product.price * (1 - percentage / 100);
      setFinalPrice(discountedPrice.toFixed(2));
      setDiscountApplied(true);
      toast.success(`${percentage}% discount applied!`);
    } else {
      toast.info('Discount already applied.');
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode === "XMAS27") {
      applyDiscount(27);
      setDiscountCodeValid(true);
    } else {
      setDiscountCodeValid(false);
    }
  };

  const handleAddToCart = () => {
    // if (!selectedSize) {
      if (!selectedSize || selectedSize === "No Size Available"){
      return toast.error("Please select a size before adding to the cart.");
    }
    const userId = localStorage.getItem('id');
    if (!userId) {
      toast.info('Please log in first!');
      navigate('/login');
      return;
    } else {
      // Use the final price if a discount is applied, otherwise use the original price
      const priceToUse = finalPrice !== null ? finalPrice : product.price;

      // Add product to the cart using the calculated price
      dispatch(addToCart({userId, newItem:product,price: priceToUse}));
      toast.success('Added to cart');
    }
  };

  const handleToggleFavorite = () => {
    const userId = localStorage.getItem('id');
    if (!userId) {
      toast.info('Please log in first!');
      navigate('/login');
      return;
    }
  
    if (isFavorite) {
      // Remove from wishlist
      dispatch(removeFromWishlist({ userId, productId: product.id }));
      toast.info('Removed from wishlist');
    } else {
      // Add to wishlist
      dispatch(addToWishlist({ userId, product }));
      toast.success('Added to wishlist');
    }
  };
  
  const copyToClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => toast.success('Coupon code copied to clipboard!'))
      .catch(() => toast.error('Failed to copy coupon code'));
  };
  // Scroll to coupon section
  const scrollToCoupon = () => {
    couponRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  // Function to handle the rating change
  const handleRating = (index) => {
    setRating(index);
    localStorage.setItem(`rating-${id}`, index);
    // dispatch(updateRating({ productId: id, rating: index }));
    toast.success(`You rated this product ${index} star${index > 1 ? 's' : ''}`);
  };

  // Function to render stars based on the rating value
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400 cursor-pointer" onClick={() => handleRating(i)} />
        ) : (
          <FaRegStar key={i} className="text-gray-300 cursor-pointer" onClick={() => handleRating(i)} />
        )
      );
    }
    return stars;
  };

  return (

    <div className="pt-[4rem]">
      <Navbar />
      <div className="p-4 max-w-2xl mx-auto">
        <ToastContainer />
        <div className="flex flex-col md:flex-row gap-4 bg-white shadow-lg rounded-lg p-3">
          {/* Left Section: Image and Wishlist Button */}
          <div className="relative w-full md:w-1/2 flex flex-col items-center">
            <div className="relative w-full h-[22rem]">
              <img
                src={product.url}
                alt={product.name}
                className={`w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-500 ${product.quantity === 0 ? 'opacity-50' : 'hover:scale-105'
                  }`}
              />
              {product.quantity === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <span className="text-white text-lg font-bold">Out of Stock</span>
                </div>
              )}
            </div>


            {/* Rating Section  */}
            <div className="mt-6 w-full">
              {/* <h3 className="text-lg font-semibold">Rating:</h3> */}
              <div className="flex gap-2 mt-1">
                {renderStars()}
              </div>
            </div>


            <button
              onClick={handleToggleFavorite}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md text-3xl text-red-500 hover:text-red-600 transition duration-300"
              aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              className={`mt-3 px-4 py-2 rounded-lg shadow-md transition duration-300 w-full text-white ${product.quantity === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
                }`}
            >
              Add to Cart
            </button>
          </div>

          {/* Right Section: Product Details */}
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
              <p className="text-base text-gray-700 mt-2">{product.description || 'No description available.'}</p>
              <p className="text-xl text-blue-600 mt-3">
                Price: ₹{discountApplied ? finalPrice : product.price.toFixed(2)}
                <span className="pl-6 text-base text-green-600 cursor-pointer" onClick={scrollToCoupon}>Flat 27% OFF</span>

                {discountApplied && (
                  <span className="text-sm text-green-500 ml-2">Discount applied</span>
                )}
              </p>
            </div>

            <div className="border-t border-gray-300 pt-4">
              <h3 className="text-lg font-semibold">Size:</h3>
              <div className="flex gap-2 mt-1">
                {/* Display predefined sizes */}
                {['3-6 months', '6-9 months', '12-18 months'].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeClick(size)}
                    className={`px-3 py-1 rounded-lg transition ${selectedSize === size
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {size}
                  </button>
                ))}

                {/* If product has no sizes, show a message */}
                {product.size && product.size.length === 0 && (
                  <span>No size options available</span>
                )}
              </div>
            </div>


            {/* Coupon Section */}
            <div className="mt-2 bg-gray-100 p-2 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-gray-700">Offer: Coupon Code</h3>
              <div className="mt-1 bg-white p-2 rounded-lg shadow-md text-center">
                <p className="text-xl font-bold text-green-700">Flat 27% OFF*</p>
                <div className="flex justify-center items-center mt-3 gap-2">
                  <div className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg font-mono text-base">
                    XMAS27
                  </div>
                  <button
                    onClick={() => copyToClipboard('XMAS27')}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                  >
                    Copy
                  </button>
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="border-2 border-gray-300 px-3 py-1 rounded-lg w-full"
                    placeholder="Enter coupon code"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-green-600 text-white px-4 py-1 rounded-lg shadow-md hover:bg-green-700 transition duration-300 mt-2 w-full"
                  >
                    Apply Coupon
                  </button>
                </div>
                {!discountCodeValid && (
                  <p className="text-red-500 text-sm mt-2">Invalid coupon code</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-12 pl-10 pr-10">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition"
            >
              <Link to={`/product/${item.id}`}>
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-40 object-contain rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-blue-600 text-lg font-bold">₹{item.price.toFixed(2)}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className='pt-10 '>
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetails;


