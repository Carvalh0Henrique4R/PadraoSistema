import React from "react";
import { CartDrawerView } from "./CartDrawerView";
import { useCartDrawerModel } from "./useCartDrawerModel";

export const CartDrawer: React.FC = () => {
  const model = useCartDrawerModel();
  const { isDrawerOpen, ...viewProps } = model;
  if (!isDrawerOpen) {
    return null;
  }
  return <CartDrawerView {...viewProps} />;
};
