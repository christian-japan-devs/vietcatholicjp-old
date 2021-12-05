export const endpoint = process.env.REACT_APP_API_END_POINT;

//Authentication endpoint Api
export const loginEndPoint = `${endpoint}/api/token`;
export const tokenRefresh = `${endpoint}/api/token/refresh`;
export const signup = `${endpoint}/signup`;
export const signupVerify = `${endpoint}/signup/verify`;
export const logout = `${endpoint}/logout/`;
export const requestPassword = `${endpoint}/password/reset/`;
export const requestPasswordVerify = `${endpoint}/password/reset/verify`;
export const passwordChange = `${endpoint}/password/change/`;
export const emailChange = `${endpoint}/email/change/`;
export const userMe = `${endpoint}/users/me/`;

//Monthly Topic endpoint Api

export const churchURL = `${endpoint}/church`;
export const churchDetailURL = (id: number) => `${endpoint}/church/${id}/detail`;

//Mass registration endpoint Api
//Available Masses
export const getListMassURL = `${endpoint}/api/getmass`
export const myRegisterByChurchIdURL = (churchId: number) =>
  `${endpoint}/api/massregister/?churchId=${churchId}`;
export const massRegisterCreateURL = `${endpoint}/api/massregister`;
export const registerUpdateURL = (id: number) =>
  `${endpoint}/api/massregister/${id}/update`;