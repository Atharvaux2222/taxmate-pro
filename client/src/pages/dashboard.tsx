import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { CheckCircle, Clock, Plus, FileText, TrendingUp, MessageCircle, PiggyBank, DollarSign } from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: taxFilings, isLoading: filingsLoading } = useQuery({
    queryKey: ["/api/tax-filings"],
    enabled: isAuthenticated,
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-secondary";
    if (progress >= 50) return "bg-accent";
    return "bg-primary";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-secondary text-white">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-accent text-white">Processing</Badge>;  
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-neutral-100">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
              Welcome back, {user?.firstName || 'User'}! 👋
            </h1>
            <p className="text-neutral-600">Let's get your taxes sorted for FY 2023-24</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/upload">
              <Button className="bg-primary hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                New Tax Return
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Current Progress */}
          <Card className="border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center text-neutral-800">
                <TrendingUp className="mr-2 h-5 w-5" />
                Current Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-neutral-600 mb-2">
                      <span>Form 16 Analysis</span>
                      <span>{stats?.progress || 0}%</span>
                    </div>
                    <Progress 
                      value={stats?.progress || 0} 
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      {stats?.hasCurrentFiling ? (
                        <CheckCircle className="h-4 w-4 text-secondary" />
                      ) : (
                        <Clock className="h-4 w-4 text-neutral-400" />
                      )}
                      <span className="text-sm">Form 16 uploaded</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {stats?.filingStatus === 'processing' || stats?.filingStatus === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-secondary" />
                      ) : (
                        <Clock className="h-4 w-4 text-neutral-400" />
                      )}
                      <span className="text-sm">Data extracted by AI</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {stats?.filingStatus === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-secondary" />
                      ) : (
                        <Clock className="h-4 w-4 text-accent" />
                      )}
                      <span className="text-sm">Review tax savings</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="bg-secondary/5 border border-secondary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Potential Tax Savings</p>
                    <p className="text-2xl font-bold text-secondary">
                      ₹{stats?.potentialSavings?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <PiggyBank className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border border-accent/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Estimated Refund</p>
                    <p className="text-2xl font-bold text-accent">
                      ₹{stats?.estimatedRefund?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Items */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/upload">
            <Card className="card-hover cursor-pointer">
              <CardContent className="p-6">
                <FileText className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Upload Form 16</h3>
                <p className="text-sm text-neutral-600">Upload your Form 16 to get started with AI extraction</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tax-savings">
            <Card className="card-hover cursor-pointer">
              <CardContent className="p-6">
                <TrendingUp className="h-8 w-8 text-secondary mb-3" />
                <h3 className="font-semibold mb-2">View Tax Savings</h3>
                <p className="text-sm text-neutral-600">See personalized investment suggestions to save more</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/chat">
            <Card className="card-hover cursor-pointer">
              <CardContent className="p-6">
                <MessageCircle className="h-8 w-8 text-accent mb-3" />
                <h3 className="font-semibold mb-2">Ask TaxBot</h3>
                <p className="text-sm text-neutral-600">Get instant answers to your tax questions</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Tax Filings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tax Filings</CardTitle>
          </CardHeader>
          <CardContent>
            {filingsLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : taxFilings && taxFilings.length > 0 ? (
              <div className="space-y-4">
                {taxFilings.map((filing: any) => (
                  <div key={filing.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">FY {filing.financialYear}</h4>
                      <p className="text-sm text-neutral-600">
                        Created {new Date(filing.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(filing.status)}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-600 mb-2">No tax filings yet</h3>
                <p className="text-neutral-500 mb-4">Upload your Form 16 to get started</p>
                <Link href="/upload">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Form 16
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
