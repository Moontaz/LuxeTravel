"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { GSAPWrapperProps } from "@/lib/interface";

const GSAPWrapper: React.FC<GSAPWrapperProps> = ({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 0.6,
  stagger = 0.1,
  className = "",
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    // Check if element exists before animating
    if (!element) {
      console.warn("GSAP target element not found");
      return;
    }

    // Set initial state based on animation type
    switch (animation) {
      case "fadeIn":
        gsap.set(element, { opacity: 0 });
        break;
      case "slideUp":
        gsap.set(element, { opacity: 0, y: 30 });
        break;
      case "stagger":
        if (element.children && element.children.length > 0) {
          gsap.set(element.children, { opacity: 0, y: 20 });
        }
        break;
      default:
        break;
    }

    // Create timeline
    const tl = gsap.timeline({ delay });

    // Animate based on type
    switch (animation) {
      case "fadeIn":
        tl.to(element, { opacity: 1, duration });
        break;
      case "slideUp":
        tl.to(element, { opacity: 1, y: 0, duration, ease: "power2.out" });
        break;
      case "stagger":
        if (element.children && element.children.length > 0) {
          tl.to(element.children, {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            ease: "power2.out",
          });
        }
        break;
      default:
        break;
    }
  }, [animation, delay, duration, stagger]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default GSAPWrapper;
