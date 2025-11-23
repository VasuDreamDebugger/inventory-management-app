// Unit tests for ProductRow
// Test rendering a normal row and entering edit mode

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductRow from "../../src/components/products/ProductRow";

const product = {
  id: 10,
  name: "Gadget",
  stock: 3,
  category: "Electronics",
  brand: "X",
  unit: "pcs",
  status: "",
  image: "",
};

test("renders normal row with text and action buttons", () => {
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  const onViewHistory = jest.fn();

  render(
    <table>
      <tbody>
        <ProductRow
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewHistory={onViewHistory}
        />
      </tbody>
    </table>
  );

  expect(screen.getByText("Gadget")).toBeInTheDocument();
  expect(screen.getByText("Edit")).toBeInTheDocument();
  expect(screen.getByText("Delete")).toBeInTheDocument();
  expect(screen.getByText("History")).toBeInTheDocument();
});

test("clicking Edit switches to edit mode showing inputs", async () => {
  const user = userEvent.setup();
  const onEdit = jest.fn().mockResolvedValue();
  const onDelete = jest.fn();
  const onViewHistory = jest.fn();

  render(
    <table>
      <tbody>
        <ProductRow
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewHistory={onViewHistory}
        />
      </tbody>
    </table>
  );

  await user.click(screen.getByText("Edit"));

  // Now an input for name should be visible (edit mode)
  expect(screen.getByDisplayValue("Gadget")).toBeInTheDocument();
  // and Save/Cancel buttons should appear
  expect(screen.getByText("Save")).toBeInTheDocument();
  expect(screen.getByText("Cancel")).toBeInTheDocument();
});
