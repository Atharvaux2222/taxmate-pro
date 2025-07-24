import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProcessSteps from "@/components/ProcessSteps";
import { Calculator, Shield, Clock, Users, Brain, Lightbulb, MessageCircle, CheckCircle, Play, Rocket } from "lucide-react";

export default function Landing() {
  const handleGoogleLogin = () => {
    window.location.href = "/api/login";
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
              🎯 Perfect for 0-3 Years Experience
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            File Your ITR-1 in 
            <span className="text-accent"> Minutes</span>, 
            Not Hours! 🚀
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Upload your Form 16, let our AI do the heavy lifting, and get personalized tax-saving tips. 
            Perfect for young professionals earning ₹3-20 LPA.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-amber-500 text-white px-8 py-4 text-lg transform hover:scale-105 shadow-lg"
              onClick={handleGoogleLogin}
            >
              <Rocket className="mr-2 h-5 w-5" />
              Start Filing Now - FREE
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 text-lg border-white/30"
              onClick={() => scrollToSection('how-it-works')}
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo (2 min)
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-blue-200">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-secondary" />
              <span>Bank-level Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-secondary" />
              <span>5-minute Filing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-secondary" />
              <span>10,000+ Users</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              How EZTaxMate Works 🔄
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Our AI-powered platform makes tax filing as easy as ordering food online
            </p>
          </div>

          <ProcessSteps />

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="card-hover">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart AI Extraction</h3>
                <p className="text-neutral-600">Our AI reads your Form 16 like a tax expert and extracts all relevant data automatically</p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Personalized Tips</h3>
                <p className="text-neutral-600">Get custom tax-saving suggestions based on your salary and age group</p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">TaxBot Assistant</h3>
                <p className="text-neutral-600">Ask questions anytime to our friendly AI chatbot trained on Indian tax laws</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              Simple, Transparent Pricing 💰
            </h2>
            <p className="text-xl text-neutral-600">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="shadow-lg border border-neutral-200">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-neutral-800 mb-2">Free Starter</h3>
                <div className="text-4xl font-bold text-neutral-800 mb-2">₹0</div>
                <p className="text-neutral-600 mb-6">Perfect for first-time filers</p>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">1 ITR-1 filing per year</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Basic Form 16 analysis</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Email support</span>
                  </li>
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleLogin}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="shadow-xl border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                  🌟 Most Popular
                </span>
              </div>
              
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-neutral-800 mb-2">Pro Filer</h3>
                <div className="text-4xl font-bold text-primary mb-2">₹499</div>
                <p className="text-neutral-600 mb-6">For smart tax planning</p>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Unlimited ITR-1 filings</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">AI-powered tax suggestions</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">TaxBot premium support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Investment tracking</span>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-primary hover:bg-blue-700"
                  onClick={handleGoogleLogin}
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>

            {/* Expert Plan */}
            <Card className="shadow-lg border border-neutral-200">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-neutral-800 mb-2">Tax Expert</h3>
                <div className="text-4xl font-bold text-neutral-800 mb-2">₹999</div>
                <p className="text-neutral-600 mb-6">Complete tax solution</p>
                
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Everything in Pro</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">CA consultation (1 hour)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">ITR-2, ITR-3 support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Advanced tax planning</span>
                  </li>
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleLogin}
                >
                  Choose Expert
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Money Back Guarantee */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 bg-secondary/10 text-secondary px-6 py-3 rounded-full">
              <Shield className="h-4 w-4" />
              <span className="font-medium">30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">EZTaxMate</span>
              </div>
              <p className="text-neutral-300 mb-4">
                Making tax filing simple and stress-free for young professionals across India.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#" className="hover:text-white transition-colors">Tax Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-neutral-300">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-700 mt-12 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 EZTaxMate. All rights reserved. | Made with ❤️ for Indian taxpayers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
