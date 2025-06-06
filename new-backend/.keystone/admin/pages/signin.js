import { getSigninPage } from '@keystone-6/auth/pages/SigninPage'

export default getSigninPage({"identityField":"username","secretField":"password","mutationName":"authenticateUserWithPassword","successTypename":"UserAuthenticationWithPasswordSuccess","failureTypename":"UserAuthenticationWithPasswordFailure"});
