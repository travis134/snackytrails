import React from "react";

const FooterComponent: React.FC = () => {
    return (
        <footer className="footer">
            <div className="content has-text-centered">
                <p className="has-text-weight-light">Savor the Journey</p>
                <p>
                    &copy; {new Date().getFullYear()} Snacky Trails. All rights
                    reserved.
                </p>
            </div>
        </footer>
    );
};

export default FooterComponent;
