import LoginPage from './containers/Account/Login';
import RegisterPage from './containers/Account/Register';
import ChatPage from './containers/Chat';
import DiagnosisPage from './containers/Diagnosis';

const routeOptions = [
  { component: ChatPage, path: '/', exact: true },
  { component: LoginPage, path: '/Login', exact: true },
  { component: RegisterPage, path: '/Register', exact: true },
  { component: DiagnosisPage, path: '/Diagnosis', exact: true },
];

export default routeOptions;
