import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CodeBlock } from "@/components/ui/code-block";
import { LivePreview } from "@/components/ui/live-preview";
import { 
  Zap, 
  FileText, 
  Code, 
  Eye, 
  Copy, 
  Download, 
  Sparkles,
  ShoppingBag,
  CheckCircle,
  Users,
  Monitor,
  Tablet,
  Smartphone
} from "lucide-react";

interface GenerateResponse {
  designSpec: string;
  code: string;
  framework: string;
  outputFormat: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [outputFormat, setOutputFormat] = useState("html");
  const [framework, setFramework] = useState("tailwind");
  const [activeTab, setActiveTab] = useState("design-spec");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: { prompt: string; outputFormat: string; framework: string }) => {
      const response = await apiRequest("POST", "/api/generate", data);
      return response.json() as Promise<GenerateResponse>;
    },
    onSuccess: (data) => {
      toast({
        title: "UI Generated Successfully!",
        description: "Your design specification and code are ready.",
      });
      setActiveTab("design-spec");
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate UI. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please describe the UI you want to generate.",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      prompt: prompt.trim(),
      outputFormat,
      framework,
    });
  };

  const handleCopyCode = async () => {
    if (generateMutation.data?.code) {
      await navigator.clipboard.writeText(generateMutation.data.code);
      toast({
        title: "Code Copied",
        description: "The generated code has been copied to your clipboard.",
      });
    }
  };

  const handleDownloadCode = () => {
    if (generateMutation.data?.code) {
      const blob = new Blob([generateMutation.data.code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-ui.${outputFormat === 'html' ? 'html' : 'jsx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your generated code is being downloaded.",
      });
    }
  };

  const examplePrompts = [
    {
      icon: ShoppingBag,
      title: "E-commerce Product Page",
      description: "Modern product page with gallery, details, and cart functionality",
      prompt: "Create a modern e-commerce product page with image gallery, product details, pricing, reviews section, and add to cart functionality with responsive design",
    },
    {
      icon: CheckCircle,
      title: "SaaS Landing Page", 
      description: "Complete landing page with hero, features, testimonials, and pricing",
      prompt: "Design a professional landing page for a SaaS app with hero section, feature highlights, customer testimonials, pricing table, and call-to-action buttons",
    },
    {
      icon: Users,
      title: "Social Media Dashboard",
      description: "Complete social platform with composer, feed, and notifications",
      prompt: "Build a social media dashboard with post composer, activity feed, notification panel, user profile sidebar, and messaging interface",
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-glass-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-lavender rounded-xl flex items-center justify-center animate-float">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">GenMind</h1>
                <p className="text-sm text-slate-600">Design it. Code it. Instantly.</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center">
              <Button className="bg-primary hover:bg-primary/90 ripple-effect">
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Transform Ideas into{" "}
            <span className="bg-gradient-to-r from-primary to-lavender bg-clip-text text-transparent">
              Beautiful UIs
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Describe your UI in plain English and watch GenMind generate both design specifications and production-ready code powered by Google Gemini AI.
          </p>
        </section>

        {/* Input Section */}
        <section className="mb-8">
          <Card className="glass border-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-mint-green rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                Describe Your UI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder="e.g., Create a modern dashboard with three metric cards, a sidebar navigation, and a data visualization chart..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 resize-none bg-white/80 backdrop-blur-sm border-slate-200 focus:border-primary"
                  maxLength={1000}
                />
                <div className="absolute bottom-3 right-3 text-sm text-slate-400">
                  {prompt.length}/1000
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Output Format</label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger className="bg-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="html">HTML/CSS/JavaScript</SelectItem>
                      <SelectItem value="react">React Components</SelectItem>
                      <SelectItem value="vue">Vue Components</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">UI Framework</label>
                  <Select value={framework} onValueChange={setFramework}>
                    <SelectTrigger className="bg-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                      <SelectItem value="bootstrap">Bootstrap</SelectItem>
                      <SelectItem value="material">Material UI</SelectItem>
                      <SelectItem value="chakra">Chakra UI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button
                onClick={handleGenerate}
                disabled={generateMutation.isPending || !prompt.trim()}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-lavender hover:shadow-lg hover:scale-105 transition-all duration-200 ripple-effect animate-glow"
                size="lg"
              >
                {generateMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Generate UI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Loading State */}
        {generateMutation.isPending && (
          <section className="mb-8">
            <Card className="glass border-glass-border">
              <CardContent className="py-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-lavender rounded-full mb-4">
                    <Zap className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Generating Your UI</h3>
                  <p className="text-slate-600 mb-6">GenMind is analyzing your prompt and creating the perfect design...</p>
                  
                  <div className="space-y-3 max-w-md mx-auto">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-mint-green rounded-full animate-pulse" />
                      <span className="text-sm text-slate-600">Analyzing prompt requirements</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-primary rounded-full animate-pulse animation-delay-200" />
                      <span className="text-sm text-slate-600">Generating design specification</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-lavender rounded-full animate-pulse animation-delay-400" />
                      <span className="text-sm text-slate-600">Creating production-ready code</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Output Section */}
        {generateMutation.data && (
          <section className="mb-8">
            <Card className="glass border-glass-border">
              <div className="p-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="glass border-glass-border">
                    <TabsTrigger value="design-spec" className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Design Spec</span>
                    </TabsTrigger>
                    <TabsTrigger value="generated-code" className="flex items-center space-x-2">
                      <Code className="w-4 h-4" />
                      <span>Generated Code</span>
                    </TabsTrigger>
                    <TabsTrigger value="live-preview" className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Live Preview</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-6">
                    <TabsContent value="design-spec" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-900">Design Specification</h3>
                        <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(generateMutation.data.designSpec)}>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="prose prose-slate max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: generateMutation.data.designSpec.replace(/\n/g, '<br>') }} />
                      </div>
                    </TabsContent>

                    <TabsContent value="generated-code" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-900">Generated Code</h3>
                        <div className="flex items-center space-x-3">
                          <Button variant="outline" size="sm" onClick={handleCopyCode}>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy Code
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleDownloadCode}
                            className="bg-mint-green hover:bg-mint-green/90"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <CodeBlock code={generateMutation.data.code} language={outputFormat === 'html' ? 'html' : 'jsx'} />
                    </TabsContent>

                    <TabsContent value="live-preview" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-900">Live Preview</h3>
                        <div className="flex items-center space-x-3">
                          <Button variant="outline" size="sm">
                            <Monitor className="w-4 h-4 mr-1" />
                            Full Screen
                          </Button>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <span>Device:</span>
                            <Button
                              variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setPreviewDevice('mobile')}
                            >
                              <Smartphone className="w-4 h-4" />
                            </Button>
                            <Button
                              variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setPreviewDevice('tablet')}
                            >
                              <Tablet className="w-4 h-4" />
                            </Button>
                            <Button
                              variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setPreviewDevice('desktop')}
                            >
                              <Monitor className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <LivePreview code={generateMutation.data.code} device={previewDevice} />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </Card>
          </section>
        )}

        {/* Examples Section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Get Inspired</h3>
            <p className="text-lg text-slate-600">Try these example prompts to see GenMind in action</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examplePrompts.map((example, index) => (
              <Card 
                key={index}
                className="glass border-glass-border hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => setPrompt(example.prompt)}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <example.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">{example.title}</h4>
                  <p className="text-sm text-slate-600">{example.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 glass border-t border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-lavender rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900">GenMind</span>
              </div>
              <p className="text-slate-600 mb-4 max-w-md">
                Transform your UI ideas into beautiful, production-ready code with the power of AI. Design it. Code it. Instantly.
              </p>
              <Badge variant="secondary" className="text-xs">
                Powered by Google Gemini AI
              </Badge>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Examples</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Support</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8" />
          <div className="text-center text-sm text-slate-500">
            <p>&copy; 2024 GenMind. All rights reserved. Made with ❤️ for designers and developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
