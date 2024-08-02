import React from "react";
import ReactDOM from "react-dom/client";
import "./bulma.css";
import Splash from "./Splash";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <Splash />
    </React.StrictMode>
);
