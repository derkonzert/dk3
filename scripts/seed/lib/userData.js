module.exports = [
  {
    username: "ju",
    email: "jus@email.com",
    emailVerified: true,
    password: "juspassword",
    skills: ["MAGIC"],
  },
  {
    username: "gwen",
    email: "gwens@email.com",
    emailVerified: true,
    password: "gwenspassword",
    skills: ["LOGIN"],
  },
  {
    username: "pierre",
    email: "pierres@email.com",
    emailVerified: true,
    password: "pierrespassword",
    skills: ["LOGIN"],
  },
  {
    username: "martha",
    email: "marthas@email.com",
    emailVerified: true,
    password: "marthaspassword",
    skills: ["LOGIN"],
  },
  {
    /* A clumsy user who typed in the wrong email, and therefore hasnt verified it */
    username: "clumsy",
    email: "clumsys@email.com",
    emailVerified: false,
    password: "clumsyspassword",
    skills: ["LOGIN"],
  },
  {
    /* A user who's not allowed to log in */
    username: "belzebub",
    email: "belzebubs@email.com",
    emailVerified: true,
    password: "belzebubspassword",
    skills: [],
  },
]
