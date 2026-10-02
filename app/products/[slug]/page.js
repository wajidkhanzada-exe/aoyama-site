import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/ProductDetail';
import { PRODUCTS, getProduct } from '@/lib/products';

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  return { title: p ? `${p.name} | Aoyama Elevator` : 'Product not found' };
}
export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  return (
    <>
      <Navbar />
      <main className="bg-[#0A0A0A] pt-20"><ProductDetail product={p} /></main>
      <Footer />
    </>
  );
}
