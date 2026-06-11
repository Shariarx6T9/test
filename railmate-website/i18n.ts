import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => {
  // Ensure locale is valid, fallback to 'en'
  const activeLocale = locale || 'en';
  
  let messages;
  try {
    messages = (await import(`./lib/i18n/${activeLocale}.json`)).default;
  } catch (error) {
    messages = (await import('./lib/i18n/en.json')).default;
  }
 
  return {
    locale: activeLocale,
    messages,
  };
});
