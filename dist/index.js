"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _apolloServerFastify = require("apollo-server-fastify");

var _apolloServerCore = require("apollo-server-core");

var _fastify = require("fastify");

var _fastifyStatic = _interopRequireDefault(require("fastify-static"));

var _path = _interopRequireDefault(require("path"));

var _pino = _interopRequireDefault(require("pino"));

var _fastifyMongodb = _interopRequireDefault(require("fastify-mongodb"));

var _templateObject;

var PORT = process.env.PORT || 7000;
var HOST = '0.0.0.0';
var MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/daily";

function fastifyAppClosePlugin(app) {
  return {
    serverWillStart: function serverWillStart() {
      return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", {
                  drainServer: function drainServer() {
                    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                      return _regenerator["default"].wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.next = 2;
                              return app.close();

                            case 2:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee);
                    }))();
                  }
                });

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    }
  };
} // A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.


var typeDefs = (0, _apolloServerCore.gql)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  type Book {\n    title: String\n    author: String\n  }\n\n  type Query {\n    books: [Book]\n  }\n"]))); // Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.

var resolvers = {
  Query: {
    books: function books() {
      return [{
        title: 'The Awakening',
        author: 'Kate Chopin'
      }, {
        title: 'City of Glass',
        author: 'Paul Auster'
      }];
    }
  }
}; // Create an http server. We pass the relevant typings for our http version used.
// By passing types we get correctly typed access to the underlying http objects in routes.
// If using http2 we'd pass <http2.Http2Server, http2.Http2ServerRequest, http2.Http2ServerResponse>

var app = (0, _fastify.fastify)({
  logger: (0, _pino["default"])({
    level: 'info'
  })
});
app.register(_fastifyMongodb["default"], {
  forceClose: true,
  url: MONGO_URI
});

function startApolloServer(_x, _x2) {
  return _startApolloServer.apply(this, arguments);
}

function _startApolloServer() {
  _startApolloServer = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(typeDefs, resolvers) {
    var server;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            server = new _apolloServerFastify.ApolloServer({
              typeDefs: typeDefs,
              resolvers: resolvers,
              plugins: [fastifyAppClosePlugin(app), (0, _apolloServerCore.ApolloServerPluginDrainHttpServer)({
                httpServer: app.server
              })]
            });
            _context3.next = 3;
            return server.start();

          case 3:
            app.register(server.createHandler());
            app.register(_fastifyStatic["default"], {
              root: _path["default"].join(__dirname, './static')
            });
            app.setNotFoundHandler(function (_, res) {
              res.sendFile('index.html');
            });
            _context3.next = 8;
            return app.listen(PORT, HOST);

          case 8:
            console.log("\uD83D\uDE80 Server ready at http://".concat(HOST, ":").concat(PORT).concat(server.graphqlPath));

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _startApolloServer.apply(this, arguments);
}

startApolloServer(typeDefs, resolvers);