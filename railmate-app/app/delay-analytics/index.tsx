import { Redirect, useLocalSearchParams } from 'expo-router';
export default function DelayAnalyticsRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={`/delay-analytics?id=${id ?? ''}` as any} />;
}
