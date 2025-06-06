import { getInitPage } from '@keystone-6/auth/pages/InitPage';

const fieldPaths = ["username","password"];

export default getInitPage({"listKey":"User","fieldPaths":["username","password"],"enableWelcome":true});
