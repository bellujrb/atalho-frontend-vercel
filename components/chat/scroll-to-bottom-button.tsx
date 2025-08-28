import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollToBottomButtonProps {
  isVisible: boolean;
  onClick: () => void;
  className?: string;
}

export function ScrollToBottomButton({ 
  isVisible, 
  onClick, 
  className = '' 
}: ScrollToBottomButtonProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`fixed bottom-44 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
        >
          <Button
            onClick={onClick}
            size="sm"
            variant="outline"
            title="Voltar ao final da conversa"
          >
            <ChevronDown className="w-5 h-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
