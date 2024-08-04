import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./bulma-custom.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { APIPollsService } from "@lib/api_polls_service";
import { HomeRoute, AboutRoute, PollsRoute, PollRoute } from "@lib/routes";
import logo from "./assets/logo.svg";

import LayoutComponent from "@components/LayoutComponent";
import HeaderComponent from "@components/HeaderComponent";
import FooterComponent from "@components/FooterComponent";
import SplashPage from "@components/SplashPage";
import PollsPage from "@components/PollsPage";
import PollPage from "@components/PollPage";

const apiHostName =
    process.env.REACT_APP_API_BASE_URL ?? "http://localhost:8788";
const pollsService = new APIPollsService({ apiBaseUrl: apiHostName });

const router = createBrowserRouter([
    { path: HomeRoute.path, element: <SplashPage /> },
    { path: AboutRoute.path, element: <SplashPage /> },
    {
        path: PollsRoute.path,
        element: <PollsPage pollsService={pollsService} />,
    },
    {
        path: PollRoute.path,
        element: <PollPage pollsService={pollsService} />,
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <LayoutComponent
            header={<HeaderComponent logo={logo} />}
            footer={<FooterComponent />}
        >
            <RouterProvider router={router} />
        </LayoutComponent>
    </React.StrictMode>
);
