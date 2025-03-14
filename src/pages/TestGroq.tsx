import React, { useState } from 'react';
import { testGroqConnection } from '../lib/groq';
import { motion } from 'framer-motion';
import Spinner from '../components/ui/spinner';

const TestGroq: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleTestConnection = async () => {
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const response = await testGroqConnection();
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card shadow-xl rounded-xl p-6 border border-border"
      >
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Groq API Test</h1>
            <p className="text-muted-foreground mt-2">
              Test your Groq API connection
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleTestConnection}
              disabled={loading}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md flex items-center justify-center transition-colors disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Spinner className="mr-2" size="sm" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-md">
              <h3 className="font-medium text-destructive mb-2">Error</h3>
              <p className="text-sm text-destructive-foreground">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-md">
              <h3 className="font-medium text-primary mb-2">API Response</h3>
              <div className="text-sm prose max-w-none">
                <pre className="whitespace-pre-wrap bg-background p-3 rounded-md">{result}</pre>
              </div>
            </div>
          )}

          <div className="p-4 bg-muted rounded-md text-sm">
            <h3 className="font-medium mb-2">Debug Info</h3>
            <p>API Key Status: {process.env.NEXT_PUBLIC_GROQ_API_KEY ? 'Available' : 'Missing'}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Make sure you have set NEXT_PUBLIC_GROQ_API_KEY in your .env.local file
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TestGroq;