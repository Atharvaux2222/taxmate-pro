import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import TaxBot from "@/components/TaxBot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, MessageCircle } from "lucide-react";

interface ChatMessage {
  id: number;
  message: string;
  isBot: boolean;
  createdAt: string;
}

export default function Chat() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

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

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/chat/messages"],
    enabled: isAuthenticated,
    retry: false,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      return await apiRequest("POST", "/api/chat/messages", { message: messageText });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      setMessage("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
    sendMessageMutation.mutate(question);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const quickQuestions = [
    "What is Section 80C?",
    "How to claim HRA?",
    "ELSS vs PPF?",
    "New vs Old tax regime?",
    "What is standard deduction?",
    "How to save more tax?"
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            🤖 Meet TaxBot - Your AI Assistant
          </h1>
          <p className="text-xl text-neutral-600">
            Get instant answers to all your tax questions in simple language
          </p>
        </div>

        {/* Chatbot Interface */}
        <Card className="shadow-lg overflow-hidden">
          {/* Chat Header */}
          <CardHeader className="bg-primary text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>TaxBot</CardTitle>
                <p className="text-sm text-blue-100">Always here to help • Powered by AI</p>
              </div>
              <div className="ml-auto flex items-center">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className="text-sm ml-2">Online</span>
              </div>
            </div>
          </CardHeader>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-white">
            {/* Welcome Message */}
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-neutral-100 p-4 rounded-lg shadow-sm max-w-xs">
                <p className="text-sm">Hi! I'm TaxBot 👋 I can help you with ITR filing, tax deductions, and investment advice. What would you like to know?</p>
              </div>
            </div>

            {/* Messages */}
            {messagesLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex space-x-3 justify-end">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ) : (
              messages?.map((msg: ChatMessage) => (
                <div key={msg.id} className={`flex space-x-3 ${msg.isBot ? '' : 'justify-end'}`}>
                  {msg.isBot && (
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`p-4 rounded-lg shadow-sm max-w-md ${
                    msg.isBot 
                      ? 'bg-neutral-100' 
                      : 'bg-primary text-white'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  {!msg.isBot && (
                    <div className="w-8 h-8 bg-neutral-300 rounded-full flex items-center justify-center text-sm">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Loading indicator */}
            {sendMessageMutation.isPending && (
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-neutral-100 p-4 rounded-lg shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {(!messages || messages.length === 0) && (
            <div className="p-4 bg-neutral-50 border-t">
              <p className="text-sm text-neutral-600 mb-3">Quick questions you can ask:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleQuickQuestion(question)}
                    disabled={sendMessageMutation.isPending}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="border-t border-neutral-200 p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything about taxes... 💬"
                disabled={sendMessageMutation.isPending}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={!message.trim() || sendMessageMutation.isPending}
                className="bg-primary hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-neutral-500 mt-2 text-center">
              TaxBot is powered by AI and provides general guidance. Always consult a CA for complex cases.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
