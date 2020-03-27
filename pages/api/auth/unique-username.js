import auth from "../../../services/auth/lib/auth"

export default async function(req, res) {
  return await auth("unique-username", req, res)
}
