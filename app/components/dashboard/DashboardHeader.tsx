import React, { useState, useRef } from 'react';
import { 
  Bell, 
  Search, 
  UserCircle,
  Settings,
  HelpCircle,
  FileUp,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/use-notifications';
import NotificationsPanel from './NotificationsPanel';

type DashboardHeaderProps = {
  isElectron?: boolean;
  onLogout?: () => void;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isElectron = false, onLogout }) => {
  const { toast } = useToast();
  const router = useRouter();
  const { unreadCount, addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search initiated",
        description: `Searching for "${searchQuery}"...`
      });
    }
  };
  
  const handleQuickUpload = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(file => file.name).join(', ');
      toast({
        title: `Uploading ${files.length} ${files.length === 1 ? 'file' : 'files'}`,
        description: `Starting upload for: ${fileNames}`
      });
      
      // Add a successful upload notification after a short delay to simulate upload
      setTimeout(() => {
        addNotification({
          title: "Files Uploaded",
          message: `Successfully uploaded ${files.length} ${files.length === 1 ? 'file' : 'files'} to your storage.`,
          type: "success",
          actionText: "View Files",
          actionLink: "/storage"
        });
      }, 2000);
      
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleSupportClick = () => {
    // Navigate to the support page using Next.js router
    router.push('/support');
    
    toast({
      title: "Support Center",
      description: "Opening the support center"
    });
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card">
      {/* Left side: Search */}
      <div className="md:w-1/3 hidden md:block">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search files..." 
            className="pl-10 bg-background h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="button"
            variant="ghost" 
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={handleQuickUpload}
          >
            <FileUp className="h-4 w-4" />
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            multiple 
            style={{ display: 'none' }} 
          />
        </form>
      </div>
      
      {/* Right side: User menu & notifications */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground relative"
          onClick={() => setNotificationsPanelOpen(true)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground"
          onClick={handleSupportClick}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src="/avatar.png" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <UserCircle className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  user@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Notifications Panel */}
      <NotificationsPanel 
        open={notificationsPanelOpen} 
        onOpenChange={setNotificationsPanelOpen} 
      />
    </header>
  );
};

export default DashboardHeader; 