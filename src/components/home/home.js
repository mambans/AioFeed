import React from "react";

import logo from "../../assets/images/logo-white.png";
import logoWhite from "../../assets/images/logo-round-white.png";

import "./home.css";

function Title() {
    return <h2>Home</h2>;
}

function Logos() {
    return (
        <div className="home">
            <img src={logo} alt="logo" className="logo" />
            <img src={logoWhite} alt="logo" className="logo" />
            <p>
                A site/app for viewing all updates on Youtube such as subscriptions, posts,
                notifications and more.
            </p>
        </div>
    );
}

function Home() {
    return (
        <>
            <Title />
            <Logos />
        </>
    );
}

export default Home;
