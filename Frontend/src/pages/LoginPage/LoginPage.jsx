import React from "react";
import {Link} from "react-router-dom";
import "./LoginPage.css";
import imgmulher from "../../assets/mulher-terapeuta.jpg";

function LoginPage() {
    return (
        <main className="login-container">
            <section className="login-section">
                
                <div className="login-content">
                    <form action="" className="login-form">

                    </form>
                </div>

                <div className="login-img-wrapper">
                    <img src={imgmulher} alt="login-img-mulher" className="login-img"/>
                </div>

            </section>
        </main>

    );
}

export default LoginPage;