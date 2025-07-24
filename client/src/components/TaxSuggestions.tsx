import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Heart, PiggyBank, Settings } from 'lucide-react';

interface TaxSuggestion {
  section: string;
  title: string;
  description: string;
  recommendedAmount: number;
  potentialSaving: number;
  category: string;
}

interface TaxSuggestionsProps {
  suggestions: TaxSuggestion[];
  onApply?: () => void;
  onCustomize?: () => void;
}

export default function TaxSuggestions({ suggestions, onApply, onCustomize }: TaxSuggestionsProps) {
  const totalSavings = suggestions.reduce((total, suggestion) => 
    total + suggestion.potentialSaving, 0
  );

  const section80C = suggestions.filter(s => s.section === '80C');
  const section80D = suggestions.filter(s => s.section === '80D');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">
          You can save up to <span className="text-secondary">₹{totalSavings.toLocaleString()}</span> more! 🎉
        </h2>
        <p className="text-neutral-600">Here are our personalized recommendations for you</p>
      </div>

      {/* Suggestions Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Section 80C */}
        {section80C.length > 0 && (
          <Card className="border border-neutral-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Section 80C Investments</CardTitle>
                <Badge className="bg-secondary/10 text-secondary">
                  Save ₹{section80C.reduce((total, s) => total + s.potentialSaving, 0).toLocaleString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {section80C.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-secondary mt-1" />
                  <div>
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <p className="text-sm text-neutral-600">{suggestion.description}</p>
                    <span className="text-xs text-secondary">
                      Recommended: ₹{suggestion.recommendedAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Section 80D */}
        {section80D.length > 0 && (
          <Card className="border border-neutral-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Section 80D Health Insurance</CardTitle>
                <Badge className="bg-accent/10 text-accent">
                  Save ₹{section80D.reduce((total, s) => total + s.potentialSaving, 0).toLocaleString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {section80D.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg">
                  <Heart className="h-5 w-5 text-red-500 mt-1" />
                  <div>
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <p className="text-sm text-neutral-600">{suggestion.description}</p>
                    <span className="text-xs text-red-500">
                      Recommended: ₹{suggestion.recommendedAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-neutral-100">
        <Button 
          className="bg-secondary hover:bg-green-600 flex-1"
          onClick={onApply}
        >
          <PiggyBank className="mr-2 h-4 w-4" />
          Apply These Recommendations
        </Button>
        <Button 
          variant="outline"
          onClick={onCustomize}
        >
          <Settings className="mr-2 h-4 w-4" />
          Customize
        </Button>
      </div>
    </div>
  );
}
