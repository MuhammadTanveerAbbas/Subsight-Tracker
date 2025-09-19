"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Trash2, Edit, CheckCircle, XCircle } from "lucide-react";
import type { Subscription } from "@/lib/types";
import { useSubscriptions } from "@/contexts/subscription-context";
import { CATEGORY_ICONS } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { EditSubscriptionDialog } from "@/components/subsight/subscription-form-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  simulation: Record<string, boolean>;
  setSimulation: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}


export function SubscriptionsTable({
  subscriptions,
  simulation,
  setSimulation,
}: SubscriptionsTableProps) {
  const { deleteSubscription } = useSubscriptions();
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  const handleSimToggle = (id: string, checked: boolean) => {
    setSimulation((prev) => ({ ...prev, [id]: checked }));
  };

  const getIconForSubscription = (sub: Subscription) => {
    return CATEGORY_ICONS[sub.icon] || CATEGORY_ICONS.default;
  }

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">No Subscriptions Yet</h3>
            <p className="text-muted-foreground mt-2">
              Click "Add Subscription" to start tracking.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Active</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Billing Cycle</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="w-12">Auto-Renew</TableHead>
                  <TableHead className="w-12 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => {
                  const isSimulated = simulation[sub.id] !== undefined;
                  const simulatedStatus = isSimulated
                    ? simulation[sub.id]
                    : sub.activeStatus;
                  const Icon = getIconForSubscription(sub);

                  return (
                    <TableRow key={sub.id} data-state={simulatedStatus ? "" : "disabled"}>
                      <TableCell>
                        <Checkbox
                          checked={simulatedStatus}
                          onCheckedChange={(checked) =>
                            handleSimToggle(sub.id, !!checked)
                          }
                          aria-label={`Toggle activation for ${sub.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Icon className="w-5 h-5 text-foreground" />
                        {sub.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{sub.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {sub.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: sub.currency,
                        })}
                      </TableCell>
                      <TableCell className="capitalize">{sub.billingCycle}</TableCell>
                      <TableCell>{format(new Date(sub.startDate), "PP")}</TableCell>
                      <TableCell>
                        {sub.autoRenew ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingSub(sub)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your subscription.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteSubscription(sub.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="grid gap-4 md:hidden">
            {subscriptions.map((sub, index) => {
              const isSimulated = simulation[sub.id] !== undefined;
              const simulatedStatus = isSimulated
                ? simulation[sub.id]
                : sub.activeStatus;
              const Icon = getIconForSubscription(sub);
              return (
                <div key={sub.id} className="border-b pb-4 last:border-b-0 last:pb-0 space-y-3" data-state={simulatedStatus ? "" : "disabled"}>
                   <div className="flex items-center justify-between pt-4">
                      <div className="font-medium flex items-center gap-2">
                        <Icon className="w-5 h-5 text-foreground" />
                        {sub.name}
                      </div>
                       <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingSub(sub)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your subscription.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteSubscription(sub.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <Badge variant="secondary">{sub.category}</Badge>
                      <div>
                        <span className="font-semibold">{sub.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: sub.currency,
                        })}</span>
                        <span className="text-muted-foreground capitalize">/{sub.billingCycle.slice(0,2)}</span>
                      </div>
                   </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Started: {format(new Date(sub.startDate), "PP")}</span>
                       <div className="flex items-center gap-2">
                        <span>Auto-renews:</span>
                        {sub.autoRenew ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                   <div className="flex items-center gap-2 pt-2">
                      <Checkbox
                          id={`sim-toggle-${sub.id}`}
                          checked={simulatedStatus}
                          onCheckedChange={(checked) =>
                            handleSimToggle(sub.id, !!checked)
                          }
                        />
                      <label htmlFor={`sim-toggle-${sub.id}`} className="text-sm">Active</label>
                   </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      {editingSub && (
        <EditSubscriptionDialog
          isOpen={!!editingSub}
          onOpenChange={(open) => !open && setEditingSub(null)}
          subscription={editingSub}
        />
      )}
    </>
  );
}