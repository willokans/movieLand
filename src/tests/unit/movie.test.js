import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "../../App";

// Mock fetch function for testing
global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
          Promise.resolve({ Search: [{ imdbID: "123", Title: "Test Movie" }] }),
    })
);

// Mock MutationObserver
global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};

describe("App component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the App component", async () => {
    const { getByText, getByPlaceholderText, getByAltText } = render(<App />);

    // check if the main title is rendered
    expect(getByText("MovieLand")).toBeInTheDocument();

    // Check if the search input and search icon are rendered
    const searchInput = getByPlaceholderText("Search for movies");
    expect(searchInput).toBeInTheDocument();
    const searchIcon = getByAltText("search");
    expect(searchIcon).toBeInTheDocument();

    // Check if initial movies are loaded
    await waitFor(() => expect(getByText("Test Movie")).toBeInTheDocument());
  });

  it("performs a movie search when the search icon is clicked", async () => {
    const { getByPlaceholderText, getByAltText, getByText } = render(<App />);
    const searchInput = getByPlaceholderText("Search for movies");
    const searchIcon = getByAltText("search");

    // Simulate user input and click on search icon
    fireEvent.change(searchInput, { target: { value: "SpiderMan" } });
    fireEvent.click(searchIcon);

    // Check if movies are loaded after search
    await waitFor(() => expect(getByText("Test Movie")).toBeInTheDocument());
  });

  it("displays 'No movies found' message when no movies are returned from the search", async () => {
    // Mock fetch function to return empty response
    global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ Search: [] }),
        })
    );

    const { getByText } = render(<App />);
    await waitFor(() =>
        expect(getByText("No movies found")).toBeInTheDocument()
    );
  });
});
