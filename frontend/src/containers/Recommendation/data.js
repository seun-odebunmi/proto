export const columns = [
  {
    Header: 'Diagnosis',
    accessor: 'diagnosis.value',
  },
  {
    Header: 'Glasses_OD',
    accessor: 'glassesod.value',
  },
  {
    Header: 'Glasses_OS',
    accessor: 'glassesos.value',
  },
  {
    Header: 'VA_OD',
    accessor: 'vaod.value',
  },
  {
    Header: 'VA_OS',
    accessor: 'vaos.value',
  },
  {
    Header: 'PH_OD',
    accessor: 'phod.value',
  },
  {
    Header: 'PH_OS',
    accessor: 'phos.value',
  },
  {
    Header: 'Date',
    accessor: 'date',
  },
  {
    Header: 'Action',
    accessor: 'action',
    disableSortBy: true,
  },
];
