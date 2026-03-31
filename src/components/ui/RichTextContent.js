import React from 'react';
import cn from '../../utils/cn';

export default function RichTextContent({ html, className }) {
  return <div className={cn('ui-richtext', className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
