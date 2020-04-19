import FormInputs from '../../Shared/FormInputs';
import FormSelect from '../../Shared/FormInputs/select';

export const formFields = [
  {
    type: 'text',
    name: 'name',
    label: 'Name',
    component: FormInputs,
    required: true,
  },
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
  {
    type: 'number',
    name: 'age',
    label: 'Age',
    component: FormInputs,
    required: true,
  },
  {
    name: 'gender',
    label: 'Gender',
    component: FormSelect,
    options: [
      { id: 1, name: 'Male' },
      { id: 2, name: 'Female' },
    ],
    required: true,
  },
];
