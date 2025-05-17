import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Folder, 
  Music, 
  Video,
  Upload,
  Download,
  Trash2,
  Share2,
  Star,
  Search,
  Grid,
  List,
  Plus,
  File,
  Image,
  FileVideo2,
  Presentation,
  FileText as FileDocument,
  AudioLines,
  FileCode2,
  HardDrive,
  Tag,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  ArrowUpDown,
  Shield,
  GripVertical,
  ZoomIn,
  FolderOpen,
  Check,
  MoreVertical,
  FolderInput,
  Copy
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ImagePreview from './ImagePreview';
import path from 'path';
// Add import for drag and drop utilities
import { handleFileDragStart, handleMultiDragStart, handleFileDragEnd, DraggableItem } from './DragDropUtils';
import { motion, AnimatePresence } from 'framer-motion';

// No need to redefine Window.electron here
// The type is defined in electron/electron.d.ts

// Define file icon helper functions
const getFileIcon = (fileName: string, type: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  // Document types
  if (extension === 'pdf') return File;
  if (extension === 'doc' || extension === 'docx') return FileDocument;
  if (extension === 'xls' || extension === 'xlsx') return Presentation;
  if (extension === 'ppt' || extension === 'pptx') return Presentation;
  if (extension === 'txt') return FileText;
  
  // Image types
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) return Image;
  
  // Video types
  if (['mp4', 'mov', 'avi', 'webm'].includes(extension || '')) return FileVideo2;
  
  // Audio types
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension || '')) return AudioLines;
  
  // Code types
  if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'py', 'java'].includes(extension || '')) return FileCode2;
  
  // Folder
  if (type === 'folder') return Folder;
  
  // Default
  return FileText;
};

// File categories
const categories = [
  { id: '1', name: 'Documents', color: 'bg-blue-500 text-blue-500' },
  { id: '2', name: 'Images', color: 'bg-green-500 text-green-500' },
  { id: '3', name: 'Videos', color: 'bg-purple-500 text-purple-500' },
  { id: '4', name: 'Audio', color: 'bg-yellow-500 text-yellow-500' },
  { id: '5', name: 'Code', color: 'bg-red-500 text-red-500' },
  { id: '6', name: 'Archives', color: 'bg-gray-500 text-gray-500' },
];

// Mock data for files
const mockFiles = [
  {
    id: '1',
    name: 'Project Presentation.pptx',
    type: 'document',
    size: '5.2 MB',
    modified: '2023-04-10T14:48:00',
    starred: true,
    categoryId: '1',
  },
  {
    id: '2',
    name: 'Product Photos',
    type: 'folder',
    size: '32 files',
    modified: '2023-04-09T10:30:00',
    starred: false,
    categoryId: '2',
  },
  {
    id: '3',
    name: 'Screenshot.png',
    type: 'image',
    size: '1.8 MB',
    modified: '2023-04-08T09:15:00',
    starred: false,
    categoryId: '2',
  },
  {
    id: '4',
    name: 'Financial Report.xlsx',
    type: 'document',
    size: '3.1 MB',
    modified: '2023-04-07T16:20:00',
    starred: true,
    categoryId: '1',
  },
  {
    id: '5',
    name: 'Project Documentation',
    type: 'folder',
    size: '15 files',
    modified: '2023-04-06T11:45:00',
    starred: false,
    categoryId: '1',
  },
  {
    id: '6',
    name: 'App Demo.mp4',
    type: 'video',
    size: '58.2 MB',
    modified: '2023-04-05T13:10:00',
    starred: false,
    categoryId: '3',
  },
  {
    id: '7',
    name: 'Project Theme.mp3',
    type: 'audio',
    size: '3.4 MB',
    modified: '2023-04-04T12:30:00',
    starred: false,
    categoryId: '4',
  },
  {
    id: '8',
    name: 'Source Code.zip',
    type: 'archive',
    size: '12.7 MB',
    modified: '2023-04-03T09:45:00',
    starred: false,
    categoryId: '6',
  },
  {
    id: '9',
    name: 'index.js',
    type: 'code',
    size: '2.1 KB',
    modified: '2023-04-02T14:20:00',
    starred: true,
    categoryId: '5',
  },
];

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface StorageItem {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  starred: boolean;
  categoryId: string | null;
  parentId?: string | null;
}

interface SortableItemProps {
  id: string;
  children: (listeners: ReturnType<typeof useSortable>['listeners']) => React.ReactNode;
}

// Helper function to get size in bytes from formatted size string
const getSizeInBytes = (sizeStr: string): number => {
  const units = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024
  };
  
  const matches = sizeStr.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB)$/i);
  if (!matches) return 0;
  
  const size = parseFloat(matches[1]);
  const unit = matches[2].toUpperCase() as keyof typeof units;
  
  return size * units[unit];
};

// Helper function to convert StorageItem to DraggableItem
const convertToDraggableItem = (item: StorageItem): DraggableItem => {
  // Convert size string to number
  const sizeInBytes = getSizeInBytes(item.size);
  
  return {
    id: item.id,
    name: item.name,
    type: item.type,
    size: sizeInBytes,
    modified: item.modified,
    starred: item.starred,
    categoryId: item.categoryId,
    parentId: item.parentId || null
  };
};

