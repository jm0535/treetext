import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Heart, Coffee, Zap, Trophy, CreditCard, AlertCircle } from 'lucide-react';

// Load Stripe with your publishable key
// You'll need to set this environment variable in your Vercel project settings
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51O9XYZLkozaXYZLkozaXYZLkozaXYZLkozaXYZLkozaXYZ');

const CheckoutForm = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create a payment intent using our Vercel serverless function
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: selectedAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm the payment with Stripe.js
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
      } else {
        throw new Error('Payment processing failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Thank You for Your Support!</h3>
        <p className="text-muted-foreground mb-6">
          Your contribution of ${amount} helps us continue developing treeText and keeping it free for everyone.
        </p>
        <Button onClick={() => window.location.reload()}>Make Another Contribution</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="card-element">Card Details</Label>
          <div className="mt-1 p-3 border rounded-md bg-background">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={!stripe || loading}
        >
          {loading ? 'Processing...' : `Pay $${amount}`}
        </Button>
        
        <div className="text-xs text-muted-foreground text-center mt-4">
          <p>Secure payment processing by Stripe</p>
          <p>Your payment information is encrypted and secure</p>
        </div>
      </div>
    </form>
  );
};

const SponsorPage: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [activeTab, setActiveTab] = useState('monthly');
  const [sliderValue, setSliderValue] = useState([5]);

  const handleAmountChange = (value: string) => {
    setSelectedAmount(parseInt(value));
    setSliderValue([parseInt(value)]);
  };


  
  const handleSliderChange = (value: number[]) => {
    const amount = value[0];
    setSliderValue(value);
    setSelectedAmount(amount);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 px-3 py-1 bg-primary/5 text-primary border-primary/20">
          <Heart className="h-3.5 w-3.5 mr-1.5" />
          Support treeText
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-foreground tracking-tight">
          Sponsor treeText
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 mb-8 leading-relaxed max-w-3xl mx-auto">
          Your support helps us maintain and improve treeText, keeping it free and accessible for students and researchers worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-2xl font-bold mb-6">Why Sponsor treeText?</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                <Coffee className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Support Open Source</h3>
                <p className="text-foreground/80">
                  treeText is 100% free and open source. Your sponsorship helps us keep it that way while continuing to add new features.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Enable New Features</h3>
                <p className="text-foreground/80">
                  Your contributions directly fund the development of new features and improvements to the platform.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Support Education</h3>
                <p className="text-foreground/80">
                  By supporting treeText, you're helping students and researchers around the world produce better academic work.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border">
            <h3 className="text-lg font-semibold mb-4">About Payments</h3>
            <p className="mb-4">
              All payments are securely processed through Stripe.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span>We accept all major credit cards and debit cards</span>
            </div>
          </div>
        </div>

        <div>
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle>Choose Your Sponsorship</CardTitle>
              <CardDescription>Select a sponsorship option that works for you</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="monthly" className="mb-6" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="onetime">One-time</TabsTrigger>
                </TabsList>
                <TabsContent value="monthly" className="pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Become a monthly sponsor and help sustain ongoing development
                  </p>
                </TabsContent>
                <TabsContent value="onetime" className="pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Make a one-time contribution to support treeText
                  </p>
                </TabsContent>
              </Tabs>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Select an amount {activeTab === 'monthly' ? 'per month' : ''}
                  </Label>
                  <RadioGroup 
                    defaultValue="5" 
                    className="grid grid-cols-4 gap-2 mb-6"
                    onValueChange={handleAmountChange}
                  >
                    <div>
                      <RadioGroupItem value="1" id="amount-1" className="peer sr-only" />
                      <Label
                        htmlFor="amount-1"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-lg font-bold">$1</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="3" id="amount-3" className="peer sr-only" />
                      <Label
                        htmlFor="amount-3"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-lg font-bold">$3</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="5" id="amount-5" className="peer sr-only" />
                      <Label
                        htmlFor="amount-5"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-lg font-bold">$5</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="7" id="amount-7" className="peer sr-only" />
                      <Label
                        htmlFor="amount-7"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-lg font-bold">$7</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="9" id="amount-9" className="peer sr-only" />
                      <Label
                        htmlFor="amount-9"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-lg font-bold">$9</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="15" id="amount-15" className="peer sr-only" />
                      <Label
                        htmlFor="amount-15"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-lg font-bold">$15</span>
                      </Label>
                    </div>
                    
                    <div>
                      <RadioGroupItem value="20" id="amount-20" className="peer sr-only" />
                      <Label
                        htmlFor="amount-20"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-lg font-bold">$20</span>
                      </Label>
                    </div>
                    

                  </RadioGroup>
                  
                  {/* Slider for amount selection */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <Label>Adjust amount: ${sliderValue[0]}</Label>
                      <span className="text-sm text-muted-foreground">Max: $20</span>
                    </div>
                    <Slider
                      defaultValue={[5]}
                      max={20}
                      min={1}
                      step={1}
                      value={sliderValue}
                      onValueChange={handleSliderChange}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$1</span>
                      <span>$5</span>
                      <span>$10</span>
                      <span>$15</span>
                      <span>$20</span>
                    </div>
                  </div>
                </div>



                <div className="pt-6 border-t">
                  <Elements stripe={stripePromise}>
                    <CheckoutForm amount={selectedAmount} />
                  </Elements>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <p className="text-sm text-muted-foreground text-center w-full">
                By sponsoring, you agree to our <a href="#" className="text-primary hover:underline">terms of service</a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold mb-6">Our Sponsors</h2>
        <p className="text-lg text-foreground/80 mb-10 max-w-3xl mx-auto">
          Join these amazing people and organizations who are supporting treeText's mission
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* This would be populated with actual sponsors in production */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card p-6 rounded-lg border border-border/30 flex items-center justify-center">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary/30">S{i+1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorPage;
