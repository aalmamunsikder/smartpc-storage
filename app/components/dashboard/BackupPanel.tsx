import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { HardDrive, Save, AlertCircle, Check, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BackupPanelProps {
  isElectron?: boolean;
}

const BackupPanel: React.FC<BackupPanelProps> = ({ isElectron = false }) => {
  const { toast } = useToast();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isBackupInProgress, setIsBackupInProgress] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [backupStats, setBackupStats] = useState({
    totalFiles: 0,
    totalSize: '0 MB',
    backupLocation: 'Default Location'
  });

  const handleBackupConfirm = () => {
    setIsConfirmDialogOpen(false);
    setIsBackupInProgress(true);
    setBackupProgress(0);
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsBackupInProgress(false);
          
          // Update last backup date and stats
          const now = new Date();
          setLastBackupDate(now.toLocaleString());
          setBackupStats({
            totalFiles: 1248,
            totalSize: '4.2 GB',
            backupLocation: 'C:/Backups/SmartPC'
          });
          
          // Show success toast
          toast({
            title: "Backup completed",
            description: "Full backup has been successfully completed"
          });
          
          return 100;
        }
        return prevProgress + 2;
      });
    }, 200);
  };

  const handleTakeFullBackup = () => {
    setIsConfirmDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">SmartPC Backup</h2>
          <p className="text-muted-foreground">Secure and manage backups of your important data</p>
        </div>
      </div>

      {/* Backup Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Backup Status</CardTitle>
          <CardDescription>
            Overview of your current backup status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                <span className="font-medium">Last Backup:</span>
              </div>
              <span>
                {lastBackupDate ? 
                  lastBackupDate : 
                  <span className="text-yellow-600">No recent backups</span>
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <HardDrive className="h-5 w-5 mr-2 text-blue-500" />
                <span className="font-medium">Backup Location:</span>
              </div>
              <span>{backupStats.backupLocation}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Save className="h-5 w-5 mr-2 text-blue-500" />
                <span className="font-medium">Files Backed Up:</span>
              </div>
              <span>{backupStats.totalFiles > 0 ? 
                `${backupStats.totalFiles} files (${backupStats.totalSize})` : 
                'No files backed up yet'
              }</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Backup and restore operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isBackupInProgress ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Backup in progress...</span>
                <span>{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Please do not close the application during backup.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              <Button 
                onClick={handleTakeFullBackup}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Take Full Backup
              </Button>
              
              <Button variant="outline" className="w-full">
                Restore From Backup
              </Button>
              
              <Button variant="outline" className="w-full">
                Configure Backup Settings
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Full Backup</DialogTitle>
            <DialogDescription>
              This will create a complete backup of all your files and settings. The process may take several minutes depending on the amount of data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-start py-4">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Please note:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Make sure you have enough disk space</li>
                <li>The application will remain responsive but performance may be affected</li>
                <li>You can cancel the backup process at any time</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBackupConfirm}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Proceed with Backup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BackupPanel; 