const CloudStorage = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [storageUsed, setStorageUsed] = useState(246); // in GB
  const [storageTotal, setStorageTotal] = useState(500); // in GB
  const [isElectron, setIsElectron] = useState(false);
  const [files, setFiles] = useState<StorageItem[]>(mockFiles);
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isStorageConfigOpen, setIsStorageConfigOpen] = useState(false);
  const [newStorageSize, setNewStorageSize] = useState(storageTotal);
  const [isAssignCategoryOpen, setIsAssignCategoryOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // New state variables for filtering, sorting, and pagination
  const [fileTypeFilter, setFileTypeFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'modified'>('modified');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredAndSortedFiles, setFilteredAndSortedFiles] = useState<StorageItem[]>([]);
  const [paginatedFiles, setPaginatedFiles] = useState<StorageItem[]>([]);

  // New state variables for upload dialog
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [selectedCategoryForUpload, setSelectedCategoryForUpload] = useState<string | null>(null);
  
  // Multi-select state
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [isMoveCopyDialogOpen, setIsMoveCopyDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'move' | 'copy' | null>(null);
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);
  
  // Sync storage state
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [connectedServices, setConnectedServices] = useState<{
    dropbox: boolean;
    googleDrive: boolean;
    iCloud: boolean;
    localMachine: boolean;
  }>({
    dropbox: false,
    googleDrive: false,
    iCloud: false,
    localMachine: false
  });
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSynced, setLastSynced] = useState<{[key: string]: string}>({});
  const router = useRouter();

  // Add new state variables for image preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Add new state variables for animation effects
  const [fileBeingDragged, setFileBeingDragged] = useState<string | null>(null);
  const [dropSuccess, setDropSuccess] = useState<boolean>(false);
  const [dropPosition, setDropPosition] = useState<{x: number, y: number} | null>(null);

  // Add state and refs for drag and drop
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if we're running in Electron
    if (window.electronAPI) {
      setIsElectron(true);
      
      // Load saved storage configuration if available
      window.electronAPI.getStorageConfig()
        .then(config => {
          if (config) {
            setStorageTotal(config.storageSize || 500);
            setNewStorageSize(config.storageSize || 500);
          }
        })
        .catch(err => {
          console.error('Error loading storage config:', err);
        });
    }
    
    // Update file counts for categories
    const updateFileCounts = () => {
      const folderCount = files.filter(file => file.type === 'folder').length;
      
      // Dispatch event to update category counts
      const categoryCounts: Record<string, number> = {
        all: files.length,
        folders: folderCount
      };
      
      // Count files in each category
      files.forEach(file => {
        if (file.categoryId) {
          categoryCounts[file.categoryId] = (categoryCounts[file.categoryId] || 0) + 1;
        }
      });
      
      // Dispatch the category counts event
      const event = new CustomEvent('categoryCount', {
        detail: { counts: categoryCounts }
      });
      window.dispatchEvent(event);
    };
    
    updateFileCounts();
    
    // Listen for category selection events from the sidebar
    const handleCategorySelect = (event: CustomEvent) => {
      if (event.detail && 'categoryId' in event.detail) {
        console.log('Category selected:', event.detail.categoryId);
        setActiveCategoryId(event.detail.categoryId);
        setActiveTab('all'); // Reset to all files when filtering by category
      }
    };
    
    window.addEventListener('categorySelect', handleCategorySelect as EventListener);
    
    return () => {
      window.removeEventListener('categorySelect', handleCategorySelect as EventListener);
    };
  }, [files]);
  
  const handleUpload = () => {
    setIsUploadDialogOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setUploadFiles(fileArray);
      
      // Initialize progress for each file
      const progressObj: {[key: string]: number} = {};
      fileArray.forEach(file => {
        progressObj[file.name] = 0;
      });
      setUploadProgress(progressObj);
    }
  };

  const handleStartUpload = () => {
    if (uploadFiles.length === 0) return;
    
    // Simulate upload progress for each file
    uploadFiles.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // After upload completes, add file to the list
          setTimeout(() => {
            const newFile: StorageItem = {
              id: Date.now().toString() + file.name,
              name: file.name,
              type: getFileType(file.name),
              size: formatFileSize(file.size),
              modified: new Date().toISOString(),
              starred: false,
              categoryId: selectedCategoryForUpload,
            };
            
            setFiles(prev => [newFile, ...prev]);
            
            // Remove file from upload list when complete
            setUploadProgress(prev => {
              const newProgress = {...prev};
              delete newProgress[file.name];
              return newProgress;
            });
            
            setUploadFiles(prev => prev.filter(f => f.name !== file.name));
            
            // Show success toast
    toast({
              title: "Upload complete",
              description: `${file.name} has been uploaded successfully`
            });
            
            // Close dialog if all files are uploaded
            if (uploadFiles.length === 1) {
              setIsUploadDialogOpen(false);
              setSelectedCategoryForUpload(null);
            }
          }, 500);
        }
        
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: progress
        }));
      }, 300);
    });
  };

  const handleCancelUpload = (fileName: string) => {
    setUploadFiles(prev => prev.filter(file => file.name !== fileName));
    setUploadProgress(prev => {
      const newProgress = {...prev};
      delete newProgress[fileName];
      return newProgress;
    });
    
    toast({
      title: "Upload cancelled",
      description: `${fileName} upload has been cancelled`
    });
  };

  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['doc', 'docx', 'pdf', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension || '')) 
      return 'document';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) 
      return 'image';
    if (['mp4', 'mov', 'avi', 'webm'].includes(extension || '')) 
      return 'video';
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension || '')) 
      return 'audio';
    if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'py', 'java'].includes(extension || '')) 
      return 'code';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) 
      return 'archive';
    
    return 'document'; // Default type
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const handleDownload = (fileName: string) => {
    toast({
      title: "Download initiated",
      description: `Downloading ${fileName}`
    });
  };

  const handleDelete = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
    toast({
      title: "File deleted",
      description: "The file has been moved to trash"
    });
  };

  const handleStar = (fileId: string) => {
    setFiles(files.map(file => 
      file.id === fileId ? { ...file, starred: !file.starred } : file
    ));
    
    const file = files.find(f => f.id === fileId);
    const action = file?.starred ? "removed from" : "added to";
    
    toast({
      title: `File ${action} favorites`,
      description: `The file has been ${action} your favorites`
    });
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
    
    const newFolder: StorageItem = {
      id: Date.now().toString(),
      name: newFolderName,
      type: 'folder',
      size: '0 files',
      modified: new Date().toISOString(),
      starred: false,
      categoryId: null,
      parentId: currentFolderId // Add the current folder as parent
    };
    
    setFiles([newFolder, ...files]);
    setNewFolderName('');
    setIsCreateFolderOpen(false);
    
    // Update the folder count
    if (currentFolderId) {
      const parentFolder = files.find(f => f.id === currentFolderId);
      if (parentFolder && parentFolder.type === 'folder') {
        // Extract the number from "X files"
        const countMatch = parentFolder.size.match(/^(\d+)/);
        const currentCount = countMatch ? parseInt(countMatch[1]) : 0;
        const newCount = currentCount + 1;
        
        // Update the parent folder's file count
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === currentFolderId 
              ? { ...f, size: `${newCount} files` } 
              : f
          )
        );
      }
    }
    
    toast({
      title: "Folder created",
      description: `'${newFolderName}' has been created successfully`
    });
    
    // Notify the sidebar about the new folder
    const customEvent = new CustomEvent('folderCreated', {
      detail: { folderId: newFolder.id, folderName: newFolder.name, parentId: currentFolderId }
    });
    window.dispatchEvent(customEvent);
  };

  const handleUpdateStorageSize = () => {
    if (isElectron && window.electronAPI) {
      window.electronAPI.saveStorageConfig({ storageSize: newStorageSize })
        .then(response => {
          if (response.success) {
            setStorageTotal(newStorageSize);
            setIsStorageConfigOpen(false);
            toast({
              title: "Storage updated",
              description: `Storage size has been set to ${newStorageSize} GB`
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to update storage configuration",
              variant: "destructive"
            });
          }
        })
        .catch(err => {
          console.error('Error saving storage config:', err);
          toast({
            title: "Error",
            description: "Failed to update storage configuration",
            variant: "destructive"
          });
        });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setActiveCategoryId(null); // Reset category filter when changing tabs
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategoryId(categoryId === activeCategoryId ? null : categoryId);
    setActiveTab('all'); // Reset to all files when filtering by category
  };

  const openAssignCategoryDialog = (fileId: string) => {
    setSelectedFileId(fileId);
    const file = files.find(f => f.id === fileId);
    setSelectedCategoryId(file?.categoryId || null);
    setIsAssignCategoryOpen(true);
  };

  const handleAssignCategory = () => {
    if (!selectedFileId) return;
    
    setFiles(files.map(file => 
      file.id === selectedFileId ? { ...file, categoryId: selectedCategoryId } : file
    ));
    
    const categoryName = selectedCategoryId 
      ? categories.find(c => c.id === selectedCategoryId)?.name 
      : 'No Category';
    
    toast({
      title: "Category assigned",
      description: `File has been assigned to ${categoryName}`
    });
    
    setIsAssignCategoryOpen(false);
  };

  // Filter, sort, and prepare files
  useEffect(() => {
    // Step 1: Apply filters based on activeTab and activeCategoryId
    let filtered = [...files];
    
    console.log('Filtering by activeTab:', activeTab, 'activeCategoryId:', activeCategoryId);
  
    // Apply tab filter
  if (activeTab === 'starred') {
      filtered = filtered.filter(file => file.starred);
  } else if (activeTab === 'recent') {
      // Sort by modified date and get the 10 most recent
      const sorted = [...filtered].sort((a, b) => 
        new Date(b.modified).getTime() - new Date(a.modified).getTime()
      );
      filtered = sorted.slice(0, 10);
    }
    
    // Apply category filter if a category is selected
    if (activeCategoryId) {
      if (activeCategoryId === 'all') {
        // 'all' means show all files, so don't filter
        // filtered = filtered (no change)
      } else if (activeCategoryId === 'folders') {
        // Filter only folders
        filtered = filtered.filter(file => file.type === 'folder');
      } else {
        // Normal category filtering
      filtered = filtered.filter(file => file.categoryId === activeCategoryId);
      }
    }
    
    // Apply file type filter if any are selected
    if (fileTypeFilter.length > 0) {
      filtered = filtered.filter(file => 
        fileTypeFilter.includes(file.type.toLowerCase())
      );
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(query)
      );
    }
    
    // Step 2: Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'size') {
        // Extract the file size in MB or KB and convert to number
        const getSizeInBytes = (sizeStr: string) => {
          const match = sizeStr.match(/(\d+(\.\d+)?)\s*(KB|MB|GB)/i);
          if (!match) return 0;
          
          const value = parseFloat(match[1]);
          const unit = match[3].toUpperCase();
          
          switch (unit) {
            case 'KB': return value * 1024;
            case 'MB': return value * 1024 * 1024;
            case 'GB': return value * 1024 * 1024 * 1024;
            default: return value;
          }
        };
        
        // Check if both items are folders (size might be in format "X files")
        if (a.type === 'folder' && b.type === 'folder') {
          // Compare number of files if both are folders
          const aCount = parseInt(a.size.split(' ')[0]) || 0;
          const bCount = parseInt(b.size.split(' ')[0]) || 0;
          return sortOrder === 'asc' ? aCount - bCount : bCount - aCount;
        } else if (a.type === 'folder') {
          return sortOrder === 'asc' ? -1 : 1; // Folders first or last
        } else if (b.type === 'folder') {
          return sortOrder === 'asc' ? 1 : -1; // Folders first or last
        } else {
          const aSize = getSizeInBytes(a.size);
          const bSize = getSizeInBytes(b.size);
          return sortOrder === 'asc' ? aSize - bSize : bSize - aSize;
        }
      } else { // modified
        return sortOrder === 'asc' 
          ? new Date(a.modified).getTime() - new Date(b.modified).getTime()
          : new Date(b.modified).getTime() - new Date(a.modified).getTime();
      }
    });
    
    // Update filtered and sorted files
    setFilteredAndSortedFiles(sorted);
    
    // Step 3: Calculate total pages
    const totalPagesCount = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
    setTotalPages(totalPagesCount);
    
    // Reset current page if it's out of bounds after filtering
    if (currentPage > totalPagesCount) {
      setCurrentPage(1);
    }
  }, [files, activeTab, activeCategoryId, fileTypeFilter, searchQuery, sortBy, sortOrder, itemsPerPage]);
  
  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedFiles(filteredAndSortedFiles.slice(startIndex, endIndex));
  }, [filteredAndSortedFiles, currentPage, itemsPerPage]);

  const usedPercentage = (storageUsed / storageTotal) * 100;
  
  // Calculate category stats
  const categoryStats = categories.map(category => {
    const categoryFiles = files.filter(file => file.categoryId === category.id);
    const count = categoryFiles.length;
    return { ...category, count };
  });
  
  // Handle item selection
  const toggleItemSelection = (itemId: string, e?: React.MouseEvent) => {
    // If control/command key is pressed, add to selection
    if (e && (e.ctrlKey || e.metaKey)) {
      setSelectedItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId) 
          : [...prev, itemId]
      );
      
      // Enter selection mode if not already
      if (!selectionMode) {
        setSelectionMode(true);
      }
      return;
    }
    
    // If we're in selection mode
    if (selectionMode) {
      setSelectedItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId) 
          : [...prev, itemId]
      );
    } else {
      // Regular click behavior (if needed)
      // For example: navigate to folder, preview file, etc.
    }
  };
  
  const toggleSelectionMode = () => {
    setSelectionMode(prev => !prev);
    if (!selectionMode) {
      // Entering selection mode
      setSelectedItems([]);
    }
  };
  
  const selectAll = () => {
    if (selectedItems.length === paginatedFiles.length) {
      // If all are selected, deselect all
      setSelectedItems([]);
    } else {
      // Select all visible items
      setSelectedItems(paginatedFiles.map(file => file.id));
    }
  };
  
  // Batch operations
  const handleBatchDelete = () => {
    if (selectedItems.length === 0) return;
    
    setFiles(files.filter(file => !selectedItems.includes(file.id)));
    
    toast({
      title: "Items deleted",
      description: `${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} moved to trash`
    });
    
    setSelectedItems([]);
    setSelectionMode(false);
  };
  
  const handleOpenMoveCopyDialog = (action: 'move' | 'copy') => {
    if (selectedItems.length === 0) return;
    
    setActionType(action);
    setIsMoveCopyDialogOpen(true);
    setTargetFolderId(null);
  };
  
  const handleMoveCopyItems = () => {
    if (!targetFolderId || !actionType || selectedItems.length === 0) return;
    
    const targetFolder = files.find(f => f.id === targetFolderId);
    if (!targetFolder || targetFolder.type !== 'folder') return;
    
    if (actionType === 'move') {
      // Move items to folder
      setFiles(prevFiles => {
        const updatedFiles = prevFiles.map(file => {
          if (selectedItems.includes(file.id)) {
            return {
              ...file,
              parentId: targetFolderId
            };
          }
          return file;
        });
      
      toast({
        title: "Items moved",
        description: `${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} moved to ${targetFolder.name}`
        });

        // Update folder's file count
        const movedFiles = updatedFiles.filter(file => file.parentId === targetFolderId);
        const folderIndex = updatedFiles.findIndex(f => f.id === targetFolderId);
        if (folderIndex !== -1) {
          updatedFiles[folderIndex] = {
            ...updatedFiles[folderIndex],
            size: `${movedFiles.length} files`
          };
        }

        return updatedFiles;
      });
    } else {
      // Copy items
      setFiles(prevFiles => {
        const newItems: StorageItem[] = selectedItems.map(itemId => {
          const originalFile = prevFiles.find(f => f.id === itemId);
          if (!originalFile) return null as unknown as StorageItem;

          return {
            ...originalFile,
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            name: `Copy of ${originalFile.name}`,
            modified: new Date().toISOString(),
            parentId: targetFolderId
          };
        }).filter((item): item is StorageItem => item !== null);

        const updatedFiles = [...prevFiles];
        
        // Update folder's file count
        const folderIndex = updatedFiles.findIndex(f => f.id === targetFolderId);
        if (folderIndex !== -1) {
          const filesInFolder = updatedFiles.filter(file => file.parentId === targetFolderId).length + newItems.length;
          updatedFiles[folderIndex] = {
            ...updatedFiles[folderIndex],
            size: `${filesInFolder} files`
          };
        }
      
      toast({
        title: "Items copied",
        description: `${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} copied to ${targetFolder.name}`
        });

        return [...updatedFiles, ...newItems];
      });
    }
    
    setSelectedItems([]);
    setSelectionMode(false);
    setIsMoveCopyDialogOpen(false);
    setTargetFolderId(null);
    setActionType(null);
  };

  const handleOpenSyncDialog = () => {
    setIsSyncDialogOpen(true);
  };
  
  const handleConnectService = (service: keyof typeof connectedServices) => {
    // In a real app, this would open OAuth flow or file picker
    
    // Simulate connection process
    setSyncInProgress(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSyncInProgress(false);
          
          // Update connected status
          setConnectedServices(prev => ({
            ...prev,
            [service]: true
          }));
          
          // Update last synced time
          setLastSynced(prev => ({
            ...prev,
            [service]: new Date().toISOString()
          }));
          
          // Show success toast
          toast({
            title: "Connected successfully",
            description: `Your ${getServiceName(service)} account is now connected.`
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  const handleDisconnectService = (service: keyof typeof connectedServices) => {
    setConnectedServices(prev => ({
      ...prev,
      [service]: false
    }));
    
    // Remove last synced time
    setLastSynced(prev => {
      const updated = {...prev};
      delete updated[service];
      return updated;
    });
    
    toast({
      title: "Disconnected",
      description: `Your ${getServiceName(service)} account has been disconnected.`
    });
  };
  
  const handleSyncService = (service: keyof typeof connectedServices) => {
    if (!connectedServices[service]) return;
    
    // Simulate sync process
    setSyncInProgress(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSyncInProgress(false);
          
          // Update last synced time
          setLastSynced(prev => ({
            ...prev,
            [service]: new Date().toISOString()
          }));
          
          // In a real app, this would fetch and merge files
          // For demo, add some mock files from the service
          const newFiles: StorageItem[] = [];
          for (let i = 1; i <= 3; i++) {
            const fileType = ['document', 'image', 'video'][Math.floor(Math.random() * 3)];
            newFiles.push({
              id: Date.now().toString() + i,
              name: `${getServiceName(service)} File ${i}`,
              type: fileType,
              size: `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 9)}${fileType === 'video' ? ' MB' : ' KB'}`,
              modified: new Date().toISOString(),
              starred: false,
              categoryId: null,
              parentId: null
            });
          }
          
          setFiles(prev => [...newFiles, ...prev]);
          
          // Show success toast
          toast({
            title: "Sync completed",
            description: `Successfully synced files from ${getServiceName(service)}.`
          });
          
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  const getServiceName = (service: string): string => {
    switch(service) {
      case 'dropbox': return 'Dropbox';
      case 'googleDrive': return 'Google Drive';
      case 'iCloud': return 'iCloud';
      case 'localMachine': return 'Local Machine';
      default: return service;
    }
  };
  
  const formatLastSynced = (timestamp: string): string => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to handle dragging items within the list (using DndKit)
  const handleSortDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        toast({
          title: "Item moved",
          description: `${items[oldIndex].name} has been moved successfully.`
        });
        
        return newItems;
      });
    }
  };

  // Create wrappers for drag handlers to simplify component code
  const handleItemDragStart = (e: React.DragEvent<HTMLElement>, file: StorageItem) => {
    const draggableItem = convertToDraggableItem(file);
    handleFileDragStart(e, draggableItem);
  };
  
  const handleItemsMultiDragStart = (e: React.DragEvent<HTMLElement>) => {
    const selectedFiles = files.filter(file => selectedItems.includes(file.id));
    const draggableItems = selectedFiles.map(convertToDraggableItem);
    handleMultiDragStart(e, draggableItems);
  };
  
  const handleItemDragEnd = (e: React.DragEvent<HTMLElement>) => {
    handleFileDragEnd(e, dragTimeoutRef);
  };

  // Add storage configuration update function
  const handleStorageConfigUpdate = async () => {
    try {
      // Update storage configuration
      const updatedConfig = {
        totalSpace: storageTotal,
        usedSpace: storageUsed,
        files: files.length,
        folders: files.filter(f => f.type === 'folder').length
      };

      // You can add API call here to update the configuration
      console.log('Storage configuration updated:', updatedConfig);
        
        toast({
        title: "Storage updated",
        description: "Storage configuration has been updated successfully."
        });
    } catch (error) {
      console.error('Error updating storage configuration:', error);
      toast({
        title: "Update failed",
        description: "Failed to update storage configuration.",
        variant: "destructive"
      });
    }
  };

  // Add a function to get files for current view
  const getCurrentViewFiles = () => {
    // Filter files based on current folder
    if (currentFolderId) {
      return files.filter(file => file.parentId === currentFolderId);
    } else {
      // Root folder - show only files with no parent or parentId === 'root'
      return files.filter(file => !file.parentId || file.parentId === 'root');
    }
  };

  // Add state for current folder navigation
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<{id: string, name: string}[]>([]);

  // Add folder navigation functions
  const handleFolderClick = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setFolderPath(prev => [...prev, { id: folderId, name: folderName }]);
    
    // Notify the sidebar about folder navigation
    const customEvent = new CustomEvent('folderSelectFromMain', {
      detail: { folderId, folderName }
    });
    window.dispatchEvent(customEvent);
  };

  const handleFolderBack = () => {
    if (folderPath.length > 0) {
      const newPath = folderPath.slice(0, -1);
      setFolderPath(newPath);
      setCurrentFolderId(newPath.length > 0 ? newPath[newPath.length - 1].id : null);
    }
  };

  // Update the file list to use getCurrentViewFiles
  useEffect(() => {
    // Step 1: Apply filters based on activeTab and activeCategoryId
    let filtered = getCurrentViewFiles();
    
    console.log('Filtering by activeTab:', activeTab, 'activeCategoryId:', activeCategoryId);
  
    // Apply tab filter
  if (activeTab === 'starred') {
      filtered = filtered.filter(file => file.starred);
  } else if (activeTab === 'recent') {
      // Sort by modified date and get the 10 most recent
      const sorted = [...filtered].sort((a, b) => 
        new Date(b.modified).getTime() - new Date(a.modified).getTime()
      );
      filtered = sorted.slice(0, 10);
    }
    
    // Apply category filter if a category is selected
    if (activeCategoryId) {
      if (activeCategoryId === 'all') {
        // 'all' means show all files, so don't filter
        // filtered = filtered (no change)
      } else if (activeCategoryId === 'folders') {
        // Filter only folders
        filtered = filtered.filter(file => file.type === 'folder');
      } else {
        // Normal category filtering
      filtered = filtered.filter(file => file.categoryId === activeCategoryId);
      }
    }
    
    // Apply file type filter if any are selected
    if (fileTypeFilter.length > 0) {
      filtered = filtered.filter(file => 
        fileTypeFilter.includes(file.type.toLowerCase())
      );
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(query)
      );
    }
    
    // Step 2: Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'size') {
        // Extract the file size in MB or KB and convert to number
        const getSizeInBytes = (sizeStr: string) => {
          const match = sizeStr.match(/(\d+(\.\d+)?)\s*(KB|MB|GB)/i);
          if (!match) return 0;
          
          const value = parseFloat(match[1]);
          const unit = match[3].toUpperCase();
          
          switch (unit) {
            case 'KB': return value * 1024;
            case 'MB': return value * 1024 * 1024;
            case 'GB': return value * 1024 * 1024 * 1024;
            default: return value;
          }
        };
        
        // Check if both items are folders (size might be in format "X files")
        if (a.type === 'folder' && b.type === 'folder') {
          // Compare number of files if both are folders
          const aCount = parseInt(a.size.split(' ')[0]) || 0;
          const bCount = parseInt(b.size.split(' ')[0]) || 0;
          return sortOrder === 'asc' ? aCount - bCount : bCount - aCount;
        } else if (a.type === 'folder') {
          return sortOrder === 'asc' ? -1 : 1; // Folders first or last
        } else if (b.type === 'folder') {
          return sortOrder === 'asc' ? 1 : -1; // Folders first or last
        } else {
          const aSize = getSizeInBytes(a.size);
          const bSize = getSizeInBytes(b.size);
          return sortOrder === 'asc' ? aSize - bSize : bSize - aSize;
        }
      } else { // modified
        return sortOrder === 'asc' 
          ? new Date(a.modified).getTime() - new Date(b.modified).getTime()
          : new Date(b.modified).getTime() - new Date(a.modified).getTime();
      }
    });
    
    // Update filtered and sorted files
    setFilteredAndSortedFiles(sorted);
    
    // Step 3: Calculate total pages
    const totalPagesCount = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
    setTotalPages(totalPagesCount);
    
    // Reset current page if it's out of bounds after filtering
    if (currentPage > totalPagesCount) {
      setCurrentPage(1);
    }
  }, [files, activeTab, activeCategoryId, fileTypeFilter, searchQuery, sortBy, sortOrder, itemsPerPage, currentFolderId]);
  
  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedFiles(filteredAndSortedFiles.slice(startIndex, endIndex));
  }, [filteredAndSortedFiles, currentPage, itemsPerPage]);

  // Add folder path breadcrumb component
  const FolderBreadcrumb = () => {
    if (folderPath.length === 0) return null;

    return (
      <div className="flex items-center space-x-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setCurrentFolderId(null);
            setFolderPath([]);
          }}
        >
          Home
        </Button>
        {folderPath.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newPath = folderPath.slice(0, index + 1);
                setFolderPath(newPath);
                setCurrentFolderId(folder.id);
              }}
            >
              {folder.name}
            </Button>
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  // Add a function to check if a file is an image
  const isImageFile = (fileName: string): boolean => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '');
  };
  
  // Add a function to handle image preview
  const handleImagePreview = async (file: StorageItem) => {
    if (!isImageFile(file.name)) return;
    
    let imageUrl = '';
    
    // Check if running in Electron
    if (typeof window !== 'undefined' && window.electron) {
      try {
        // For demo purposes, we'll assume files are stored in a mock location
        // In a real app, you would have the actual file paths stored in your database
        const mockFilePath = `/tmp/smartpc/${file.id}/${file.name}`;
        
        // In a real implementation, you would:
        // 1. Get the actual file path from your storage system
        // 2. Load the image file using the Electron API
        
        // For now, we'll simulate with placeholder images
        // In a real app, replace this with actual file loading:
        // const result = await window.electron.loadImageFile(actualFilePath);
        // if (result.success) {
        //   imageUrl = result.dataUrl;
        // }
        
        // For demo purposes, use a placeholder
        imageUrl = `https://picsum.photos/seed/${file.id}/800/600`;
      } catch (error) {
        console.error('Error loading image:', error);
        // Fall back to placeholder
        imageUrl = `https://picsum.photos/seed/${file.name}/800/600`;
      }
    } else {
      // For web version, use placeholder
      imageUrl = `https://picsum.photos/seed/${file.name}/800/600`;
    }
    
    setPreviewFileName(file.name);
    setPreviewImage(imageUrl);
    setIsPreviewOpen(true);
  };
  
  // Add a function to handle selecting a local image file
  const handleSelectLocalImage = async () => {
    if (typeof window !== 'undefined' && window.electron) {
      try {
        // Open file dialog to select an image
        const result = await window.electron.selectFile({
          title: 'Select Image File',
          filters: [
            { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }
          ],
          properties: ['openFile']
        });
        
        if (result.success && result.filePath) {
          // Load the selected image
          const imageResult = await window.electron.loadImageFile(result.filePath);
          
          if (imageResult.success && imageResult.dataUrl) {
            setPreviewFileName(imageResult.fileName || path.basename(result.filePath));
            setPreviewImage(imageResult.dataUrl);
            setIsPreviewOpen(true);
          } else {
            // Show error toast
            toast({
              title: 'Error Loading Image',
              description: imageResult.error || 'Failed to load the selected image.',
              variant: 'destructive'
            });
          }
        }
      } catch (error) {
        console.error('Error selecting image:', error);
        toast({
          title: 'Error',
          description: 'Failed to select or load the image.',
          variant: 'destructive'
        });
      }
    }
  };
  
  // Listen for folder select events from the sidebar
  useEffect(() => {
    const handleFolderSelect = (event: CustomEvent) => {
      if (event.detail && 'folderId' in event.detail) {
        const folderId = event.detail.folderId as string;
        const folderName = 'folderName' in event.detail ? event.detail.folderName as string : '';
        
        if (folderId === 'root') {
          // Reset to root folder
          setCurrentFolderId(null);
          setFolderPath([]);
        } else {
          // First check if this folder exists in our files
          const folderExists = files.some(file => 
            file.type === 'folder' && file.id === folderId
          );
          
          if (folderExists) {
            setCurrentFolderId(folderId);
            
            // Find the folder path
            // This is a simplified approach - in a real app with deep nesting,
            // you would need a more robust solution to build the full path
            const selectedFolder = files.find(f => f.id === folderId);
            
            // Build path based on parentId relationships
            const buildPath = (fId: string): {id: string, name: string}[] => {
              const folder = files.find(f => f.id === fId);
              if (!folder) return [];
              
              if (folder.parentId) {
                const parentPath = buildPath(folder.parentId);
                return [...parentPath, { id: folder.id, name: folder.name }];
              }
              
              return [{ id: folder.id, name: folder.name }];
            };
            
            if (selectedFolder) {
              const newPath = buildPath(folderId);
              setFolderPath(newPath);
            }
          }
        }
        
        // Dispatch event to update sidebar if navigation happened from main view
        const customEvent = new CustomEvent('folderSelectFromMain', {
          detail: { folderId }
        });
        window.dispatchEvent(customEvent);
      }
    };
    
    window.addEventListener('folderSelect', handleFolderSelect as EventListener);
    
    return () => {
      window.removeEventListener('folderSelect', handleFolderSelect as EventListener);
    };
  }, [files]);
  
  // Update the file list render in list view to include drag attributes
  const renderListViewItem = (file: StorageItem) => {
    const FileIcon = getFileIcon(file.name, file.type);
    const category = categories.find(c => c.id === file.categoryId);
    const isSelected = selectedItems.includes(file.id);
    const isImage = isImageFile(file.name);
    
    return (
      <TableRow key={file.id}>
        {selectionMode && (
          <TableCell>
            <input 
              type="checkbox" 
              checked={isSelected}
              onChange={() => toggleItemSelection(file.id)} 
              onClick={(e) => e.stopPropagation()}
              className="h-4 w-4"
            />
          </TableCell>
        )}
        <TableCell 
          className="font-medium" 
          onClick={() => {
            if (file.type === 'folder') {
              handleFolderClick(file.id, file.name);
            } else if (isImage) {
              handleImagePreview(file);
            }
          }}
          draggable={file.type !== 'folder'}
          onDragStart={(e) => handleItemDragStart(e, file)}
          onDragEnd={handleItemDragEnd}
        >
          <div className={`flex items-center ${file.type !== 'folder' && isImage ? 'cursor-pointer hover:text-primary' : file.type === 'folder' ? 'cursor-pointer' : ''}`}>
            {isImage ? (
              <div className="relative mr-2 w-8 h-8 rounded overflow-hidden flex-shrink-0 group">
                <img 
                  src={`https://picsum.photos/seed/${file.id}/32/32`} 
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('.fallback-icon')?.removeAttribute('style');
                  }}
                />
                {/* Preview indicator on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                  <ZoomIn className="text-white h-3 w-3" />
                </div>
                <div className="fallback-icon absolute inset-0 flex items-center justify-center" style={{display: 'none'}}>
                  <FileIcon className="h-5 w-5 text-primary" />
                </div>
              </div>
            ) : (
              <FileIcon className="h-5 w-5 mr-2 text-primary" />
            )}
            <span>{file.name}</span>
            {file.starred && <Star className="h-3 w-3 ml-2 text-yellow-400 fill-yellow-400" />}
          </div>
        </TableCell>
        <TableCell>
          {category ? (
            <Badge variant="outline" className={category.color.split(' ')[1]}>
              {category.name}
            </Badge>
          ) : (
            <span className="text-muted-foreground text-xs">Uncategorized</span>
          )}
        </TableCell>
        <TableCell>{file.size}</TableCell>
        <TableCell>{formatDate(file.modified)}</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Tag className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openAssignCategoryDialog(file.id)}>
                  Assign Category
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDownload(file.name)}
              className="h-7 w-7"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleStar(file.id)}
              className="h-7 w-7"
            >
              <Star className={`h-4 w-4 ${file.starred ? 'text-yellow-400 fill-yellow-400' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(file.id)}
              className="h-7 w-7 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };
  
  // Update the grid view card rendering to include drag attributes
  const renderGridViewItem = (file: StorageItem) => {
    const FileIcon = getFileIcon(file.name, file.type);
    const category = categories.find(c => c.id === file.categoryId);
    const isSelected = selectedItems.includes(file.id);
    const isImage = isImageFile(file.name);
    
    return (
      <Card 
        className={cn(
          "overflow-hidden relative",
          isSelected && "ring-2 ring-primary"
        )}
        onClick={(e) => {
          if (file.type === 'folder') {
            handleFolderClick(file.id, file.name);
          } else if (selectionMode) {
            toggleItemSelection(file.id, e);
          } else if (isImage) {
            handleImagePreview(file);
          }
        }}
        draggable={file.type !== 'folder'}
        onDragStart={(e) => handleItemDragStart(e, file)}
        onDragEnd={handleItemDragEnd}
      >
        <div className="p-4 flex flex-col items-center">
          <div className="h-16 w-16 flex items-center justify-center text-primary">
            {isImage ? (
              <div className="relative w-14 h-14 rounded overflow-hidden group cursor-pointer transition-all duration-200 hover:w-16 hover:h-16">
                {/* Image thumbnail with preview indicator on hover */}
                <img 
                  src={`https://picsum.photos/seed/${file.id}/56/56`} 
                  alt={file.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('.fallback-icon')?.removeAttribute('style');
                  }}
                />
                {/* Preview overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                  <ZoomIn className="text-white h-6 w-6" />
                </div>
                <div className="fallback-icon absolute inset-0 flex items-center justify-center" style={{display: 'none'}}>
                  <FileIcon className="h-8 w-8" />
                </div>
              </div>
            ) : (
              <FileIcon className="h-10 w-10" />
            )}
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm font-medium truncate w-full">{file.name}</p>
            <p className="text-xs text-muted-foreground">{file.size}</p>
            {category && (
              <Badge variant="outline" className={`mt-2 ${category.color.split(' ')[1]}`}>
                {category.name}
              </Badge>
            )}
          </div>
        </div>
        <CardFooter className="p-2 bg-secondary/20 flex justify-between">
          {isImage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleImagePreview(file);
              }}
              className="h-7 w-7"
              title="Preview Image"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openAssignCategoryDialog(file.id)}
            className="h-7 w-7"
          >
            <Tag className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleStar(file.id)}
            className="h-7 w-7"
          >
            <Star className={`h-4 w-4 ${file.starred ? 'text-yellow-400 fill-yellow-400' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(file.id)}
            className="h-7 w-7 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Add a listener for files being dropped from sidebar
  useEffect(() => {
    const handleFilesDropped = (event: CustomEvent) => {
      if (event.detail && 'files' in event.detail && 'targetFolderId' in event.detail) {
        const { files: droppedFiles, targetFolderId } = event.detail;
        
        // Handle the copying of files to the target folder
        if (Array.isArray(droppedFiles) && droppedFiles.length > 0) {
          const targetFolder = files.find(f => f.id === targetFolderId);
          if (targetFolder && targetFolder.type === 'folder') {
            // Create copies of the files with the new parent folder
            const copiedFiles: StorageItem[] = droppedFiles.map(file => ({
              ...file,
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              parentId: targetFolderId,
              modified: new Date().toISOString()
            }));
            
            // Add the new files to the files array
            setFiles(prev => [...prev, ...copiedFiles]);
            
            // Update folder's file count
            setFiles(prevFiles => {
              const folderIndex = prevFiles.findIndex(f => f.id === targetFolderId);
              if (folderIndex !== -1) {
                const filesInFolder = prevFiles.filter(file => file.parentId === targetFolderId).length + copiedFiles.length;
                return prevFiles.map((file, index) => 
                  index === folderIndex 
                    ? { ...file, size: `${filesInFolder} files` } 
                    : file
                );
              }
              return prevFiles;
            });
            
            // Show success toast
            toast({
              title: "Files copied",
              description: `${droppedFiles.length} file${droppedFiles.length > 1 ? 's' : ''} copied to ${targetFolder.name}`
            });
          }
        }
      }
    };
    
    window.addEventListener('filesDropped', handleFilesDropped as EventListener);
    
    return () => {
      window.removeEventListener('filesDropped', handleFilesDropped as EventListener);
    };
  }, [files, toast]);

  // Update the render method for the file list
  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Storage Overview</CardTitle>
            <CardDescription>
              Manage your cloud storage efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Used Storage</p>
                  <p className="text-2xl font-bold">{storageUsed} GB <span className="text-sm text-muted-foreground">of {storageTotal} GB</span></p>
                </div>
                <HardDrive className="h-10 w-10 text-primary opacity-80" />
              </div>
              
              <Progress value={usedPercentage} className="h-2" />
              
              <div className="grid grid-cols-3 gap-4 pt-2">
                {categoryStats.slice(0, 3).map(category => (
                  <div key={category.id} className="space-y-1">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${category.color.split(' ')[0]} mr-2`}></div>
                      <p className="text-sm">{category.name}</p>
                    </div>
                    <p className="text-sm font-semibold">{category.count} files</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={handleUpload}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
            
            <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                  <DialogDescription>
                    Enter a name for your new folder.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
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
            
            <Button variant="secondary" className="w-full" onClick={handleOpenSyncDialog}>
              <HardDrive className="mr-2 h-4 w-4" />
              Sync Storage
            </Button>
            
            {/* Add Select Local Image button */}
            {isElectron && (
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={handleSelectLocalImage}
              >
                <Image className="mr-2 h-4 w-4" />
                Preview Local Image
              </Button>
            )}
            
            <Button 
              variant="secondary" 
              className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300"
              onClick={() => {
                router.push('/backup');
              }}
            >
              <Shield className="mr-2 h-4 w-4" />
              Take Full Backup
            </Button>
            
            {isElectron && (
              <Dialog open={isStorageConfigOpen} onOpenChange={setIsStorageConfigOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full">
                    <HardDrive className="mr-2 h-4 w-4" />
                    Change Storage Size
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configure Storage Size</DialogTitle>
                    <DialogDescription>
                      Set the maximum amount of cloud storage for your account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="block text-sm font-medium">
                        Storage Size: {newStorageSize} GB
                      </Label>
                      <Slider
                        value={[newStorageSize]}
                        min={100}
                        max={2000}
                        step={100}
                        onValueChange={([value]) => setNewStorageSize(value)}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>100 GB</span>
                        <span>2 TB</span>
                      </div>
                    </div>
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-sm">
                        Current usage: <span className="font-semibold">{storageUsed} GB</span> 
                        {newStorageSize < storageUsed && (
                          <span className="text-destructive ml-2">
                            (Warning: New size is smaller than current usage)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsStorageConfigOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleStorageConfigUpdate}>
                      Update Storage
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Category filters - only show them if they're not in the sidebar */}
      {activeCategoryId && (
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant="default"
            className="cursor-pointer"
          >
            {categories.find(c => c.id === activeCategoryId)?.name || 'Category'} 
            <X className="h-3 w-3 ml-2" onClick={() => setActiveCategoryId(null)} />
          </Badge>
        </div>
      )}
      
      {/* Files Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
            <CardTitle>My Files</CardTitle>
              <FolderBreadcrumb />
            </div>
            <div className="flex space-x-2 items-center">
              {/* Selection Mode Toggle and Actions */}
              {selectionMode ? (
                <>
                  <span className="text-sm mr-2">
                    {selectedItems.length} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={selectAll}
                  >
                    {selectedItems.length === paginatedFiles.length ? "Deselect All" : "Select All"}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleOpenMoveCopyDialog('move')}
                        disabled={selectedItems.length === 0}
                      >
                        Move to Folder
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOpenMoveCopyDialog('copy')}
                        disabled={selectedItems.length === 0}
                      >
                        Copy to Folder
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleBatchDelete}
                        disabled={selectedItems.length === 0}
                        className="text-destructive"
                      >
                        Delete Selected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      setSelectionMode(false);
                      setSelectedItems([]);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 mr-2"
                  onClick={toggleSelectionMode}
                >
                  Select
                </Button>
              )}
              
              {/* File Type Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    {fileTypeFilter.length > 0 && (
                      <Badge variant="secondary" className="ml-2 rounded-sm px-1">
                        {fileTypeFilter.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>File Types</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={fileTypeFilter.includes('folder')}
                    onCheckedChange={(checked) => {
                      setFileTypeFilter(prev => 
                        checked 
                          ? [...prev, 'folder'] 
                          : prev.filter(type => type !== 'folder')
                      );
                    }}
                  >
                    Folders
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={fileTypeFilter.includes('document')}
                    onCheckedChange={(checked) => {
                      setFileTypeFilter(prev => 
                        checked 
                          ? [...prev, 'document'] 
                          : prev.filter(type => type !== 'document')
                      );
                    }}
                  >
                    Documents
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={fileTypeFilter.includes('image')}
                    onCheckedChange={(checked) => {
                      setFileTypeFilter(prev => 
                        checked 
                          ? [...prev, 'image'] 
                          : prev.filter(type => type !== 'image')
                      );
                    }}
                  >
                    Images
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={fileTypeFilter.includes('video')}
                    onCheckedChange={(checked) => {
                      setFileTypeFilter(prev => 
                        checked 
                          ? [...prev, 'video'] 
                          : prev.filter(type => type !== 'video')
                      );
                    }}
                  >
                    Videos
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={fileTypeFilter.includes('audio')}
                    onCheckedChange={(checked) => {
                      setFileTypeFilter(prev => 
                        checked 
                          ? [...prev, 'audio'] 
                          : prev.filter(type => type !== 'audio')
                      );
                    }}
                  >
                    Audio
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={fileTypeFilter.includes('code')}
                    onCheckedChange={(checked) => {
                      setFileTypeFilter(prev => 
                        checked 
                          ? [...prev, 'code'] 
                          : prev.filter(type => type !== 'code')
                      );
                    }}
                  >
                    Code
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setFileTypeFilter([])}
                    className="justify-center text-xs"
                  >
                    Clear Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    {sortBy === 'name' ? 'Name' : sortBy === 'size' ? 'Size' : 'Date'}
                    {sortOrder === 'asc' ? (
                      <SortAsc className="h-3 w-3 ml-2" />
                    ) : (
                      <SortDesc className="h-3 w-3 ml-2" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'size' | 'modified')}>
                    <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="size">Size</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="modified">Date Modified</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={sortOrder === 'asc'}
                    onCheckedChange={(checked) => {
                      setSortOrder(checked ? 'asc' : 'desc');
                    }}
                  >
                    Ascending Order
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 w-[150px] lg:w-[250px]"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-6 w-6"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              {/* View Toggle */}
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="h-8 w-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">All Files</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {filteredAndSortedFiles.length === 0 ? (
            <div className="text-center py-10">
              <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No files found</h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === 'starred' 
                  ? "You haven't starred any files yet."
                  : activeTab === 'recent'
                  ? "No recent files to display."
                  : activeCategoryId
                  ? "No files in this category."
                  : "Your file list is empty."}
              </p>
              <Button onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
            </div>
          ) : viewMode === 'list' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  {selectionMode && <TableHead className="w-[40px]">Select</TableHead>}
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Modified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedFiles.map(file => renderListViewItem(file))}
              </TableBody>
            </Table>
          ) : (
            <div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              draggable={selectedItems.length > 0}
              onDragStart={handleItemsMultiDragStart}
              onDragEnd={handleItemDragEnd}
            >
              {paginatedFiles.map(file => renderGridViewItem(file))}
                      </div>
          )}
          
          {/* Pagination Controls */}
          {filteredAndSortedFiles.length > 0 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Showing {paginatedFiles.length} of {filteredAndSortedFiles.length} items
                </span>
                <Select 
                  value={itemsPerPage.toString()} 
                  onValueChange={(value) => setItemsPerPage(parseInt(value))}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>
              
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Create a window of pages around the current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        onClick={() => setCurrentPage(pageNum)}
                        className="h-8 w-8 px-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Category Dialog */}
      <Dialog open={isAssignCategoryOpen} onOpenChange={setIsAssignCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Category</DialogTitle>
            <DialogDescription>
              Select a category for this file.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={selectedCategoryId === null ? "default" : "outline"}
                className="justify-start"
                onClick={() => setSelectedCategoryId(null)}
              >
                No Category
              </Button>
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategoryId === category.id ? "default" : "outline"}
                  className={`justify-start ${selectedCategoryId !== category.id ? category.color.split(' ')[1] : ''}`}
                  onClick={() => setSelectedCategoryId(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignCategory}>
              Assign Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Files Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Select files to upload to your cloud storage.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div 
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-secondary/10 transition-colors"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm font-medium mb-1">Click to select files</p>
              <p className="text-xs text-muted-foreground mb-4">or drag and drop files here</p>
              <Input 
                id="file-upload" 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleFileSelect}
              />
              <Button variant="outline" size="sm" onClick={(e) => {
                e.stopPropagation();
                document.getElementById('file-upload')?.click();
              }}>
                Browse Files
              </Button>
            </div>

            {uploadFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Files to Upload ({uploadFiles.length})</h4>
                  <div className="flex space-x-2">
                    <Select
                      value={selectedCategoryForUpload || ""}
                      onValueChange={setSelectedCategoryForUpload}
                    >
                      <SelectTrigger className="h-8 w-[180px]">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Category</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="max-h-[200px] overflow-y-auto space-y-3">
                  {uploadFiles.map(file => {
                    const progress = uploadProgress[file.name] || 0;
                    const isUploading = progress > 0 && progress < 100;
                    const isComplete = progress === 100;
                    
                    const FileIcon = getFileIcon(file.name, getFileType(file.name));
                    
                    return (
                      <div key={file.name} className="flex items-center space-x-3">
                        <FileIcon className="h-8 w-8 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                          </div>
                          <Progress value={progress} className="h-1" />
                        </div>
                        {isComplete ? (
                          <div className="text-green-500 text-xs font-medium">Complete</div>
                        ) : isUploading ? (
                          <div className="text-blue-500 text-xs font-medium">{Math.round(progress)}%</div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCancelUpload(file.name)}
                            className="h-6 w-6 text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStartUpload}
              disabled={uploadFiles.length === 0 || Object.keys(uploadProgress).some(key => uploadProgress[key] > 0)}
            >
              Start Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Move/Copy Dialog */}
      <Dialog open={isMoveCopyDialogOpen} onOpenChange={setIsMoveCopyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'move' ? 'Move Items' : 'Copy Items'}
            </DialogTitle>
            <DialogDescription>
              Select a destination folder for the {selectedItems.length} selected item{selectedItems.length > 1 ? 's' : ''}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="max-h-[300px] overflow-y-auto space-y-2 border rounded-md p-3">
              {files
                .filter(f => f.type === 'folder' && !selectedItems.includes(f.id))
                .map(folder => (
                  <div 
                    key={folder.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                      targetFolderId === folder.id ? 'bg-secondary' : 'hover:bg-secondary/40'
                    }`}
                    onClick={() => setTargetFolderId(folder.id)}
                  >
                    <Folder className="h-5 w-5 mr-2 text-primary" />
                    <span>{folder.name}</span>
                  </div>
                ))}
              {files.filter(f => f.type === 'folder' && !selectedItems.includes(f.id)).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No folders available as destination</p>
                  <p className="text-xs mt-1">Create a folder first to continue</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMoveCopyDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleMoveCopyItems}
              disabled={!targetFolderId || files.filter(f => f.type === 'folder').length === 0}
            >
              {actionType === 'move' ? 'Move' : 'Copy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Sync Storage Dialog */}
      <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Sync External Storage</DialogTitle>
            <DialogDescription>
              Connect your cloud storage services to sync and access your files.
            </DialogDescription>
          </DialogHeader>
          
          {syncInProgress && (
            <div className="py-6 space-y-4">
              <p className="text-center font-medium">Syncing in progress...</p>
              <Progress value={syncProgress} className="h-2 w-full" />
              <p className="text-center text-sm text-muted-foreground">
                Please wait while we connect to your service.
              </p>
            </div>
          )}
          
          {!syncInProgress && (
            <div className="py-4 space-y-6">
              {/* Dropbox */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 14.5L2 12l4-2.5 4 2.5-4 2.5z"/>
                      <path d="M14 19.5L10 17l4-2.5 4 2.5-4 2.5z"/>
                      <path d="M6 9.5L2 7l4-2.5 4 2.5-4 2.5z"/>
                      <path d="M14 4.5L10 2l4-2.5 4 2.5-4 2.5z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Dropbox</h4>
                    <p className="text-sm text-muted-foreground">
                      {connectedServices.dropbox 
                        ? `Last synced: ${formatLastSynced(lastSynced.dropbox || '')}`
                        : 'Connect to sync your Dropbox files'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {connectedServices.dropbox && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSyncService('dropbox')}
                    >
                      Sync Now
                    </Button>
                  )}
                  <Button 
                    variant={connectedServices.dropbox ? "destructive" : "default"} 
                    size="sm"
                    onClick={() => connectedServices.dropbox 
                      ? handleDisconnectService('dropbox') 
                      : handleConnectService('dropbox')}
                  >
                    {connectedServices.dropbox ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
              
              {/* Google Drive */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-600 rounded-md flex items-center justify-center text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L4 12l8 10 8-10z"/>
                      <path d="M4 12h16"/>
                      <path d="M8 17l8-10"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Google Drive</h4>
                    <p className="text-sm text-muted-foreground">
                      {connectedServices.googleDrive 
                        ? `Last synced: ${formatLastSynced(lastSynced.googleDrive || '')}`
                        : 'Connect to sync your Google Drive files'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {connectedServices.googleDrive && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSyncService('googleDrive')}
                    >
                      Sync Now
                    </Button>
                  )}
                  <Button 
                    variant={connectedServices.googleDrive ? "destructive" : "default"} 
                    size="sm"
                    onClick={() => connectedServices.googleDrive 
                      ? handleDisconnectService('googleDrive') 
                      : handleConnectService('googleDrive')}
                  >
                    {connectedServices.googleDrive ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
              
              {/* iCloud */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-400 rounded-md flex items-center justify-center text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 18.5a4 4 0 1 0 0-8 4.5 4.5 0 0 0-4.5 4.5c-1.5 0-3-1.5-3-3 0-1.6 1.3-3 3-3 1 0 2 .8 2 2"/>
                      <path d="M17 18.5a4 4 0 1 0 0-8h-8a6 6 0 1 0 0 12h8"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">iCloud</h4>
                    <p className="text-sm text-muted-foreground">
                      {connectedServices.iCloud 
                        ? `Last synced: ${formatLastSynced(lastSynced.iCloud || '')}`
                        : 'Connect to sync your iCloud files'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {connectedServices.iCloud && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSyncService('iCloud')}
                    >
                      Sync Now
                    </Button>
                  )}
                  <Button 
                    variant={connectedServices.iCloud ? "destructive" : "default"} 
                    size="sm"
                    onClick={() => connectedServices.iCloud 
                      ? handleDisconnectService('iCloud') 
                      : handleConnectService('iCloud')}
                  >
                    {connectedServices.iCloud ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
              
              {/* Local Machine */}
              {isElectron && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-600 rounded-md flex items-center justify-center text-white mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="16" height="12" x="4" y="6" rx="2"/>
                        <path d="M2 14h20"/>
                        <path d="M12 6v12"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Local Machine</h4>
                      <p className="text-sm text-muted-foreground">
                        {connectedServices.localMachine 
                          ? `Last synced: ${formatLastSynced(lastSynced.localMachine || '')}`
                          : 'Sync with folders on your computer'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {connectedServices.localMachine && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSyncService('localMachine')}
                      >
                        Sync Now
                      </Button>
                    )}
                    <Button 
                      variant={connectedServices.localMachine ? "destructive" : "default"} 
                      size="sm"
                      onClick={() => connectedServices.localMachine 
                        ? handleDisconnectService('localMachine') 
                        : handleConnectService('localMachine')}
                    >
                      {connectedServices.localMachine ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Sync Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-sync" className="cursor-pointer">Enable Auto-Sync</Label>
                    <input type="checkbox" id="auto-sync" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sync-interval" className="mr-4">Sync Interval</Label>
                    <Select defaultValue="60">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">Every 15 minutes</SelectItem>
                        <SelectItem value="30">Every 30 minutes</SelectItem>
                        <SelectItem value="60">Every hour</SelectItem>
                        <SelectItem value="720">Every 12 hours</SelectItem>
                        <SelectItem value="1440">Every day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSyncDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Image Preview Dialog */}
      <ImagePreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageUrl={previewImage || ''}
        fileName={previewFileName}
        onDownload={() => handleDownload(previewFileName)}
      />
    </div>
  );
};

export default CloudStorage; 