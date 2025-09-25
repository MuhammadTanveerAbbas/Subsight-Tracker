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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

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
      icon: values.icon || "default",
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
      form.setValue("currency", details.currency as any, {
        shouldValidate: true,
      });
      form.setValue("billingCycle", details.billingCycle as any, {
        shouldValidate: true,
      });
      form.setValue("startDate", new Date(details.startDate), {
        shouldValidate: true,
      });
      form.setValue("autoRenew", details.autoRenew, { shouldValidate: true });

      const categoryLower = details.category.toLowerCase();
      const matchedIcon = Object.keys(CATEGORY_ICONS).find((key) =>
        categoryLower.includes(key)
      );
      form.setValue("icon", matchedIcon || "default", { shouldValidate: true });

      toast({
        title: "AI Assistant",
        description: "Fields have been pre-filled.",
      });
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 sm:space-y-4"
      >
        {/* Subscription Name with AI Fill */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Subscription Name</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="e.g. Netflix"
                    {...field}
                    className="h-9 sm:h-10 text-sm"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAiFill}
                  disabled={isAiLoading}
                  className="h-9 sm:h-10 w-9 sm:w-10 p-0"
                >
                  {isAiLoading ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                  <span className="sr-only">AI Fill</span>
                </Button>
              </div>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Icon Selection - Compact for mobile */}
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Icon</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="w-full"
                >
                  <Accordion type="single" collapsible className="border-none">
                    {Object.entries(ICON_CATEGORIES).map(
                      ([category, icons]) => (
                        <AccordionItem
                          value={category}
                          key={category}
                          className="border border-border rounded-md mb-2 last:mb-0"
                        >
                          <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline">
                            {category}
                          </AccordionTrigger>
                          <AccordionContent className="px-3 pb-3">
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2">
                              {Object.entries(icons).map(([key, Icon]) => (
                                <FormItem
                                  key={key}
                                  className="flex items-center justify-center"
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={key}
                                      id={`icon-${key}`}
                                      className="sr-only"
                                    />
                                  </FormControl>
                                  <FormLabel
                                    htmlFor={`icon-${key}`}
                                    className="cursor-pointer"
                                  >
                                    <div
                                      className={cn(
                                        "p-2 sm:p-3 rounded-md border-2 transition-colors",
                                        field.value === key
                                          ? "border-primary bg-accent"
                                          : "border-transparent hover:bg-muted"
                                      )}
                                    >
                                      <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                                    </div>
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    )}
                  </Accordion>
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Provider and Category */}
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Provider</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Netflix, Inc."
                    {...field}
                    className="h-9 sm:h-10 text-sm"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Entertainment"
                    {...field}
                    className="h-9 sm:h-10 text-sm"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Amount, Currency, and Billing Cycle */}
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    className="h-9 sm:h-10 text-sm"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Currency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 sm:h-10 text-sm">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c} className="text-sm">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billingCycle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Cycle</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 sm:h-10 text-sm">
                      <SelectValue placeholder="Cycle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BILLING_CYCLES.map((c) => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="capitalize text-sm"
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Start Date */}
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-9 sm:h-10 text-sm",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
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
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any notes about this subscription..."
                  {...field}
                  className="min-h-[60px] sm:min-h-[80px] text-sm resize-none"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Status Switches */}
        <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
          <FormField
            control={form.control}
            name="activeStatus"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                <FormLabel className="text-sm font-normal">Active</FormLabel>
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
                <FormLabel className="text-sm font-normal">
                  Auto-renews
                </FormLabel>
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

        {/* Submit Button */}
        <Button type="submit" className="w-full h-10 text-sm font-medium">
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
      <DialogContent className="w-[95vw] max-w-[400px] sm:max-w-md md:max-w-xl max-h-[95dvh] overflow-y-auto p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="text-lg sm:text-xl">
            Add Subscription
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enter the details of your subscription below. Use the magic wand to
            autofill with AI.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 sm:p-6 pt-0">
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
      <DialogContent className="w-[95vw] max-w-[400px] sm:max-w-md md:max-w-xl max-h-[95dvh] overflow-y-auto p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="text-lg sm:text-xl">
            Edit Subscription
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update the details of your subscription.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 sm:p-6 pt-0">
          <SubscriptionForm
            onDone={() => onOpenChange(false)}
            subscription={subscription}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
