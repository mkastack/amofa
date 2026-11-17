"use client";

import { Icon } from "@/components/icons";

export function QuantityControl({
  quantity,
  onChange,
  label,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
  label: string;
}) {
  return (
    <div aria-label={`Quantity for ${label}`} className="quantity-control">
      <button
        aria-label={`Decrease ${label} quantity`}
        disabled={quantity <= 1}
        onClick={() => onChange(quantity - 1)}
        type="button"
      >
        <Icon name="minus" />
      </button>
      <span aria-live="polite">{quantity}</span>
      <button
        aria-label={`Increase ${label} quantity`}
        onClick={() => onChange(quantity + 1)}
        type="button"
      >
        <Icon name="plus" />
      </button>
    </div>
  );
}

