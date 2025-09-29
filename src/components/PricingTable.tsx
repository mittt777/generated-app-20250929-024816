import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
const plans = [
  {
    name: 'Starter',
    price: '$19',
    period: '/month',
    description: 'For individuals and small teams getting started.',
    features: [
      'Up to 500 subscribers',
      'Basic analytics',
      'Email support',
    ],
    isPopular: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For growing businesses that need more power.',
    features: [
      'Up to 5,000 subscribers',
      'Advanced analytics',
      'API access',
      'Priority email support',
    ],
    isPopular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large-scale applications with custom needs.',
    features: [
      'Unlimited subscribers',
      'Dedicated infrastructure',
      'Custom integrations',
      '24/7 phone support',
    ],
    isPopular: false,
  },
];
export function PricingTable() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={cn(
            'flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2',
            plan.isPopular && 'border-primary shadow-lg'
          )}
        >
          {plan.isPopular && (
            <div className="py-1 px-3 bg-primary text-primary-foreground text-xs font-semibold rounded-full self-start -translate-y-4 translate-x-4">
              Most Popular
            </div>
          )}
          <CardHeader>
            <CardTitle className="font-display text-2xl">{plan.name}</CardTitle>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
              {plan.period && <span className="ml-1 text-xl font-semibold text-muted-foreground">{plan.period}</span>}
            </div>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant={plan.isPopular ? 'default' : 'outline'}>
              <Link to="/auth">
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}