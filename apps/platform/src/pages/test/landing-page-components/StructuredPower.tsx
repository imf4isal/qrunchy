import React, { useState } from "react";
import { PhonePreview } from "./PhonePreview";
import { Section } from "./shared/Section";

export const StructuredPower: React.FC = () => {
  const [itemName, setItemName] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [addons, setAddons] = useState<Record<string, boolean>>({
    "Extra cheese": false,
    Jalapeños: false,
    Avocado: false,
    Sauce: false,
  });

  const variantOptions = ["Regular", "Large"];
  const toggleAddon = (key: string) =>
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  const canSave = itemName.trim().length > 0;

  return (
    <Section
      id="power"
      title="Complex menus, simple editing."
      subtitle="Sizes, toppings, modifiers; allergen tags; search; quick hide/sold out."
    >
      <div className="rounded-2xl border border-neutral-800 p-6">
        {/* Left column flexes, right column fits content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_max-content]">
          {/* Left: Form */}
          <div className="space-y-5">
            {/* Item name */}
            <div>
              <label className="text-xs uppercase tracking-widest text-neutral-400">
                Item name
              </label>
              <input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="mt-2 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none transition hover:border-neutral-700 focus:border-neutral-700 focus:ring-1 focus:ring-neutral-600"
                placeholder="Spicy Chicken Wrap"
                aria-label="Menu item name"
              />
              <div className="mt-1 text-[11px] text-neutral-500">
                Keep it short and scannable.
              </div>
            </div>

            {/* Variants */}
            <div>
              <label className="text-xs uppercase tracking-widest text-neutral-400">
                Variants
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {variantOptions.map((v) => {
                  const active = selectedVariant === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        setSelectedVariant((curr) => (curr === v ? null : v))
                      }
                      className={`rounded-full px-3 py-1 text-xs transition
                        ${
                          active
                            ? "bg-white text-black shadow-sm"
                            : "border border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900 active:scale-[0.98]"
                        }
                      `}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
              <div className="mt-1 text-[11px] text-neutral-500">
                Choose a default size (optional).
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <label className="text-xs uppercase tracking-widest text-neutral-400">
                Add-ons
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {Object.keys(addons).map((a) => (
                  <label
                    key={a}
                    className="group inline-flex items-center gap-2 rounded-md border border-transparent px-2 py-1 text-sm text-neutral-300 transition hover:border-neutral-800 hover:bg-neutral-950"
                  >
                    <input
                      type="checkbox"
                      checked={addons[a]}
                      onChange={() => toggleAddon(a)}
                      className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 transition focus:ring-1 focus:ring-neutral-600"
                    />
                    <span className="select-none">{a}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Save */}
            <button
              disabled={!canSave}
              className={`w-full sm:w-auto rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition
                enabled:hover:bg-neutral-200 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60`}
            >
              Save
            </button>
          </div>

          {/* Right: Preview — centered on mobile, hugs right on desktop, fixed intrinsic width */}
          <div className="relative flex items-center justify-center md:justify-end">
            {/* subtle glow, desktop only to avoid any small-screen artifacts */}
            <div className="pointer-events-none absolute -inset-4 hidden md:block rounded-[32px] bg-[radial-gradient(closest-side,rgba(255,255,255,0.06),transparent)]" />
            <div className="w-[260px] shrink-0">
              <PhonePreview theme="dark" mode="digital" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};