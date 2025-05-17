import React, { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Check,
  Trash2,
  X
} from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { Notification, NotificationType } from '@/lib/types';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications,
    unreadCount 
  } = useNotifications();
  
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  
  const visibleNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notification => !notification.read);
    
  const router = useRouter();
    
  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  // Format timestamp for display
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'MMM d, yyyy • h:mm a');
    }
  };
  
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Handle notification action if exists
    if (notification.actionLink) {
      // Use Next.js router for navigation
      router.push(notification.actionLink);
      
      // Close the panel
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> 
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Stay updated with important alerts and system notifications
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-2">
          <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'unread')}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <Check className="h-4 w-4 mr-1" /> Mark all read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearAllNotifications}
                  disabled={notifications.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Clear all
                </Button>
              </div>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <NotificationsList 
                notifications={notifications} 
                onNotificationClick={handleNotificationClick}
                onRemove={removeNotification}
              />
            </TabsContent>
            
            <TabsContent value="unread" className="mt-0">
              <NotificationsList 
                notifications={visibleNotifications} 
                onNotificationClick={handleNotificationClick}
                onRemove={removeNotification}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              <X className="h-4 w-4 mr-2" /> Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

interface NotificationsListProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onRemove: (id: string) => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({ 
  notifications, 
  onNotificationClick,
  onRemove
}) => {
  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  // Format timestamp for display
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'MMM d, yyyy • h:mm a');
    }
  };
  
  if (notifications.length === 0) {
    return (
      <Card className="border-dashed border-muted">
        <CardContent className="pt-6 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <CardTitle className="text-lg font-medium">No notifications</CardTitle>
          <CardDescription className="mt-2">
            You're all caught up! Check back later for updates.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <ScrollArea className="h-[calc(100vh-230px)]">
      <div className="space-y-3 pr-3">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`transition-colors ${!notification.read ? 'bg-primary/5 border-primary/20' : ''}`}
          >
            <CardHeader className="p-4 pb-2 flex flex-row items-start gap-3">
              <div>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start w-full">
                  <CardTitle className="text-sm font-medium">
                    {notification.title}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-muted-foreground -mt-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(notification.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-xs mt-1">
                  {formatTimestamp(notification.timestamp)}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent 
              className="p-4 pt-1 cursor-pointer" 
              onClick={() => onNotificationClick(notification)}
            >
              <p className="text-sm text-foreground/90">{notification.message}</p>
            </CardContent>
            {notification.actionText && (
              <CardFooter className="p-4 pt-0">
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto text-primary"
                  onClick={() => onNotificationClick(notification)}
                >
                  {notification.actionText}
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default NotificationsPanel; 