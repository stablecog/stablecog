import { env } from '$env/dynamic/public';
import * as React from 'react';

import { Container, useTheme } from '@mui/joy';
import { CssVarsProvider } from '@mui/joy';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Chat } from '$routes/ai-chat/components/Chat';
import { NoSSR } from '$routes/ai-chat/components/util/NoSSR';
import { isValidOpenAIApiKey, SettingsModal } from '$routes/ai-chat/components/dialogs/SettingsModal';
import { useSettingsStore } from '$routes/ai-chat/lib/stores/store-settings';
import { ErrorBoundary } from '$routes/ai-chat/pages/errorBoundary';

export default function Home() {
  // state
  const [settingsShown, setSettingsShown] = React.useState(false);

  // external state
  const theme = useTheme();
  const apiKey = useSettingsStore(state => state.apiKey);
  const centerMode = useSettingsStore(state => state.centerMode);


  // show the Settings Dialog at startup if the API key is required but not set
  React.useEffect(() => {
    if (!env.HAS_SERVER_KEY_OPENAI && !isValidOpenAIApiKey(apiKey))
      setSettingsShown(true);
  }, [apiKey]);

  const [queryClient] = React.useState(() => new QueryClient());
  
  return (
    /**
     * Note the global NoSSR wrapper
     *  - Even the overall container could have hydration issues when using localStorage and non-default maxWidth
     */
    <ErrorBoundary>
      {/* Rect-query provider */}
      <QueryClientProvider client={queryClient}>
        <CssVarsProvider defaultMode='light' theme={theme}>
          <NoSSR>

            <Container maxWidth={centerMode === 'full' ? false : centerMode === 'narrow' ? 'md' : 'xl'} disableGutters sx={{
              boxShadow: {
                xs: 'none',
                md: centerMode === 'narrow' ? theme.vars.shadow.md : 'none',
                xl: centerMode !== 'full' ? theme.vars.shadow.lg : 'none',
              },
            }}>

              <Chat onShowSettings={() => setSettingsShown(true)} />

              <SettingsModal open={settingsShown} onClose={() => setSettingsShown(false)} />

            </Container>

          </NoSSR>
        </CssVarsProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}