import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

export interface BreakpointState {
  width: number;
  height: number;
  device: DeviceType;
  orientation: Orientation;
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  isTouch: boolean;
}

export function useBreakpoint(): BreakpointState {
  const [state, setState] = useState<BreakpointState>(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;
    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    let device: DeviceType = 'desktop';
    if (w < 768) device = 'mobile';
    else if (w < 1024) device = 'tablet';
    else if (w < 1280) device = 'laptop';

    return {
      width: w,
      height: h,
      device,
      orientation: w >= h ? 'landscape' : 'portrait',
      isMobile: device === 'mobile',
      isTablet: device === 'tablet',
      isLaptop: device === 'laptop',
      isDesktop: device === 'desktop',
      isTouch,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      let device: DeviceType = 'desktop';
      if (w < 768) device = 'mobile';
      else if (w < 1024) device = 'tablet';
      else if (w < 1280) device = 'laptop';

      setState({
        width: w,
        height: h,
        device,
        orientation: w >= h ? 'landscape' : 'portrait',
        isMobile: device === 'mobile',
        isTablet: device === 'tablet',
        isLaptop: device === 'laptop',
        isDesktop: device === 'desktop',
        isTouch,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return state;
}
