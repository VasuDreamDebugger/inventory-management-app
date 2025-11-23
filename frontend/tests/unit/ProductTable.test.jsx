// Unit tests for ProductTable
// These tests render ProductTable with small props and check visible behavior.

import React from "react";
import { render, screen } from "@testing-library/react";
import ProductTable from "../../src/components/products/ProductTable";

const products = [
  {
    id: 1,
    name: "Apple",
    stock: 5,
    category: "Fruits",
    brand: "B",
    unit: "pcs",
    status: "",
    image: "",
  },
  {
    id: 2,
    name: "Banana",
    stock: 0,
    category: "Fruits",
    brand: "C",
    unit: "pcs",
    status: "",
    image: "",
  },
];

test("renders multiple product rows and shows In Stock / Out of Stock", () => {
  // Arrange: simple callbacks
  const noop = () => {};

  // Act
  render(
    <ProductTable
      products={products}
      sort="name"
      order="asc"
      onSortChange={noop}
      onEdit={noop}
      onDelete={noop}
      onViewHistory={noop}
      loading={false}
      error={""}
    />
  );

  // Assert: product names appear
  expect(screen.getByText("Apple")).toBeInTheDocument();
  expect(screen.getByText("Banana")).toBeInTheDocument();

  // 'In Stock' appears for Apple (stock 5)
  expect(screen.getAllByText("In Stock").length).toBeGreaterThanOrEqual(1);
  // 'Out of Stock' appears for Banana (stock 0)
  expect(screen.getAllByText("Out of Stock").length).toBeGreaterThanOrEqual(1);
});
