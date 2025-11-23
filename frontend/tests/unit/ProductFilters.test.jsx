// Unit tests for ProductFilters
// Verify search input and category dropdown call the provided callbacks

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductFilters from "../../src/components/products/ProductFilters";
import { MemoryRouter } from "react-router-dom";

test("typing in search input calls onSearchChange and changing category calls onCategoryChange", async () => {
  const user = userEvent.setup();
  const onSearchChange = jest.fn();
  const onCategoryChange = jest.fn();
  const onAddClick = jest.fn();
  const onImport = jest.fn();
  const onExport = jest.fn();

  render(
    <MemoryRouter>
      <ProductFilters
        search=""
        onSearchChange={onSearchChange}
        category="All"
        onCategoryChange={onCategoryChange}
        categoryOptions={["Electronics", "Fruits"]}
        onAddClick={onAddClick}
        onImport={onImport}
        onExport={onExport}
      />
    </MemoryRouter>
  );

  const input = screen.getByPlaceholderText("Search by name");
  await user.type(input, "apple");
  expect(onSearchChange).toHaveBeenCalled();

  const select = screen.getByLabelText(/Category/i);
  await user.selectOptions(select, "Electronics");
  expect(onCategoryChange).toHaveBeenCalledWith("Electronics");
});
