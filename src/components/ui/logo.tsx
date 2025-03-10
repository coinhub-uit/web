'use client';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Logo = () => {
  const { theme } = useTheme();
  const LogoSource =
    theme === 'dracula'
      ? '/images/coinhub-wordmark-white.png'
      : '/images/Coinhub-Wordmark.png';
  return (
    <Link
      href="/"
      className="hover:bg-base-300 rounded-lg pt-2 pr-6 pb-2 pl-6 transition-colors duration-200"
    >
      <Image src={LogoSource} alt="Logo" width={100} height={100} />
    </Link>
  );
};

export default Logo;
