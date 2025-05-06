import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders welcome message", () => {
  render(<App />);
  const welcomeText = screen.getByText(/Bienvenue sur l'application/i);
  expect(welcomeText).toBeInTheDocument();
});

