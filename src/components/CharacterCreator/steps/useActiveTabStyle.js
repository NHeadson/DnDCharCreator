import { computed, ref, toRefs } from 'vue';
import { useTheme } from 'vuetify';

export function useActiveTabStyle () {
  const theme = useTheme();
  return computed(() => {
    const primary = theme.current.value.colors.primary || '#1976d2';
    const onPrimary = theme.current.value.colors['on-primary'] || '#fff';
    return {
      background: primary,
      color: onPrimary,
      padding: '2px 12px',
      borderRadius: '8px',
      display: 'inline-block',
    };
  });
}
