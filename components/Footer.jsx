import { H } from '@/lib/legacy';

export default function Footer() {
  return <div dangerouslySetInnerHTML={{ __html: H.footer }} />;
}
