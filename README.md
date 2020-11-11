# JWT-Auth-NodeJS
# $$ WORK IN PROGRESS $$ 
Quick guide to set up JWT authentication with your node js api

JWT (JSON Web Token). JSON Web Token is an open standard (RFC 7519) that defines a compact way to securely transmit information across parties as a JSON object.

The token generated is composed by 3 parts(header, payload and signature) each encoded in base64 and concactenated with a dot(.):
const token = base64urlEncoding(header) + '.' + base64urlEncoding(payload) + '.' + base64urlEncoding(signature)

The header is composed by, for example: { "alg" : "HS256", "typ" : "JWT" }
This means that the token was signed using HMAC-SHA256 

The payload is composed by a set of claims defined by the API, in the sample api provided, the payload is composed by:
{"user":{"id":1,"username":"myDemoUser1","accesses":["CREATE","UPDATE","READ","DELETE"]},"iat":1605058642,"exp":1605067642,"aud":"DM_AUDNC","iss":"YOUR-ISSUER-NAME"}

With this information the api can confirm who the user is, what he is allowed to use, when the token will expire, when the token was issued, the target audience of the token and who issued the token. As the token is encoded in Base64 this information can be easily read and changed by the end user but this info should be merely informative and should always be confirmed by the server itself.

Lastely the the signature is composed by the resulting string of the cryptohraphic signing of algorithm specified in the header. 
The signing process as such: HMAC-SHA256(secret, base64urlEncoding(header) + '.' + base64urlEncoding(payload))
The "secret" should be pre-shared key between the server and the users.
