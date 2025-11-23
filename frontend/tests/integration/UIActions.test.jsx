// Simple UI action test: clicking Add Product calls provided onAddClick via ProductFilters

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductFilters from "../../src/components/products/ProductFilters";
import { MemoryRouter } from "react-router-dom";

test("clicking Add Product calls onAddClick", async () => {
  const user = userEvent.setup();
  const onAddClick = jest.fn();
  const onSearchChange = jest.fn();
  const onCategoryChange = jest.fn();
  const onImport = jest.fn();
  const onExport = jest.fn();

  render(
    <MemoryRouter>
      <ProductFilters
        search=""
        onSearchChange={onSearchChange}
        category="All"
        onCategoryChange={onCategoryChange}
        categoryOptions={[]}
        onAddClick={onAddClick}
        onImport={onImport}
        onExport={onExport}
      />
    </MemoryRouter>
  );

  await user.click(screen.getByText("Add Product"));
  expect(onAddClick).toHaveBeenCalled();
});
