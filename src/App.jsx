import { Routes, Route} from 'react-router-dom';
import Login from './Pages/Login';

import './App.css'
import './index.css';
import ProductList from './Pages/ProductList';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/User/Home';
import Cart from './Components/User/Cart';
import Order from './Components/User/Order';
import OrderList from './Components/User/OrderList';
import Footer from './Components/User/Footer';

import { UserContextProvider } from './Context/UserContext';
// import OrderHistory from './Pages/OrderHistory';

function App() {
  return (
    <div className="App">
    {/* <Navbar/> */}
        <UserContextProvider>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/productList" element={<ProductList />} />
          <Route path="/" element={<Home/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/order" element={<Order/>} />
          <Route path="/orderList" element={<OrderList/>} />
          {/* <Route path="/first" element={<FirstPage/>} /> */}
        </Routes>
        </UserContextProvider>
        {/* <Footer /> */}
         {/* Move Footer outside of Routes so it appears on all pages */}
    
    </div>
  );
}

export default App;


