import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TaxBot from './TaxBot';
import { MessageCircle } from 'lucide-react';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToChat = () => {
    const chatSection = document.querySelector('#chat-section');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If no chat section, open the dialog
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-all bg-primary hover:bg-blue-700"
              title="Chat with TaxBot"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] p-0">
            <DialogHeader className="p-0">
              <DialogTitle className="sr-only">TaxBot Chat</DialogTitle>
            </DialogHeader>
            <div className="h-[600px]">
              <TaxBot />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
