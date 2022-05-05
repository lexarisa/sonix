"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// imports
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./src/router"));
const connection_1 = require("./src/models/connection");
// init the hostname and port
const hostname = 'http://localhost';
const port = process.env.PORT || 3001;
// init the app
const app = (0, express_1.default)();
//configure and add cors
const corsConfig = {
    origin: 'http://localhost:3000',
    credentials: true,
};
//hide the x-powered-by express in response header
app.disable('x-powered-by');
// add the middleware
app.use((0, cors_1.default)(corsConfig));
// app.use(morgan('short'));
app.use(express_1.default.json());
app.use(router_1.default);
//catch all requests not handled by router
app.get('*', (req, res) => {
    res.status(404).send('Not found!');
});
//connect to db and start the server
(function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connection_1.mongoose.connect(connection_1.dbUrl);
            app.listen(port, () => {
                console.log(`Ready on http://${hostname}:${port}/`);
            });
        }
        catch (err) {
            if (err instanceof Error)
                console.error('Failed to connect to database', err.message);
        }
    });
})();
module.exports = app;
