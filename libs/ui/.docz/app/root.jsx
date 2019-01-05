import React from 'react'
import { hot } from 'react-hot-loader'
import Theme from 'docz-theme-default'

import Wrapper from 'utils/doczWrapper'

const Root = () => <Theme wrapper={Wrapper} />

export default hot(module)(Root)
