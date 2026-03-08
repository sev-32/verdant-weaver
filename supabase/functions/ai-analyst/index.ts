import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { screenshots, prompt, docs, codeSnippets, analysisType } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build the system prompt based on analysis type
    const systemPrompt = `You are an expert AI analyst for ProVeg Studio, a procedural 3D tree and rock generation engine. You specialize in:

1. **Visual Realism Analysis**: Evaluating procedural geometry for botanical/geological accuracy — trunk taper, branch distribution, crown shape, bark texture, leaf density, rock erosion patterns, etc.
2. **Code Architecture Review**: Analyzing Three.js/TypeScript generator code for performance, correctness, and quality improvements.
3. **Parameter Recommendations**: Suggesting specific slider/parameter values to achieve more realistic or artistic results.
4. **Full System Rebuild Guidance**: When the system needs fundamental rework, provide clear architectural direction with priorities.

When analyzing screenshots:
- Look for unrealistic geometry (flat tops, bolted-on branches, unnatural angles)
- Evaluate taper continuity from trunk to branches
- Check branch distribution and crown density
- Assess lighting and material quality
- Note any visual artifacts or mesh issues

When analyzing code:
- Focus on the tree/rock generation algorithms
- Look for mathematical errors in taper, branching, and growth formulas
- Suggest optimizations for vertex generation
- Identify architectural issues

Always be specific and actionable. Reference exact parameter names and values when possible. Be brutally honest about quality issues.`;

    // Build message content array
    const content: any[] = [];

    // Add screenshots as images
    if (screenshots && screenshots.length > 0) {
      for (const ss of screenshots) {
        if (ss.dataUrl) {
          content.push({
            type: "image_url",
            image_url: { url: ss.dataUrl },
          });
          content.push({
            type: "text",
            text: `[Screenshot: ${ss.label} | Angle: ${ss.cameraAngle} | Mode: ${ss.studioMode} | Seed: ${ss.seed}]`,
          });
        }
      }
    }

    // Add documentation context
    if (docs && docs.length > 0) {
      content.push({
        type: "text",
        text: `\n--- PROJECT DOCUMENTATION ---\n${docs.join("\n\n---\n\n")}`,
      });
    }

    // Add code snippets
    if (codeSnippets && codeSnippets.length > 0) {
      content.push({
        type: "text",
        text: `\n--- CODE SNIPPETS ---\n${codeSnippets.map((s: any) => `// ${s.file}\n${s.code}`).join("\n\n")}`,
      });
    }

    // Add user prompt
    content.push({ type: "text", text: prompt });

    // Choose model based on analysis type
    // Use Gemini 3.1 Pro for complex reasoning + image analysis
    const model = analysisType === "visual-only"
      ? "google/gemini-2.5-flash"
      : "google/gemini-3.1-pro-preview";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits depleted. Please add credits in workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: `AI gateway error: ${response.status}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-analyst error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
