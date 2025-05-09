import React, { useState, useEffect } from 'react';
import { 
  File, 
  FileImage, 
  FileVideo, 
  Music, 
  Code, 
  Archive, 
  FolderPlus, 
  Pencil, 
  X,
  MoreHorizontal,
  Files,
  Folder
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  count: number;
  special?: boolean; // Flag for special categories that can't be edited/deleted
}

// Special categories
const specialCategories: Category[] = [
  { id: 'all', name: 'All Files', icon: Files, color: 'bg-purple-600', count: 0, special: true },
  { id: 'folders', name: 'Folders', icon: Folder, color: 'bg-amber-500', count: 0, special: true },
];

// Default user categories
const defaultCategories: Category[] = [
  { id: '1', name: 'Documents', icon: File, color: 'bg-blue-500', count: 28 },
  { id: '2', name: 'Images', icon: FileImage, color: 'bg-green-500', count: 64 },
  { id: '3', name: 'Videos', icon: FileVideo, color: 'bg-purple-500', count: 12 },
  { id: '4', name: 'Audio', icon: Music, color: 'bg-yellow-500', count: 35 },
  { id: '5', name: 'Code', icon: Code, color: 'bg-red-500', count: 15 },
  { id: '6', name: 'Archives', icon: Archive, color: 'bg-gray-500', count: 8 },
];

const CloudStorageCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  // Listen for category count updates
  useEffect(() => {
    const handleCategoryCount = (event: CustomEvent) => {
      if (event.detail && event.detail.counts) {
        setCategoryCounts(event.detail.counts);
      }
    };
    
    window.addEventListener('categoryCount', handleCategoryCount as EventListener);
    
    return () => {
      window.removeEventListener('categoryCount', handleCategoryCount as EventListener);
    };
  }, []);

  // Combine special and user categories with updated counts
  const allCategories = [
    ...specialCategories.map(cat => ({
      ...cat,
      count: categoryCounts[cat.id] || 0
    })),
    ...categories.map(cat => ({
      ...cat,
      count: categoryCounts[cat.id] || cat.count
    }))
  ];

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      icon: FolderPlus,
      color: 'bg-indigo-500',
      count: 0
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setIsCreateOpen(false);

    toast({
      title: "Category created",
      description: `"${newCategoryName}" category has been created`
    });
  };

  const handleEditCategory = () => {
    if (!editingCategory) return;
    
    if (!editingCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    setCategories(categories.map(cat => 
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    
    setIsEditOpen(false);
    setEditingCategory(null);

    toast({
      title: "Category updated",
      description: `Category has been updated successfully`
    });
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    
    toast({
      title: "Category deleted",
      description: "Category has been deleted successfully"
    });
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory({...category});
    setIsEditOpen(true);
  };

  const handleCategoryClick = (categoryId: string) => {
    // Dispatch custom event for category selection
    const event = new CustomEvent('categorySelect', {
      detail: { categoryId }
    });
    window.dispatchEvent(event);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Categories</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={() => setIsCreateOpen(true)}
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allCategories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div
                key={category.id}
                className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className={`${category.color} p-2 rounded-md text-white`}>
                  <CategoryIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{category.name}</p>
                  <p className="text-xs text-muted-foreground">{category.count} files</p>
                </div>
                {!category.special && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEditDialog(category); }}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                        onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id); }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                )}
              </div>
            );
          })}
        </div>

        {/* Create Category Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="category-name" className="block text-sm font-medium mb-2">
                Category Name
              </Label>
              <Input
                id="category-name"
                placeholder="New Category"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCategory}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="edit-category-name" className="block text-sm font-medium mb-2">
                Category Name
              </Label>
              <Input
                id="edit-category-name"
                value={editingCategory?.name || ''}
                onChange={(e) => editingCategory && setEditingCategory({
                  ...editingCategory,
                  name: e.target.value
                })}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCategory}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CloudStorageCategories; 