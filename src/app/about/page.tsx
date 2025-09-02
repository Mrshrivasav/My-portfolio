import About from '@/pages/About';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'About Diggaj Raj - Software Developer and ML engeenier',
	description: 'Learn about Diggaj Raj, a full-stack developer with expertise in building web applications with React, Node.js, and modern web technologies with Ml and Data Science',
};

export default function AboutPage() {
	return <About />;
}