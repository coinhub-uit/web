'use client';
import useToggleThemes from '@/lib/hooks/useToggleThemes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Logo = () => {
  const { isDark } = useToggleThemes();
  const [logoSrc, setLogoSrc] = useState('/images/Coinhub-Wordmark.png');

  useEffect(() => {
    setLogoSrc(
      isDark
        ? '/images/coinhub-wordmark-white.png'
        : '/images/Coinhub-Wordmark.png',
    );
  }, [isDark]);

  return (
    <Link
      href="/"
      className="hover:bg-base-300 rounded-lg pt-2 pr-6 pb-2 pl-6 transition-colors duration-200"
    >
      <Image src={logoSrc} alt="Logo" width={100} height={100} />
    </Link>
  );
};

export default Logo;
