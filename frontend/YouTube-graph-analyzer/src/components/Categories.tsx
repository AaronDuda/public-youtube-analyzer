import { Autocomplete, TextField } from '@mui/material';

const categories = [
  'All Categories',
  'Entertainment',
  'Comedy',
  'News & Politics',
  'Music',
  'Science & Technology',
  'Nonprofits & Activism',
  'People & Blogs',
  'Howto & Style',
  'Sports',
  'Autos & Vehicles',
  'Film & Animation',
  'UNA',
  'Education',
  'Pets & Animals',
  'Travel & Events',
];

export type CategoriesProps = {
  selectedItems: string[];
  onChange: (value: string[]) => void;
};

export default function Categories({ selectedItems, onChange }: CategoriesProps) {
  return (
    <Autocomplete
      multiple
      options={categories}
      value={selectedItems}
      onChange={(_event, value) => onChange(value)}
      renderInput={(params) => <TextField {...params} label="Categories" />}
    />
  );
}

