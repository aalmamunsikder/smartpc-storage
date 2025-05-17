'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { KeyRound } from "lucide-react";
import { useRouter } from 'next/navigation';

// No need to redefine Window.electron here
// The type is defined in electron/electron.d.ts

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isElectron, setIsElectron] = useState(false);
  const [appVersion, setAppVersion] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Clear any previous auth check to avoid redirect loops
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('auth_checked');
    }
    
    // Check if running in Electron
    if (typeof window !== 'undefined' && window.electron) {
      setIsElectron(true);
      
      // Get app version for display
      window.electron.getAppVersion().then(version => {
        setAppVersion(version);
      });
    }

    // Check if already authenticated
    const checkAuth = async () => {
      try {
        let isAuthenticated = false;
        
        if (typeof window !== 'undefined') {
          if (isElectron && window.electron) {
            isAuthenticated = await window.electron.getStoreValue('isAuthenticated');
          } else {
            isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
          }
          
          if (isAuthenticated) {
            router.push('/storage');
          }
        }
      } catch (error) {
        console.error('Login auth check error:', error);
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [router, isElectron]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Store authentication state
      if (isElectron && window.electron) {
        // In Electron, use the secure store
        await window.electron.setStoreValue('isAuthenticated', true);
        if (rememberMe) {
          await window.electron.setStoreValue('rememberedUser', email);
        } else {
          await window.electron.deleteStoreValue('rememberedUser');
        }
      } else {
        // In browser, use localStorage
        localStorage.setItem('isAuthenticated', 'true');
        if (rememberMe) {
          localStorage.setItem('rememberedUser', email);
        } else {
          localStorage.removeItem('rememberedUser');
        }
      }
      
      toast({
        title: "Success",
        description: "You've been logged in successfully"
      });

      // Set auth check in session for dashboard
      sessionStorage.setItem('auth_checked', 'true');
      
      // Navigate to storage page
      router.push('/storage');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="hidden md:block absolute -bottom-8 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-blue-600/20 p-3 flex items-center justify-center border border-blue-500/30 shadow-lg shadow-blue-500/20">
            <KeyRound className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">SmartPC</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to access your dashboard</p>
          {isElectron && appVersion && (
            <p className="mt-1 text-xs text-muted-foreground/70">Desktop Version {appVersion}</p>
          )}
        </div>
        
        <Card className="border-border shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked: boolean | 'indeterminate') => 
                    setRememberMe(checked === true)}
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm cursor-pointer"
                >
                  Remember me for 30 days
                </Label>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow transition-all" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full bg-black hover:bg-gray-900 text-white border-black"
                  onClick={() => {
                    toast({
                      title: "Apple Sign In",
                      description: "Apple authentication would be initiated here"
                    });
                  }}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.0364 12.3662C17.0364 9.71956 19.0438 8.55881 19.1207 8.48225C17.7958 6.56262 15.7884 6.30771 15.1505 6.23115C13.3738 6.07804 11.712 7.36802 10.8433 7.36802C9.9746 7.36802 8.55747 6.2582 7.07166 6.30771C5.25272 6.35722 3.55877 7.34143 2.69004 8.86675C0.875424 11.9182 2.27483 16.4187 4.01823 18.9898C4.8997 20.2548 5.92492 21.6707 7.26961 21.59C8.54274 21.5158 9.01051 20.7286 10.5477 20.7286C12.069 20.7286 12.5241 21.59 13.8688 21.5405C15.2647 21.4908 16.1514 20.2301 17.0201 18.9651C18.0198 17.5493 18.446 16.1335 18.4768 16.0837C18.446 16.0589 17.0364 15.5373 17.0364 12.3662Z" fill="white"/>
                    <path d="M14.7645 4.6C15.5051 3.69593 16.0011 2.48016 15.8858 1.25C14.8476 1.29951 13.5361 1.97927 12.7647 2.88334C12.0703 3.68697 11.4716 4.92697 11.6176 6.10618C12.7647 6.20519 13.9931 5.50456 14.7645 4.6Z" fill="white"/>
                  </svg>
                  Apple
                </Button>
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full border-[#4285F4] bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-white"
                  onClick={() => {
                    toast({
                      title: "Google Sign In",
                      description: "Google authentication would be initiated here"
                    });
                  }}
                >
                  <svg 
                    className="mr-2 h-4 w-4" 
                    viewBox="0 0 24 24" 
                    width="16" 
                    height="16"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Google
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
} 