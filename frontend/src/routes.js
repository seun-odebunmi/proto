import LoginPage from './containers/Account/Login';
import RegisterPage from './containers/Account/Register';
import ChatPage from './containers/Chat';

const routeOptions = [
  { component: ChatPage, path: '/', exact: true },
  { component: LoginPage, path: '/Login', exact: true },
  { component: RegisterPage, path: '/Register', exact: true },
];

export default routeOptions;
