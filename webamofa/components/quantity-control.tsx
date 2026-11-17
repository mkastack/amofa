"use client";

import { Icon } from "@/components/icons";

export function QuantityControl({
  quantity,
  onChange,
  label,
  max = 99,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
  label: string;
  max?: number;
}) {
  return (
    <div role="group" aria-label={`Quantity for ${label}`} className="stepper">
      <button aria-label={`Decrease ${label} quantity`} disabled={quantity <= 1} onClick={() => onChange(quantity - 1)} type="button">
        <Icon name="minus" />
      </button>
      <span aria-live="polite" aria-atomic="true">{quantity}</span>
      <button aria-label={`Increase ${label} quantity`} disabled={quantity >= max} onClick={() => onChange(Math.min(max, quantity + 1))} type="button">
        <Icon name="plus" />
      </button>
    </div>
  );
}
