// @ts-nocheck
import React from 'react'
import {
  ApplicationProvider,
  useData,
} from 'unitx-ui'
import { RDFType } from '@type'
import { DATA_TYPE, EVENT } from '@utils/constants'
import { DataEditor } from './components/GraphEditor/DataEditor'
import { Graph } from './components'
import { MockTripleItemProps } from './components/GraphEditor/DataEditor/TripleItem'

export default () => (
  <ApplicationProvider>
    <Graph
      style={{ width: '100%', height: 250 }}
      nodes={[
        {
          id: '1',
          position: { x: 10, y: 10 },
          data: { city: 'Amsterdam', color: 'red' },
        },
        {
          id: '2',
          position: { x: 300, y: 10 },
          data: { city: 'Maastricht', color: 'blue' },
        },
      ]}
      edges={[
        { id: 51, source: '1', target: '2' },
      ]}
      renderNode={({ item: { data } }) => (
        <Graph.View
          style={{ width: 100, height: 100, backgroundColor: data.color }}
        >
          <Graph.Text
            style={{ fontSize: 20 }}
          >
            {data.city}
          </Graph.Text>
        </Graph.View>
      )}
    />
  </ApplicationProvider>

)

const RDFData = {
  Person: 'http://xmlns.com/foaf/0.1/Person',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  name: 'http://xmlns.com/foaf/0.1/name',
  nickname: 'http://xmlns.com/foaf/0.1/nick',
  affiliation: 'http://schema.org/affiliation',
  depiction:
  {
    '@id': 'http://xmlns.com/foaf/0.1/depiction',
    '@type': '@id',
  },
  image:
  {
    '@id': 'http://xmlns.com/foaf/0.1/img',
    '@type': '@id',
  },
  born:
  {
    '@id': 'http://schema.org/birthDate',
    '@type': 'xsd:date',
  },
  child:
  {
    '@id': 'http://schema.org/children',
    '@type': '@id',
  },
  colleague:
  {
    '@id': 'http://schema.org/colleagues',
    '@type': '@id',
  },
  knows:
  {
    '@id': 'http://xmlns.com/foaf/0.1/knows',
    '@type': '@id',
  },
  died:
  {
    '@id': 'http://schema.org/deathDate',
    '@type': 'xsd:date',
  },
  email:
  {
    '@id': 'http://xmlns.com/foaf/0.1/mbox',
    '@type': '@id',
  },
  familyName: 'http://xmlns.com/foaf/0.1/familyName',
  givenName: 'http://xmlns.com/foaf/0.1/givenName',
  gender: 'http://schema.org/gender',
  homepage:
  {
    '@id': 'http://xmlns.com/foaf/0.1/homepage',
    '@type': '@id',
  },
  honorificPrefix: 'http://schema.org/honorificPrefix',
  honorificSuffix: 'http://schema.org/honorificSuffix',
  jobTitle: 'http://xmlns.com/foaf/0.1/title',
  nationality: 'http://schema.org/nationality',
  parent:
  {
    '@id': 'http://schema.org/parent',
    '@type': '@id',
  },
  sibling:
  {
    '@id': 'http://schema.org/sibling',
    '@type': '@id',
  },
  spouse:
  {
    '@id': 'http://schema.org/spouse',
    '@type': '@id',
  },
  telephone: 'http://schema.org/telephone',
  Address: 'http://www.w3.org/2006/vcard/ns#Address',
  address: 'http://www.w3.org/2006/vcard/ns#address',
  street: 'http://www.w3.org/2006/vcard/ns#street-address',
  locality: 'http://www.w3.org/2006/vcard/ns#locality',
  region: 'http://www.w3.org/2006/vcard/ns#region',
  country: 'http://www.w3.org/2006/vcard/ns#country',
  postalCode: 'http://www.w3.org/2006/vcard/ns#postal-code',
}
