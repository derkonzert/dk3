export const hasSkill = (user, skill) => {
  if (!user || !user.skills) {
    return false
  }

  if (user.skills.indexOf(skill) >= 0) {
    return true
  }

  if (user.skills.indexOf("MAGIC") >= 0) {
    return true
  }

  return false
}
