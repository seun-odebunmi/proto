require('dotenv/config')

const config = {
  client: {
    addTypename: false,
    service: {
      name: 'local',
      url: `http://${process.env.NODE_HOST}:${process.env.NODE_PORT}/graphql`
    }
  }
}

module.exports = config
