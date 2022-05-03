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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("./../models/user.model"));
const SECRET = process.env.SECRET || '';
const validateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // extract token from auth headers
    const authHeaders = req.headers['authorization'];
    if (!authHeaders) {
        return res.status(403).send({ message: 'No token found!' });
    }
    const token = authHeaders.split(' ')[1];
    try {
        // verify & decode token payload,
        const { _id } = jsonwebtoken_1.default.verify(token, SECRET);
        // attempt to find user object and set to req
        const user = yield user_model_1.default.findById({ _id });
        if (!user)
            return res.status(401).send({ message: 'User not found' });
        res.locals.user = user;
        next();
    }
    catch (error) {
        res.sendStatus(401);
    }
});
exports.default = validateUser;
