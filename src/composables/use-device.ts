import { ref, onMounted, onUnmounted } from "vue";

export function useDevice(breakpoint = 768) {
  const isMobile = ref(false);
  let mediaQuery: MediaQueryList | undefined;

  const update = (e: MediaQueryListEvent) => {
    isMobile.value = e.matches;
  };

  onMounted(() => {
    mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    isMobile.value = mediaQuery.matches;
    mediaQuery.addEventListener("change", update);
  });

  onUnmounted(() => {
    mediaQuery?.removeEventListener("change", update);
  });

  return { isMobile };
}
