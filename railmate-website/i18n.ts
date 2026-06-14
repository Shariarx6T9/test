import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale} from './lib/i18n/navigation';

export default getRequestConfig(async ({requestLocale}) => {
  // `requestLocale` corresponds to the `[locale]` route segment matched by
  // the middleware. It can be `undefined`/invalid for requests outside of
  // the `[locale]` segment, so we validate and fall back to the default.
  const requested = await requestLocale;
  const activeLocale = locales.includes(requested as (typeof locales)[number])
    ? (requested as (typeof locales)[number])
    : defaultLocale;

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
