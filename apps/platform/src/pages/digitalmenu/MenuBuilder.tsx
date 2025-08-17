// src/pages/digitalmenu/MenuBuilder.tsx
import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit3, Check, X, Loader2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  batchSaveMode?: boolean;
}

export default function MenuBuilder({
  menu,
  restaurantId,
  onCategoriesChange,
  onItemsChange,
  batchSaveMode = false,
}: MenuBuilderProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [showItemEditor, setShowItemEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [bulkUploadMode, setBulkUploadMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSampleFormat, setShowSampleFormat] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  
  // Ref to track scroll position during drag operations
  const scrollPositionRef = useRef<{ top: number; left: number }>({ top: 0, left: 0 });

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

  const updateItemMutation = trpc.digitalMenu.items.update.useMutation({
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
    onError: (error: any) => {
      console.error("Bulk import failed:", error);
      alert(
        "Failed to import menu. Please check your JSON format and try again."
      );
      setBulkUploadMode(false);
    },
  });

  // Reorder mutations
  const reorderCategoriesMutation = trpc.digitalMenu.categories.reorder.useMutation({
    onSuccess: () => {
      // Delay invalidation to prevent immediate scroll jumping
      setTimeout(() => {
        utils.digitalMenu.categories.getByRestaurant.invalidate();
      }, 100);
    },
  });

  const reorderItemsMutation = trpc.digitalMenu.items.reorder.useMutation({
    onSuccess: () => {
      // Delay invalidation to prevent immediate scroll jumping
      setTimeout(() => {
        utils.digitalMenu.items.getByRestaurant.invalidate();
      }, 100);
    },
  });

  const updateItemImageMutation = trpc.digitalMenu.items.updateImage.useMutation({
    onSuccess: () => {
      setTimeout(() => {
        utils.digitalMenu.items.getByRestaurant.invalidate();
      }, 100);
    },
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load draft from localStorage on mount (only for new restaurants)
  useEffect(() => {
    if (!restaurantId) {
      const draft = localStorage.getItem('qrunchy_menu_draft');
      if (draft) {
        try {
          const draftData = JSON.parse(draft);
          // Check if it's the new format (with menu object) or old format
          if (draftData.menu) {
            onCategoriesChange(draftData.menu.categories || []);
            onItemsChange(draftData.menu.items || []);
          } else if (draftData.categories && draftData.items) {
            // Old format - backward compatibility
            onCategoriesChange(draftData.categories);
            onItemsChange(draftData.items);
          }
          setDraftLoaded(true);
        } catch (error) {
          console.error('Failed to load menu draft:', error);
          localStorage.removeItem('qrunchy_menu_draft');
        }
      }
    }
  }, [restaurantId, onCategoriesChange, onItemsChange]);

  // Don't save draft here anymore - let DigitalMenu handle it to avoid conflicts
  // The DigitalMenu component will save the complete draft including categories and items

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
      backendItems.forEach((categoryData: any) => {
        categoryData.items.forEach((item: any) => {
          transformedItems.push(item as MenuItem);
        });
      });
      onItemsChange(transformedItems);
    }
  }, [backendItems, onItemsChange]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    if (!restaurantId) {
      // For new restaurants, add to local state only
      const newCategory = {
        id: crypto.randomUUID(),
        name: newCategoryName.trim(),
        sortOrder: menu.categories?.length || 0,
      };
      
      onCategoriesChange([...(menu.categories || []), newCategory]);
      setNewCategoryName("");
      return;
    }

    // For existing restaurants, save to backend
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
    if (!restaurantId) {
      // For new restaurants, remove from local state only
      const updatedCategories = menu.categories?.filter(cat => cat.id !== categoryId) || [];
      const updatedItems = menu.items?.filter(item => item.categoryId !== categoryId) || [];
      
      onCategoriesChange(updatedCategories);
      onItemsChange(updatedItems);
      return;
    }

    // For existing restaurants, delete from backend
    try {
      await deleteCategoryMutation.mutateAsync({
        id: parseInt(categoryId, 10),
      });
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleEditCategory = (categoryId: string) => {
    const category = menu.categories?.find((cat) => cat.id === categoryId);
    if (category) {
      setEditingCategory(categoryId);
      setEditingCategoryName(category.name);
    }
  };

  const handleSaveCategory = async () => {
    if (!editingCategoryName.trim() || !editingCategory) return;

    if (!restaurantId) {
      // For new restaurants, update local state only
      const updatedCategories = menu.categories?.map(cat => 
        cat.id === editingCategory 
          ? { ...cat, name: editingCategoryName.trim() }
          : cat
      ) || [];
      
      onCategoriesChange(updatedCategories);
      setEditingCategory(null);
      setEditingCategoryName("");
      return;
    }

    // For existing restaurants, update backend
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
    console.log('🔍 MenuBuilder handleSaveItem called with item.image_url:', item.image_url);
    
    if (batchSaveMode || !restaurantId) {
      // In batch save mode or for new restaurants, just update local state
      // Images are handled separately via atomic upload endpoint
      const existingItemIndex = menu.items?.findIndex(existingItem => existingItem.id === item.id) ?? -1;
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update existing item
        updatedItems = [...(menu.items || [])];
        updatedItems[existingItemIndex] = item;
      } else {
        // Add new item
        updatedItems = [...(menu.items || []), item];
      }
      
      onItemsChange(updatedItems);
      setShowItemEditor(false);
      setEditingItem(null);
    } else {
      // Immediate save mode for existing restaurants
      try {
        const existingItem = menu.items?.find((existingItem) => existingItem.id === item.id);
        
        if (existingItem) {
          // Update existing item
          console.log('🔍 About to call updateItemMutation with image_url:', item.image_url);
          await updateItemMutation.mutateAsync({
            id: parseInt(item.id, 10),
            name: item.name,
            price: item.price,
            description: item.description,
            category_id: parseInt(item.categoryId, 10),
            image_url: item.image_url,
            variants: item.variants.map((variant) => ({
              id: variant.id, // Include ID for existing variants
              title: variant.title,
              options: variant.options.map((option) => ({
                id: option.id, // Include ID for existing options
                name: option.name,
                price: option.price,
              })),
            })),
            addons: item.addons.map((addon) => ({
              id: addon.id, // Include ID for existing addons
              name: addon.name,
              price: addon.price,
            })),
          });
        } else {
          // Add new item
          await createItemMutation.mutateAsync({
            name: item.name,
            price: item.price,
            description: item.description,
            category_id: parseInt(item.categoryId, 10),
            image_url: item.image_url,
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
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!restaurantId) {
      // For new restaurants, remove from local state only
      const updatedItems = menu.items?.filter(item => item.id !== itemId) || [];
      onItemsChange(updatedItems);
      return;
    }

    // For existing restaurants, delete from backend
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

        if (restaurantId) {
          // Existing restaurant: Upload directly to backend
          await bulkImportMutation.mutateAsync({
            restaurant_id: restaurantId,
            menu_data: jsonData,
            replace_existing: true,
          });

          alert("Menu imported successfully!");
        } else {
          // New restaurant: Store in local state for later upload
          const categories = jsonData.categories.map((cat: any, index: number) => ({
            id: crypto.randomUUID(),
            name: cat.name,
            sort_order: index,
          }));

          const items = jsonData.items.map((item: any, index: number) => {
            const category = categories.find((cat: any) => cat.name === item.categoryName);
            return {
              id: crypto.randomUUID(),
              name: item.name,
              price: item.price,
              description: item.description || "",
              categoryId: category?.id || categories[0]?.id || crypto.randomUUID(),
              sort_order: index,
              image_url: item.image_url, // Preserve image URL from JSON
              variants: item.variants.map((variant: any) => ({
                id: crypto.randomUUID(),
                title: variant.title,
                options: variant.options.map((option: any) => ({
                  id: crypto.randomUUID(),
                  name: option.name,
                  price: option.price,
                })),
              })),
              addons: item.addons.map((addon: any) => ({
                id: crypto.randomUUID(),
                name: addon.name,
                price: addon.price,
              })),
            };
          });

          // Update local state
          onCategoriesChange(categories);
          onItemsChange(items);

          // Save to localStorage as draft
          localStorage.setItem('qrunchy_menu_draft', JSON.stringify({
            categories,
            items,
            timestamp: new Date().toISOString()
          }));

          alert("Menu imported successfully! It will be saved when you generate the QR code.");
        }

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
          image_url: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1610&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
          name: "Mozzarella Sticks",
          price: 9.99,
          description: "Golden fried mozzarella with marinara sauce",
          categoryName: "Appetizers",
          image_url: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          variants: [
            {
              title: "Size",
              options: [
                { name: "6 pieces", price: 9.99 },
                { name: "10 pieces", price: 14.99 },
              ],
            },
          ],
          addons: [
            { name: "Extra Marinara", price: 0.5 },
            { name: "Ranch Dip", price: 0.75 },
          ],
        },
        {
          name: "Caesar Salad",
          price: 11.99,
          description: "Fresh romaine lettuce with classic Caesar dressing",
          categoryName: "Appetizers",
          image_url: "https://plus.unsplash.com/premium_photo-1675252369719-dd52bc69c3df?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          variants: [
            {
              title: "Size",
              options: [
                { name: "Regular", price: 11.99 },
                { name: "Large", price: 15.99 },
              ],
            },
          ],
          addons: [
            { name: "Grilled Chicken", price: 4.0 },
            { name: "Extra Parmesan", price: 1.5 },
          ],
        },
        {
          name: "Grilled Salmon",
          price: 24.99,
          description: "Fresh Atlantic salmon with seasonal vegetables",
          categoryName: "Main Course",
          image_url: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1610&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
          name: "Ribeye Steak",
          price: 32.99,
          description: "12oz premium ribeye cooked to perfection",
          categoryName: "Main Course",
          image_url: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          variants: [
            {
              title: "Temperature",
              options: [
                { name: "Rare", price: 0 },
                { name: "Medium Rare", price: 0 },
                { name: "Medium", price: 0 },
                { name: "Well Done", price: 0 },
              ],
            },
          ],
          addons: [
            { name: "Mushroom Sauce", price: 3.5 },
            { name: "Side Salad", price: 4.0 },
          ],
        },
        {
          name: "Chicken Alfredo",
          price: 18.99,
          description: "Creamy alfredo pasta with grilled chicken",
          categoryName: "Main Course",
          image_url: "https://plus.unsplash.com/premium_photo-1675252369719-dd52bc69c3df?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          variants: [
            {
              title: "Pasta Type",
              options: [
                { name: "Fettuccine", price: 0 },
                { name: "Penne", price: 0 },
                { name: "Linguine", price: 1.0 },
              ],
            },
          ],
          addons: [
            { name: "Extra Chicken", price: 5.0 },
            { name: "Garlic Bread", price: 2.5 },
          ],
        },
        {
          name: "Chocolate Cake",
          price: 8.99,
          description: "Rich chocolate cake with vanilla ice cream",
          categoryName: "Desserts",
          image_url: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1610&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          variants: [],
          addons: [{ name: "Extra Ice Cream", price: 2.0 }],
        },
        {
          name: "Cheesecake",
          price: 7.99,
          description: "Classic New York style cheesecake with berry compote",
          categoryName: "Desserts",
          image_url: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          variants: [
            {
              title: "Topping",
              options: [
                { name: "Strawberry", price: 0 },
                { name: "Blueberry", price: 0 },
                { name: "Chocolate Drizzle", price: 1.0 },
              ],
            },
          ],
          addons: [
            { name: "Whipped Cream", price: 1.0 },
          ],
        },
        {
          name: "Fresh Juice",
          price: 4.99,
          description: "Freshly squeezed fruit juice",
          categoryName: "Beverages",
          image_url: "https://plus.unsplash.com/premium_photo-1675252369719-dd52bc69c3df?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
        {
          name: "Specialty Coffee",
          price: 3.99,
          description: "Premium coffee blends and specialty drinks",
          categoryName: "Beverages",
          image_url: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1610&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          variants: [
            {
              title: "Type",
              options: [
                { name: "Espresso", price: 3.99 },
                { name: "Cappuccino", price: 4.99 },
                { name: "Latte", price: 5.49 },
                { name: "Americano", price: 3.99 },
              ],
            },
            {
              title: "Size",
              options: [
                { name: "Small", price: 0 },
                { name: "Medium", price: 0.75 },
                { name: "Large", price: 1.25 },
              ],
            },
          ],
          addons: [
            { name: "Extra Shot", price: 1.0 },
            { name: "Oat Milk", price: 0.5 },
          ],
        },
        {
          name: "Soft Drinks",
          price: 2.99,
          description: "Refreshing carbonated beverages",
          categoryName: "Beverages",
          image_url: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          variants: [
            {
              title: "Flavor",
              options: [
                { name: "Coca Cola", price: 0 },
                { name: "Pepsi", price: 0 },
                { name: "Sprite", price: 0 },
                { name: "Orange Fanta", price: 0 },
              ],
            },
            {
              title: "Size",
              options: [
                { name: "Regular", price: 2.99 },
                { name: "Large", price: 3.99 },
              ],
            },
          ],
          addons: [
            { name: "Extra Ice", price: 0 },
          ],
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
    return menu.items?.filter((item) => item.categoryId === categoryId) || [];
  };

  // Scroll position utilities
  const saveScrollPosition = () => {
    scrollPositionRef.current = {
      top: window.scrollY,
      left: window.scrollX,
    };
  };

  const restoreScrollPosition = () => {
    requestAnimationFrame(() => {
      const { top, left } = scrollPositionRef.current;
      window.scrollTo({ top, left, behavior: 'instant' });
    });
  };

  // Drag event handlers
  const handleDragStart = () => {
    // Save scroll position when drag starts
    saveScrollPosition();
  };

  // Drag end handlers
  const handleCategoryDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // Save scroll position before any state changes
      saveScrollPosition();

      const oldIndex = menu.categories?.findIndex((item) => item.id === active.id) ?? -1;
      const newIndex = menu.categories?.findIndex((item) => item.id === over?.id) ?? -1;

      const reorderedCategories = arrayMove(menu.categories || [], oldIndex, newIndex);
      
      // Update local state immediately for better UX
      onCategoriesChange(reorderedCategories);

      // Restore scroll position after state update
      restoreScrollPosition();

      // Update backend
      if (restaurantId) {
        try {
          await reorderCategoriesMutation.mutateAsync({
            restaurant_id: restaurantId,
            category_orders: reorderedCategories.map((category, index) => ({
              id: parseInt(category.id, 10),
              sort_order: index,
            })),
          });
          // Restore scroll position after backend update too
          restoreScrollPosition();
        } catch (error) {
          console.error("Failed to reorder categories:", error);
          // Revert local state on error
          onCategoriesChange(menu.categories || []);
          restoreScrollPosition();
        }
      }
    }
  };

  const handleItemDragEnd = async (event: DragEndEvent, categoryId: string) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // Save scroll position before any state changes
      saveScrollPosition();

      const categoryItems = getItemsForCategory(categoryId);
      const oldIndex = categoryItems.findIndex((item) => item.id === active.id);
      const newIndex = categoryItems.findIndex((item) => item.id === over?.id);

      const reorderedItems = arrayMove(categoryItems, oldIndex, newIndex);
      
      // Update local state immediately
      const updatedAllItems = (menu.items || []).map((item) => {
        if (item.categoryId === categoryId) {
          const reorderedItem = reorderedItems.find((ri) => ri.id === item.id);
          return reorderedItem || item;
        }
        return item;
      });
      onItemsChange(updatedAllItems);

      // Restore scroll position after state update
      restoreScrollPosition();

      // Update backend
      if (restaurantId) {
        try {
          await reorderItemsMutation.mutateAsync({
            category_id: parseInt(categoryId, 10),
            item_orders: reorderedItems.map((item, index) => ({
              id: parseInt(item.id, 10),
              sort_order: index,
            })),
          });
          // Restore scroll position after backend update too
          restoreScrollPosition();
        } catch (error) {
          console.error("Failed to reorder items:", error);
          // Revert local state on error
          onItemsChange(menu.items || []);
          restoreScrollPosition();
        }
      }
    }
  };

  // Sortable Category Component
  const SortableCategory = ({ category }: { category: Category }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: category.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <Card ref={setNodeRef} style={style} className={isDragging ? "opacity-50" : ""}>
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
                <div className="flex items-center gap-2">
                  <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab hover:bg-gray-100 p-1 rounded"
                  >
                    <GripVertical size={16} className="text-gray-400" />
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={(event) => handleItemDragEnd(event, category.id)}
          >
            <SortableContext
              items={getItemsForCategory(category.id).map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {getItemsForCategory(category.id).map((item) => (
                  <SortableItem key={item.id} item={item} />
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
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    );
  };

  // Sortable Item Component
  const SortableItem = ({ item }: { item: MenuItem }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: item.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <div className="flex items-center gap-2 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:bg-gray-100 p-1 rounded"
          >
            <GripVertical size={14} className="text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="font-medium">
              {item.name || "Untitled Item"}
            </div>
            <div className="text-sm text-gray-500">
              ${item.price.toFixed(2)}
              {item.variants && item.variants.length > 0 && (
                <span className="ml-2 text-blue-500">
                  {item.variants.length} variant
                  {item.variants.length !== 1 ? "s" : ""}
                </span>
              )}
              {item.addons && item.addons.length > 0 && (
                <span className="ml-2 text-green-500">
                  {item.addons.length} addon
                  {item.addons.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
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
    );
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
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold">Build Your Menu</h2>
          <p className="text-gray-600 mt-1">
            Add categories and menu items manually, or upload a complete menu from JSON file.
          </p>
        </div>
        {!restaurantId && (
          <div className="text-right">
            {draftLoaded && (
              <div className="text-sm text-blue-600 mb-1">
                📄 Draft loaded from previous session
              </div>
            )}
            <div className="text-xs text-gray-500">
              Auto-saving draft...
            </div>
          </div>
        )}
      </div>

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
                    !newCategoryName.trim() || (!!restaurantId && createCategoryMutation.isPending)
                  }
                >
                  {(restaurantId && createCategoryMutation.isPending) ? (
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleCategoryDragEnd}
      >
        <SortableContext
          items={menu.categories?.map((category) => category.id) || []}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {menu.categories?.map((category) => (
              <SortableCategory key={category.id} category={category} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {(!menu.categories || menu.categories.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          <p>
            {bulkUploadMode
              ? "Upload a JSON file above to populate your menu automatically"
              : "Start by adding your first category above"}
          </p>
        </div>
      )}

      {/* Item Editor Modal */}
      {showItemEditor && editingItem && (
        <ItemEditor
          item={editingItem}
          categories={menu.categories || []}
          onSave={handleSaveItem}
          onClose={handleCloseItemEditor}
          onImagePersisted={(updatedItem) => {
            // Update local state when image is persisted for existing items
            console.log('🔄 Image persisted, updating local state');
            const existingItemIndex = menu.items?.findIndex(item => item.id === updatedItem.id.toString()) ?? -1;
            if (existingItemIndex >= 0 && menu.items) {
              const updatedItems = [...menu.items];
              updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex], 
                image_url: updatedItem.image_url
              };
              onItemsChange(updatedItems);
            }
          }}
        />
      )}
    </div>
  );
}
