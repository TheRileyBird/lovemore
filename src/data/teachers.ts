import joellenImage from '../assets/images/joellen.jpg';
import domImage from '../assets/images/dom.jpg';
import jaxImage from '../assets/images/jax.jpg';

export interface Teacher {
	name: string;
	title: string;
	image: ImageMetadata;
	bio?: string;
	slug?: string;
}

export const teachers: Teacher[] = [
	{
		name: 'JoEllen Luke',
		title: 'Founder & Lead Instructor',
		image: joellenImage,
		slug: 'joellen-luke'
	},
	{
		name: 'Dom Luke',
		title: 'Movement Instructor',
		image: domImage,
		slug: 'dom-luke'
	},
	{
		name: 'Jax Hurst',
		title: 'Wellness Instructor',
		image: jaxImage,
		slug: 'jax-hurst'
	}
];
