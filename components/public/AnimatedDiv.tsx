import * as motion from "motion/react-client";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;       // kaç sn sonra başlasın
  duration?: number;    // animasyon süresi
  y?: number;           // dikey hareket
  x?: number;           // yatay hareket
  once?: boolean;       // bir kere mi çalışsın
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.8,
  y = 100,
  x = 0,
  once = false,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}