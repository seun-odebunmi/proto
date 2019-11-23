import moment from 'moment';

export const UTILS = {
  formatDate: date =>
    moment.parseZone(new Date(date)).format('YYYY-MM-DD HH:mm:ss'),
  now: () => moment({}).format('YYYY-MM-DD HH:mm:ss'),
  filterObjKeys: (inputObj, obj) => {
    let newObj = { ...obj };
    const keys = Object.keys(inputObj);

    Object.keys(obj).map(key => {
      keys.indexOf(key) < 0 && delete newObj[key];
    });

    return newObj;
  },
  status: { duplicate: 'DUPLICATE', success: 'SUCCESS', error: 'ERROR' },
  requestStatus: ['PENDING', 'APPROVED', 'DECLINED'],
  requests: [
    { key: 'DISABLE_USER', model: '', action: '', action: '' },
    { key: 'ENABLE_USER', model: '', action: '', action: '' },
    { key: 'DISABLE_DEVICE', model: '', action: '' },
    { key: 'ENABLE_DEVICE', model: '', action: '' },
    { key: 'RELEASE_DEVICE', model: '', action: '' },
    { key: 'CREATE_PORTAL_USER', model: 'Users', action: 'createUser' },
    { key: 'EDIT_PORTAL_USER', model: 'Users', action: 'updateUser' },
    { key: 'ENABLE_PORTAL_USER', model: 'Users', action: 'activateUser' },
    { key: 'DISABLE_PORTAL_USER', model: 'Users', action: 'deactivateUser' },
    { key: 'CREATE_BANK', model: '', action: '' },
    { key: 'EDIT_BANK', model: '', action: '' },
    { key: 'ENABLE_BANK', model: '', action: '' },
    { key: 'DISABLE_BANK', model: '', action: '' },
    { key: 'CREATE_BILLER', model: '', action: '' },
    { key: 'EDIT_BILLER', model: '', action: '' },
    { key: 'ENABLE_BILLER', model: '', action: '' },
    { key: 'DISABLE_BILLER', model: '', action: '' },
    { key: 'CREATE_CATEGORY', model: '', action: '' },
    { key: 'EDIT_CATEGORY', model: '', action: '' },
    { key: 'ENABLE_CATEGORY', model: '', action: '' },
    { key: 'DISABLE_CATEGORY', model: '', action: '' },
    { key: 'CREATE_PRODUCT', model: '', action: '' },
    { key: 'EDIT_PRODUCT', model: '', action: '' },
    { key: 'ENABLE_PRODUCT', model: '', action: '' },
    { key: 'DISABLE_PRODUCT', model: '', action: '' },
    { key: 'CREATE_ROLE', model: 'Roles', action: 'createRole' },
    { key: 'EDIT_ROLE', model: 'Roles', action: 'updateRole' },
    { key: 'CREATE_MENU', model: '', action: '' },
    { key: 'EDIT_MENU', model: '', action: '' },
    { key: 'CREATE_CUSTOMER_LIMIT', model: '', action: '' },
    { key: 'EDIT_CUSTOMER_LIMIT', model: '', action: '' },
    { key: 'DELETE_CUSTOMER_LIMIT', model: '', action: '' },
    { key: 'EDIT_GLOBAL_SETTING', model: '', action: '' },
    { key: 'RESET_PASSWORD', model: '', action: '' },
    { key: 'RESET_PIN', model: '', action: '' },
    { key: 'SECURITY_QUIZ_AND_ANSWER', model: '', action: '' },
    { key: 'EDIT_GLOBAL_AUTH_LIMIT', model: '', action: '' },
    { key: 'CREATE_BRANCH', model: 'Branches', action: 'createBranch' },
    { key: 'EDIT_BRANCH', model: 'Branches', action: 'updateBranch' },
    { key: 'RELEASE_CUSTOMER', model: '', action: '' },
    { key: 'CHANGE_PASSWORD', model: '', action: '' },
    { key: 'DELETE_PORTAL_USER', model: '', action: '' },
    { key: 'PORTAL_USER_LOGIN', model: '', action: '' },
    { key: 'ENROLL_CUSTOMER', model: '', action: '' },
    { key: 'ADD_ROLE_FUNCTION', model: '', action: '' },
    { key: 'ENABLE_BRANCH', model: 'Branches', action: 'activateBranch' },
    { key: 'DISABLE_BRANCH', model: 'Branches', action: 'deactivateBranch' },
    { key: 'APPROVE_SERVICE_REQUEST', model: '', action: '' },
    { key: 'DECLINE_SERVICE_REQUEST', model: '', action: '' },
    { key: 'IN_PROGRESS_SERVICE_REQUEST', model: '', action: '' },
    { key: 'UPDATE_PORTAL_PASSWORD_POLICY', model: '', action: '' },
    { key: 'UPDATE_APP_PASSWORD_POLICY', model: '', action: '' },
    { key: 'EDIT_SETTING', model: '', action: '' },
    {
      key: 'CREATE_INSTITUTION',
      model: 'Institutions',
      action: 'createInstitution'
    },
    {
      key: 'UPDATE_INSTITUTION',
      model: 'Institutions',
      action: 'updateInstitution'
    },
    {
      key: 'CREATE_COUNTRY',
      model: 'Countries',
      action: 'createCountry'
    },
    {
      key: 'UPDATE_COUNTRY',
      model: 'Countries',
      action: 'updateCountry'
    }
  ]
};
