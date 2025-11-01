import React from 'react';
import { useRouter } from 'next/router';

export default function LanguageSelector() {
  const router = useRouter();
  const { locale, pathname, query, asPath } = router;

  const changeLanguage = (newLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <div className="lang-selector">
      <button
        onClick={() => changeLanguage('en')}
        className={`lang-button ${locale === 'en' ? 'active' : ''}`}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('hi')}
        className={`lang-button ${locale === 'hi' ? 'active' : ''}`}
      >
        हिंदी
      </button>
    </div>
  );
}

