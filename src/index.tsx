import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./bulma-custom.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Routes from "@lib/routes";
import icon from "./assets/icon.svg";
import logo from "./assets/logo.svg";

import { BrowserStorageService } from "@lib/services/BrowserStorageService";
import { AnonymousUserService } from "@lib/services/AnonymousUserService";
import { APILoginService } from "@lib/services/APILoginService";
import { BrowserAuthorizationService } from "@lib/services/BrowserAuthorizationService";
import { APIBlogsService } from "@lib/services/APIBlogsService";
import { APIPollsService } from "@lib/services/APIPollsService";

import LayoutComponent from "@components/LayoutComponent";
import HeaderComponent from "@components/HeaderComponent";
import FooterComponent from "@components/FooterComponent";
import SplashPage from "@components/SplashPage";
import LoginPage from "@components/LoginPage";
import AboutPage from "@components/AboutPage";
import BlogsPage from "@components/BlogsPage";
import BlogPage from "@components/BlogPage";
import PollsPage from "@components/PollsPage";
import PollPage from "@components/PollPage";
import PollResultsPage from "@components/PollResultsPage";

const queryClient = new QueryClient();

const apiBaseUrl = window.location.origin;

const storageService = new BrowserStorageService();
const userService = new AnonymousUserService({ storageService });
const loginService = new APILoginService({ apiBaseUrl, userService });
const authorizationService = new BrowserAuthorizationService({
    loginService,
    storageService,
});
const blogsService = new APIBlogsService({ apiBaseUrl, userService });
const pollsService = new APIPollsService({ apiBaseUrl, userService });

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            element={
                <LayoutComponent
                    header={
                        <HeaderComponent
                            icon={icon}
                            authorizationService={authorizationService}
                        />
                    }
                    footer={<FooterComponent />}
                />
            }
        >
            <Route
                index
                path={Routes.HomeRoute.path}
                element={<SplashPage logo={logo} />}
            />
            <Route
                path={Routes.LoginRoute.path}
                element={
                    <LoginPage authorizationService={authorizationService} />
                }
            />
            <Route path={Routes.AboutRoute.path} element={<AboutPage />} />
            <Route
                path={Routes.BlogsRoute.path}
                element={<BlogsPage blogsService={blogsService} />}
            />
            <Route
                path={Routes.BlogRoute.path}
                element={
                    <BlogPage
                        blogsService={blogsService}
                        authorizationService={authorizationService}
                    />
                }
            />
            <Route
                path={Routes.PollsRoute.path}
                element={<PollsPage pollsService={pollsService} />}
            />
            <Route
                path={Routes.PollRoute.path}
                element={<PollPage pollsService={pollsService} />}
            />
            <Route
                path={Routes.PollResultsRoute.path}
                element={<PollResultsPage pollsService={pollsService} />}
            />
        </Route>
    )
);

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>
);
