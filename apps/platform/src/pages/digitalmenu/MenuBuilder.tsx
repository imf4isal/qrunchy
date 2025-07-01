// src/pages/digitalmenu/MenuBuilder.tsx
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ItemEditor from "./ItemEditor";
import { trpc } from "@/utils/trpc";
import type { DigitalMenu, Category, MenuItem } from "@/types/digitalMenu";

interface MenuBuilderProps {
  menu: DigitalMenu;
  restaurantId?: number;
  onCategoriesChange: (categories: Category[]) => void;
  onItemsChange: (items: MenuItem[]) => void;
}

export default function MenuBuilder({
  menu,
  restaurantId,
  onCategoriesChange,
  onItemsChange,
}: MenuBuilderProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [showItemEditor, setShowItemEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [bulkUploadMode, setBulkUploadMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSampleFormat, setShowSampleFormat] = useState(false);

  // tRPC queries and mutations
  const utils = trpc.useUtils();

  // Fetch categories for the restaurant
  const {
    data: backendCategories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = trpc.digitalMenu.categories.getByRestaurant.useQuery(
    { restaurant_id: restaurantId! },
    { enabled: !!restaurantId }
  );

  // Fetch items for the restaurant
  const {
    data: backendItems,
    isLoading: itemsLoading,
    error: itemsError,
  } = trpc.digitalMenu.items.getByRestaurant.useQuery(
    { restaurant_id: restaurantId! },
    { enabled: !!restaurantId }
  );

  // Category mutations
  const createCategoryMutation = trpc.digitalMenu.categories.create.useMutation(
    {
      onSuccess: () => {
        utils.digitalMenu.categories.getByRestaurant.invalidate();
      },
    }
  );

  const updateCategoryMutation = trpc.digitalMenu.categories.update.useMutation(
    {
      onSuccess: () => {
        utils.digitalMenu.categories.getByRestaurant.invalidate();
      },
    }
  );

  const deleteCategoryMutation = trpc.digitalMenu.categories.delete.useMutation(
    {
      onSuccess: () => {
        utils.digitalMenu.categories.getByRestaurant.invalidate();
        utils.digitalMenu.items.getByRestaurant.invalidate();
      },
    }
  );

  // Item mutations
  const createItemMutation = trpc.digitalMenu.items.create.useMutation({
    onSuccess: () => {
      utils.digitalMenu.items.getByRestaurant.invalidate();
    },
  });

  const deleteItemMutation = trpc.digitalMenu.items.delete.useMutation({
    onSuccess: () => {
      utils.digitalMenu.items.getByRestaurant.invalidate();
    },
  });

  // Bulk import mutation
  const bulkImportMutation = trpc.digitalMenu.menu.bulkImport.useMutation({
    onSuccess: () => {
      utils.digitalMenu.categories.getByRestaurant.invalidate();
      utils.digitalMenu.items.getByRestaurant.invalidate();
    },
    onError: (error) => {
      console.error("Bulk import failed:", error);
      alert(
        "Failed to import menu. Please check your JSON format and try again."
      );
      setBulkUploadMode(false);
    },
  });

  // Sync backend data to local state
  useEffect(() => {
    if (backendCategories) {
      onCategoriesChange(backendCategories);
    }
  }, [backendCategories, onCategoriesChange]);

  useEffect(() => {
    if (backendItems) {
      // Transform backend items format to local format
      const transformedItems: MenuItem[] = [];
      backendItems.forEach((categoryData) => {
        categoryData.items.forEach((item) => {
          transformedItems.push(item as MenuItem);
        });
      });
      onItemsChange(transformedItems);
    }
  }, [backendItems, onItemsChange]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !restaurantId) return;

    try {
      await createCategoryMutation.mutateAsync({
        name: newCategoryName.trim(),
        restaurant_id: restaurantId,
      });
      setNewCategoryName("");
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!restaurantId) return;

    try {
      await deleteCategoryMutation.mutateAsync({
        id: parseInt(categoryId, 10),
      });
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleEditCategory = (categoryId: string) => {
    const category = menu.categories.find((cat) => cat.id === categoryId);
    if (category) {
      setEditingCategory(categoryId);
      setEditingCategoryName(category.name);
    }
  };

  const handleSaveCategory = async () => {
    if (!editingCategoryName.trim() || !editingCategory || !restaurantId)
      return;

    try {
      await updateCategoryMutation.mutateAsync({
        id: parseInt(editingCategory, 10),
        name: editingCategoryName.trim(),
      });
      setEditingCategory(null);
      setEditingCategoryName("");
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditingCategoryName("");
  };

  const handleAddItem = (categoryId: string) => {
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      name: "",
      price: 0,
      categoryId,
      variants: [],
      addons: [],
      description: "",
    };

    setEditingItem(newItem);
    setShowItemEditor(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setShowItemEditor(true);
  };

  const handleSaveItem = async (item: MenuItem) => {
    if (!restaurantId) return;

    try {
      if (menu.items.find((existingItem) => existingItem.id === item.id)) {
        // Update existing item - TODO: implement when backend supports it
        console.log("Item update not yet implemented in backend");
        setShowItemEditor(false);
        setEditingItem(null);
        return;
      } else {
        // Add new item
        await createItemMutation.mutateAsync({
          name: item.name,
          price: item.price,
          description: item.description,
          category_id: parseInt(item.categoryId, 10),
          variants: item.variants.map((variant) => ({
            title: variant.title,
            options: variant.options.map((option) => ({
              name: option.name,
              price: option.price,
            })),
          })),
          addons: item.addons.map((addon) => ({
            name: addon.name,
            price: addon.price,
          })),
        });
      }

      setShowItemEditor(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to save item:", error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!restaurantId) return;

    try {
      await deleteItemMutation.mutateAsync({
        id: parseInt(itemId, 10),
      });
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleCloseItemEditor = () => {
    setShowItemEditor(false);
    setEditingItem(null);
  };

  const handleFileUpload = async (file: File) => {
    if (!restaurantId) {
      alert("Restaurant ID not found. Please refresh and try again.");
      setBulkUploadMode(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);

        // Validate JSON structure
        if (!validateMenuJson(jsonData)) {
          alert(
            "Invalid JSON format. Please check the structure and try again, or use manual entry."
          );
          setBulkUploadMode(false);
          return;
        }

        // Use backend bulk import instead of local state update
        await bulkImportMutation.mutateAsync({
          restaurant_id: restaurantId,
          menu_data: jsonData,
          replace_existing: true,
        });

        alert("Menu imported successfully!");
        setBulkUploadMode(false);
      } catch (error) {
        console.error("Failed to import menu:", error);
        alert(
          "Invalid JSON file or import failed. Please check the format and try again."
        );
        setBulkUploadMode(false);
      }
    };
    reader.readAsText(file);
  };

  const validateMenuJson = (data: any): boolean => {
    return (
      data &&
      Array.isArray(data.categories) &&
      Array.isArray(data.items) &&
      data.categories.every(
        (cat: any) => cat.name && typeof cat.name === "string"
      ) &&
      data.items.every(
        (item: any) =>
          item.name &&
          typeof item.name === "string" &&
          typeof item.price === "number" &&
          item.categoryName &&
          typeof item.categoryName === "string"
      )
    );
  };

  const transformJsonToMenu = (data: any) => {
    // Create categories with IDs
    const categories: Category[] = data.categories.map(
      (cat: any, index: number) => ({
        id: crypto.randomUUID(),
        name: cat.name,
        sortOrder: index,
      })
    );

    // Create a mapping from category name to ID
    const categoryMap = new Map(categories.map((cat) => [cat.name, cat.id]));

    // Create items with proper IDs and references
    const items: MenuItem[] = data.items.map((item: any) => ({
      id: crypto.randomUUID(),
      name: item.name,
      price: item.price,
      description: item.description || "",
      categoryId: categoryMap.get(item.categoryName) || categories[0]?.id || "",
      variants: (item.variants || []).map((variant: any) => ({
        id: crypto.randomUUID(),
        title: variant.title,
        options: (variant.options || []).map((option: any) => ({
          id: crypto.randomUUID(),
          name: option.name,
          price: option.price,
        })),
      })),
      addons: (item.addons || []).map((addon: any) => ({
        id: crypto.randomUUID(),
        name: addon.name,
        price: addon.price,
      })),
    }));

    return { categories, items };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(
      (file) => file.type === "application/json" || file.name.endsWith(".json")
    );

    if (jsonFile) {
      handleFileUpload(jsonFile);
    } else {
      alert("Please upload a valid JSON file.");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    e.target.value = "";
  };

  const downloadSampleFormat = () => {
    const sampleData = {
      categories: [
        { name: "Appetizers" },
        { name: "Main Course" },
        { name: "Desserts" },
        { name: "Beverages" },
      ],
      items: [
        {
          name: "Chicken Wings",
          price: 12.99,
          description: "Crispy chicken wings with your choice of sauce",
          categoryName: "Appetizers",
          variants: [
            {
              title: "Size",
              options: [
                { name: "6 pieces", price: 12.99 },
                { name: "12 pieces", price: 22.99 },
              ],
            },
            {
              title: "Sauce",
              options: [
                { name: "Buffalo", price: 0 },
                { name: "BBQ", price: 0 },
                { name: "Honey Garlic", price: 0.5 },
              ],
            },
          ],
          addons: [
            { name: "Extra Sauce", price: 1.0 },
            { name: "Celery Sticks", price: 2.0 },
          ],
        },
        {
          name: "Grilled Salmon",
          price: 24.99,
          description: "Fresh Atlantic salmon with seasonal vegetables",
          categoryName: "Main Course",
          variants: [
            {
              title: "Cooking Style",
              options: [
                { name: "Grilled", price: 0 },
                { name: "Blackened", price: 2.0 },
              ],
            },
          ],
          addons: [
            { name: "Extra Vegetables", price: 3.0 },
            { name: "Garlic Butter", price: 1.5 },
          ],
        },
        {
          name: "Chocolate Cake",
          price: 8.99,
          description: "Rich chocolate cake with vanilla ice cream",
          categoryName: "Desserts",
          variants: [],
          addons: [{ name: "Extra Ice Cream", price: 2.0 }],
        },
        {
          name: "Fresh Juice",
          price: 4.99,
          description: "Freshly squeezed fruit juice",
          categoryName: "Beverages",
          variants: [
            {
              title: "Flavor",
              options: [
                { name: "Orange", price: 0 },
                { name: "Apple", price: 0 },
                { name: "Mixed Berry", price: 1.0 },
              ],
            },
            {
              title: "Size",
              options: [
                { name: "Small", price: 4.99 },
                { name: "Large", price: 6.99 },
              ],
            },
          ],
          addons: [],
        },
      ],
    };

    const dataStr = JSON.stringify(sampleData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "qrunchy-menu-sample.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const getItemsForCategory = (categoryId: string) => {
    return menu.items.filter((item) => item.categoryId === categoryId);
  };

  // Show loading state while fetching data
  if (categoriesLoading || itemsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading menu data...</span>
      </div>
    );
  }

  // Show error state if there's an error
  if (categoriesError || itemsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium mb-2">Error Loading Menu</h3>
        <p className="text-red-600 text-sm">
          {categoriesError?.message ||
            itemsError?.message ||
            "Failed to load menu data"}
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Build Your Menu</h2>
      <p className="text-gray-600 mb-6">
        Add categories and menu items manually, or upload a complete menu from
        JSON file.
      </p>

      {/* Bulk Upload Toggle */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Menu Entry Method</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Choose how you want to build your menu
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="entryMethod"
                  checked={!bulkUploadMode}
                  onChange={() => setBulkUploadMode(false)}
                  className="text-blue-600"
                />
                <span className="text-sm">Manual Entry</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="entryMethod"
                  checked={bulkUploadMode}
                  onChange={() => setBulkUploadMode(true)}
                  className="text-blue-600"
                />
                <span className="text-sm">Upload JSON</span>
              </label>
            </div>
          </div>
        </CardHeader>

        {bulkUploadMode && (
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Upload a JSON file with your complete menu structure
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowSampleFormat(!showSampleFormat)}
                  >
                    {showSampleFormat ? "Hide" : "Show"} Format
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadSampleFormat}
                  >
                    Download Sample
                  </Button>
                </div>
              </div>

              {showSampleFormat && (
                <div className="bg-gray-50 rounded-lg p-4 text-xs">
                  <pre className="whitespace-pre-wrap text-gray-700">
                    {`{
  "categories": [
    { "name": "Appetizers" },
    { "name": "Main Course" }
  ],
  "items": [
    {
      "name": "Chicken Wings",
      "price": 12.99,
      "description": "Crispy wings",
      "categoryName": "Appetizers",
      "variants": [
        {
          "title": "Size",
          "options": [
            { "name": "6 pieces", "price": 12.99 },
            { "name": "12 pieces", "price": 22.99 }
          ]
        }
      ],
      "addons": [
        { "name": "Extra Sauce", "price": 1.00 }
      ]
    }
  ]
}`}
                  </pre>
                </div>
              )}

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  bulkImportMutation.isPending
                    ? "border-blue-500 bg-blue-50 opacity-50"
                    : isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {bulkImportMutation.isPending ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-3" />
                    <p className="text-blue-600 font-medium">
                      Importing menu...
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                      Please wait while we process your menu data
                    </p>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="json-upload"
                      disabled={bulkImportMutation.isPending}
                    />
                    <label htmlFor="json-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-400 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <p className="text-gray-600 mb-1">
                          Drag and drop your JSON file here, or click to browse
                        </p>
                        <p className="text-xs text-gray-500">
                          Accepts .json files only
                        </p>
                      </div>
                    </label>
                  </>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                <p className="text-yellow-800">
                  <strong>Note:</strong> Uploading a new file will replace your
                  current menu data. Make sure your JSON follows the correct
                  format shown above.
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {!bulkUploadMode && (
        <>
          {/* Add Category */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Add Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter category name (e.g., Appetizers, Main Course)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddCategory}
                  disabled={
                    !newCategoryName.trim() || createCategoryMutation.isPending
                  }
                >
                  {createCategoryMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Categories and Items - Always show if data exists */}
      <div className="space-y-6">
        {menu.categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                {editingCategory === category.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveCategory();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveCategory}
                      disabled={updateCategoryMutation.isPending}
                    >
                      {updateCategoryMutation.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Check size={14} />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelEdit}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditCategory(category.id)}
                      >
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={deleteCategoryMutation.isPending}
                      >
                        {deleteCategoryMutation.isPending ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getItemsForCategory(category.id).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {item.name || "Untitled Item"}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                        {item.variants.length > 0 && (
                          <span className="ml-2 text-blue-500">
                            {item.variants.length} variant
                            {item.variants.length !== 1 ? "s" : ""}
                          </span>
                        )}
                        {item.addons.length > 0 && (
                          <span className="ml-2 text-green-500">
                            {item.addons.length} addon
                            {item.addons.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={() => handleAddItem(category.id)}
                  className="w-full"
                >
                  <Plus size={16} />
                  Add Item to {category.name}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {menu.categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>
              {bulkUploadMode
                ? "Upload a JSON file above to populate your menu automatically"
                : "Start by adding your first category above"}
            </p>
          </div>
        )}
      </div>

      {/* Item Editor Modal */}
      {showItemEditor && editingItem && (
        <ItemEditor
          item={editingItem}
          categories={menu.categories}
          onSave={handleSaveItem}
          onClose={handleCloseItemEditor}
        />
      )}
    </div>
  );
}
