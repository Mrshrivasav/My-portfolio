import Contact from '@/pages/Contact';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Contact - Diggaj Raj',
	description: 'Get in touch with Diggaj Raj, a Software Developer specializing in full-stack development with Ml and Data Science.',
};

export default function ContactPage() {
	return <Contact />;
}