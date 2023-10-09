import AddInventoryForm from "@/components/dashboard/inventory/add-inventory";
import InventoryLayout from "@/components/layout/inventory-layout";
import { Container } from "@mui/material";
import Link from "next/link";
import React from "react";
import { GrLinkPrevious } from "react-icons/gr";

const AddInventory = () => {
  return (
    <Container maxWidth="xl" className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/dashboard/inventory/add-inventory">
          <button className="bg-primary text-white text-sm rounded px-3 py-2 mb-1">
            Add Item
          </button>
        </Link>
        <button className="bg-primary text-white text-sm rounded px-3 py-2 mb-1">
          Sale Order
        </button>
        <button className="bg-primary text-white text-sm rounded px-3 py-2 mb-1">
          View Items
        </button>
      </div>
      <button className="font-semibold">
        <Link href="/dashboard/inventory" className="flex items-center gap-2">
          <GrLinkPrevious />
          <h1>Back</h1>
        </Link>
      </button>
      <AddInventoryForm />
    </Container>
  );
};

AddInventory.getLayout = (page) => <InventoryLayout>{page}</InventoryLayout>;

export default AddInventory;