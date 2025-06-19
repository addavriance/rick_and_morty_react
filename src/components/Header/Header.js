import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {LogoIcon} from '../Icons';
import './Header.css';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const isActive = (path) => {
        if (path === '/' || path === '/characters') {
            return location.pathname === '/' || location.pathname === '/characters';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <header className="header">
                <div className="container header__container">
                    <div className="header__content">
                        <Link className="logo" to="/" onClick={closeMobileMenu}>
                            <LogoIcon className="logo__icon"/>
                        </Link>

                        <label
                            className="mobile-menu__button"
                            onClick={toggleMobileMenu}
                        >
                            <span className={`mobile-menu__line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                            <span className={`mobile-menu__line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                            <span className={`mobile-menu__line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                        </label>

                        <nav className="header__nav header__nav--desktop">
                            <Link
                                className={`header__link ${isActive('/characters') ? 'active' : ''}`}
                                to="/characters"
                            >
                                Characters
                            </Link>
                            <Link
                                className={`header__link ${isActive('/locations') ? 'active' : ''}`}
                                to="/locations"
                            >
                                Locations
                            </Link>
                            <Link
                                className={`header__link ${isActive('/episodes') ? 'active' : ''}`}
                                to="/episodes"
                            >
                                Episodes
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <nav className={`header__nav header__nav--mobile ${isMobileMenuOpen ? 'open' : ''}`}>
                <Link
                    className={`header__link ${isActive('/characters') ? 'active' : ''}`}
                    to="/characters"
                    onClick={closeMobileMenu}
                >
                    Characters
                </Link>
                <Link
                    className={`header__link ${isActive('/locations') ? 'active' : ''}`}
                    to="/locations"
                    onClick={closeMobileMenu}
                >
                    Locations
                </Link>
                <Link
                    className={`header__link ${isActive('/episodes') ? 'active' : ''}`}
                    to="/episodes"
                    onClick={closeMobileMenu}
                >
                    Episodes
                </Link>
            </nav>

            <div
                className={`mobile-menu__backdrop ${isMobileMenuOpen ? 'open' : ''}`}
                onClick={closeMobileMenu}
            ></div>
        </>
    );
};

export default Header;
