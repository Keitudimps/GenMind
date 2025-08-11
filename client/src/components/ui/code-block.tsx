import { useEffect } from "react";
import { Card } from "@/components/ui/card";

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  useEffect(() => {
    // Dynamically import and configure Prism.js for syntax highlighting
    const loadPrism = async () => {
      if (typeof window !== "undefined") {
        const Prism = (await import("prismjs")).default;
        
        // Import language definitions
        if (language === "html") {
          await import("prismjs/components/prism-markup");
        } else if (language === "jsx") {
          await import("prismjs/components/prism-jsx");
        }
        
        Prism.highlightAll();
      }
    };
    
    loadPrism();
  }, [code, language]);

  return (
    <Card className="bg-slate-50 border-slate-200">
      <div className="p-6">
        <pre className="overflow-x-auto">
          <code className={`language-${language} font-jetbrains text-sm leading-relaxed`}>
            {code}
          </code>
        </pre>
      </div>
    </Card>
  );
}
