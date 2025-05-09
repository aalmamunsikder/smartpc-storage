import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  HardDrive, 
  Settings, 
  User, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  LifeBuoy,
  MenuIcon,
  ArrowLeftToLine,
  ArrowRightToLine,
  Shield,
  GraduationCap,
  File,
  FileImage,
  FileVideo,
  Music,
  Code,
  Archive,
  FolderPlus,
  ChevronDown,
  Files,
  Folder
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Main navigation items
const navItems = [
  { 
    name: 'Smart Storage', 
    path: '/storage', 
    icon: HardDrive 
  },
  {
    name: 'SmartPC Backup',
    path: '/backup',
    icon: Shield
  },
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: Settings 
  },
  { 
    name: 'Support', 
    path: '/support', 
    icon: LifeBuoy 
  }
];

// Category items
const defaultCategories = [
  { id: 'all', name: 'All Files', icon: Files, color: 'bg-purple-600 text-purple-600' },
  { id: 'folders', name: 'Folders', icon: Folder, color: 'bg-amber-500 text-amber-500' },
  { id: '1', name: 'Documents', icon: File, color: 'bg-blue-500 text-blue-500' },
  { id: '2', name: 'Images', icon: FileImage, color: 'bg-green-500 text-green-500' },
  { id: '3', name: 'Videos', icon: FileVideo, color: 'bg-purple-500 text-purple-500' },
  { id: '4', name: 'Audio', icon: Music, color: 'bg-yellow-500 text-yellow-500' },
  { id: '5', name: 'Code', icon: Code, color: 'bg-red-500 text-red-500' },
  { id: '6', name: 'Archives', icon: Archive, color: 'bg-gray-500 text-gray-500' },
];

interface DashboardSidebarProps {
  activePath?: string;
  onNavigate?: (path: string) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  activePath = '/storage',
  onNavigate
}) => {
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState(defaultCategories);
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(true);
  const [showCreateCategoryDialog, setShowCreateCategoryDialog] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    if (window) {
      window.dispatchEvent(new CustomEvent('sidebarCollapse', { detail: { collapsed: !collapsed } }));
    }
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    console.log('Navigation requested to path:', path);
    
    if (onNavigate) {
      console.log('Using onNavigate prop for navigation');
      onNavigate(path);
    } else {
      console.log('Fallback navigation not supported in Next.js');
    }
    
    setActiveCategory(null);
    setMobileOpen(false);
  };

  const handleCategoryClick = (categoryId: string) => {
    const newSelectedCategory = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newSelectedCategory);
    
    // Dispatch custom event for category selection
    const event = new CustomEvent('categorySelect', {
      detail: { categoryId: newSelectedCategory }
    });
    window.dispatchEvent(event);
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      icon: FolderPlus,
      color: 'bg-indigo-500 text-indigo-500'
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setIsCreateCategoryOpen(false);

    toast({
      title: "Category created",
      description: `"${newCategoryName}" category has been created`
    });
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleMobileSidebar}
          className="h-10 w-10 rounded-full"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 md:relative transition-all duration-300 bg-card border-r border-border",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 px-4 border-b border-border flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center">
                <span className="font-bold gradient-text text-lg">Smart Storage Connect</span>
              </div>
            )}
            
            <div className={cn("flex items-center", collapsed && "w-full justify-center")}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="hidden md:flex hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {collapsed ? 
                  <ArrowRightToLine className="h-5 w-5 transition-transform duration-200" /> : 
                  <ArrowLeftToLine className="h-5 w-5 transition-transform duration-200" />
                }
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileSidebar}
                className="md:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="flex-1 py-6 px-3 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full justify-start gap-2",
                    activePath === item.path 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
                  {!collapsed && <span>{item.name}</span>}
                </Button>
              ))}
            </div>
            
            {/* Categories Section */}
            {!collapsed && (
              <>
                <div className="mt-8 mb-2">
                  <div className="flex items-center justify-between px-3">
                    <h3 className="text-xs uppercase font-semibold text-muted-foreground">Categories</h3>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                      >
                        {categoriesExpanded ? 
                          <ArrowLeftToLine className="h-3 w-3" /> : 
                          <ArrowRightToLine className="h-3 w-3" />
                        }
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-primary"
                        onClick={() => setIsCreateCategoryOpen(true)}
                      >
                        <FolderPlus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {categoriesExpanded && (
                  <div className="space-y-1 pl-2">
                    {categories.map((category) => {
                      const CategoryIcon = category.icon;
                      return (
                        <div
                          key={category.id}
                          onClick={() => handleCategoryClick(category.id)}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-md transition-colors cursor-pointer text-sm",
                            selectedCategory === category.id 
                              ? "bg-primary/10 text-primary" 
                              : `${category.color.split(' ')[1]} hover:bg-muted`
                          )}
                        >
                          <div className={`${category.color.split(' ')[0]} p-1 rounded-md mr-2`}>
                            <CategoryIcon className="h-3 w-3 text-white" />
                          </div>
                          <span>{category.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
            
            {/* Collapsed Categories Section */}
            {collapsed && (
              <div className="mt-8 space-y-3 flex flex-col items-center">
                {categories.slice(0, 6).map((category) => {
                  const CategoryIcon = category.icon;
                  return (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        selectedCategory === category.id && "bg-primary/10 p-1 rounded-md"
                      )}
                    >
                      <div 
                        className={`${category.color.split(' ')[0]} p-1.5 rounded-md`}
                        title={category.name}
                      >
                        <CategoryIcon className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                  );
                })}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 mt-2"
                  onClick={() => setIsCreateCategoryOpen(true)}
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full text-muted-foreground hover:text-destructive flex items-center",
                collapsed && "justify-center px-0"
              )}
            >
              <LogOut className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && <span>Exit</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Create Category Dialog */}
      <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
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
            <Button variant="outline" onClick={() => setIsCreateCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardSidebar; 