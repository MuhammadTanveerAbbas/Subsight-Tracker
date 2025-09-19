
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddSubscriptionDialog } from "@/components/subsight/subscription-form-dialog";
import { FileDown, FileUp, PlusCircle, Sparkles, MoreVertical } from "lucide-react";
import { useSubscriptions } from "@/contexts/subscription-context";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV, exportToJSON, exportToPDF } from "@/lib/export";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { summarizeSpending } from "@/ai/flows/summarize-spending";
import Link from "next/link";
import { Target } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppHeader() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { subscriptions, importSubscriptions } = useSubscriptions();
  const { toast } = useToast();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const isMobile = useIsMobile();

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (file.type === "application/json") {
          const data = JSON.parse(text);
          importSubscriptions(data);
          toast({ title: "Success", description: "Subscriptions imported from JSON." });
        } else if (file.type === "text/csv") {
          const rows = text.split("\n").filter(row => row.trim() !== '');
          const headersText = rows[0].split(',');
          const headers = headersText.map(h => h.trim().replace(/"/g, ''));
          const data = rows.slice(1).map((row) => {
            const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
            return headers.reduce((obj: any, header, index) => {
              const key = header.trim();
              const value = values[index]?.trim() || '';
              const cleanedValue = value.replace(/^"|"$/g, '');

               if (key === 'amount' || key === 'annualPrice') {
                 obj[key] = parseFloat(cleanedValue);
               } else if (key === 'activeStatus' || key === 'autoRenew') {
                 obj[key] = cleanedValue.toLowerCase() === 'true';
               } else {
                 obj[key] = cleanedValue;
               }
              return obj;
            }, {});
          });
          importSubscriptions(data);
          toast({ title: "Success", description: "Subscriptions imported from CSV." });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Import Error",
          description: "Failed to parse or import file. Please check the file format.",
        });
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const handleSummarize = async () => {
    if (subscriptions.length === 0) {
      toast({
        variant: "destructive",
        title: "No subscriptions",
        description: "Please add at least one subscription to get a summary.",
      });
      return;
    }
    setIsSummarizing(true);
    try {
      const result = await summarizeSpending({subscriptionData: JSON.stringify(subscriptions)});
      toast({
        title: "AI Spending Summary",
        description: result.summary,
        duration: 20000,
      });
    } catch(e) {
      toast({
          variant: "destructive",
          title: "AI Error",
          description: "Failed to generate summary.",
      });
    } finally {
      setIsSummarizing(false);
    }
  }

  const handleExport = (format: 'json' | 'csv' | 'pdf') => {
    if (subscriptions.length === 0) {
      toast({
        variant: "destructive",
        title: "No subscriptions",
        description: "There are no subscriptions to export.",
      });
      return;
    }
    if (format === 'json') exportToJSON(subscriptions);
    if (format === 'csv') exportToCSV(subscriptions);
    if (format === 'pdf') exportToPDF(subscriptions);
  }

  const handleAddClick = () => setIsAddOpen(true);

  const renderImportOptions = (isMobile = false) => (
    <>
      <DropdownMenuItem onSelect={() => document.getElementById('import-json')?.click()}>
        {isMobile && <FileUp className="mr-2 h-4 w-4" />} Import from JSON
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => document.getElementById('import-csv')?.click()}>
        {isMobile && <FileUp className="mr-2 h-4 w-4" />} Import from CSV
      </DropdownMenuItem>
    </>
  );

  const renderExportOptions = (isMobile = false) => (
    <>
      <DropdownMenuItem onSelect={() => handleExport('json')} disabled={subscriptions.length === 0}>
        {isMobile && <FileDown className="mr-2 h-4 w-4" />} Export as JSON
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => handleExport('csv')} disabled={subscriptions.length === 0}>
        {isMobile && <FileDown className="mr-2 h-4 w-4" />} Export as CSV
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => handleExport('pdf')} disabled={subscriptions.length === 0}>
        {isMobile && <FileDown className="mr-2 h-4 w-4" />} Export as PDF
      </DropdownMenuItem>
    </>
  );

  const desktopMenuItems = (
    <>
      <Button variant="outline" onClick={handleSummarize} disabled={isSummarizing || subscriptions.length === 0}>
        <Sparkles className="mr-2 h-4 w-4" />
        {isSummarizing ? "Analyzing..." : "AI Summary"}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {renderImportOptions()}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={subscriptions.length === 0}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {renderExportOptions()}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button onClick={handleAddClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Subscription
      </Button>
    </>
  );

  const mobileMenuItems = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreVertical className="h-5 w-5" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Subscription
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSummarize} disabled={isSummarizing || subscriptions.length === 0}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isSummarizing ? "Analyzing..." : "AI Summary"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {renderImportOptions(true)}
        <DropdownMenuSeparator />
        {renderExportOptions(true)}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight font-headline">Subsight</h1>
        </Link>
        <div className="ml-auto">
          {isMobile ? mobileMenuItems : desktopMenuItems}
        </div>
      </header>
      <AddSubscriptionDialog isOpen={isAddOpen} onOpenChange={setIsAddOpen} />
       <input
        type="file"
        id="import-json"
        className="hidden"
        accept="application/json"
        onChange={(e) => {
          if (e.target.files) {
            handleImport(e.target.files[0]);
            e.target.value = '';
          }
        }}
      />
      <input
        type="file"
        id="import-csv"
        className="hidden"
        accept="text/csv"
        onChange={(e) => {
          if (e.target.files) {
            handleImport(e.target.files[0]);
            e.target.value = '';
          }
        }}
      />
    </>
  );
}

    