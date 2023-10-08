import { LoaderFunction } from "react-router";

import { toastMessageParamPath } from "../../utils/ToastMessages";
import { auth } from "../auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await auth.isAuthenticated(request, { failureRedirect: toastMessageParamPath("/", "error", "Not logged in", "You need to login first") });
  return await auth.logout(request, { redirectTo: toastMessageParamPath("/", "success", "Logged out", `Successfully logged you out ${user.displayName}`) });
};
