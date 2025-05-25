import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import image from '../assets/image.png';
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {GET_CATEGORY_URL} from "../constants.ts";
import {Category} from "../interfaces.ts";


const Header = (props: any) => {
    const [showProductsMenu, setShowProductsMenu] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authTokenResponse");
        props.setAuthTokenResponse(null);
        navigate("/products");
    };

    useEffect(() => {
        axios.get(GET_CATEGORY_URL)
            .then(res => setCategories(res.data))
            .catch(err => console.error("Chyba při načítání kategorií:", err));
    }, []);

    return (
        <header className="bg-white shadow-sm position-fixed top-0 w-100 z-3">
            <div className="container py-3">
                <div className="d-flex justify-content-between align-items-center">
                    {/* Left: Logo */}
                    <div>
                        <Link to="/products" className="navbar-brand">
                            <div className="d-flex align-items-center">
                                <img src={image} alt="LukiMori and Zuzik's store logo" height="40"/>
                                <span className="ms-2 text-dark fw-bold">LukiMori and Zuzik's store</span>
                            </div>
                        </Link>
                    </div>

                    {/* Right: Navigation */}
                    <div className="d-flex align-items-center">
                        <ul className="nav">
                            {/* Products Dropdown */}
                            <li className="nav-item dropdown mx-2"
                                onMouseEnter={() => setShowProductsMenu(true)}
                                onMouseLeave={() => setShowProductsMenu(false)}>
                                <Link
                                    to="/products"
                                    className="nav-link dropdown-toggle text-decoration-none"
                                    id="productsDropdown"
                                    aria-expanded={showProductsMenu}
                                >
                                    Produkty
                                </Link>
                                {showProductsMenu && (
                                    <div className="dropdown-menu show" aria-labelledby="productsDropdown">
                                        {categories.map((cat) => (
                                            <Link key={cat.id} to={`/products/category/${cat.id}`} className="dropdown-item">
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </li>

                            {/* Profile Link */}
                            <li className="nav-item mx-2">
                                <Link to="/profile" className="nav-link">
                                    Profil
                                </Link>
                            </li>

                            {/* Orders Link */}
                            <li className="nav-item mx-2">
                                <Link to="/orders" className="nav-link">
                                    Objednávky
                                </Link>
                            </li>

                            {/* Cart Link */}
                            <li className="nav-item mx-2">
                                <Link to="/cart" className="nav-link">
                                    Košík
                                </Link>
                            </li>

                            {/* Login/Logout Button */}
                            {!props.loadingAuth && (
                                <li className="nav-item mx-2 d-flex align-items-center">
                                    {props.authTokenResponse ? (
                                        <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                                            Odhlásit se
                                        </Button>
                                    ) : (
                                        <Link to="/login">
                                            <Button variant="outline-primary" size="sm">
                                                Přihlásit se
                                            </Button>
                                        </Link>
                                    )}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
