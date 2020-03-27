import cron from "../../services/cron/lib/cron"

export default async function(req, res) {
  return await cron(req, res)
}
