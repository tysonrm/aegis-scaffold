'use strict'

/**
 * The aegis host configuration. We federate the config
 * to make updating hosts simple. We can keep configs
 * in different branches for different instances or groups
 * of instances.
 * @type {import('../domain/index').ModelSpecification}
 */
export const HostConfig = {
  modelName: 'hostConfig',
  endpoint: 'host-config',
  factory: () => args =>
    Object.freeze({
      desc:
        'hot-reloadable configurtion variables, see https://github.com/module-federatio/aegis',
      env: {
        desc: 'live-updateable environmental vars',
        distributedCache: {
          desc: 'enables transparent integration between aegis instances',
          enabled: args?.env?.distributedCache?.enabled || true
        },
        serviceMesh: {
          desc:
            'Is service mesh enabled or not: disable to use external integration',
          enabled: args?.env?.serviceMesh?.enabled || true
        },
        resumeWorkflow: args?.env?.resumeWorkflow || true,
        checkIpHost: 'https://checkip.amazonaws.com',
        defaultCircuitBreaker: {
          errorRate: 25,
          callVolume: 100,
          intervalMs: 6000
        }
      },
      adapters: {
        desc: 'adapter config',
        cacheSize: 3000,
        defaultDatasource: 'DataSourceFile',
        datasources: {
          DataSourceMemory: {
            desc: 'Non-persistent, in-memory storage',
            enabled: true
          },
          DataSourceFile: {
            desc: 'Persistent storage on local file system',
            enabled: true
          },
          DataSourceMongoDb: {
            desc: 'Persistent NoSQL, JSON document storage',
            enabled: true,
            url: 'mongodb://localhost:27017',
            cacheSize: 3000
          },
          DataSourceIpfs: {
            desc: 'Decentralized p2p Internet-wide storage network',
            enabled: false
          },
          DataSourceSolidPod: {
            desc: "Sir Tim Berners Lee's redesign of the Web for data privacy",
            enabled: false
          },
          DataSourceEtherium: {
            desc: 'blockchain storage based on solidity',
            enabled: false
          }
        }
      },
      services: {
        desc: 'services config',
        activeServiceMesh: 'WebSwitch',
        serviceMesh: {
          WebSwitch: {
            desc: 'Default implementation. Switched mesh over web sockets.',
            enabled: true,
            isSwitch: true,
            host: 'localhost',
            port: 8880,
            heartbeat: 30000,
            debug: false,
            uplink: null
          },
          MeshLink: {
            desc: 'Fast UDP-based, peer-to-peer mesh with shared Redis cache.',
            enabled: true,
            config: {
              redis: {
                host: '127.0.0.1',
                port: 6379
              },
              ttl: 10000,
              prefix: 'aegis',
              strict: false,
              relayLimit: 1,
              relayDelay: 0,
              updateInterval: 1000
            }
          },
          NatsMesh: {
            desc: 'Use NATS at layer 7',
            enabled: false
          },
          QuicMesh: {
            desc:
              'Uses QUIC transport protocol (replacing TCP in HTTP/3). Optimized for streaming.',
            enabled: false
          }
        },
        auth: {
          keySet: {
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: 'https://dev-2fe2iar6.us.auth0.com/.well-known/jwks.json',
            audience: 'https://microlib.io/',
            issuer: 'https://dev-2fe2iar6.us.auth0.com/',
            algorithms: ['RS256']
          }
        },
        cert: {
          certDir: 'cert',
          webRoot: 'public',
          domain: 'aegis.module-federation.org',
          domainEmail: 'admin@gmail.com'
        }
      }
    })
}
