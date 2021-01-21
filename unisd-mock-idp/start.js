const { create } = require('fake-sso-idp')
const app = create({
  serviceProvider: {
    destination: 'http://127.0.0.1/saml2/acs',
    metadata: 'http://127.0.0.1/saml2/metadata'
  },
  users: [
    //SUPER ADMIN
    {
      id: 'test1',
      name: 'SuperAdmin Enrico Oliva',
      username: 'enrico',
      password: 'pwd',
      attributes: {
        pisa_id: {
          format: 'urn:oasis:names:tc:SAML:2.0:attrname-format:uri',
          value: 'super-admin',
          type: 'xs:string'
        },
       'urn:oid:2.16.840.1.113730.3.1.241':{
          format: 'urn:oasis:names:tc:SAML:2.0:attrname-format:uri',
          value: 'Enrico Oliva',
          type: 'xs:string'
        },
        'urn:oid:1.3.6.1.4.1.4203.666.11.11.1.0':{
          format: 'urn:oasis:names:tc:SAML:2.0:attrname-format:uri',
          value: 'LVONRC76C29L500F',
          type: 'xs:string'
        },
        'urn:oid:0.9.2342.19200300.100.1.3':{
          format:  'urn:oasis:names:tc:SAML:2.0:attrname-format:uri',
          value: 'enrico.oliva@uniurb.it',
          type: 'xs:string'
        },
      }
    },
  ]
  

})

app.listen(7000)