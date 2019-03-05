require("@babel/polyfill")

var enzyme = require("enzyme")
var Adapter = require("enzyme-adapter-react-16")

enzyme.configure({ adapter: new Adapter() })

window.scrollTo = () => {}
window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  addListener: jest.fn(),
  removeListener: jest.fn(),
}))
