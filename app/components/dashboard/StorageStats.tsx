import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { HardDrive, Upload, Plus, DownloadCloud } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface StorageStatsProps {
  storageUsed: number;
  storageTotal: number;
  categoryStats: Category[];
  onUpload?: () => void;
  onCreateFolder?: () => void;
  onChangeStorageSize?: (size: number) => void;
  isElectron?: boolean;
}

const StorageStats: React.FC<StorageStatsProps> = ({
  storageUsed = 0,
  storageTotal = 100,
  categoryStats = [],
  onUpload,
  onCreateFolder,
  onChangeStorageSize,
  isElectron = false,
}) => {
  const { toast } = useToast();
  const [isStorageConfigOpen, setIsStorageConfigOpen] = React.useState(false);
  const [newStorageSize, setNewStorageSize] = React.useState(storageTotal);

  const usedPercentage = (storageUsed / storageTotal) * 100;
  
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

  const handleCreateFolder = () => {
    if (onCreateFolder) {
      onCreateFolder();
    }
  };

  const handleUpdateStorageSize = () => {
    if (onChangeStorageSize) {
      onChangeStorageSize(newStorageSize);
      setIsStorageConfigOpen(false);
      toast({
        title: "Storage updated",
        description: `Storage size has been set to ${newStorageSize} GB`
      });
    }
  };

  return (
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

            {categoryStats.length > 3 && (
              <div className="pt-2 text-center">
                <Button variant="link" className="text-xs text-muted-foreground">
                  View all categories
                </Button>
              </div>
            )}
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
          
          <Button variant="outline" className="w-full" onClick={handleCreateFolder}>
            <Plus className="mr-2 h-4 w-4" />
            Create Folder
          </Button>
          
          {isElectron && (
            <Dialog open={isStorageConfigOpen} onOpenChange={setIsStorageConfigOpen}>
              <Button variant="secondary" className="w-full" onClick={() => setIsStorageConfigOpen(true)}>
                <HardDrive className="mr-2 h-4 w-4" />
                Change Storage Size
              </Button>
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
                  <Button onClick={handleUpdateStorageSize}>
                    Update Storage
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Button variant="outline" className="w-full">
            <DownloadCloud className="mr-2 h-4 w-4" />
            Backup Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageStats; 