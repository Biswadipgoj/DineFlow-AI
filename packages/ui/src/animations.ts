export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

export const slideUp = {
  initial: { y: 24, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit:    { y: 16, opacity: 0, transition: { duration: 0.15 } },
};

export const slideUpFull = {
  initial: { y: '100%' },
  animate: { y: 0, transition: { type: 'spring', stiffness: 280, damping: 32 } },
  exit:    { y: '100%', transition: { duration: 0.2 } },
};

export const bounceIn = {
  initial: { scale: 0.85, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } },
  exit:    { scale: 0.9, opacity: 0, transition: { duration: 0.15 } },
};

export const staggerChildren = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const kotCard = {
  initial: { x: -40, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 350, damping: 28 } },
  exit:    { x: 40, opacity: 0, transition: { duration: 0.2 } },
};
