import crypto from 'node:crypto'

export function clean(value){return String(value??'').trim()}
function secret(){return clean(process.env.APP_HUB_SESSION_SECRET||process.env.APP_HUB_ADMIN_PASSWORD)}
export function createAdminToken(){const exp=Date.now()+1000*60*60*12;const payload=Buffer.from(JSON.stringify({exp})).toString('base64url');const signature=crypto.createHmac('sha256',secret()).update(payload).digest('base64url');return `${payload}.${signature}`}
export function verifyAdminToken(req){const configured=secret();if(!configured)return false;const header=String(req.headers.authorization||'');if(!header.startsWith('Bearer '))return false;const token=header.slice(7);const [payload,signature]=token.split('.');if(!payload||!signature)return false;const expected=crypto.createHmac('sha256',configured).update(payload).digest('base64url');if(!crypto.timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))return false;try{return JSON.parse(Buffer.from(payload,'base64url').toString()).exp>Date.now()}catch{return false}}
export function configured(){return Boolean(secret())}
