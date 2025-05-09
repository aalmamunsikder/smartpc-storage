import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  LifeBuoy,
  MessageSquare,
  Search,
  HelpCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  PlusCircle
} from 'lucide-react';

export interface SupportPanelProps {
  isElectron?: boolean;
}

const SupportPanel: React.FC<SupportPanelProps> = ({ isElectron = false }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('faq');
  const [query, setQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  
  const faqItems = [
    {
      id: '1',
      question: 'How do I upload files to my cloud storage?',
      answer: 'To upload files, navigate to the Files tab and click the "Upload" button. You can select files from your local device to upload. Alternatively, you can drag and drop files directly into the browser window.'
    },
    {
      id: '2',
      question: 'What happens if I exceed my storage limit?',
      answer: 'If you exceed your storage limit, you will not be able to upload new files until you either free up space or upgrade your plan. Your existing files will remain accessible.'
    },
    {
      id: '3',
      question: 'How do I create folders to organize my files?',
      answer: 'In the Files tab, click the "New Folder" button. Enter a name for your folder and click "Create". You can then move files into this folder to organize your storage.'
    },
    {
      id: '4',
      question: 'Can I share files with others?',
      answer: 'Yes, you can share files by selecting a file and clicking the share button. You can generate a link that allows others to view or download the file, or you can send a direct invitation to specific email addresses.'
    },
    {
      id: '5',
      question: 'How do I cancel my subscription?',
      answer: 'To cancel your subscription, go to the Billing page, click on "Manage Subscription" and then select "Cancel Subscription". You will still have access to your account until the end of your current billing period.'
    },
  ];

  const tickets = [
    { 
      id: 'TK-001', 
      subject: 'Cannot upload files larger than 1GB', 
      status: 'Open',
      priority: 'High',
      date: '2 days ago',
      lastUpdated: '1 hour ago'
    },
    { 
      id: 'TK-002', 
      subject: 'Missing files after category assignment', 
      status: 'In Progress',
      priority: 'Medium',
      date: '1 week ago',
      lastUpdated: '2 days ago'
    },
    { 
      id: 'TK-003', 
      subject: 'Question about storage upgrade', 
      status: 'Closed',
      priority: 'Low',
      date: '3 weeks ago',
      lastUpdated: '1 week ago'
    },
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Support Ticket Created',
      description: 'We will respond to your inquiry as soon as possible.',
    });
    setActiveTab('tickets');
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const filteredFAQs = faqItems.filter(
    item => 
      !query || 
      item.question.toLowerCase().includes(query.toLowerCase()) || 
      item.answer.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTickets = tickets.filter(
    ticket => 
      !query || 
      ticket.subject.toLowerCase().includes(query.toLowerCase()) || 
      ticket.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Support</h2>
          <p className="text-sm text-muted-foreground">
            Get help with SmartPC Cloud
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for help..."
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions and answers about SmartPC Cloud</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((item) => (
                  <div 
                    key={item.id} 
                    className="border rounded-lg overflow-hidden"
                  >
                    <button
                      className="flex justify-between items-center w-full p-4 text-left hover:bg-muted/50"
                      onClick={() => toggleFAQ(item.id)}
                    >
                      <span className="font-medium">{item.question}</span>
                      {expandedFAQ === item.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    {expandedFAQ === item.id && (
                      <div className="p-4 pt-0 border-t">
                        <p className="text-muted-foreground">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No results found</h3>
                  <p className="text-muted-foreground">
                    Try a different search term or contact support for help.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => window.open('/support', '_blank')}>
                View All FAQs
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <Button onClick={() => setActiveTab('contact')}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Still Need Help?
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>View and manage your support requests</CardDescription>
              </div>
              <Button onClick={() => setActiveTab('contact')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </CardHeader>
            <CardContent>
              {filteredTickets.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-6 p-4 font-medium border-b bg-muted/50">
                    <div className="md:col-span-3">Subject</div>
                    <div className="hidden md:block">Date</div>
                    <div className="hidden md:block">Status</div>
                    <div className="hidden md:block">Last Update</div>
                  </div>
                  <div className="divide-y">
                    {filteredTickets.map((ticket) => (
                      <div 
                        key={ticket.id} 
                        className="grid grid-cols-1 md:grid-cols-6 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="md:col-span-3 flex flex-col md:flex-row md:items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                ticket.status === 'Open' 
                                  ? 'default' 
                                  : ticket.status === 'In Progress' 
                                    ? 'outline' 
                                    : 'secondary'
                              }
                              className="w-2 h-2 p-0 rounded-full"
                            />
                            <span className="font-medium">{ticket.subject}</span>
                          </div>
                          <Badge variant="outline" className="md:ml-2 w-fit">{ticket.id}</Badge>
                        </div>
                        <div className="mt-2 md:mt-0 text-sm text-muted-foreground md:text-foreground">
                          {ticket.date}
                        </div>
                        <div className="mt-1 md:mt-0">
                          <Badge 
                            variant={
                              ticket.status === 'Open' 
                                ? 'default' 
                                : ticket.status === 'In Progress' 
                                  ? 'outline' 
                                  : 'secondary'
                            }
                            className="w-fit"
                          >
                            {ticket.status}
                          </Badge>
                        </div>
                        <div className="mt-1 md:mt-0 flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {ticket.lastUpdated}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No tickets found</h3>
                  <p className="text-muted-foreground mb-4">
                    {query ? 
                      `No tickets matching "${query}"` : 
                      "You don't have any support tickets yet."
                    }
                  </p>
                  <Button onClick={() => setActiveTab('contact')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Ticket
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Submit a new support request</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Briefly describe your issue" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue="technical">
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="account">Account Management</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please provide details about your issue or question..."
                    className="min-h-[150px]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="attachment">Attachment (Optional)</Label>
                  <Input id="attachment" type="file" />
                  <p className="text-xs text-muted-foreground">
                    You can attach screenshots or files to help us understand your issue better.
                    Maximum file size: 10MB
                  </p>
                </div>
                
                <div className="pt-2 flex justify-end">
                  <Button type="submit">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Submit Ticket
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="justify-between flex-col sm:flex-row gap-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span>Response time: Typically within 24 hours</span>
              </div>
              <Button variant="outline" onClick={() => setActiveTab('faq')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                Check FAQ
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportPanel; 