module.exports = {
  VALID_HEADERS: [
    // Standard headers
    'Accept-Patch', // Specifies which patch document formats this server supports
    'Accept-Ranges', // What partial content range types this server supports via byte serving
    'Age', // The age the object has been in a proxy cache in seconds
    'Allow', // Valid methods for a specified resource. To be used for a 405 Method not allowed
    'Alt-Svc', // A server uses “Alt-Svc” header (meaning Alternative Services) to indicate that its resources can also be accessed at a different network location (host or port) or using a different protocol. When using HTTP/2, servers should instead send an ALTSVC frame
    'Cache-Control', // If no-cache is used, the Cache-Control header can tell the browser to never use a cached version of a resource without first checking the ETag value. max-age is measured in seconds. The more restrictive no-store option tells the browser (and all the intermediary network devices) the not even store the resource in its cache:
    'Connection', // Control options for the current connection and list of hop-by-hop response fields. Deprecated in HTTP/2
    'Content-Disposition', // An opportunity to raise a “File Download” dialogue box for a known MIME type with binary format or suggest a filename for dynamic content. Quotes are necessary with special characters
    'Content-Encoding', // The type of encoding used on the data. See HTTP compression
    'Content-Language', // The natural language or languages of the intended audience for the enclosed content
    'Content-Length', // The length of the response body expressed in 8-bit bytes
    'Content-Location', // An alternate location for the returned data
    'Content-Range', // Where in a full body message this partial message belongs
    'Content-Type', // The MIME type of this content
    'Date', // The date and time that the message was sent (in “HTTP-date” format as defined by RFC 7231)
    'Delta-Base', // Specifies the delta-encoding entity tag of the response
    'ETag', // An identifier for a specific version of a resource, often a message digest
    'Expires', // Gives the date/time after which the response is considered stale (in “HTTP-date” format as defined by RFC 7231)
    'IM', // Instance-manipulations applied to the response
    'Last-Modified', // The last modified date for the requested object (in “HTTP-date” format as defined by RFC 7231)
    'Link', // Used to express a typed relationship with another resource, where the relation type is defined by RFC 5988
    'Location', // Used in redirection, or when a new resource has been created
    'Pragma', // Implementation-specific fields that may have various effects anywhere along the request-response chain.
    'Proxy-Authenticate', // Request authentication to access the proxy
    'Public-Key-Pins', // HTTP Public Key Pinning, announces hash of website’s authentic TLS certificate
    'Retry-After', // If an entity is temporarily unavailable, this instructs the client to try again later. Value could be a specified period of time (in seconds) or a HTTP-date
    'Server', // A name for the server
    'Set-Cookie', // An HTTP cookie
    'Strict-Transport-Security', // A HSTS Policy informing the HTTP client how long to cache the HTTPS only policy and whether this applies to subdomains
    'Trailer', // The Trailer general field value indicates that the given set of header fields is present in the trailer of a message encoded with chunked transfer coding
    'Transfer-Encoding', // The form of encoding used to safely transfer the entity to the user. Currently defined methods are: chunked, compress, deflate, gzip, identity. Deprecated in HTTP/2
    'Tk', // Tracking Status header, value suggested to be sent in response to a DNT(do-not-track), possible values: “!” — under construction “?” — dynamic “G” — gateway to multiple parties “N” — not tracking “T” — tracking “C” — tracking with consent “P” — tracking only if consented “D” — disregarding DNT “U” — updated
    'Upgrade', // Ask the client to upgrade to another protocol. Deprecated in HTTP/2
    'Vary', // Tells downstream proxies how to match future request headers to decide whether the cached response can be used rather than requesting a fresh one from the origin server
    'Via', // Informs the client of proxies through which the response was sent
    'Warning', // A general warning about possible problems with the entity body
    'WWW-Authenticate', // Indicates the authentication scheme that should be used to access the requested entity

    // CORS headers
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
    'Access-Control-Expose-Headers',
    'Access-Control-Max-Age',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers',

    // Non-standard headers
    'Content-Security-Policy', // Helps to protect against XSS attacks
    'Refresh', // Redirect to a URL after an arbitrary delay expressed in seconds
    'X-Powered-By', // Can be used by servers to send their name and version
    'X-Request-ID', // Allows the server to pass a request ID that clients can send back to let the server correlate the request
    'X-UA-Compatible', // Sets which version of Internet Explorer compatibility layer should be used. Only used if you need to support IE8 or IE9
    'X-XSS-Protection', // Now replaced by the Content-Security-Policy header, used in older browsers to stop pages load when an XSS attack is detected
  ],

  VALID_CODES: [
    // 1×× Informational
    100, // Continue
    101, // Switching Protocols
    102, // Processing

    // 2×× Success
    200, // OK
    201, // Created
    202, // Accepted
    203, // Non-authoritative Information
    204, // No Content
    205, // Reset Content
    206, // Partial Content
    207, // Multi-Status
    208, // Already Reported
    226, // IM Used

    // 3×× Redirection
    300, // Multiple Choices
    301, // Moved Permanently
    302, // Found
    303, // See Other
    304, // Not Modified
    305, // Use Proxy
    307, // Temporary Redirect
    308, // Permanent Redirect

    // 4×× Client Error
    400, // Bad Request
    401, // Unauthorized
    402, // Payment Required
    403, // Forbidden
    404, // Not Found
    405, // Method Not Allowed
    406, // Not Acceptable
    407, // Proxy Authentication Required
    408, // Request Timeout
    409, // Conflict
    410, // Gone
    411, // Length Required
    412, // Precondition Failed
    413, // Payload Too Large
    414, // Request-URI Too Long
    415, // Unsupported Media Type
    416, // Requested Range Not Satisfiable
    417, // Expectation Failed
    418, // I'm a teapot
    421, // Misdirected Request
    422, // Unprocessable Entity
    423, // Locked
    424, // Failed Dependency
    426, // Upgrade Required
    428, // Precondition Required
    429, // Too Many Requests
    431, // Request Header Fields Too Large
    444, // Connection Closed Without Response
    451, // Unavailable For Legal Reasons
    499, // Client Closed Request

    // 5×× Server Error
    500, // Internal Server Error
    501, // Not Implemented
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
    505, // HTTP Version Not Supported
    506, // Variant Also Negotiates
    507, // Insufficient Storage
    508, // Loop Detected
    510, // Not Extended
    511, // Network Authentication Required
    599, // Network Connect Timeout Error
  ],
};
