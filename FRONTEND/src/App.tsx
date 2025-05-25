import './App.css';
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./components/Signup.tsx";
import Header from "./components/Header.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from "./components/Profile.tsx";
import Login from "./components/Login.tsx";
import Products from "./components/Products.tsx";
import ProductsByCategory from "./components/ProductsByCategory.tsx";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart.tsx";
import Checkout from './components/Checkout';
import Orders from './components/Orders';


function App() {

    const [authTokenResponse, setAuthTokenResponseState] = useState<string | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);



    function setAuthTokenResponse(authTokenResponse: string | null) {
        if (authTokenResponse) {
            localStorage.setItem("authTokenResponse", authTokenResponse);
        } else {
            localStorage.removeItem("authTokenResponse");
        }
        setAuthTokenResponseState(authTokenResponse);
    }

    useEffect(() => {
        const token = localStorage.getItem("authTokenResponse");
        setAuthTokenResponseState(token); // ← just update state here, don't store again
        setLoadingAuth(false);
    }, []);

    return (
        <div className="App">
            <Header authTokenResponse={authTokenResponse} setAuthTokenResponse={setAuthTokenResponse} loadingAuth={loadingAuth} />
            <div className="pt-5">
                <Routes>
                    <Route path='/' element={<Products />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/login' element={
                        <Login setAuthTokenResponse={setAuthTokenResponse} />
                    } />
                    <Route path='/profile' element={
                        <Profile />
                    } />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/category/:categoryId" element={<ProductsByCategory />} />
                    <Route path="/products/:productId" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<Orders />} />
                </Routes>
            </div>
        </div>
    );
}

export default App
