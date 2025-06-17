import arcjet, {detectBot, shield, tokenBucket} from "@arcjet/node";

import 'dotenv/config.js'

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ['ip.src'],
    rules: [
        shield({mode: 'LIVE'}), // protects from common attacks like SQL injection, XSS, CSRF
        detectBot({
            mode: 'LIVE',
            allow: ['CATEGORY:SEARCH_ENGINE'] // block all bots except search engines
        }),
        tokenBucket({
            mode: 'LIVE',
            refillRate: 30,
            interval: 5,
            capacity: 20
        })
    ]
});