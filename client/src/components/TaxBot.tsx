import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface TaxBotProps {
  onSendMessage?: (message: string) => void;
  messages?: Message[];
  isLoading?: boolean;
}

export default function TaxBot({ onSendMessage, messages = [], isLoading = false }: TaxBotProps) {
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && onSendMessage) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const quickQuestions = [
    "What is Section 80C?",
    "How to claim HRA?", 
    "ELSS vs PPF?",
    "New vs Old tax regime?"
  ];

  return (
    <Card className="h-full flex flex-col">
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
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm ml-2">Online</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-64 max-h-96">
          {/* Welcome Message */}
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-neutral-100 p-4 rounded-lg shadow-sm max-w-xs">
              <p className="text-sm">
                Hi! I'm TaxBot 👋 I can help you with ITR filing, tax deductions, and investment advice. What would you like to know?
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          {messages.map((message) => (
            <div key={message.id} className={`flex space-x-3 ${message.isBot ? '' : 'justify-end'}`}>
              {message.isBot && (
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div className={`p-4 rounded-lg shadow-sm max-w-md ${
                message.isBot 
                  ? 'bg-neutral-100' 
                  : 'bg-primary text-white'
              }`}>
                <p className="text-sm">{message.text}</p>
              </div>
              {!message.isBot && (
                <div className="w-8 h-8 bg-neutral-300 rounded-full flex items-center justify-center text-sm">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {/* Loading */}
          {isLoading && (
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
        </div>

        {/* Quick Questions */}
        {messages.length === 0 && (
          <div className="p-4 bg-neutral-50 border-t">
            <p className="text-sm text-neutral-600 mb-3">Quick questions you can ask:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => onSendMessage?.(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-neutral-200 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about taxes... 💬"
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!inputMessage.trim() || isLoading}
              className="bg-primary hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-neutral-500 mt-2 text-center">
            TaxBot is powered by AI and provides general guidance. Always consult a CA for complex cases.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
