// https://ja.reactjs.org/docs/error-boundaries.html
// https://speakerdeck.com/taro28/reactnosuspensewoshi-tutafei-tong-qi-chu-li-noerahandoringu

import React, { ErrorInfo } from "react";

type ErrorBoundaryProps = {
    children: JSX.Element;
    onError: (error: Error) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
    constructor(props: ErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false };
    }
  
    // クラスコンポーネントに、ライフサイクルメソッドの static getDerivedStateFromError() か componentDidCatch() のいずれか（または両方）を定義すると、error boundary になります。
    static getDerivedStateFromError(error: unknown) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      // You can also log the error to an error reporting service
      console.log("this.state.hasError", this.state.hasError);
      console.log(error);
      console.log(errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong.</h1>;
      }
  
      return this.props.children; 
    }
}

export default ErrorBoundary