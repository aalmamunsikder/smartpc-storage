import React, { useState, useEffect, useRef } from 'react';
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
  Folder,
  Home,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

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

// Default folder structure
const defaultFolders = [
  { 
    id: 'documents', 
    name: 'Documents', 
    icon: Folder, 
    color: 'bg-blue-500 text-blue-500',
    parentId: null
  },
  { 
    id: 'images', 
    name: 'Images', 
    icon: Folder, 
    color: 'bg-green-500 text-green-500',
    parentId: null
  },
  { 
    id: 'videos', 
    name: 'Videos', 
    icon: Folder, 
    color: 'bg-purple-500 text-purple-500',
    parentId: null
  },
  { 
    id: 'work', 
    name: 'Work', 
    icon: Folder, 
    color: 'bg-yellow-500 text-yellow-500',
    parentId: 'documents'
  },
  { 
    id: 'personal', 
    name: 'Personal', 
    icon: Folder, 
    color: 'bg-red-500 text-red-500',
    parentId: 'documents'
  },
  { 
    id: 'vacation', 
    name: 'Vacation Photos', 
    icon: Folder, 
    color: 'bg-green-500 text-green-500',
    parentId: 'images'
  }
];

// Category items (for backwards compatibility)
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
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [parentFolderForNew, setParentFolderForNew] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['documents', 'images']);
  const [folders, setFolders] = useState(defaultFolders);
  
  // Add new state for drag and drop functionality
  const [draggedFiles, setDraggedFiles] = useState<any[]>([]);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [dropTargetPulse, setDropTargetPulse] = useState(false);

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

  const handleFolderClick = (folderId: string) => {
    setSelectedFolder(folderId);
    
    // Dispatch custom event for folder navigation
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      const event = new CustomEvent('folderSelect', {
        detail: { folderId, folderName: folder.name }
      });
      window.dispatchEvent(event);
    } else if (folderId === 'root') {
      // Handle the root folder case
      const event = new CustomEvent('folderSelect', {
        detail: { folderId: 'root', folderName: 'Home' }
    });
    window.dispatchEvent(event);
    }
  };

  const toggleFolderExpand = (folderId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId) 
        : [...prev, folderId]
    );
  };

  // Function to check if a folder has children
  const hasChildren = (folderId: string) => {
    return folders.some(folder => folder.parentId === folderId);
  };

  // Get children folders for a parent
  const getChildFolders = (parentId: string | null) => {
    return folders.filter(folder => folder.parentId === parentId);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      icon: Folder,
      color: 'bg-indigo-500 text-indigo-500',
      parentId: parentFolderForNew
    };

    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setIsCreateFolderOpen(false);
    setParentFolderForNew(null);

    toast({
      title: "Folder created",
      description: `"${newFolderName}" folder has been created`
    });

    // Expand the parent folder if it's not already expanded
    if (parentFolderForNew && !expandedFolders.includes(parentFolderForNew)) {
      setExpandedFolders(prev => [...prev, parentFolderForNew]);
    }
  };

  // Add useEffect to listen for file drag events from CloudStorage
  useEffect(() => {
    const handleFilesDragStart = (event: CustomEvent) => {
      if (event.detail && event.detail.files) {
        setDraggedFiles(event.detail.files);
        document.body.classList.add('dragging-files');
      }
    };
    
    const handleFilesDragEnd = () => {
      setDraggedFiles([]);
      setDraggedOver(null);
      document.body.classList.remove('dragging-files');
    };
    
    window.addEventListener('filesDragStart', handleFilesDragStart as EventListener);
    window.addEventListener('filesDragEnd', handleFilesDragEnd as EventListener);
    
    return () => {
      window.removeEventListener('filesDragStart', handleFilesDragStart as EventListener);
      window.removeEventListener('filesDragEnd', handleFilesDragEnd as EventListener);
    };
  }, []);
  
  // Add handlers for folder dropping with improved animations
  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedFiles.length === 0) return;
    
    e.dataTransfer.dropEffect = 'copy';
    
    if (draggedOver !== folderId) {
      setDraggedOver(folderId);
      
      // Start pulsing animation when dragging over a folder
      setDropTargetPulse(true);
    }
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOver(null);
    setDropTargetPulse(false);
  };
  
  const handleDrop = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear the drag state
    setDraggedOver(null);
    setDropTargetPulse(false);
    
    try {
      // Try to get data from dataTransfer
      const jsonData = e.dataTransfer.getData('application/json');
      if (jsonData) {
        const data = JSON.parse(jsonData);
        
        if (data.files && data.files.length > 0) {
          // Create an animation effect for successful drop
          const dropEffect = document.createElement('div');
          dropEffect.className = 'drop-effect';
          dropEffect.style.position = 'fixed';
          dropEffect.style.left = `${e.clientX - 20}px`;
          dropEffect.style.top = `${e.clientY - 20}px`;
          dropEffect.style.width = '40px';
          dropEffect.style.height = '40px';
          dropEffect.style.borderRadius = '50%';
          dropEffect.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
          dropEffect.style.transform = 'scale(0)';
          dropEffect.style.transition = 'all 0.3s ease-out';
          dropEffect.style.zIndex = '9999';
          document.body.appendChild(dropEffect);
          
          // Play the animation
          setTimeout(() => {
            dropEffect.style.transform = 'scale(3)';
            dropEffect.style.opacity = '0';
            
            // Remove after animation completes
            setTimeout(() => {
              document.body.removeChild(dropEffect);
            }, 300);
          }, 10);
          
          // Dispatch event to notify CloudStorage about the drop
          window.dispatchEvent(new CustomEvent('filesDropped', {
            detail: {
              files: data.files,
              targetFolderId: folderId,
              operation: data.operation || 'copy'
            }
          }));
          
          // Expand the target folder
          if (!expandedFolders.includes(folderId) && folderId !== 'root') {
            setExpandedFolders(prev => [...prev, folderId]);
          }
          
          // Show success toast with file count and names
          const fileCount = data.files.length;
          const fileNames = data.files.map((f: any) => f.name).join(', ');
          const displayNames = fileCount > 2 
            ? `${data.files[0].name}, ${data.files[1].name}${fileCount > 2 ? ` and ${fileCount - 2} more` : ''}`
            : fileNames;
            
          const targetFolder = folders.find(f => f.id === folderId) || { name: 'Root' };
          
          toast({
            title: "Files copied",
            description: `${fileCount} file${fileCount > 1 ? 's' : ''} copied to ${targetFolder.name}: ${displayNames}`,
            duration: 3000
          });
        }
      }
    } catch (error) {
      console.error('Error processing drop:', error);
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to process the dropped files",
        variant: "destructive"
      });
    }
  };

  // Update the folder item rendering to include drop functionality with animation
  const renderFolders = (parentId: string | null, level = 0) => {
    const childFolders = getChildFolders(parentId);
    
    if (childFolders.length === 0) {
      return null;
    }
    
    return (
      <div className={`space-y-1 ${level > 0 ? 'pl-4 ml-2 border-l border-border' : ''}`}>
        {childFolders.map((folder) => {
          const hasChildFolders = hasChildren(folder.id);
          const isExpanded = expandedFolders.includes(folder.id);
          const isDropTarget = draggedOver === folder.id;
          
          return (
            <div key={folder.id} className="relative">
              <motion.div
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors cursor-pointer text-sm",
                  selectedFolder === folder.id 
                    ? "bg-primary/10 text-primary" 
                    : isDropTarget
                    ? "bg-secondary text-primary shadow-md" 
                    : `hover:bg-muted ${folder.color.split(' ')[1]}`
                )}
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, folder.id)}
                animate={isDropTarget ? "active" : "inactive"}
                variants={{
                  active: { 
                    scale: 1.05,
                    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                  },
                  inactive: { 
                    scale: 1,
                    boxShadow: "none"
                  }
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {/* Drop indicator pulse animation */}
                {isDropTarget && dropTargetPulse && (
                  <motion.div 
                    className="absolute inset-0 rounded-md bg-primary/10 z-0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ 
                      opacity: [0.5, 0.2, 0.5], 
                      scale: [0.98, 1.02, 0.98] 
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  />
                )}
                <div 
                  className="mr-2 flex items-center z-10"
                  onClick={(e) => hasChildFolders && toggleFolderExpand(folder.id, e)}
                >
                  {hasChildFolders && (
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        isExpanded && "rotate-90"
                      )} 
                    />
                  )}
                  {!hasChildFolders && <div className="w-4" />}
                </div>
                
                <div 
                  className="flex items-center flex-1 z-10"
                  onClick={() => handleFolderClick(folder.id)}
                >
                  <div className={`${folder.color.split(' ')[0]} p-1 rounded-md mr-2`}>
                    <Folder className="h-3 w-3 text-white" />
                  </div>
                  <span>{folder.name}</span>
                </div>
              </motion.div>
              
              {/* Render subfolders if expanded */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderFolders(folder.id, level + 1)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Update the root folder item to also support drop functionality with animation
  const renderRootFolder = () => {
    const isDropTarget = draggedOver === 'root';
    
    return (
      <motion.div
        className={cn(
          "flex items-center px-3 py-2 rounded-md transition-colors cursor-pointer text-sm",
          selectedFolder === null 
            ? "bg-primary/10 text-primary" 
            : isDropTarget
            ? "bg-secondary text-primary shadow-md" 
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
        onClick={() => handleFolderClick('root')}
        onDragOver={(e) => handleDragOver(e, 'root')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 'root')}
        animate={isDropTarget ? "active" : "inactive"}
        variants={{
          active: { 
            scale: 1.05,
            boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
          },
          inactive: { 
            scale: 1,
            boxShadow: "none"
          }
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* Drop indicator pulse animation */}
        {isDropTarget && dropTargetPulse && (
          <motion.div 
            className="absolute inset-0 rounded-md bg-primary/10 z-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: [0.5, 0.2, 0.5], 
              scale: [0.98, 1.02, 0.98] 
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        )}
        <Home className="h-4 w-4 mr-2 z-10" />
        <span className="z-10">Home</span>
      </motion.div>
    );
  };

  // Listen for folder navigation events from CloudStorage
  useEffect(() => {
    const handleExternalFolderSelect = (event: CustomEvent) => {
      if (event.detail && 'folderId' in event.detail) {
        setSelectedFolder(event.detail.folderId);
        
        // Ensure all parent folders in the path are expanded
        const currentFolderId = event.detail.folderId;
        const parentPath: string[] = [];
        
        // Find the folder
        const findFolder = folders.find(f => f.id === currentFolderId);
        if (findFolder && findFolder.parentId) {
          // Build the path of parent IDs
          let parentId: string | null = findFolder.parentId;
          while (parentId) {
            parentPath.push(parentId);
            const parentFolder = folders.find(f => f.id === parentId);
            parentId = parentFolder?.parentId || null;
          }
          
          // Add all parent folders to expanded list
          setExpandedFolders(prev => {
            const newExpanded = [...prev];
            for (const id of parentPath) {
              if (!newExpanded.includes(id)) {
                newExpanded.push(id);
              }
            }
            return newExpanded;
          });
        }
      }
    };
    
    window.addEventListener('folderSelectFromMain', handleExternalFolderSelect as EventListener);
    
    return () => {
      window.removeEventListener('folderSelectFromMain', handleExternalFolderSelect as EventListener);
    };
  }, [folders]);

  // Listen for folder creation events from CloudStorage
  useEffect(() => {
    const handleFolderCreated = (event: CustomEvent) => {
      if (event.detail && 'folderId' in event.detail && 'folderName' in event.detail) {
        const { folderId, folderName, parentId } = event.detail;
        
        // Add new folder to the folders array
        const newFolder = {
          id: folderId,
          name: folderName,
          icon: Folder,
          color: 'bg-indigo-500 text-indigo-500',
          parentId: parentId || null
        };
        
        setFolders(prev => [...prev, newFolder]);
        
        // Expand the parent folder if it exists
        if (parentId && !expandedFolders.includes(parentId)) {
          setExpandedFolders(prev => [...prev, parentId]);
        }
        
        // Select the new folder
        setSelectedFolder(folderId);
      }
    };
    
    window.addEventListener('folderCreated', handleFolderCreated as EventListener);
    
    return () => {
      window.removeEventListener('folderCreated', handleFolderCreated as EventListener);
  };
  }, [expandedFolders]);

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
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          draggedFiles.length > 0 && "drag-highlight"
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
            
            {/* Folders Section */}
            {!collapsed && (
              <>
                <div className="mt-8 mb-2">
                  <div className="flex items-center justify-between px-3">
                    <h3 className="text-xs uppercase font-semibold text-muted-foreground">Folders</h3>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-primary"
                        onClick={() => {
                          setParentFolderForNew(null);
                          setIsCreateFolderOpen(true);
                        }}
                      >
                        <FolderPlus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pl-2">
                  {/* Home/Root button with drop functionality */}
                  {renderRootFolder()}
                  
                  {/* Folder hierarchy with drop functionality */}
                  {renderFolders(null)}
                  
                  <Button
                    variant="ghost" 
                    size="sm"
                    className="mt-2 text-primary w-full justify-start"
                    onClick={() => {
                      setParentFolderForNew(null);
                      setIsCreateFolderOpen(true);
                    }}
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    <span>New Folder</span>
                  </Button>
                  </div>
              </>
            )}
            
            {/* Collapsed Folders Section */}
            {collapsed && (
              <div className="mt-8 space-y-3 flex flex-col items-center">
                {/* Home shortcut with drop functionality */}
                <motion.div
                  onClick={() => handleFolderClick('root')}
                  className={cn(
                    "cursor-pointer transition-colors p-1.5 rounded-md",
                    selectedFolder === null ? "bg-primary/10" : "bg-blue-600",
                    draggedOver === 'root' && "ring-2 ring-primary"
                  )}
                  title="Home"
                  onDragOver={(e) => handleDragOver(e, 'root')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'root')}
                  animate={draggedOver === 'root' ? "active" : "inactive"}
                  variants={{
                    active: { 
                      scale: 1.1,
                      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                    },
                    inactive: { 
                      scale: 1,
                      boxShadow: "none"
                    }
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Home className="h-3.5 w-3.5 text-white" />
                </motion.div>
                
                {/* Top level folders only with drop functionality */}
                {folders
                  .filter(folder => folder.parentId === null)
                  .slice(0, 5)
                  .map((folder) => {
                    const isDropTarget = draggedOver === folder.id;
                    
                  return (
                      <motion.div
                        key={folder.id}
                        onClick={() => handleFolderClick(folder.id)}
                      className={cn(
                        "cursor-pointer transition-colors",
                          selectedFolder === folder.id && "bg-primary/10 p-1 rounded-md",
                          isDropTarget && "ring-2 ring-primary rounded-md"
                        )}
                        onDragOver={(e) => handleDragOver(e, folder.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, folder.id)}
                        animate={isDropTarget ? "active" : "inactive"}
                        variants={{
                          active: { 
                            scale: 1.1,
                            boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                          },
                          inactive: { 
                            scale: 1,
                            boxShadow: "none"
                          }
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <div 
                          className={`${folder.color.split(' ')[0]} p-1.5 rounded-md`}
                          title={folder.name}
                      >
                          <Folder className="h-3.5 w-3.5 text-white" />
                      </div>
                      </motion.div>
                  );
                })}
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 mt-2"
                  onClick={() => {
                    setParentFolderForNew(null);
                    setIsCreateFolderOpen(true);
                  }}
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

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="folder-name" className="block text-sm font-medium mb-2">
                Folder Name
            </Label>
            <Input
                id="folder-name"
                placeholder="New Folder"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full"
            />
            </div>
            
            <div>
              <Label htmlFor="parent-folder" className="block text-sm font-medium mb-2">
                Parent Folder
              </Label>
              <div className="relative">
                <select
                  id="parent-folder"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={parentFolderForNew || ''}
                  onChange={(e) => setParentFolderForNew(e.target.value === '' ? null : e.target.value)}
                >
                  <option value="">Root (Home)</option>
                  {folders.map(folder => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardSidebar; 