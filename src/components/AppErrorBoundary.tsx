import React from "react";

interface State {
  error: Error | null;
}

export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("AppErrorBoundary:", error, info);
  }

  render() {
    if (this.state.error) {
      const e = this.state.error;
      return (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#0d0f14",
            color: "#f87171",
            padding: 24,
            fontFamily: "monospace",
            fontSize: 14,
            overflow: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          <strong style={{ fontSize: 18 }}>ProVeg Studio Error</strong>
          {"\n\n"}
          {e.message}
          {"\n\n"}
          {e.stack}
        </div>
      );
    }
    return this.props.children;
  }
}
