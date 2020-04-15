import FormInputs from '../../Shared/FormInputs';

export const formFields = [
  {
    type: 'text',
    name: 'username',
    label: 'Username',
    component: FormInputs,
    required: true,
  },
  {
    type: 'password',
    name: 'password',
    label: 'Password',
    component: FormInputs,
    required: true,
  },
];
