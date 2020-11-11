# JWT-Auth-NodeJS

## Disclaimer
I do not pretend to be a specialist in JWT authentication.
This repository serves only for:
+ As training for the technology itself 
+ Training on the documentation creation process. 

In any case if you found this repo useful and helped you understand or start using JWT authentication, please let me know.

# $$ WORK IN PROGRESS $$ 
Quick guide to set up JWT authentication with your node js api

### Introduction
JWT (JSON Web Token). JSON Web Token is an open standard (RFC 7519) that defines a compact way to securely transmit information across parties as a JSON object.

### Structure
The token generated is composed by 3 parts(header, payload and signature) each encoded in base64 and concactenated with a dot(.):
`const token = base64urlEncoding(header) + '.' + base64urlEncoding(payload) + '.' + base64urlEncoding(signature)`

The header is composed by, for example: `{ "alg" : "HS256", "typ" : "JWT" }`
This means that the token was signed using HMAC-SHA256 

The payload is composed by a set of claims defined by the API, in the sample api provided, the payload is composed by:
`{"user":{"id":1,"username":"myDemoUser1","accesses":["CREATE","UPDATE","READ","DELETE"]},"iat":1605058642,"exp":1605067642,"aud":"DM_AUDNC","iss":"YOUR-ISSUER-NAME"}`

With this information the api can confirm who the user is, what he is allowed to use, when the token will expire, when the token was issued, the target audience of the token and who issued the token. As the token is encoded in Base64 this information can be easily read and changed by the end user but this info should be merely informative and should always be confirmed by the server itself.

Lastely the the signature is composed by the resulting string of the cryptohraphic signing of algorithm specified in the header. 
The signing process as such: 
`HMAC-SHA256(secret, base64urlEncoding(header) + '.' + base64urlEncoding(payload))`
The "secret" should be pre-shared key between the server and the users.

### Standard fields
###### Standard fields that can be used in a JWT token claim set
Note: Although these are the standard and recommended fields you can use your own fields, a parte of the standard fields or a mix of both cases. 
| Attribute | Name | Description |
| ---       | ---  | ---         |
| iss | Issuer | Identifies who issued the token. |
| sub | Subject | Identifies the subject of the token. |
| aud | Audience | Identifies the recipients that the token is for. Every token should have this attribute because if the principal that will process the token does not identify the principal in the audience attribute the token must be rejected.|
| exp | Expiration time | Identifies the time on and after that the token must no longer be acceptable by any principals. This value should be a NumericDate (integer or decimal) in seconds since epoch date (1970-01-01 00:00:00). |
| nbf | Not before | Identifies the time on which the token should start be accepted by principals. (NumericDate) |
| iat | Issued at | Identifies the time on which the token was issued. (NumericDate) |
| jti | JWT ID | Unique identifier of the token. |

###### Standard fields that can be used in the header of the JWT token
Note: Bare minimum you should use the attributes typ and alg.
| Attribute | Name | Description |
| ---       | ---  | ---         |
| typ | Token type | Identifies the type of the token. If present should be set to JWT. |
| cty | Content type | If nested signing or encryption is employed, set it to JWT. |
| alg | Message authentication code algorithm | Defines the algorithm to verify the signature of the token. Be aware that some of the supported algorithms are insecure.  |
| kid | Key ID | A key hint indicating the key that the client used to generate the token signature. The principal should match this value to a key stored to verify if the signature is valid. If you only use one key for all your clients this attribute is unnecessary. |
| x5c | x.509 certificate chain  | A certificate chain in RFC4945 format corresponding to the key used to sign the token. |
| x5u | x.509 certificate chain url  | A URL that the principal can retrieve a certificate chain from. The principal will then use the retrieved key to verify the token signature. |
| crit | Critical | A list of headers that the principal needs in order to accept the token. |

### Cons
+ Due to the way tokens work if you need to deactivate a user, you will need to wait until the last token generated to expire before the user is truly locked out of your system.
+ If a user needs to change their password and there is a token generated before the password change, this token will still be valid until it has expired.
+ There is no "true logout" as tokens are always valid until they expire and you cannot destroy tokens without breaking the "stateless-ness" of the JWT standard. 
+ Security consultant Time McLean has reported vulnerabilities in some JWT libraries that were using the alg attribute to validate tokens incorrectly

### Pros
