import React from "react";
import { render, screen } from "@testing-library/react";

import SplashPage from "@components/SplashPage";

test("renders learn react link", () => {
    render(<SplashPage />);
    const logoElement = screen.getByAltText("Snacky Trails");
    expect(logoElement).toBeInTheDocument();
});
