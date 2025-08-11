import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  code: string;
  device: "mobile" | "tablet" | "desktop";
}

export function LivePreview({ code, device }: LivePreviewProps) {
  const encodedHtml = useMemo(() => {
    // Create a complete HTML document for the iframe
    const completeHtml = code.includes('<!DOCTYPE html>') 
      ? code 
      : `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { margin: 0; padding: 0; }
    </style>
</head>
<body>
    ${code}
</body>
</html>`;
    
    return `data:text/html;charset=utf-8,${encodeURIComponent(completeHtml)}`;
  }, [code]);

  const deviceClasses = {
    mobile: "max-w-sm mx-auto",
    tablet: "max-w-2xl mx-auto", 
    desktop: "w-full"
  };

  const deviceHeight = {
    mobile: "h-96",
    tablet: "h-[500px]",
    desktop: "h-[600px]"
  };

  return (
    <div className={cn("transition-all duration-300", deviceClasses[device])}>
      <Card className="border-2 border-primary/20 shadow-lg overflow-hidden">
        <iframe
          src={encodedHtml}
          className={cn("w-full border-0 bg-white", deviceHeight[device])}
          title="Live Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </Card>
    </div>
  );
}
