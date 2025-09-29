import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { PricingTable } from '@/components/PricingTable';
import { CheckCircle, Zap, BarChart, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
const features = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Blazing Fast',
    description: 'Powered by Cloudflare Workers for unparalleled performance and reliability worldwide.',
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Insightful Analytics',
    description: 'Get a clear view of your revenue, subscribers, and growth metrics in one place.',
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: 'Simple Integration',
    description: 'Easily integrate with your existing stack using our developer-friendly API.',
  },
];
export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]"></div>
          </div>
          <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                Subscription Billing, <br />
                <span className="text-primary">Simplified.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                OrbitBill provides the complete toolkit to launch, manage, and scale your subscription business. Focus on your product, not your billing infrastructure.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Button size="lg" asChild className="transition-all duration-300 hover:shadow-primary hover:-translate-y-px">
                  <Link to="/auth">Get Started for Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#pricing">View Pricing</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        {/* Features Section */}
        <section id="features" className="py-24 lg:py-32 bg-secondary">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to succeed
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                OrbitBill is packed with features designed to make your life easier and your business more profitable.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Pricing Section */}
        <section id="pricing" className="py-24 lg:py-32">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Fair pricing for every stage
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Choose the plan that's right for you. No hidden fees, no surprises.
              </p>
            </div>
            <div className="mt-16">
              <PricingTable />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}