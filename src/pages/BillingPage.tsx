import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Subscription, PlanId } from '@shared/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const planDetails = {
  starter: { name: 'Starter', price: 19 },
  pro: { name: 'Pro', price: 49 },
  enterprise: { name: 'Enterprise', price: 0 },
};
const invoices = [
    { id: 'INV001', date: 'June 23, 2024', amount: '$49.00', status: 'Paid' },
    { id: 'INV002', date: 'May 23, 2024', amount: '$49.00', status: 'Paid' },
    { id: 'INV003', date: 'April 23, 2024', amount: '$19.00', status: 'Paid' },
];
function BillingPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-5 w-1/2" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-4 w-40" />
          </CardContent>
          <CardFooter className="flex gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-48" />
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-16 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export function BillingPage() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const { data: subscription, isLoading } = useQuery<Subscription>({
    queryKey: ['subscription'],
    queryFn: () => api('/api/subscriptions/me', { headers: { 'Authorization': `Bearer ${token}` } }),
    enabled: !!token,
  });
  const mutation = useMutation({
    mutationFn: (newPlan: PlanId) => {
      return api<Subscription>('/api/subscriptions/me', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ planId: newPlan }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast.success('Plan updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update plan: ${error.message}`);
    },
  });
  const handleChangePlan = (planId: PlanId) => {
    if (subscription?.planId === planId) {
      toast.info("You are already on this plan.");
      return;
    }
    mutation.mutate(planId);
  };
  const handleDownloadInvoice = (invoiceId: string) => {
    toast.info(`Downloading invoice ${invoiceId}... (mock)`);
  };
  const handleUpdatePayment = () => {
    toast.info("This is a mock action. In a real app, this would open a payment portal.");
  }
  if (isLoading || !subscription) {
    return <BillingPageSkeleton />;
  }
  const currentPlan = planDetails[subscription.planId];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your billing information and subscription plan.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the {currentPlan?.name} plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold">${currentPlan?.price}<span className="text-lg font-normal text-muted-foreground">/month</span></div>
            <p className="text-sm text-muted-foreground">
              {subscription.status === 'active' && subscription.currentPeriodEnd
                ? `Your plan renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                : 'Your subscription is inactive.'}
            </p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={() => handleChangePlan('pro')} disabled={mutation.isPending || subscription.planId === 'pro'}>
              {mutation.isPending && mutation.variables === 'pro' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Switch to Pro
            </Button>
            <Button onClick={() => handleChangePlan('starter')} variant="outline" disabled={mutation.isPending || subscription.planId === 'starter'}>
              {mutation.isPending && mutation.variables === 'starter' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Switch to Starter
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Your primary payment method.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <img src="https://www.svgrepo.com/show/303202/visa-logo.svg" alt="Visa" className="h-8" />
            <div>
              <p className="font-medium">Visa ending in 1234</p>
              <p className="text-sm text-muted-foreground">Expires 12/2026</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleUpdatePayment}>Update Payment Method</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>Your current usage for this billing period.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Subscribers</span>
                <span>2,350 / 5,000</span>
              </div>
              <Progress value={47} />
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>API Calls</span>
                <span>12,830 / 50,000</span>
              </div>
              <Progress value={25} />
            </div>
          </CardContent>
        </Card>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>View and download your past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === 'Paid' ? 'success' : 'default'}>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDownloadInvoice(invoice.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}