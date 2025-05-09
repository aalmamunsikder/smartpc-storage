import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/theme-provider';
import { 
  Check, 
  Laptop, 
  Moon, 
  Sun, 
  Bell, 
  Clock, 
  Globe, 
  Shield, 
  HardDrive, 
  DownloadCloud, 
  Upload,
  User,
  LogOut,
  KeyRound
} from 'lucide-react';

export interface SettingsPanelProps {
  isElectron?: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isElectron = false }) => {
  const { toast } = useToast();
  const { theme: currentTheme, setTheme } = useTheme();
  const [storageSize, setStorageSize] = useState(100);

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    });
  };

  const handleSavePassword = () => {
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully."
    });
  };

  const handleSignOut = () => {
    toast({
      title: "Signing out",
      description: "You have been signed out."
    });
  };

  const handleStorageSizeChange = (value: number[]) => {
    setStorageSize(value[0]);
  };

  const handleUpdateStorage = () => {
    toast({
      title: "Storage updated",
      description: `Your storage limit has been set to ${storageSize}GB.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select defaultValue="utc-5">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="utc+0">UTC</SelectItem>
                    <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-blue-500 mr-2" />
                  <p className="font-medium text-blue-700 dark:text-blue-300">Security Notice</p>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  For security reasons, password updates can only be done through our website. 
                  Please visit <span className="font-medium">smartpc.com/account</span> to update your password.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize the appearance of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <RadioGroup
                  value={currentTheme}
                  onValueChange={(value) => {
                    setTheme(value as 'light' | 'dark' | 'system');
                    toast({
                      title: 'Theme updated',
                      description: `Theme set to ${value.charAt(0).toUpperCase() + value.slice(1)}`,
                    });
                  }}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                    <Label
                      htmlFor="theme-light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Sun className="mb-3 h-6 w-6" />
                      Light
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                    <Label
                      htmlFor="theme-dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Moon className="mb-3 h-6 w-6" />
                      Dark
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                    <Label
                      htmlFor="theme-system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Laptop className="mb-3 h-6 w-6" />
                      System
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduce-motion">Reduce Motion</Label>
                  <Switch id="reduce-motion" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast">High Contrast</Label>
                  <Switch id="high-contrast" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Increase contrast for better readability
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control which notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                <Label className="text-base">Notification Types</Label>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="security-alerts" className="text-sm font-medium">Security Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Login attempts, password changes, etc.
                    </p>
                  </div>
                  <Switch id="security-alerts" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="system-updates" className="text-sm font-medium">System Updates</Label>
                    <p className="text-xs text-muted-foreground">
                      New features, maintenance, etc.
                    </p>
                  </div>
                  <Switch id="system-updates" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="billing-alerts" className="text-sm font-medium">Billing Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Upcoming charges, payment issues, etc.
                    </p>
                  </div>
                  <Switch id="billing-alerts" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="tips-offers" className="text-sm font-medium">Tips & Offers</Label>
                    <p className="text-xs text-muted-foreground">
                      Product tips, special offers, etc.
                    </p>
                  </div>
                  <Switch id="tips-offers" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Storage Management</CardTitle>
              <CardDescription>Manage your cloud storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Current Storage</span>
                  <span>42 GB of {storageSize} GB</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(42 / storageSize) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {isElectron && (
                <div className="space-y-2 pt-4 border-t">
                  <Label className="text-base">Change Storage Size</Label>
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Storage Size: {storageSize} GB</span>
                    </div>
                    <Slider
                      defaultValue={[storageSize]}
                      max={2000}
                      min={100}
                      step={100}
                      onValueChange={handleStorageSizeChange}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>100 GB</span>
                      <span>2 TB</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleUpdateStorage}
                    className="mt-2"
                  >
                    Update Storage Limit
                  </Button>
                </div>
              )}
              
              <div className="space-y-2 pt-4 border-t">
                <Label className="text-base">Storage Actions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" className="gap-2">
                    <DownloadCloud className="h-4 w-4" />
                    Backup Files
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Backup
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <Label className="text-base">Data Management</Label>
                <div className="pt-2">
                  <Button variant="destructive">Clear Cache Data</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This will clear all cached data but won't affect your files.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPanel; 