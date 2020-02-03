import * as React from 'react';

type FormGroupProps = {
  label: string;
  name: string;
  value: string | string[];
};

export default function Field({ label, name, value }: FormGroupProps) {
  return (
    <div className="formGroup">
      <label htmlFor={name}>{label}</label>
      <input type="text" name={name} defaultValue={value} />
    </div>
  );
}
