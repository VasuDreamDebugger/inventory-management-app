// Integration tests for ProductsPage
// We mock productsApi to avoid network calls and verify rendered UI and pagination behavior

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductsPage from "../../src/components/products/ProductsPage";
import { MemoryRouter } from "react-router-dom";
import productsApi from "../../src/api/productsApi";

jest.mock("../../src/api/productsApi");

beforeEach(() => {
  jest.clearAllMocks();
});

test("displays products returned by mocked API", async () => {
  productsApi.getProducts.mockResolvedValue({
    data: [{ id: 1, name: "Phone", stock: 5 }],
    pagination: { totalPages: 1 },
  });
  productsApi.getCategories.mockResolvedValue({
    categories: ["All", "Electronics"],
  });

  render(
    <MemoryRouter>
      <ProductsPage />
    </MemoryRouter>
  );

  // Wait for the product to appear after the hook fetches data
  expect(await screen.findByText("Phone")).toBeInTheDocument();
});

test("clicking Next pagination triggers a new API request with updated page param", async () => {
  // First call returns page 1 with totalPages 2
  productsApi.getProducts.mockResolvedValueOnce({
    data: [{ id: 1, name: "Item1", stock: 2 }],
    pagination: { totalPages: 2 },
  });
  productsApi.getCategories.mockResolvedValue({ categories: [] });

  // Second call for page 2 returns different data
  productsApi.getProducts.mockResolvedValueOnce({
    data: [{ id: 2, name: "Item2", stock: 4 }],
    pagination: { totalPages: 2 },
  });

  render(
    <MemoryRouter>
      <ProductsPage />
    </MemoryRouter>
  );

  // Wait for initial API call to happen
  await waitFor(() => expect(productsApi.getProducts).toHaveBeenCalled());

  const user = userEvent.setup();
  await user.click(screen.getByText("Next"));

  // After clicking Next, the component should request page 2
  await waitFor(() =>
    expect(productsApi.getProducts).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 })
    )
  );
});
