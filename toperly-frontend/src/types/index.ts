export interface Program {
  id: number;
  title: string;
  description: string;
  image: string;
  format: string;
  eligibility: string;
  duration: string;
  deadline: string;
  category: 'undergraduate' | 'postgraduate' | 'executive';
}

export interface Tab {
  id: string;
  label: string;
  value: 'undergraduate' | 'postgraduate' | 'executive';
}