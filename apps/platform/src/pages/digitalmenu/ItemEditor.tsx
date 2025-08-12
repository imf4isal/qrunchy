import { useState, useEffect } from "react";
import { X, Plus, Trash2, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  MenuItem,
  Category,
  Variant,
  VariantOption,
  Addon,
} from "@/types/digitalMenu";

interface ItemEditorProps {
  item: MenuItem;
  categories: Category[];
  onSave: (item: MenuItem) => void;
  onClose: () => void;
}

export default function ItemEditor({
  item,
  categories,
  onSave,
  onClose,
}: ItemEditorProps) {
  const [formData, setFormData] = useState<MenuItem>(item);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleBasicInfoChange = (field: keyof MenuItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('Image file must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch('/api/upload/menuitem/single', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const result = await response.json();
      handleBasicInfoChange('image_url', result.file.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    handleBasicInfoChange('image_url', undefined);
  };

  const handleAddVariant = () => {
    const newVariant: Variant = {
      id: crypto.randomUUID(),
      title: "",
      options: [],
    };

    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));
  };

  const handleUpdateVariant = (
    variantId: string,
    field: keyof Variant,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.id === variantId ? { ...variant, [field]: value } : variant
      ),
    }));
  };

  const handleDeleteVariant = (variantId: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((variant) => variant.id !== variantId),
    }));
  };

  const handleAddVariantOption = (variantId: string) => {
    const newOption: VariantOption = {
      id: crypto.randomUUID(),
      name: "",
      price: 0,
    };

    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.id === variantId
          ? { ...variant, options: [...variant.options, newOption] }
          : variant
      ),
    }));
  };

  const handleUpdateVariantOption = (
    variantId: string,
    optionId: string,
    field: keyof VariantOption,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              options: variant.options.map((option) =>
                option.id === optionId ? { ...option, [field]: value } : option
              ),
            }
          : variant
      ),
    }));
  };

  const handleDeleteVariantOption = (variantId: string, optionId: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              options: variant.options.filter(
                (option) => option.id !== optionId
              ),
            }
          : variant
      ),
    }));
  };

  const handleAddAddon = () => {
    const newAddon: Addon = {
      id: crypto.randomUUID(),
      name: "",
      price: 0,
    };

    setFormData((prev) => ({
      ...prev,
      addons: [...prev.addons, newAddon],
    }));
  };

  const handleUpdateAddon = (
    addonId: string,
    field: keyof Addon,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      addons: prev.addons.map((addon) =>
        addon.id === addonId ? { ...addon, [field]: value } : addon
      ),
    }));
  };

  const handleDeleteAddon = (addonId: string) => {
    setFormData((prev) => ({
      ...prev,
      addons: prev.addons.filter((addon) => addon.id !== addonId),
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.name.trim() || formData.price <= 0) {
      alert("Please fill in item name and price");
      return;
    }

    // Validate variants
    for (const variant of formData.variants) {
      if (!variant.title.trim()) {
        alert("Please fill in all variant titles");
        return;
      }
      if (variant.options.length === 0) {
        alert("Each variant must have at least one option");
        return;
      }
      for (const option of variant.options) {
        if (!option.name.trim() || option.price < 0) {
          alert("Please fill in all variant option names and prices");
          return;
        }
      }
    }

    // Validate addons
    for (const addon of formData.addons) {
      if (!addon.name.trim() || addon.price < 0) {
        alert("Please fill in all addon names and prices");
        return;
      }
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">
            {item.name ? `Edit ${item.name}` : "Add New Item"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>

        <div
          className="overflow-y-auto p-6 space-y-6"
          style={{ maxHeight: "calc(90vh - 140px)" }}
        >
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <Input
                  placeholder="Enter item name"
                  value={formData.name}
                  onChange={(e) =>
                    handleBasicInfoChange("name", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) =>
                    handleBasicInfoChange(
                      "price",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter item description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleBasicInfoChange("description", e.target.value)
                  }
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Image (Optional)
                </label>
                <div className="space-y-3">
                  {formData.image_url ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.image_url}
                        alt="Item preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                        onClick={handleRemoveImage}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-3">Upload an image for this item</p>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file);
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer ${
                          uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {uploadingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={16} className="mr-2" />
                            Choose Image
                          </>
                        )}
                      </label>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Supported formats: JPEG, PNG, WebP. Max size: 5MB
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.categoryId}
                  onChange={(e) =>
                    handleBasicInfoChange("categoryId", e.target.value)
                  }
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Variants (Optional)</CardTitle>
                <Button size="sm" onClick={handleAddVariant}>
                  <Plus size={14} />
                  Add Variant
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Add variants like size, spice level, etc. Each variant can have
                multiple options.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.variants.map((variant) => (
                <div key={variant.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Input
                      placeholder="Variant title (e.g., Size, Spice Level)"
                      value={variant.title}
                      onChange={(e) =>
                        handleUpdateVariant(variant.id, "title", e.target.value)
                      }
                      className="flex-1 mr-2"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteVariant(variant.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {variant.options.map((option) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <Input
                          placeholder="Option name (e.g., Small, Medium)"
                          value={option.name}
                          onChange={(e) =>
                            handleUpdateVariantOption(
                              variant.id,
                              option.id,
                              "name",
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Price"
                          value={option.price}
                          onChange={(e) =>
                            handleUpdateVariantOption(
                              variant.id,
                              option.id,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-24"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleDeleteVariantOption(variant.id, option.id)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddVariantOption(variant.id)}
                      className="w-full"
                    >
                      <Plus size={14} />
                      Add Option
                    </Button>
                  </div>
                </div>
              ))}

              {formData.variants.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <p>
                    No variants added yet. Click "Add Variant" to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add-ons */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add-ons (Optional)</CardTitle>
                <Button size="sm" onClick={handleAddAddon}>
                  <Plus size={14} />
                  Add Add-on
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Add optional extras that customers can add to this item.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.addons.map((addon) => (
                <div key={addon.id} className="flex items-center gap-2">
                  <Input
                    placeholder="Add-on name (e.g., Extra Cheese)"
                    value={addon.name}
                    onChange={(e) =>
                      handleUpdateAddon(addon.id, "name", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Price"
                    value={addon.price}
                    onChange={(e) =>
                      handleUpdateAddon(
                        addon.id,
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-24"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteAddon(addon.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}

              {formData.addons.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <p>
                    No add-ons added yet. Click "Add Add-on" to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-end gap-2 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Item</Button>
        </div>
      </div>
    </div>
  );
}
