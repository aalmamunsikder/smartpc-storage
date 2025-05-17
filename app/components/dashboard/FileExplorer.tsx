import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  File,
  Folder,
  Image,
  FileVideo2,
  FileText,
  AudioLines,
  FileCode2,
  HardDrive,
  Grid,
  List,
  Star,
  Download,
  Trash2,
  Tag,
  Upload,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  ListFilter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

// Define file icon helper functions
const getFileIcon = (fileName: string, type: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  // Document types
  if (extension === 'pdf') return File;
  if (extension === 'doc' || extension === 'docx') return FileText;
  if (extension === 'xls' || extension === 'xlsx') return FileText;
  if (extension === 'ppt' || extension === 'pptx') return FileText;
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
  return File;
};

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
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface FileExplorerProps {
  files: StorageItem[];
  categories: Category[];
  onUpload?: () => void;
  onDownload?: (fileName: string) => void;
  onDelete?: (fileId: string) => void;
  onStar?: (fileId: string) => void;
  onAssignCategory?: (fileId: string, categoryId: string | null) => void;
  onCreateFolder?: (name: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files = [],
  categories = [],
  onUpload,
  onDownload,
  onDelete,
  onStar,
  onAssignCategory,
  onCreateFolder,
}) => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeTab, setActiveTab] = useState('all');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [filteredFiles, setFilteredFiles] = useState<StorageItem[]>(files);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isAssignCategoryOpen, setIsAssignCategoryOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // New state variables for filtering, sorting, and pagination
  const [fileTypeFilter, setFileTypeFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'modified'>('modified');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedFiles, setPaginatedFiles] = useState<StorageItem[]>([]);

  // Filter and sort files based on all criteria
  useEffect(() => {
    let result = [...files];
    
    // Apply tab filters
    if (activeTab === 'starred') {
      result = result.filter(file => file.starred);
    } else if (activeTab === 'recent') {
      // Sort by modified date and take top 5
      result = [...result]
        .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
        .slice(0, 5);
    }
    
    // Apply category filter
    if (activeCategoryId) {
      if (activeCategoryId === 'all') {
        // Show all files (no filtering)
        result = [...files];
      } else if (activeCategoryId === 'folders') {
        // Show only folder type items
        result = result.filter(file => file.type === 'folder');
      } else {
        // Show files with specific category
      result = result.filter(file => file.categoryId === activeCategoryId);
      }
    }
    
    // Apply file type filter if any types are selected
    if (fileTypeFilter.length > 0) {
      result = result.filter(file => fileTypeFilter.includes(file.type));
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(file => 
        file.name.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'modified') {
        return sortOrder === 'asc'
          ? new Date(a.modified).getTime() - new Date(b.modified).getTime()
          : new Date(b.modified).getTime() - new Date(a.modified).getTime();
      } else if (sortBy === 'size') {
        // For folders, size is typically a string like "5 files"
        // For files, size is typically a string like "3.2 MB"
        // We need special handling for different formats
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
          
          const aSize = getSizeInBytes(a.size);
          const bSize = getSizeInBytes(b.size);
          
          return sortOrder === 'asc' ? aSize - bSize : bSize - aSize;
        }
      }
      return 0;
    });
    
    // Save filtered files
    setFilteredFiles(result);
    
    // Calculate total pages for pagination
    const totalPgs = Math.ceil(result.length / itemsPerPage);
    setTotalPages(totalPgs);
    
    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedResult = result.slice(startIndex, startIndex + itemsPerPage);
    setPaginatedFiles(paginatedResult);
    
  }, [files, activeTab, activeCategoryId, searchQuery, fileTypeFilter, sortBy, sortOrder, currentPage, itemsPerPage]);

  // Listen for category selection events from the sidebar
  useEffect(() => {
    const handleCategorySelect = (event: CustomEvent) => {
      if (event.detail && 'categoryId' in event.detail) {
        setActiveCategoryId(event.detail.categoryId);
        setActiveTab('all'); // Reset to all files when filtering by category
      }
    };
    
    window.addEventListener('categorySelect', handleCategorySelect as EventListener);
    
    return () => {
      window.removeEventListener('categorySelect', handleCategorySelect as EventListener);
    };
  }, []);

  const handleUpload = () => {
    if (onUpload) {
      onUpload();
    } else {
      toast({
        title: "Upload initiated",
        description: "Your file is being uploaded"
      });
    }
  };

  const handleDownload = (fileName: string) => {
    if (onDownload) {
      onDownload(fileName);
    } else {
      toast({
        title: "Download initiated",
        description: `Downloading ${fileName}`
      });
    }
  };

  const handleDelete = (fileId: string) => {
    if (onDelete) {
      onDelete(fileId);
    } else {
      toast({
        title: "File deleted",
        description: "The file has been moved to trash"
      });
    }
  };

  const handleStar = (fileId: string) => {
    if (onStar) {
      onStar(fileId);
    } else {
      const file = files.find(f => f.id === fileId);
      const action = file?.starred ? "removed from" : "added to";
      
      toast({
        title: `File ${action} favorites`,
        description: `The file has been ${action} your favorites`
      });
    }
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
    
    if (onCreateFolder) {
      onCreateFolder(newFolderName);
    } else {
      toast({
        title: "Folder created",
        description: `'${newFolderName}' has been created successfully`
      });
    }
    
    setNewFolderName('');
    setIsCreateFolderOpen(false);
  };

  const openAssignCategoryDialog = (fileId: string) => {
    setSelectedFileId(fileId);
    const file = files.find(f => f.id === fileId);
    setSelectedCategoryId(file?.categoryId || null);
    setIsAssignCategoryOpen(true);
  };

  const handleAssignCategory = () => {
    if (!selectedFileId) return;
    
    if (onAssignCategory) {
      onAssignCategory(selectedFileId, selectedCategoryId);
    } else {
      const categoryName = selectedCategoryId 
        ? categories.find(c => c.id === selectedCategoryId)?.name 
        : 'No Category';
      
      toast({
        title: "Category assigned",
        description: `File has been assigned to ${categoryName}`
      });
    }
    
    setIsAssignCategoryOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* File Explorer Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">File Explorer</h2>
          <p className="text-sm text-muted-foreground">
            {filteredFiles.length} files found
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button onClick={handleUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
            <Button variant="outline" onClick={() => setIsCreateFolderOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>Enter a name for your new folder.</DialogDescription>
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
        </div>
      </div>

      {/* Filter, Sort, and Pagination Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Filter by file type */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-4 w-4" />
                Filter
                {fileTypeFilter.length > 0 && <Badge variant="secondary" className="ml-1">{fileTypeFilter.length}</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
                <FileText className="mr-2 h-4 w-4" />
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
                <Image className="mr-2 h-4 w-4" />
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
                <FileVideo2 className="mr-2 h-4 w-4" />
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
                <AudioLines className="mr-2 h-4 w-4" />
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
                <FileCode2 className="mr-2 h-4 w-4" />
                Code
              </DropdownMenuCheckboxItem>
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
                <Folder className="mr-2 h-4 w-4" />
                Folders
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setFileTypeFilter([])}
                className="justify-center text-center"
              >
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="modified">Date Modified</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="size">Size</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                {sortOrder === 'asc' ? (
                  <>
                    <SortDesc className="mr-2 h-4 w-4" />
                    Sort Descending
                  </>
                ) : (
                  <>
                    <SortAsc className="mr-2 h-4 w-4" />
                    Sort Ascending
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Items per page select */}
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground whitespace-nowrap">Items per page:</p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
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
        </div>
      </div>

      {/* Active filters display */}
      {(fileTypeFilter.length > 0 || activeCategoryId) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {fileTypeFilter.map((type) => (
            <Badge key={type} variant="outline" className="cursor-pointer">
              {type.charAt(0).toUpperCase() + type.slice(1)}
              <X 
                className="h-3 w-3 ml-2" 
                onClick={() => setFileTypeFilter(prev => prev.filter(t => t !== type))} 
              />
            </Badge>
          ))}
      {activeCategoryId && (
          <Badge variant="default" className="cursor-pointer">
            {categories.find(c => c.id === activeCategoryId)?.name || 'Category'} 
            <X className="h-3 w-3 ml-2" onClick={() => setActiveCategoryId(null)} />
          </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              setFileTypeFilter([]);
              setActiveCategoryId(null);
            }}
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Files Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Files</CardTitle>
            <div className="flex space-x-2">
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">All Files</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {filteredFiles.length === 0 ? (
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
                  : fileTypeFilter.length > 0
                  ? "No files match your filter criteria."
                  : searchQuery
                  ? `No files matching "${searchQuery}"`
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
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Modified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedFiles.map((file) => {
                  const FileIcon = getFileIcon(file.name, file.type);
                  const category = categories.find(c => c.id === file.categoryId);
                  return (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FileIcon className="h-5 w-5 mr-2 text-primary" />
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
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedFiles.map((file) => {
                const FileIcon = getFileIcon(file.name, file.type);
                const category = categories.find(c => c.id === file.categoryId);
                return (
                  <Card key={file.id} className="overflow-hidden">
                    <div className="p-4 flex flex-col items-center">
                      <div className="h-16 w-16 flex items-center justify-center text-primary">
                        <FileIcon className="h-10 w-10" />
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
                    <div className="p-2 bg-secondary/20 flex justify-between">
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
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
          
          {/* Pagination controls */}
          {filteredFiles.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredFiles.length)} to {Math.min(currentPage * itemsPerPage, filteredFiles.length)} of {filteredFiles.length} items
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                    let pageNumber: number;
                    
                    // Display logic for page numbers
                    if (totalPages <= 5) {
                      // Show all pages if 5 or fewer
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      // Near the start
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // Near the end
                      pageNumber = totalPages - 4 + index;
                    } else {
                      // In the middle
                      pageNumber = currentPage - 2 + index;
                    }
                    
                    return (
              <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(pageNumber)}
              >
                        {pageNumber}
              </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileExplorer; 