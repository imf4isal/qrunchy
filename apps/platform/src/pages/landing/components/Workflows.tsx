import React, { useState } from "react";
import { Upload, Image as ImageIcon, Layers, Check, ArrowRight } from "lucide-react";
import { PhonePreview } from "./PhonePreview";
import { Section } from "./shared/Section";

export const Workflows: React.FC = () => {
  const [tab, setTab] = useState<"photo" | "digital">("photo");
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0); // 0: Upload, 1: Arrange, 2: Publish (carousel)
  const [zoom, setZoom] = useState(100); // step 3 only
  const [slide, setSlide] = useState(0); // step 3 only

  // Digital menu state
  const [categories, setCategories] = useState<
    Array<{
      id: string;
      name: string;
      items: Array<{
        id: string;
        name: string;
        price: string;
        description: string;
      }>;
    }>
  >([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [digitalMenuActiveCategory, setDigitalMenuActiveCategory] = useState(0);

  const steps =
    tab === "photo"
      ? ["Upload images", "Arrange", "Publish"]
      : ["Add category", "Add item", "Publish"];

  const percent = Math.round((progress / steps.length) * 100);

  const handleStepClick = (i: number) => {
    setActiveStep(i);
    setProgress((p) => Math.max(p, i + 1));
  };

  const resetFlow = () => {
    setProgress(0);
    setActiveStep(0);
    setZoom(100);
    setSlide(0);
    // Reset digital menu state
    setCategories([]);
    setNewCategoryName("");
    setSelectedCategoryId(null);
    setNewItem({ name: "", price: "", description: "" });
    setDigitalMenuActiveCategory(0);
  };

  const totalSlides = 5;
  const prevSlide = () => setSlide((s) => (s - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setSlide((s) => (s + 1) % totalSlides);

  // Digital menu helper functions
  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        items: [],
      };
      setCategories((prev) => [...prev, newCategory]);
      setNewCategoryName("");
      setSelectedCategoryId(newCategory.id);
    }
  };

  const addItemToCategory = () => {
    if (selectedCategoryId && newItem.name.trim() && newItem.price.trim()) {
      const item = {
        id: Date.now().toString(),
        name: newItem.name.trim(),
        price: newItem.price.trim(),
        description: newItem.description.trim(),
      };
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategoryId
            ? { ...cat, items: [...cat.items, item] }
            : cat
        )
      );
      setNewItem({ name: "", price: "", description: "" });
    }
  };

  return (
    <Section
      id="workflows"
      title="Pick your flow: Photo or Digital"
      subtitle="Let your team self-select the simplest path. Inline demos require no account."
    >
      <div className="mb-8 w-fit rounded-full border border-neutral-800 p-1 flex items-center gap-2">
        {(
          [
            {
              key: "photo",
              label: "Photo Menu",
              icon: <ImageIcon className="h-4 w-4" />,
            },
            {
              key: "digital",
              label: "Digital Menu",
              icon: <Layers className="h-4 w-4" />,
            },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              resetFlow();
            }}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-200 active:scale-95 ${
              tab === t.key
                ? "bg-white text-black shadow-sm"
                : "text-neutral-300 hover:bg-neutral-900 hover:text-neutral-200"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8">
        {/* Phone preview (renders step content INSIDE for Photo & Digital) */}
        <div className="w-fit mx-auto md:mx-0 md:ml-8">
          <PhonePreview theme="dark" mode={tab}>
            {tab === "photo" && (
              <>
                {/* STEP 1: Upload skeleton */}
                {activeStep === 0 && (
                  <div className="space-y-3">
                    <div className="rounded-lg border-2 border-dashed border-neutral-800 bg-neutral-950/70 p-4 text-center">
                      <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/60">
                        <Upload className="h-4 w-4 text-neutral-300" />
                      </div>
                      <div className="text-[11px] text-neutral-300">
                        Drag & drop images here
                      </div>
                      <div className="mt-0.5 text-[10px] text-neutral-500">
                        or tap to browse
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-md border border-neutral-900 bg-neutral-950 p-2"
                        >
                          <div className="h-8 w-10 rounded bg-neutral-800 animate-pulse" />
                          <div className="flex-1 space-y-1.5">
                            <div className="h-2.5 w-28 rounded bg-neutral-800 animate-pulse" />
                            <div className="h-2 w-16 rounded bg-neutral-900" />
                          </div>
                          <div className="h-5 w-12 rounded-full bg-neutral-900" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Arrange list with drag grip + user avatar */}
                {activeStep === 1 && (
                  <div className="space-y-2.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-950 p-2"
                      >
                        {/* Drag handle */}
                        <span className="px-1.5 py-4 text-neutral-600 hover:text-neutral-400 cursor-grab active:cursor-grabbing select-none">
                          <svg
                            width="10"
                            height="16"
                            viewBox="0 0 10 16"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <circle cx="2" cy="2" r="1.2" />
                            <circle cx="8" cy="2" r="1.2" />
                            <circle cx="2" cy="8" r="1.2" />
                            <circle cx="8" cy="8" r="1.2" />
                            <circle cx="2" cy="14" r="1.2" />
                            <circle cx="8" cy="14" r="1.2" />
                          </svg>
                        </span>

                        {/* Thumb */}
                        <div className="h-10 w-12 rounded bg-neutral-800" />

                        {/* Meta + user */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="h-2.5 w-28 rounded bg-neutral-800" />
                            <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[9px] text-neutral-300">
                              U
                            </div>
                          </div>
                          <div className="mt-1.5 h-2 w-20 rounded bg-neutral-900" />
                        </div>
                      </div>
                    ))}
                    <div className="text-[10px] text-neutral-500">
                      Tip: drag the handle to reorder images.
                    </div>
                  </div>
                )}

                {/* STEP 3: Carousel with arrows + zoom */}
                {activeStep === 2 && (
                  <div className="rounded-lg border border-neutral-800 bg-neutral-950 overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between gap-2 border-b border-neutral-900 px-2 py-1.5">
                      <div className="text-[10px] text-neutral-400">
                        Preview {slide + 1}/{totalSlides}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setZoom((z) => Math.max(50, z - 10))}
                          className="rounded border border-neutral-800 px-1.5 text-[11px] text-neutral-300 hover:bg-neutral-900"
                          aria-label="Zoom out"
                        >
                          −
                        </button>
                        <div className="min-w-[2.5rem] text-center text-[10px] text-neutral-400">
                          {zoom}%
                        </div>
                        <button
                          onClick={() => setZoom((z) => Math.min(200, z + 10))}
                          className="rounded border border-neutral-800 px-1.5 text-[11px] text-neutral-300 hover:bg-neutral-900"
                          aria-label="Zoom in"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Slide area */}
                    <div className="relative h-60">
                      <button
                        onClick={prevSlide}
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full border border-neutral-800 bg-neutral-900/70 p-1.5 text-neutral-200 hover:bg-neutral-900"
                        aria-label="Previous"
                      >
                        <ArrowRight className="h-4 w-4 rotate-180" />
                      </button>

                      <div className="flex h-full items-center justify-center">
                        <div
                          className="rounded-md bg-neutral-800 transition-transform"
                          style={{
                            width: `${Math.min(95, 60 + (zoom - 100) * 0.25)}%`,
                            height: "70%",
                          }}
                        />
                      </div>

                      <button
                        onClick={nextSlide}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full border border-neutral-800 bg-neutral-900/70 p-1.5 text-neutral-200 hover:bg-neutral-900"
                        aria-label="Next"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            {tab === "digital" && (
              <>
                {/* STEP 1: Add Category */}
                {activeStep === 0 && (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                      <div className="mb-3 text-[11px] text-neutral-400 uppercase tracking-widest">
                        Create Category
                      </div>
                      <input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g., Appetizers"
                        className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-[13px] text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600/20 transition-all duration-200 hover:border-neutral-700"
                        onKeyPress={(e) => e.key === "Enter" && addCategory()}
                      />
                      <button
                        onClick={addCategory}
                        disabled={!newCategoryName.trim()}
                        className="mt-2 w-full rounded-md bg-white px-3 py-2 text-[12px] font-medium text-black disabled:opacity-50 transition-all duration-200 hover:bg-neutral-100 hover:shadow-sm active:scale-[0.98] disabled:hover:bg-white disabled:hover:shadow-none disabled:active:scale-100"
                      >
                        Add Category
                      </button>
                    </div>

                    {/* Categories list */}
                    <div className="space-y-2">
                      {categories.map((cat, i) => (
                        <div
                          key={cat.id}
                          className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 transition-all duration-200 hover:bg-neutral-900 hover:border-neutral-700"
                        >
                          <span className="text-[12px] text-neutral-200">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            {cat.items.length} items
                          </span>
                        </div>
                      ))}
                      {categories.length === 0 && (
                        <div className="text-center py-6 text-[11px] text-neutral-500">
                          Add categories to organize your menu
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2: Add Item */}
                {activeStep === 1 && (
                  <div className="space-y-3">
                    {categories.length > 0 ? (
                      <>
                        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                          <div className="mb-3 text-[11px] text-neutral-400 uppercase tracking-widest">
                            Add Menu Item
                          </div>

                          {/* Category selector */}
                          <select
                            value={selectedCategoryId || ""}
                            onChange={(e) =>
                              setSelectedCategoryId(e.target.value)
                            }
                            className="w-full mb-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-[12px] text-neutral-200 focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600/20 transition-all duration-200 hover:border-neutral-700"
                          >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>

                          {/* Item form */}
                          <input
                            value={newItem.name}
                            onChange={(e) =>
                              setNewItem((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder="Item name"
                            className="w-full mb-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-[12px] text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600/20 transition-all duration-200 hover:border-neutral-700"
                          />
                          <input
                            value={newItem.price}
                            onChange={(e) =>
                              setNewItem((prev) => ({
                                ...prev,
                                price: e.target.value,
                              }))
                            }
                            placeholder="Price (e.g., $12.99)"
                            className="w-full mb-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-[12px] text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600/20 transition-all duration-200 hover:border-neutral-700"
                          />
                          <textarea
                            value={newItem.description}
                            onChange={(e) =>
                              setNewItem((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Description (optional)"
                            rows={2}
                            className="w-full mb-2 resize-none rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-[12px] text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600/20 transition-all duration-200 hover:border-neutral-700"
                          />
                          <button
                            onClick={addItemToCategory}
                            disabled={
                              !selectedCategoryId ||
                              !newItem.name.trim() ||
                              !newItem.price.trim()
                            }
                            className="w-full rounded-md bg-white px-3 py-2 text-[12px] font-medium text-black disabled:opacity-50 transition-all duration-200 hover:bg-neutral-100 hover:shadow-sm active:scale-[0.98] disabled:hover:bg-white disabled:hover:shadow-none disabled:active:scale-100"
                          >
                            Add Item
                          </button>
                        </div>

                        {/* Preview categories with items */}
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {categories.map((cat) => (
                            <div
                              key={cat.id}
                              className="rounded-md border border-neutral-800 bg-neutral-950"
                            >
                              <div className="px-3 py-2 text-[11px] font-medium text-neutral-200 border-b border-neutral-800">
                                {cat.name}
                              </div>
                              {cat.items.length > 0 ? (
                                <div className="p-2 space-y-1">
                                  {cat.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex justify-between items-start"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <div className="text-[10px] text-neutral-200 truncate">
                                          {item.name}
                                        </div>
                                        {item.description && (
                                          <div className="text-[9px] text-neutral-500 truncate">
                                            {item.description}
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-neutral-300 ml-2">
                                        {item.price}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-2 text-[10px] text-neutral-500">
                                  No items yet
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-[11px] text-neutral-500">
                        Add categories first before adding items
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: Menu Preview */}
                {activeStep === 2 && (
                  <div className="space-y-2">
                    {categories.length > 0 ? (
                      <>
                        {/* Category tabs */}
                        <div className="flex gap-1 overflow-x-auto pb-1">
                          {categories.map((cat, i) => (
                            <button
                              key={cat.id}
                              onClick={() => setDigitalMenuActiveCategory(i)}
                              className={`shrink-0 rounded-full px-3 py-1 text-[10px] transition-all duration-200 active:scale-95 ${
                                digitalMenuActiveCategory === i
                                  ? "bg-white text-black shadow-sm"
                                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-200"
                              }`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>

                        {/* Active category content */}
                        <div className="rounded-lg border border-neutral-800 bg-neutral-950 min-h-48">
                          {categories[digitalMenuActiveCategory] && (
                            <div className="p-3">
                              <div className="mb-3 text-[12px] font-medium text-neutral-200">
                                {categories[digitalMenuActiveCategory].name}
                              </div>
                              <div className="space-y-2">
                                {categories[
                                  digitalMenuActiveCategory
                                ].items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-start gap-3 p-2 rounded-md bg-neutral-900/50"
                                  >
                                    <div className="h-8 w-8 rounded bg-neutral-800"></div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-[11px] font-medium text-neutral-200">
                                        {item.name}
                                      </div>
                                      {item.description && (
                                        <div className="text-[9px] text-neutral-400 mt-0.5">
                                          {item.description}
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-[10px] font-medium text-neutral-200">
                                      {item.price}
                                    </div>
                                  </div>
                                ))}
                                {categories[digitalMenuActiveCategory].items
                                  .length === 0 && (
                                  <div className="text-center py-4 text-[10px] text-neutral-500">
                                    No items in this category
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-[11px] text-neutral-500">
                        Create categories and add items to see preview
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </PhonePreview>
        </div>

        {/* Controls & progress (right column) */}
        <div>
          <div className="rounded-2xl border border-neutral-800 p-6">
            <div className="text-sm text-neutral-400">
              Inline demo {tab === "photo" ? "(Photo)" : "(Digital)"}
            </div>
            <h3 className="mt-1 text-xl font-semibold text-neutral-100">
              {tab === "photo"
                ? "Upload → Arrange → Publish"
                : "Category → Items → Publish"}
            </h3>

            <div className="mt-4 space-y-3">
              {steps.map((s, i) => {
                const done = progress > i;
                const active = activeStep === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleStepClick(i)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-all duration-200 active:scale-[0.98] ${
                      active
                        ? "border-neutral-700 bg-neutral-900 ring-1 ring-neutral-700/60 shadow-sm"
                        : done
                          ? "border-neutral-700 bg-neutral-900 hover:bg-neutral-800"
                          : "border-neutral-900 hover:bg-neutral-950 hover:border-neutral-800"
                    }`}
                  >
                    <span className="flex items-center gap-3 text-neutral-200">
                      {done ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-neutral-700" />
                      )}
                      {s}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {done
                        ? "Completed"
                        : active
                          ? "In progress (see phone)"
                          : "Click to complete"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Progress + actions */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-neutral-400">
                <span>Publish in 60 seconds</span>
                <span>{percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-900">
                <div
                  className="h-full bg-white"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-60 transition-all duration-200 hover:bg-neutral-100 hover:shadow-sm active:scale-95 disabled:hover:bg-white disabled:hover:shadow-none disabled:active:scale-100"
                  disabled={progress < steps.length}
                >
                  Publish
                </button>
                <button
                  onClick={resetFlow}
                  className="rounded-full border border-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-neutral-200 hover:border-neutral-700 transition-all duration-200 active:scale-95"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};