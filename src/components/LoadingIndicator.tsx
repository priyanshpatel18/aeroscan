import { motion } from "framer-motion";
import { CloudIcon } from "lucide-react";

interface LoadingIndicatorProps {
  message: string;
}

export default function LoadingIndicator({ message }: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <CloudIcon className="w-12 h-12 text-primary" />
      </motion.div>
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  );
}
