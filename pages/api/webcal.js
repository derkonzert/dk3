import webcal from "../../services/webcal/lib/webcal"

export default async function(req, res) {
  return await webcal(req, res)
}
