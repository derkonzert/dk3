import auth from "../../../services/auth/lib/auth"

export default async function(req, res) {
  return await auth("signIn", req, res)
}
