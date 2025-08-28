import './globals.css';
import { ClerkProviderWrapper } from '@/components/clerk-provider-wrapper';
import { ScriptWrapper } from '@/components/script-wrapper';
import { ProvidersWrapper } from '@/components/providers-wrapper';
import { ContextsWrapper } from '@/components/contexts-wrapper';
import { FontsWrapper } from '@/components/fonts-wrapper';
import { MetadataWrapper } from '@/components/metadata-wrapper';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <MetadataWrapper />
      </head>
      <body className="antialiased">
        <FontsWrapper>
          <ClerkProviderWrapper>
            <ProvidersWrapper>
              <ScriptWrapper />
              <ContextsWrapper>
                {children}
              </ContextsWrapper>
            </ProvidersWrapper>
          </ClerkProviderWrapper>
        </FontsWrapper>
      </body>
    </html>
  );
}
