import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import type { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { useId } from 'react';

type FieldProps = OutlinedInputProps & {
  label: string;
  helperText?: string;
};

export function Field({ label, helperText, id, ...inputProps }: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FormControl fullWidth error={inputProps.error}>
      <FormLabel htmlFor={inputId} sx={{ mb: 0.75 }}>
        {label}
      </FormLabel>
      <OutlinedInput id={inputId} size="small" {...inputProps} />
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
}
