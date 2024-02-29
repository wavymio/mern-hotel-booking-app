import React from "react";
import PropTypes from "prop-types"
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";

const Layout = ({children}) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Hero />
            <div className="container mx-auto">
                <SearchBar />
            </div>
            <div className="container mx-auto flex-1 py-10">
                {children}
            </div>
            <Footer />
        </div>
    )   
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout