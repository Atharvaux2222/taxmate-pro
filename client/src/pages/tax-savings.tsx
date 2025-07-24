import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TaxSuggestions from "@/components/TaxSuggestions";
import { TrendingUp, Settings, PiggyBank, Heart, BookOpen } from "lucide-react";

export default function TaxSavings() {
  const { toast } = useToast();

  const { data: taxFilings, isLoading: filingsLoading } = useQuery({
    queryKey: ["/api/tax-filings"],
    retry: false,
  });

  // Get current filing data
  const currentFiling = taxFilings?.find((filing: any) => filing.financialYear === '2023-24');
  const suggestions = currentFiling?.taxSuggestions || [];
  const totalSavings = suggestions.reduce((total: number, suggestion: any) => 
    total + (suggestion.potentialSaving || 0), 0
  );

  const handleApplyRecommendations = () => {
    toast({
      title: "Recommendations Applied! 🎉",
      description: "Your tax-saving recommendations have been applied to your filing.",
    });
  };

  const handleCustomize = () => {
    toast({
      title: "Customization Coming Soon",
      description: "Advanced customization features will be available soon.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 to-primary/5 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            💡 AI-Powered Tax Savings Suggestions
          </h1>
          <p className="text-xl text-neutral-600">
            Based on your salary and profile, here's how you can save more taxes
          </p>
        </div>

        {/* Savings Overview */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                You can save up to <span className="text-secondary">₹{totalSavings.toLocaleString()}</span> more! 🎉
              </h2>
              <p className="text-neutral-600">Here are our personalized recommendations for you</p>
            </div>

            {filingsLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-32 bg-gray-200 rounded-xl"></div>
                  <div className="h-32 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            ) : suggestions.length > 0 ? (
              <>
                {/* Recommendations Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Section 80C */}
                  <Card className="border border-neutral-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Section 80C Investments</CardTitle>
                        <Badge className="bg-secondary/10 text-secondary">
                          Save ₹{suggestions
                            .filter((s: any) => s.section === '80C')
                            .reduce((total: number, s: any) => total + (s.potentialSaving || 0), 0)
                            .toLocaleString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {suggestions
                        .filter((suggestion: any) => suggestion.section === '80C')
                        .map((suggestion: any, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-secondary mt-1" />
                            <div>
                              <h4 className="font-medium">{suggestion.title}</h4>
                              <p className="text-sm text-neutral-600">{suggestion.description}</p>
                              <span className="text-xs text-secondary">
                                Recommended: ₹{suggestion.recommendedAmount?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                    </CardContent>
                  </Card>

                  {/* Section 80D */}
                  <Card className="border border-neutral-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Section 80D Health Insurance</CardTitle>
                        <Badge className="bg-accent/10 text-accent">
                          Save ₹{suggestions
                            .filter((s: any) => s.section === '80D')
                            .reduce((total: number, s: any) => total + (s.potentialSaving || 0), 0)
                            .toLocaleString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {suggestions
                        .filter((suggestion: any) => suggestion.section === '80D')
                        .map((suggestion: any, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg">
                            <Heart className="h-5 w-5 text-red-500 mt-1" />
                            <div>
                              <h4 className="font-medium">{suggestion.title}</h4>
                              <p className="text-sm text-neutral-600">{suggestion.description}</p>
                              <span className="text-xs text-red-500">
                                Recommended: ₹{suggestion.recommendedAmount?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-neutral-100">
                  <Button 
                    className="bg-secondary hover:bg-green-600 flex-1"
                    onClick={handleApplyRecommendations}
                  >
                    <PiggyBank className="mr-2 h-4 w-4" />
                    Apply These Recommendations
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleCustomize}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Customize
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-600 mb-2">No suggestions available yet</h3>
                <p className="text-neutral-500 mb-4">Upload your Form 16 to get personalized tax-saving recommendations</p>
                <Button onClick={() => window.location.href = '/upload'}>
                  Upload Form 16
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              Learn More About Tax Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <a href="#" className="text-primary hover:underline">What is Section 80C?</a>
              <a href="#" className="text-primary hover:underline">ELSS vs PPF Comparison</a>
              <a href="#" className="text-primary hover:underline">Health Insurance Benefits</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
