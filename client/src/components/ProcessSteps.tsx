import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, FileText, Bot, Download } from 'lucide-react';

export default function ProcessSteps() {
  const steps = [
    {
      number: 1,
      icon: FileText,
      title: "📱 Quick Signup",
      description: "Login with Google in seconds. No lengthy forms!"
    },
    {
      number: 2,
      icon: FileText,
      title: "📂 Upload Form 16", 
      description: "Simply upload your Form 16 PDF or take a photo"
    },
    {
      number: 3,
      icon: Bot,
      title: "🤖 AI Magic",
      description: "Our AI extracts data and suggests tax savings"
    },
    {
      number: 4,
      icon: Download,
      title: "📝 Download ITR",
      description: "Get your completed ITR-1 JSON ready to file"
    }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-8">
      {steps.map((step, index) => (
        <div key={step.number} className="text-center">
          <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            {step.number}
          </div>
          <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
          <p className="text-neutral-600">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
