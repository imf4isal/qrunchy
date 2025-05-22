import { useState } from "react";
import { Plus, Trash2, Edit3, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DigitalMenu, Category, MenuItem } from "@/types/digitalMenu";
import ItemEditor from "./ItemEditor";

interface MenuBuilderProps {
  menu: DigitalMenu;
  onCategoriesChange: (categories: Category[]) => void;
  onItemsChange: (items: MenuItem[]) => void;
}

export default function MenuBuilder({
  menu,
  onCategoriesChange,
  onItemsChange,
}: MenuBuilderProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [showItemEditor, setShowItemEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: newCategoryName.trim(),
      sortOrder: menu.categories.length,
    };

    onCategoriesChange([...menu.categories, newCategory]);
    setNewCategoryName("");
  };

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = menu.categories.filter(
      (cat) => cat.id !== categoryId
    );
    const updatedItems = menu.items.filter(
      (item) => item.categoryId !== categoryId
    );

    onCategoriesChange(updatedCategories);
    onItemsChange(updatedItems);
  };

  const handleEditCategory = (categoryId: string) => {
    const category = menu.categories.find((cat) => cat.id === categoryId);
    if (category) {
      setEditingCategory(categoryId);
      setEditingCategoryName(category.name);
    }
  };

  const handleSaveCategory = () => {
    if (!editingCategoryName.trim() || !editingCategory) return;

    const updatedCategories = menu.categories.map((cat) =>
      cat.id === editingCategory
        ? { ...cat, name: editingCategoryName.trim() }
        : cat
    );

    onCategoriesChange(updatedCategories);
    setEditingCategory(null);
    setEditingCategoryName("");
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

  const handleSaveItem = (item: MenuItem) => {
    if (menu.items.find((existingItem) => existingItem.id === item.id)) {
      // Update existing item
      const updatedItems = menu.items.map((existingItem) =>
        existingItem.id === item.id ? item : existingItem
      );
      onItemsChange(updatedItems);
    } else {
      // Add new item
      onItemsChange([...menu.items, item]);
    }

    setShowItemEditor(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = menu.items.filter((item) => item.id !== itemId);
    onItemsChange(updatedItems);
  };

  const handleCloseItemEditor = () => {
    setShowItemEditor(false);
    setEditingItem(null);
  };

  const getItemsForCategory = (categoryId: string) => {
    return menu.items.filter((item) => item.categoryId === categoryId);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Build Your Menu</h2>
      <p className="text-gray-600 mb-6">
        Add categories and menu items. You can see a live preview on the right.
      </p>

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
              disabled={!newCategoryName.trim()}
            >
              <Plus size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

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
                    <Button size="sm" onClick={handleSaveCategory}>
                      <Check size={14} />
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
                      >
                        <Trash2 size={14} />
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
            <p>Start by adding your first category above</p>
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
