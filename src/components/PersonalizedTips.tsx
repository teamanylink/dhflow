import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPersonalizedADHDTips, generateADHDContent, ContentType, ADHDProfile } from '@/utils/groq';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { motion } from 'framer-motion';

interface PersonalizedTipsProps {
  adhdType: string;
  focusScore: number;
  organizationScore: number;
  primaryChallenges: string[];
  contentType?: ContentType;
}

const PersonalizedTips: React.FC<PersonalizedTipsProps> = ({
  adhdType,
  focusScore,
  organizationScore,
  primaryChallenges,
  contentType = 'daily-tips'
}) => {
  const [tips, setTips] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>(contentType);
  const [generatingNew, setGeneratingNew] = useState<boolean>(false);

  const profile: ADHDProfile = {
    adhdType,
    focusScore,
    organizationScore,
    primaryChallenges,
    motivationLevel: 'Moderate',
    motivationScore: 3
  };

  // Content type options for the user to select from
  const contentTypeOptions: { value: ContentType; label: string }[] = [
    { value: 'daily-tips', label: 'Daily Tips' },
    { value: 'focus-strategies', label: 'Focus Strategies' },
    { value: 'organization-strategies', label: 'Organization Strategies' },
    { value: 'productivity-tips', label: 'Productivity Tips' },
    { value: 'emotional-regulation', label: 'Emotional Regulation' },
    { value: 'morning-routine', label: 'Morning Routine' }
  ];

  // Fetch initial personalized tips when component mounts
  useEffect(() => {
    async function fetchInitialTips() {
      try {
        setLoading(true);
        const initialTips = await getPersonalizedADHDTips(
          adhdType,
          focusScore,
          organizationScore,
          primaryChallenges
        );
        setTips(initialTips);
        setError(null);
      } catch (err) {
        console.error('Error fetching personalized tips:', err);
        setError('Unable to load personalized tips. Please try again later.');
        setTips('');
      } finally {
        setLoading(false);
      }
    }

    fetchInitialTips();
  }, [adhdType, focusScore, organizationScore, primaryChallenges]);

  // Generate new content based on selected content type
  const generateNewContent = async (type: ContentType) => {
    setGeneratingNew(true);
    setError(null);
    
    try {
      const newContent = await generateADHDContent(type, profile);
      setTips(newContent);
    } catch (err) {
      console.error(`Error generating ${type} content:`, err);
      setError(`Unable to generate ${type} content. Please try again later.`);
    } finally {
      setGeneratingNew(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-lg border-0 bg-white/80 backdrop-blur-md">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 pb-6">
          <CardTitle className="text-xl font-bold text-indigo-800 flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-purple-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>
            Your Personalized ADHD Strategies
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Spinner size="lg" />
              <p className="mt-4 text-indigo-600">Generating personalized strategies...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-600">
              {error}
              <Button 
                onClick={() => generateNewContent(selectedContentType)}
                className="mt-4 bg-red-100 text-red-700 hover:bg-red-200"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="prose prose-indigo max-w-none mb-6">
                <div dangerouslySetInnerHTML={{ __html: tips.replace(/\n/g, '<br />') }} />
              </div>
              
              <div className="mt-6 border-t border-indigo-100 pt-4">
                <p className="text-sm text-indigo-700 mb-3">Generate different strategies:</p>
                <div className="flex flex-wrap gap-2">
                  {contentTypeOptions.map(option => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={selectedContentType === option.value ? "default" : "outline"}
                      onClick={() => {
                        setSelectedContentType(option.value);
                        generateNewContent(option.value);
                      }}
                      disabled={generatingNew}
                      className={selectedContentType === option.value ? 
                        "bg-indigo-600 hover:bg-indigo-700" : 
                        "border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              {generatingNew && (
                <div className="flex items-center justify-center py-4">
                  <Spinner size="sm" />
                  <span className="ml-2 text-indigo-600 text-sm">Generating new content...</span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PersonalizedTips;