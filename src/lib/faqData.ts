export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: 'How do I turn a Letterboxd review into an Instagram Story?',
    answer:
      'Open the studio, paste the review URL and press Create Story. Pick a template, adjust the design and download the image. Then add it to Instagram as a Story.',
  },
  {
    question: 'Do I need an account?',
    answer: 'No. There is nothing to sign up for. Your saved drafts stay in your browser.',
  },
  {
    question: 'What sizes can I export?',
    answer: '9:16 for Stories, 4:5 for portrait posts, 1:1 for square posts and 16:9 for landscape.',
  },
  {
    question: 'Is StoryBoxd connected to Letterboxd?',
    answer: "No. StoryBoxd is an independent project and isn't affiliated with Letterboxd.",
  },
];

