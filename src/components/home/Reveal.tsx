import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -48px', threshold: 0.08 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = { '--reveal-delay': `${delay}ms` } as CSSProperties;

  return (
    <div ref={elementRef} className={`reveal-on-scroll ${isVisible ? 'reveal-on-scroll-visible' : ''} ${className}`} style={style}>
      {children}
    </div>
  );
}
