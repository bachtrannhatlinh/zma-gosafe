import React from 'react';
import { Page, Text, Button, Box } from 'zmp-ui';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Page>
          <Box className="p-4 text-center">
            <Text className="text-red-500 mb-4">
              Có lỗi xảy ra: {this.state.error?.message}
            </Text>
            <Button onClick={() => window.location.reload()}>
              Tải lại
            </Button>
          </Box>
        </Page>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;