'use client';

import React from 'react';
import { track } from '@vercel/analytics';

export type ContactChannel = 'email' | 'instagram' | 'github' | 'linkedin' | 'issues';

interface ContactLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  channel: ContactChannel;
  children: React.ReactNode;
  className?: string;
}

export function ContactLink({
  href,
  channel,
  children,
  className,
  onClick,
  ...rest
}: ContactLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      track('contact_click', { channel });
    } catch {
      // ignore tracking errors
    }
    onClick?.(e);
  };

  return (
    <a href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

interface FeedbackLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function FeedbackLink({
  href,
  children,
  className,
  onClick,
  ...rest
}: FeedbackLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      track('feedback_click');
    } catch {
      // ignore tracking errors
    }
    onClick?.(e);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}

