
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useSubscriptions } from "@/contexts/subscription-context";
import {
  BILLING_CYCLES,
  CURRENCIES,
  Subscription,
  SubscriptionFormData,
  ICON_CATEGORIES,
  CATEGORY_ICONS,
} from "@/lib/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getSubscriptionDetails } from "@/ai/flows/subscription-assistant";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  provider: z.string().min(2, "Provider must be at least 2 characters."),
  category: z.string().min(2, "Category must be at least 2 characters."),
  icon: z.string().optional(),
  startDate: z.date({ required_error: "A start date is required." }),
  billingCycle: z.enum(BILLING_CYCLES),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  currency: z.enum(CURRENCIES),
  notes: z.string().optional(),
  activeStatus: z.boolean(),
  autoRenew: z.boolean(),
});

interface SubscriptionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subscription?: Subscription;
}

function SubscriptionForm({
  onDone,
  subscription,
}: {
  onDone: () => void;
  subscription?: Subscription;
}) {
  const { addSubscription, updateSubscription } = useSubscriptions();
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: subscription
      ? {
          ...subscription,
          startDate: new Date(subscription.startDate),
          amount: subscription.amount,
        }
      : {
          name: "",
          provider: "",
          category: "",
          icon: "default",
          startDate: new Date(),
          billingCycle: "monthly",
          amount: 0,
          currency: "USD",
          notes: "",
          activeStatus: true,
          autoRenew: true,
        },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data: SubscriptionFormData = {
      ...values,
      icon: values.icon || 'default',
      startDate: values.startDate.toISOString(),
    };
    if (subscription) {
      updateSubscription(subscription.id, data);
      toast({ title: "Success", description: "Subscription updated." });
    } else {
      addSubscription(data);
      toast({ title: "Success", description: "Subscription added." });
    }
    onDone();
  }

  const handleAiFill = async () => {
    const name = form.getValues("name");
    if (!name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a subscription name first.",
      });
      return;
    }
    setIsAiLoading(true);
    try {
      const details = await getSubscriptionDetails({ subscriptionName: name });
      form.setValue("provider", details.provider, { shouldValidate: true });
      form.setValue("category", details.category, { shouldValidate: true });
      form.setValue("amount", details.amount, { shouldValidate: true });
      form.setValue("currency", details.currency as any, { shouldValidate: true });
      form.setValue("billingCycle", details.billingCycle as any, { shouldValidate: true });
      form.setValue("startDate", new Date(details.startDate), { shouldValidate: true });
      form.setValue("autoRenew", details.autoRenew, { shouldValidate: true });

      const categoryLower = details.category.toLowerCase();
      const matchedIcon = Object.keys(CATEGORY_ICONS).find(key => categoryLower.includes(key));
      form.setValue("icon", matchedIcon || "default", { shouldValidate: true });

      toast({ title: "AI Assistant", description: "Fields have been pre-filled." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not fetch subscription details.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscription Name</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="e.g. Netflix" {...field} />
                  </FormControl>
                  <Button type="button" variant="outline" size="icon" onClick={handleAiFill} disabled={isAiLoading}>
                    {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Sparkles className="h-4 w-4" />}
                    <span className="sr-only">AI Fill</span>
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Icon</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="w-full"
                  >
                  <Accordion type="single" collapsible defaultValue={Object.keys(ICON_CATEGORIES).find(cat => Object.keys(ICON_CATEGORIES[cat]).includes(field.value || 'default'))}>
                    {Object.entries(ICON_CATEGORIES).map(([category, icons]) => (
                      <AccordionItem value={category} key={category}>
                        <AccordionTrigger>{category}</AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-6 gap-2">
                              {Object.entries(icons).map(([key, Icon]) => (
                                <FormItem key={key} className="flex items-center justify-center">
                                  <FormControl>
                                      <RadioGroupItem value={key} id={`icon-${key}`} className="sr-only" />
                                  </FormControl>
                                  <FormLabel htmlFor={`icon-${key}`} className="cursor-pointer">
                                      <div className={cn(
                                        "p-3 rounded-lg border-2",
                                        field.value === key ? "border-primary bg-accent" : "border-transparent"
                                      )}>
                                      <Icon className="w-6 h-6" />
                                      </div>
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provider</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Netflix, Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Entertainment" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Currency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billingCycle"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Cycle</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cycle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BILLING_CYCLES.map((c) => (
                        <SelectItem key={c} value={c} className="capitalize">
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any notes about this subscription..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-4">
          <FormField
            control={form.control}
            name="activeStatus"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                <div className="space-y-0.5">
                  <FormLabel>Active</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="autoRenew"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                <div className="space-y-0.5">
                  <FormLabel>Auto-renews</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          {subscription ? "Save Changes" : "Add Subscription"}
        </Button>
      </form>
    </Form>
  );
}

export function AddSubscriptionDialog({
  isOpen,
  onOpenChange,
}: SubscriptionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl max-h-[90dvh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Add Subscription</DialogTitle>
          <DialogDescription>
            Enter the details of your new subscription below. Use the magic wand to autofill with AI.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-0">
          <SubscriptionForm onDone={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EditSubscriptionDialog({
  isOpen,
  onOpenChange,
  subscription,
}: Required<SubscriptionDialogProps>) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl max-h-[90dvh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>
            Update the details of your subscription.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-0">
            <SubscriptionForm
              onDone={() => onOpenChange(false)}
              subscription={subscription}
            />
        </div>
      </DialogContent>
    </Dialog>
  );
}

