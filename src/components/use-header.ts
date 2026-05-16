import { useEffect, useRef } from 'react';
import { useRoutePath } from '../shared/use-route-params';

export const useHeaderVideo = (items: { path: string }[]) => {
  const currentPath = useRoutePath();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isMounted = useRef(false);
  const itemsRef = useRef(items);

  const playVideo = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) {
      return;
    }
    video.currentTime = 0;
    void video.play();
  };

  useEffect(() => {
    itemsRef.current.forEach((_, index) => {
      playVideo(index);
    });
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const index = itemsRef.current.findIndex((item) => item.path === currentPath);
    if (index < 0) {
      return;
    }
    playVideo(index);
  }, [currentPath]);

  const handleMouseEnter = (index: number) => {
    playVideo(index);
  };

  const setVideoRef = (index: number) => (el: HTMLVideoElement | null) => {
    videoRefs.current[index] = el;
  };

  return { setVideoRef, handleMouseEnter, currentPath };
};
