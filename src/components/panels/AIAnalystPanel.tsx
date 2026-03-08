import React, { useState, useRef, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Camera, Orbit, Sparkles, Trash2, Send, Loader2 } from "lucide-react";
import { useProVegLayout } from "@/contexts/ProVegLayoutContext";
import { useScreenshotCapture } from "@/hooks/useScreenshotCapture";
import type { Screenshot } from "@/types/screenshot";
import { supabase } from "@/integrations/supabase/client";

const ANALYSIS_PRESETS = [
  { label: "Visual Realism", prompt: "Analyze these screenshots for visual realism. What looks wrong? What should be improved? Be specific about geometry, taper, branching, and overall form.", type: "visual-only" as const },
  { label: "Full Rebuild", prompt: "This system needs a full rebuild. Analyze the current state from screenshots and docs, and give a prioritized architectural roadmap for fixing the core generation engine. Be brutally honest.", type: "full" as const },
  { label: "Parameter Tune", prompt: "Based on the current visual output, suggest specific parameter changes (with exact values) that would improve realism. Reference actual parameter names from the codebase.", type: "full" as const },
  { label: "Code Review", prompt: "Review the tree/rock generator code for mathematical correctness, performance issues, and architectural problems. Suggest specific fixes.", type: "full" as const },
];

export function AIAnalystPanel() {
  const { studioMode, seed } = useProVegLayout();
  const { captureCurrentView, captureFixedAngles } = useScreenshotCapture();

  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [selectedScreenshots, setSelectedScreenshots] = useState<Set<string>>(new Set());
  const [aiResponse, setAiResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleManualCapture = useCallback(() => {
    const ss = captureCurrentView("Manual Capture", studioMode, seed);
    if (ss) {
      setScreenshots(prev => [ss, ...prev]);
      setSelectedScreenshots(prev => new Set([...prev, ss.id]));
    }
  }, [captureCurrentView, studioMode, seed]);

  const handleAutoCapture = useCallback(() => {
    const results = captureFixedAngles(studioMode, seed);
    if (results.length > 0) {
      setScreenshots(prev => [...results, ...prev]);
      const newSelected = new Set(selectedScreenshots);
      results.forEach(r => newSelected.add(r.id));
      setSelectedScreenshots(newSelected);
    }
  }, [captureFixedAngles, studioMode, seed, selectedScreenshots]);

  const toggleScreenshot = useCallback((id: string) => {
    setSelectedScreenshots(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const deleteScreenshot = useCallback((id: string) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
    setSelectedScreenshots(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const runAnalysis = useCallback(async (prompt: string, analysisType: string) => {
    const selected = screenshots.filter(s => selectedScreenshots.has(s.id));
    if (selected.length === 0 && analysisType === "visual-only") {
      setAiResponse("⚠️ Please capture and select at least one screenshot first.");
      return;
    }

    setIsAnalyzing(true);
    setAiResponse("");

    try {
      const body: any = {
        screenshots: selected.map(s => ({
          dataUrl: s.dataUrl,
          label: s.label,
          cameraAngle: s.cameraAngle,
          studioMode: s.studioMode,
          seed: s.seed,
        })),
        prompt,
        analysisType,
      };

      // Include docs for full analysis
      if (analysisType === "full") {
        body.docs = [
          "ProVeg Studio is a procedural 3D tree and rock generator built with Three.js. The tree engine uses a unified recursive branching system where the trunk is the primary (order 0) branch.",
        ];
      }

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-analyst`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          setAiResponse("⚠️ Rate limited. Please wait a moment and try again.");
        } else if (resp.status === 402) {
          setAiResponse("⚠️ Credits depleted. Add credits in Settings → Workspace → Usage.");
        } else {
          setAiResponse(`⚠️ Analysis failed (${resp.status}). Please try again.`);
        }
        setIsAnalyzing(false);
        return;
      }

      // Stream the response
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              setAiResponse(fullResponse);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error("Analysis error:", e);
      setAiResponse(`⚠️ Error: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [screenshots, selectedScreenshots]);

  return (
    <div className="flex flex-col h-full">
      {/* Capture buttons */}
      <div className="editor-section">
        <div className="editor-section-title">Capture</div>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-7 text-[10px] gap-1"
            onClick={handleManualCapture}
          >
            <Camera className="h-3 w-3" /> Snapshot
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-7 text-[10px] gap-1"
            onClick={handleAutoCapture}
          >
            <Orbit className="h-3 w-3" /> Auto Angles
          </Button>
        </div>
      </div>

      {/* Screenshot gallery */}
      {screenshots.length > 0 && (
        <div className="editor-section">
          <div className="editor-section-title">
            Screenshots ({selectedScreenshots.size}/{screenshots.length} selected)
          </div>
          <div className="grid grid-cols-3 gap-1">
            {screenshots.map((ss) => (
              <div
                key={ss.id}
                className={`relative group cursor-pointer rounded overflow-hidden border transition-all ${
                  selectedScreenshots.has(ss.id)
                    ? "border-primary ring-1 ring-primary/30"
                    : "border-border hover:border-muted-foreground"
                }`}
                onClick={() => toggleScreenshot(ss.id)}
              >
                <img
                  src={ss.dataUrl}
                  alt={ss.label}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 px-1 py-0.5">
                  <span className="text-[8px] text-muted-foreground truncate block">
                    {ss.cameraAngle}
                  </span>
                </div>
                <button
                  className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/80 rounded p-0.5"
                  onClick={(e) => { e.stopPropagation(); deleteScreenshot(ss.id); }}
                >
                  <Trash2 className="h-2.5 w-2.5 text-destructive-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis presets */}
      <div className="editor-section">
        <div className="editor-section-title">AI Analysis</div>
        <div className="grid grid-cols-2 gap-1">
          {ANALYSIS_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              className="h-7 text-[10px] gap-1"
              disabled={isAnalyzing}
              onClick={() => runAnalysis(preset.prompt, preset.type)}
            >
              <Sparkles className="h-3 w-3" />
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom prompt */}
      <div className="editor-section">
        <div className="flex gap-1">
          <textarea
            ref={textareaRef}
            className="flex-1 bg-input border border-border rounded px-2 py-1.5 text-[11px] text-foreground resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            rows={2}
            placeholder="Ask the AI anything about the current model..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (customPrompt.trim()) {
                  runAnalysis(customPrompt, "full");
                  setCustomPrompt("");
                }
              }
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            disabled={isAnalyzing || !customPrompt.trim()}
            onClick={() => {
              if (customPrompt.trim()) {
                runAnalysis(customPrompt, "full");
                setCustomPrompt("");
              }
            }}
          >
            {isAnalyzing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* AI Response */}
      {aiResponse && (
        <div className="flex-1 min-h-0">
          <div className="editor-section-title px-0">Response</div>
          <ScrollArea className="h-[300px]">
            <div className="text-[11px] leading-relaxed text-foreground whitespace-pre-wrap pr-2">
              {aiResponse}
            </div>
          </ScrollArea>
        </div>
      )}

      {isAnalyzing && !aiResponse && (
        <div className="flex items-center gap-2 py-4 justify-center text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-[11px]">Analyzing...</span>
        </div>
      )}
    </div>
  );
}
