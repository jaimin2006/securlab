import { TopicItem } from '../types/security';

export const TOPICS_DATA: TopicItem[] = [
  {
    id: 'probing-network',
    number: 1,
    title: 'Probing the Network',
    subtitle: 'Reconnaissance, Port Scanning, & Service Enumeration',
    category: 'Recon & Network',
    cweMapping: 'CWE-200 (Information Exposure)',
    severity: 'Medium',
    shortDescription: 'Techniques and methodologies for mapping active hosts, detecting open ports, fingerprinting operating systems, and discovering running network services.',
    conceptTheory: [
      'Network probing is the foundational phase of penetration testing and defensive network auditing. It involves actively or passively sending packets to a target IP range to determine alive hosts, open listening ports, service banners, and software versions.',
      'Active network scanning relies on TCP/IP stack behavior. When a TCP SYN packet reaches an open port, the host replies with SYN-ACK; if closed, it responds with RST. In UDP scanning, an open port may drop packets silently or reply with application data, while an unreachable port triggers an ICMP Port Unreachable message.',
      'Network administrators and security engineers use probing tools like Nmap, Masscan, and ZMap for defensive asset discovery and identifying unauthorized or outdated shadow IT services exposed to the Internet.'
    ],
    attackMechanism: [
      'TCP SYN Scan (-sS): Half-open stealth scanning. The sender sends SYN, receives SYN-ACK from an open port, and immediately sends RST to terminate the handshake before an application session is logged.',
      'TCP Connect Scan (-sT): Completes the full three-way handshake (SYN, SYN-ACK, ACK), which is slower and recorded in system connection logs, but works without raw socket privileges.',
      'Service & Version Detection (-sV): Probes open ports with application-level payloads to elicit banners and compare signatures against databases.',
      'OS Fingerprinting (-O): Analyzes TCP window size, DF bit, initial TTL, and TCP options order to determine the host OS kernel.'
    ],
    realWorldScenario: 'An enterprise network left port 3389 (RDP) and port 9200 (Elasticsearch) exposed publicly on a staging subnet without firewall boundary rules. An unauthorized port scan discovered both within seconds, allowing attackers to access unauthenticated logs.',
    remediationSteps: [
      'Implement default-deny inbound firewall policies on perimeter routers and cloud security groups.',
      'Deploy Network Intrusion Detection Systems (NIDS/Snort/Suricata) with rate-based alerts for sequential SYN scans.',
      'Disable unnecessary service banners and configure minimal error responses.',
      'Place administrative interfaces (SSH, RDP, Web Management) strictly behind a VPN or Zero-Trust Network Access (ZTNA) tunnel with MFA.'
    ],
    codeSnippet: {
      language: 'bash',
      vulnerableCode: `# Insecure default: Exposing sensitive services to 0.0.0.0
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 9200 -j ACCEPT  # Exposed DB to the entire world
iptables -P INPUT ACCEPT                         # Permissive default accept`,
      secureCode: `# Secure: Default-drop policy with strict source allowlisting
iptables -P INPUT DROP
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT   # Public HTTPS only
# Restrict SSH & Admin ports to corporate bastion gateway IP
iptables -A INPUT -p tcp -s 192.168.10.50 --dport 22 -j ACCEPT`,
      explanation: 'Setting a default-drop policy and restricting non-public ports to authenticated bastion hosts prevents network enumeration and port discovery by external adversaries.'
    },
    quiz: [
      {
        question: 'What is the primary technical difference between an Nmap TCP SYN scan (-sS) and a TCP Connect scan (-sT)?',
        options: [
          'SYN scan encrypts packet payloads with TLS, whereas Connect scan is unencrypted.',
          'SYN scan sends an RST after receiving SYN-ACK to avoid completing the full handshake, leaving fewer application logs.',
          'Connect scan is faster because it uses UDP datagrams.',
          'SYN scan requires root privileges because it cannot send TCP flags.'
        ],
        correctIndex: 1,
        explanation: 'A SYN scan (half-open) does not complete the 3-way handshake; it resets the connection with RST as soon as SYN-ACK is observed, which frequently bypasses application-level connection logging.'
      },
      {
        question: 'Which response indicates a filtered TCP port during an active SYN scan?',
        options: [
          'Immediate RST/ACK from target host',
          'SYN-ACK received within 10ms',
          'No response received (timed out) or an ICMP type 3 destination unreachable message',
          'HTTP 403 Forbidden header returned'
        ],
        correctIndex: 2,
        explanation: 'When a firewall drops incoming SYN packets silently or sends an ICMP destination unreachable message, the scanner marks the port as "Filtered".'
      }
    ],
    simulationType: 'network_probing'
  },
  {
    id: 'web-application-firewall',
    number: 2,
    title: 'Web Application Firewall (WAF)',
    subtitle: 'Layer 7 HTTP Traffic Inspection, Rule Filtering, & Mitigation',
    category: 'Core Architecture & Proxy',
    cweMapping: 'CWE-693 (Protection Mechanism Failure)',
    severity: 'High',
    shortDescription: 'Deep dive into Layer 7 application inspection, signature matching, anomaly scoring engines, ModSecurity/CRS rules, and defensive tuning.',
    conceptTheory: [
      'A Web Application Firewall (WAF) monitors, filters, and blocks malicious HTTP/HTTPS traffic moving to and from a web application. Unlike network firewalls operating at Layers 3 and 4, WAF operates at OSI Layer 7 (Application Layer).',
      'WAF architectures include cloud-based reverse proxies (Cloudflare, AWS WAF, Akamai), embedded server modules (ModSecurity on NGINX/Apache), and API gateway plugins (Kong, Envoy).',
      'WAFs use dual detection models: Positive Security (Allowlist - only accepted patterns are allowed through) and Negative Security (Blocklist/Signature-based - known malicious payloads like SQLi or XSS patterns are blocked). Modern WAFs also leverage Correlated Rule Sets (like OWASP Core Rule Set / CRS) with anomaly scoring.'
    ],
    attackMechanism: [
      'Signature Evasion: Attackers attempt to bypass simple regex filters using encoding techniques (URL double encoding, Unicode normalization, hex representations, comment injection inside SQL commands).',
      'HTTP Parameter Pollution (HPP): Supplying duplicate query parameters (e.g., ?id=1&id=2) to confuse the WAF parser versus the backend framework parser.',
      'Chunked Transfer Encoding Smuggling: Splitting HTTP request bodies into chunks with varying Content-Length and Transfer-Encoding headers to slip payloads past proxy inspection.'
    ],
    realWorldScenario: 'An unpatched e-commerce application had an SQL injection vulnerability in its search field. Deploying a tuned OWASP Core Rule Set on ModSecurity blocked 99.4% of automated exploitation attempts while developers prepared and deployed parameterized query fixes.',
    remediationSteps: [
      'Never rely on a WAF as a substitute for secure coding; treat WAF as a defense-in-depth shield that buys patching time.',
      'Deploy OWASP CRS (Core Rule Set) in anomaly scoring mode to reduce false positives.',
      'Implement strict input validation schemas (OpenAPI / JSON Schema) at the API gateway layer.',
      'Regularly review blocked request telemetry and tune rule thresholds for false positives.'
    ],
    codeSnippet: {
      language: 'apache',
      vulnerableCode: `# Weak WAF rule: Simple exact string match easily bypassed
SecRule ARGS "@streq ' OR 1=1--" "id:1001,deny,status:403"
# Bypassed by: ' OR '1'='1' or /**/OR/**/1=1 or URL encoding`,
      secureCode: `# Robust OWASP CRS Anomaly Scoring Rule for SQLi
SecRule REQUEST_COOKIES|!REQUEST_COOKIES:/__utm/|REQUEST_COOKIES_NAMES|ARGS_NAMES|ARGS|XML:/* \
  "@detectSQLi" \
  "id:942100,\
  phase:2,\
  block,\
  capture,\
  t:none,t:utf8toUnicode,t:urlDecodeUni,t:normalizePath,t:lowercase,\
  msg:'SQL Injection Attack Detected via libinjection',\
  setvar:'tx.sql_injection_score=+%{tx.critical_anomaly_score}',\
  setvar:'tx.anomaly_score=+%{tx.critical_anomaly_score}'"`,
      explanation: 'Using libinjection tokenization algorithms combined with canonical transformations (utf8toUnicode, urlDecode, lowercase) prevents attackers from evading regex via obfuscation.'
    },
    quiz: [
      {
        question: 'At which OSI layer does a Web Application Firewall (WAF) operate?',
        options: [
          'Layer 3 (Network Layer)',
          'Layer 4 (Transport Layer)',
          'Layer 7 (Application Layer)',
          'Layer 2 (Data Link Layer)'
        ],
        correctIndex: 2,
        explanation: 'A WAF inspects HTTP/HTTPS headers, cookies, verbs, and request bodies at Layer 7.'
      },
      {
        question: 'Why is a WAF alone insufficient for application security?',
        options: [
          'WAFs cannot decrypt HTTPS traffic.',
          'A WAF cannot fix flawed business logic or replace parameterized database queries; attackers can frequently find novel bypasses.',
          'WAFs only inspect outgoing traffic, never inbound requests.',
          'WAFs only run on Linux servers.'
        ],
        correctIndex: 1,
        explanation: 'WAFs provide perimeter filtering, but defense-in-depth requires secure code (e.g. prepared statements, proper authorization) at the application layer.'
      }
    ],
    simulationType: 'waf_rules'
  },
  {
    id: 'owasp-top-10',
    number: 3,
    title: 'OWASP Top 10 Framework',
    subtitle: 'Standard Awareness Document for Web Application Security Risks',
    category: 'OWASP Top 10',
    severity: 'High',
    shortDescription: 'Comprehensive overview of the OWASP Top 10 risk methodology, ranking criteria, CWE mappings, and enterprise vulnerability management.',
    conceptTheory: [
      'The Open Web Application Security Project (OWASP) is an international non-profit dedicated to improving software security. The OWASP Top 10 represents a broad consensus on the most critical security risks facing modern web applications.',
      'Rankings are determined by combining data from vulnerability scanners, bug bounty programs, and industry security testing, evaluated against Likelihood, Detectability, Exploitability, and Technical Impact.',
      'The standard categories span A01 Broken Access Control (the #1 ranked risk), A02 Cryptographic Failures, A03 Injection, A04 Insecure Design, A05 Security Misconfiguration, A06 Vulnerable and Outdated Components, A07 Identification & Authentication Failures, A08 Software & Data Integrity Failures, A09 Security Logging & Monitoring Failures, and A10 Server-Side Request Forgery (SSRF).'
    ],
    attackMechanism: [
      'Adversaries utilize the OWASP framework systematically during threat modeling to assess which vulnerability classes an application may expose.',
      'Risk scoring blends CWE frequency, CVSS base scores, and real-world exploit prevalence.',
      'Common multi-stage attacks chain multiple OWASP categories: for example, leveraging A05 Misconfiguration to expose an internal API, then A01 Broken Access Control to dump customer database records.'
    ],
    realWorldScenario: 'An organization restructured its SDLC security gate around the OWASP Top 10, establishing automated SAST checks for A03 Injection and DAST checks for A01 Access Control, reducing post-release critical vulnerabilities by 73%.',
    remediationSteps: [
      'Adopt the OWASP ASVS (Application Security Verification Standard) for rigorous testing criteria.',
      'Embed automated SAST (Static Application Security Testing) and SCA tools into continuous integration (CI/CD) pipelines.',
      'Provide regular developer security training focused on root cause analysis rather than quick patches.',
      'Conduct recurring third-party gray-box penetration tests.'
    ],
    codeSnippet: {
      language: 'json',
      vulnerableCode: `{
  "policy": "No security verification",
  "dependencies": "unpinned and unvetted",
  "logging": "off",
  "accessControl": "client-side parameter trust"
}`,
      secureCode: `{
  "securityFramework": "OWASP ASVS Level 2",
  "accessControl": "Centralized RBAC middleware with principle of least privilege",
  "cryptography": "TLS 1.3 + Argon2id password hashing",
  "inputValidation": "Context-aware strict schema validation and prepared statements",
  "monitoring": "SIEM event ingestion with automated threshold alerting"
}`,
      explanation: 'Establishing a programmatic security policy based on OWASP standards mitigates common vulnerability classes across the entire software development lifecycle.'
    },
    quiz: [
      {
        question: 'Which vulnerability category holds the #1 ranking in the current OWASP Top 10 standard?',
        options: [
          'A03: Injection',
          'A01: Broken Access Control',
          'A02: Cryptographic Failures',
          'A07: Identification and Authentication Failures'
        ],
        correctIndex: 1,
        explanation: 'A01: Broken Access Control moved up to the #1 position due to its high prevalence (over 94% of tested applications had access control weaknesses).'
      }
    ],
    simulationType: 'owasp_overview'
  },
  {
    id: 'burpsuite-installation',
    number: 4,
    title: 'Burp Suite Installation & Configuration',
    subtitle: 'Man-in-the-Middle Proxy Setup, CA Certificate Installation, & Repeater Workflows',
    category: 'Core Architecture & Proxy',
    severity: 'Medium',
    shortDescription: 'Step-by-step setup of Burp Suite Community/Professional, configuring the interception proxy (127.0.0.1:8080), installing root CA certificates for HTTPS inspection, and using Repeater/Decoder.',
    conceptTheory: [
      'Burp Suite by PortSwigger is the industry-standard workbench for web application security testing. It functions as an HTTP/HTTPS Man-in-the-Middle (MITM) proxy sitting between your browser and the web application server.',
      'To intercept encrypted HTTPS traffic without triggering browser SSL warning errors, Burp generates a unique Root Certificate Authority (PortSwigger CA). The tester imports this CA into the browser or operating system trust store.',
      'Core Burp modules include: Proxy (intercepts, modifies, and inspects raw HTTP requests and responses), Repeater (manually crafts, alters, and resends single requests to analyze backend behavior), Intruder (automated parameter fuzzing), and Decoder (URL, Base64, Hex encoding/decoding).'
    ],
    attackMechanism: [
      'Interception Workflow: Browser requests are caught in the Proxy tab before they leave the host. The tester inspects headers, parameters, and payloads, modifies values in-flight, and clicks "Forward".',
      'Tampering Hidden Fields: Modifying hidden HTML form values (e.g., price=0.01 or role=admin) that client-side scripts prevent users from altering.',
      'Replay Attacks in Repeater: Sending identical tokens or authorization headers across endpoints to detect race conditions or session leakage.'
    ],
    realWorldScenario: 'During an authorized web audit of an invoice portal, a tester configured Burp Proxy to capture a request to /download-pdf?invoice_id=892. In Burp Repeater, altering the ID to 891 returned another tenant’s private tax invoice, demonstrating Broken Object Level Authorization.',
    remediationSteps: [
      'Never trust any data submitted by the client (headers, cookies, parameters, or hidden fields).',
      'Enforce server-side authorization checks on every state change and resource retrieval.',
      'Implement TLS certificate pinning in native mobile apps to hinder unauthorized proxy interception.',
      'Log and monitor anomalous request header anomalies or client tampering patterns.'
    ],
    codeSnippet: {
      language: 'http',
      vulnerableCode: `# Intercepted HTTP Request in Burp Suite Proxy:
POST /api/v1/checkout HTTP/1.1
Host: shop.example.com
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json

{"cart_id": "9021", "total_price": 499.00, "is_discount_approved": false}`,
      secureCode: `# Server-side verification (Node.js/Express):
app.post('/api/v1/checkout', authMiddleware, async (req, res) => {
  const { cart_id } = req.body;
  // NEVER trust total_price or discount flags from the client!
  const cart = await db.getCartById(cart_id, req.user.id);
  const verifiedPrice = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const paymentIntent = await processPayment(req.user.id, verifiedPrice);
  res.json({ success: true, paymentId: paymentIntent.id });
});`,
      explanation: 'Clients can intercept and rewrite any HTTP request parameter in Burp Suite. The server must independently calculate financial totals and privileges from authoritative database records.'
    },
    quiz: [
      {
        question: 'Why must you install the PortSwigger CA certificate into your browser to intercept HTTPS with Burp Suite?',
        options: [
          'Because Burp Suite cannot run on port 8080 without a certificate.',
          'To establish trust for Burp’s dynamically generated TLS certificates and prevent browser SSL/TLS connection warnings.',
          'To enable Burp to automatically crack Wi-Fi encryption keys.',
          'Because modern browsers refuse to run without a Burp license key.'
        ],
        correctIndex: 1,
        explanation: 'Burp decrypts HTTPS by presenting a dynamically minted certificate signed by its own Root CA. Without importing this CA into the browser trust store, the browser will flag the proxy as an untrusted MITM.'
      }
    ],
    simulationType: 'burp_proxy'
  },
  {
    id: 'broken-access-control',
    number: 5,
    title: 'Broken Access Control',
    subtitle: 'OWASP A01: IDOR, Horizontal/Vertical Privilege Escalation, & Enforcement',
    category: 'OWASP Top 10',
    owaspMapping: 'A01:2021 - Broken Access Control',
    cweMapping: 'CWE-284, CWE-639 (IDOR)',
    severity: 'Critical',
    shortDescription: 'Understanding Insecure Direct Object References (IDOR), unauthorized resource access, missing functional level access controls, and role-based access enforcement.',
    conceptTheory: [
      'Access control enforces policy such that users cannot act outside their intended permissions. Broken Access Control occurs when these checks are missing, client-enforced, or flawed.',
      'Horizontal Privilege Escalation (e.g., IDOR): User A accesses records, messages, or files belonging to User B at the same permission tier simply by changing a resource ID parameter (e.g., /api/user/101 vs /api/user/102).',
      'Vertical Privilege Escalation: A standard unprivileged user executes administrative functionality (e.g., /admin/delete-user) because the endpoint fails to verify role permissions on the server.'
    ],
    attackMechanism: [
      'Parameter Tampering: Changing user_id, account_no, or filename in REST URLs, query strings, or JSON bodies.',
      'HTTP Verb Tampering: Bypassing filters configured only for GET or POST by using PUT, PATCH, or DELETE.',
      'JWT/Token Role Manipulation: Editing unverified claims (e.g. "role": "admin") in JWT payloads if the backend fails to verify the cryptographic signature.'
    ],
    realWorldScenario: 'A medical portal allowed patients to view their lab test results at /records?doc_id=4521. By simply incrementing the doc_id query parameter, an attacker could download private diagnostic results for all 80,000 clinic patients.',
    remediationSteps: [
      'Enforce server-side authorization checks on EVERY request; never rely on UI button hiding or client routes.',
      'Adopt the Principle of Least Privilege: deny by default, allow only by explicit policy.',
      'Use indirect or unpredictable reference maps (such as UUIDv4) or verify ownership against the authenticated session: WHERE id = :id AND tenant_id = :current_user_tenant_id.',
      'Centralize access control logic in reusable middlewares or declarative policies (e.g., Casbin, OPA).'
    ],
    codeSnippet: {
      language: 'typescript',
      vulnerableCode: `// VULNERABLE: Direct object reference with no ownership validation
app.get('/api/documents/:id', authenticateToken, async (req, res) => {
  const document = await db.query('SELECT * FROM documents WHERE id = ?', [req.params.id]);
  if (!document) return res.status(404).json({ error: 'Not found' });
  // Missing check: Does req.user.id own this document?
  return res.json(document);
});`,
      secureCode: `// SECURE: Enforces strict ownership check via session context
app.get('/api/documents/:id', authenticateToken, async (req, res) => {
  const document = await db.query(
    'SELECT * FROM documents WHERE id = ? AND owner_id = ?',
    [req.params.id, req.user.id]
  );
  if (!document) {
    // Return 404 or 403 to prevent resource enumeration
    return res.status(404).json({ error: 'Document not found' });
  }
  return res.json(document);
});`,
      explanation: 'Binding the query directly to req.user.id ensures that even if an attacker alters the document ID in the URL, the database returns empty results unless the authenticated caller owns the resource.'
    },
    quiz: [
      {
        question: 'What is Insecure Direct Object Reference (IDOR)?',
        options: [
          'An attack where an adversary injects executable JavaScript into an object.',
          'When an application exposes a reference to an internal object (like an ID) without verifying that the requesting user is authorized to access it.',
          'A failure in DNS object resolution during TLS handshake.',
          'When a database fails to compile object relational mappings.'
        ],
        correctIndex: 1,
        explanation: 'IDOR occurs when an application uses user-supplied input to access objects directly without performing authorization checks.'
      }
    ],
    simulationType: 'idor_access_control'
  },
  {
    id: 'cryptographic-failure',
    number: 6,
    title: 'Cryptographic Failures',
    subtitle: 'OWASP A02: Insecure Encryption, Weak Hashing, & Key Management',
    category: 'OWASP Top 10',
    owaspMapping: 'A02:2021 - Cryptographic Failures',
    cweMapping: 'CWE-327, CWE-328, CWE-798',
    severity: 'High',
    shortDescription: 'Common cryptographic mistakes: sensitive data exposure in transit/at rest, broken algorithms (MD5, SHA1, DES), lack of salts, hardcoded keys, and weak random number generators.',
    conceptTheory: [
      'Formerly known as "Sensitive Data Exposure", Cryptographic Failures focus on failures related to cryptography (or lack thereof) that compromise sensitive data like passwords, credit cards, health records, and personal credentials.',
      'Encryption is distinct from Hashing. Encryption is a two-way function used for data in transit (TLS) or at rest (AES-256-GCM). Hashing is a one-way mathematical function used for password verification (Argon2id, bcrypt, PBKDF2) and message integrity (SHA-256 HMAC).',
      'Using obsolete algorithms like MD5 or SHA-1 for passwords makes systems trivial to compromise via precomputed rainbow tables and high-speed GPU cracking rigs capable of hundreds of billions of hashes per second.'
    ],
    attackMechanism: [
      'Offline Password Cracking: If a database leak contains unsalted MD5 or SHA-1 hashes, attackers recover millions of cleartext passwords within minutes using tools like Hashcat.',
      'Hardcoded Secret Keys: Searching codebases or public Git repositories for embedded AES keys, API tokens, or JWT signing secrets.',
      'Weak Pseudorandom Number Generation (PRNG): Using standard Math.random() for session IDs or reset tokens, allowing attackers to predict future seed values.'
    ],
    realWorldScenario: 'A financial platform stored user credit card numbers using ECB mode AES encryption with a hardcoded key in their frontend JavaScript bundle. Reverse engineers extracted the key, decrypted the entire customer transaction history, and exfiltrated card details.',
    remediationSteps: [
      'Always use strong, salted, adaptive hashing algorithms designed for passwords: Argon2id, scrypt, or bcrypt with high work factors.',
      'Enforce TLS 1.3 for all communications; disable SSLv3, TLS 1.0, and TLS 1.1; enforce HSTS (HTTP Strict Transport Security).',
      'Use authenticated symmetric encryption (AES-256-GCM or ChaCha20-Poly1305); never use ECB mode.',
      'Store encryption keys in hardware security modules (HSM) or dedicated cloud secret managers (AWS Secrets Manager, HashiCorp Vault), never in source code.'
    ],
    codeSnippet: {
      language: 'typescript',
      vulnerableCode: `// VULNERABLE: Fast hashing algorithm without salt or work factor
import crypto from 'crypto';

function hashPassword(password: string): string {
  // MD5 is broken and crackable in milliseconds via rainbow tables!
  return crypto.createHash('md5').update(password).digest('hex');
}`,
      secureCode: `// SECURE: Adaptive, salted, memory-hard hashing with Argon2id / bcrypt
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}`,
      explanation: 'Bcrypt automatically generates a unique cryptographic salt per password and enforces a computational cost factor (work factor) that makes brute-force GPU attacks computationally infeasible.'
    },
    quiz: [
      {
        question: 'Why should algorithms like MD5 or SHA-256 NEVER be used directly for password storage?',
        options: [
          'Because MD5 and SHA-256 are proprietary and require licensing fees.',
          'Because they are fast general-purpose digest algorithms; modern GPUs can compute billions of guesses per second, enabling rapid rainbow table lookups and brute-force attacks.',
          'Because they produce variable-length output strings.',
          'Because they can only hash numeric digits.'
        ],
        correctIndex: 1,
        explanation: 'Fast hashes are vulnerable to brute-force dictionary attacks. Password storage requires adaptive, slow, salted algorithms like Argon2id or bcrypt.'
      }
    ],
    simulationType: 'crypto_failures'
  },
  {
    id: 'injection-attacks',
    number: 7,
    title: 'Injection Attacks',
    subtitle: 'OWASP A03: SQL Injection, OS Command Injection, & Cross-Site Scripting (XSS)',
    category: 'OWASP Top 10',
    owaspMapping: 'A03:2021 - Injection',
    cweMapping: 'CWE-89 (SQLi), CWE-78 (Command Injection), CWE-79 (XSS)',
    severity: 'Critical',
    shortDescription: 'Flaws occurring when untrusted user input is sent to an interpreter as part of a command or query, altering the intended execution structure.',
    conceptTheory: [
      'Injection happens when untrusted data is concatenated directly into an interpreter (SQL database engine, shell command processor, LDAP directory, XML parser). The interpreter confuses user-supplied data with command instructions.',
      'SQL Injection (SQLi): Manipulating database queries to bypass authentication (e.g. admin\' OR \'1\'=\'1), extract sensitive tables via UNION-based attacks, or alter/drop records.',
      'OS Command Injection: Passing unchecked arguments to system shell functions (e.g., system(), exec(), child_process.exec()), enabling remote code execution (RCE).',
      'Cross-Site Scripting (XSS): Injecting malicious scripts into web pages viewed by other users, stealing session cookies or performing actions on their behalf.'
    ],
    attackMechanism: [
      'Tautology Payloads: \' OR 1=1 -- comments out the remainder of the query and forces the condition to evaluate to true.',
      'UNION SELECT: Appending results of secondary queries to leak schema tables and password columns.',
      'Command Chaining: Using shell metacharacters (; & | && || ` $) to append malicious system commands to legitimate parameters (e.g., ping 127.0.0.1; whoami).'
    ],
    realWorldScenario: 'A banking login portal verified users via: "SELECT * FROM users WHERE email=\'" + email + "\' AND password=\'" + pass + "\'". Entering "admin\' --" bypassed password verification entirely because the double dash commented out the password clause, granting administrator dashboard access.',
    remediationSteps: [
      'Always use Parameterized Queries (Prepared Statements) for all database operations.',
      'Use ORMs with parameterized bindings (Prisma, Drizzle, TypeORM), ensuring raw queries are avoided.',
      'Avoid invoking system shells; if calling external binaries, use APIs with distinct argument arrays (e.g., execFile with no shell).',
      'Contextually encode output and enforce a strict Content Security Policy (CSP) to neutralize XSS.'
    ],
    codeSnippet: {
      language: 'javascript',
      vulnerableCode: `// VULNERABLE: Direct string interpolation into SQL query
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  // Attacker inputs username: admin' --
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  const user = await db.raw(query);
  res.json(user);
});`,
      secureCode: `// SECURE: Parameterized Query (Prepared Statement)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  // Parameter placeholders (?) ensure the database treats input as raw data, never executable syntax
  const [rows] = await db.execute(
    'SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1',
    [username]
  );
  if (!rows.length || !(await verifyPassword(password, rows[0].password_hash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ token: generateJwt(rows[0]) });
});`,
      explanation: 'Prepared statements pre-compile the SQL query structure in the database engine. User parameters are transmitted separately as raw literals, rendering injection syntax mathematically inert.'
    },
    quiz: [
      {
        question: 'Why does a Parameterized Query (Prepared Statement) prevent SQL Injection?',
        options: [
          'It encodes all single quotes into HTML entities.',
          'It separates the query structure (code) from user parameters (data); the database parses the query AST before substituting parameters as literal values.',
          'It automatically encrypts the database table with AES-256.',
          'It blocks users from typing words like "SELECT" or "UNION".'
        ],
        correctIndex: 1,
        explanation: 'Prepared statements pre-compile the SQL syntax. Even if a parameter contains characters like single quotes or semicolons, the database parser treats them strictly as plain string data.'
      }
    ],
    simulationType: 'injection_attacks'
  },
  {
    id: 'insecure-design',
    number: 8,
    title: 'Insecure Design',
    subtitle: 'OWASP A04: Threat Modeling, Secure Architecture, & Business Logic Flaws',
    category: 'OWASP Top 10',
    owaspMapping: 'A04:2021 - Insecure Design',
    cweMapping: 'CWE-1059, CWE-209',
    severity: 'High',
    shortDescription: 'Focuses on architectural and design flaws that cannot be fixed by a simple code patch, emphasizing threat modeling, failure boundaries, and business logic validation.',
    conceptTheory: [
      'Insecure Design is a category representing design and architectural weaknesses. A secure design cannot be achieved through code implementation alone; if the underlying architecture has flawed assumptions, even bug-free code will remain vulnerable.',
      'Threat Modeling (e.g., STRIDE: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) is the structured practice of identifying security threats during the design phase.',
      'Business logic flaws often stem from insecure design: for example, allowing infinite retry attempts on a 6-digit MFA code, or allowing negative quantities in a shopping cart checkout.'
    ],
    attackMechanism: [
      'Negative Quantity Cart Abuse: Submitting quantity=-1 on an item to decrease total checkout balance, generating a negative bill or free high-value goods.',
      'Credential Recovery Abuse: Allowing account recovery via static, easily guessable security questions ("What city were you born in?").',
      'Unbounded Resource Consumption: Designing an API endpoint that generates PDFs or processes large video files without concurrency caps, leading to complete server denial of service.'
    ],
    realWorldScenario: 'An airline ticket booking portal allowed users to reserve 100 seats per booking without paying or verifying an email address. Scalpers automated this flaw to reserve entire flights, releasing reservations moments before departure to resell tickets at extortionate markups.',
    remediationSteps: [
      'Integrate Threat Modeling (STRIDE, PASTA) into every sprint planning and architectural review session.',
      'Establish explicit rate limiting, quotas, and state machine validations for all multi-step financial or authentication workflows.',
      'Enforce plausible input boundary conditions (e.g., items must be positive integers: quantity >= 1).',
      'Adopt defense-in-depth principles: validate state transitions on the server at each step.'
    ],
    codeSnippet: {
      language: 'typescript',
      vulnerableCode: `// VULNERABLE: Insecure design assumes client will always send positive quantities
app.post('/api/cart/add', (req, res) => {
  const { productId, quantity } = req.body;
  // If quantity is -5, total price decreases!
  cart.items.push({ productId, quantity });
  cart.total += (products[productId].price * quantity);
  res.json(cart);
});`,
      secureCode: `// SECURE: Enforces strict business invariant rules in domain model
app.post('/api/cart/add', (req, res) => {
  const { productId, quantity } = req.body;
  // Validate business rules explicitly
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
    return res.status(400).json({ error: 'Quantity must be an integer between 1 and 50' });
  }
  const product = products[productId];
  if (!product || product.stock < quantity) {
    return res.status(400).json({ error: 'Insufficient stock or invalid product' });
  }
  cart.items.push({ productId, quantity });
  recalculateCartTotal(cart);
  res.json(cart);
});`,
      explanation: 'Designing strict domain invariants and bounds checking into the business logic prevents manipulation of application workflows.'
    },
    quiz: [
      {
        question: 'What is the primary difference between Insecure Design (A04) and Insecure Implementation (such as SQL Injection)?',
        options: [
          'Insecure Design only affects hardware firewalls.',
          'Insecure Design refers to architectural flaws and missing security concepts (threat modeling, business invariants) that cannot be fixed by a simple syntax bug fix.',
          'Insecure Implementation is only found in PHP applications.',
          'There is no difference; they are identical terms.'
        ],
        correctIndex: 1,
        explanation: 'You cannot fix an insecure design by writing "perfect" code if the architectural premise itself (e.g. trusting client-calculated discounts) is fundamentally flawed.'
      }
    ],
    simulationType: 'insecure_design'
  },
  {
    id: 'security-misconfiguration',
    number: 9,
    title: 'Security Misconfiguration',
    subtitle: 'OWASP A05: Default Credentials, Verbose Error Stack Traces, & Unnecessary Services',
    category: 'OWASP Top 10',
    owaspMapping: 'A05:2021 - Security Misconfiguration',
    cweMapping: 'CWE-16, CWE-209, CWE-1004',
    severity: 'High',
    shortDescription: 'Risks resulting from insecure default configurations, incomplete ad-hoc setups, open cloud storage buckets, verbose error stack traces, and unhardened web servers.',
    conceptTheory: [
      'Security Misconfiguration happens when security settings are not defined, implemented, or maintained properly across any part of an application stack (network, database, web server, application framework, or cloud storage).',
      'Common misconfigurations include leaving default admin credentials unchanged (admin/admin), enabling directory listing on web servers, exposing sensitive diagnostic endpoints (/actuator/env, /debug/vars), and returning full exception stack traces to end users.',
      'Modern cloud environments frequently suffer from misconfigured AWS S3 buckets or GCP Cloud Storage buckets left world-readable or world-writable.'
    ],
    attackMechanism: [
      'Error Triggering: Sending malformed inputs to trigger uncaught 500 Internal Server Errors that expose database table names, ORM paths, library versions, and server filesystem directory structures.',
      'Default Admin Panels: Scanning for known vendor administrative routes (/manager/html on Tomcat, /phpmyadmin, /wp-admin) and testing default factory passwords.',
      'CORS Misconfiguration: Returning Access-Control-Allow-Origin: * alongside Access-Control-Allow-Credentials: true, permitting unauthorized third-party sites to steal user session responses.'
    ],
    realWorldScenario: 'A major enterprise launched a production cluster with the Spring Boot Actuator endpoint /actuator/env exposed publicly. Attackers retrieved database passwords, AWS credentials, and API secret keys stored in environment variables, compromising the entire infrastructure.',
    remediationSteps: [
      'Establish automated hardening scripts and CIS (Center for Internet Security) benchmark templates for all servers and containers.',
      'Disable directory indexing and ensure all debug and administrative interfaces are disabled in production builds.',
      'Configure custom generic error pages that return generic messages (e.g. "An unexpected error occurred. Ref: #10293") while logging full details to an internal SIEM.',
      'Implement strict Content Security Policy (CSP), HSTS, and X-Content-Type-Options: nosniff headers.'
    ],
    codeSnippet: {
      language: 'typescript',
      vulnerableCode: `// VULNERABLE: Verbose error handler leaks internal stack trace & DB queries
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    stack: err.stack,        // Leaks internal filesystem file paths and code lines
    query: err.sqlQuery,     // Leaks database schema and SQL syntax
    env: process.env         // Catastrophic: Leaks API keys & DB passwords!
  });
});`,
      secureCode: `// SECURE: Generic public error response; internal error logging
app.use((err, req, res, next) => {
  const errorId = crypto.randomUUID();
  // Log full stack trace internally to secure logger
  logger.error({ errorId, err, path: req.path, user: req.user?.id });
  
  // Return sanitized, non-leaking error to client
  res.status(500).json({
    error: 'Internal Server Error',
    referenceId: errorId
  });
});`,
      explanation: 'Hiding internal stack traces prevents attackers from gaining intelligence on server directory layouts, library versions, and backend database queries.'
    },
    quiz: [
      {
        question: 'Why is exposing detailed stack traces in production considered a security risk?',
        options: [
          'It slows down the CPU rendering of HTML.',
          'It leaks underlying database technologies, framework versions, file paths, and internal logic that adversaries use to craft targeted exploits.',
          'Stack traces are illegal under ISO 27001.',
          'It triggers automatic browser blocking.'
        ],
        correctIndex: 1,
        explanation: 'Detailed stack traces provide adversaries with architectural roadmaps, including exact library versions and SQL query structures.'
      }
    ],
    simulationType: 'misconfiguration'
  },
  {
    id: 'vulnerable-components',
    number: 10,
    title: 'Vulnerable & Outdated Components',
    subtitle: 'OWASP A06: Software Composition Analysis (SCA), CVEs, & Patch Management',
    category: 'OWASP Top 10',
    owaspMapping: 'A06:2021 - Vulnerable and Outdated Components',
    cweMapping: 'CWE-1104',
    severity: 'High',
    shortDescription: 'Managing risks associated with unsupported or outdated third-party libraries, modules, frameworks, and operating system packages carrying known CVEs.',
    conceptTheory: [
      'Modern applications are rarely built from scratch; 80% to 90% of the lines of code in a typical web application come from open-source dependencies (npm packages, Python pip libraries, Java Maven jars, Docker base images).',
      'When a vulnerability is discovered in a library (e.g., Log4Shell in Log4j, or Spring4Shell), a CVE (Common Vulnerabilities and Exposures) is published with an associated CVSS severity score.',
      'Attackers monitor public CVE databases and GitHub security advisories to build automated scanners that target unpatched applications before organizations deploy security updates.'
    ],
    attackMechanism: [
      'CVE Exploitation: Running automated scans against target web applications to fingerprint outdated frameworks (e.g., Apache Struts 2.3.x) and executing published exploit proofs-of-concept.',
      'Dependency Confusion / Typosquatting: Publishing malicious packages with names similar to internal private packages on public npm/PyPI repositories.',
      'Supply Chain Poisoning: Hijacking maintainer credentials on GitHub or npm to inject malicious code into updates of popular utility packages.'
    ],
    realWorldScenario: 'The 2017 Equifax data breach resulted from an unpatched Apache Struts vulnerability (CVE-2017-5638). A patch had been available for two months, but because Equifax lacked an inventory of third-party components, the portal remained vulnerable, compromising the personal data of 147 million people.',
    remediationSteps: [
      'Maintain an accurate Software Bill of Materials (SBOM) for all production systems.',
      'Integrate automated Software Composition Analysis (SCA) tools (Snyk, Dependabot, npm audit, OWASP Dependency-Check) into your CI/CD pipeline.',
      'Establish a formal Patch Management SLA: patch Critical CVEs within 24–48 hours of release.',
      'Remove unused dependencies and pin library versions with cryptographic integrity hashes.'
    ],
    codeSnippet: {
      language: 'json',
      vulnerableCode: `// package.json with floating wildcard versions and known vulnerable packages
{
  "dependencies": {
    "lodash": "4.17.4",       // High: Prototype pollution (CVE-2019-10744)
    "axios": "*",             // Insecure wildcard: accepts breaking or hijacked releases
    "jsonwebtoken": "8.5.1"    // Older version lacking strict algorithm enforcement
  }
}`,
      secureCode: `// Secure package.json: Pinned patched versions + automated audit step
{
  "dependencies": {
    "lodash": "^4.17.21",     // Patched against prototype pollution
    "axios": "1.7.4"          // Pinned version verified against security advisories
  },
  "scripts": {
    "prebuild": "npm audit --audit-level=high" // Fails CI/CD build if high/critical CVEs exist
  }
}`,
      explanation: 'Running dependency audits inside the CI pipeline prevents code containing known vulnerabilities from reaching production.'
    },
    quiz: [
      {
        question: 'What is a Software Bill of Materials (SBOM)?',
        options: [
          'An invoice sent to clients for software licensing fees.',
          'A formal, machine-readable inventory of all software components, open-source libraries, and dependencies included in an application.',
          'A list of firewall rules applied to a Linux server.',
          'A source code compiler configuration file.'
        ],
        correctIndex: 1,
        explanation: 'An SBOM provides visibility into every library and nested dependency used in a codebase, allowing security teams to immediately determine if a newly disclosed CVE affects their software.'
      }
    ],
    simulationType: 'outdated_components'
  },
  {
    id: 'authentication-failures',
    number: 11,
    title: 'Authentication & Identification Failures',
    subtitle: 'OWASP A07: Session Fixation, Credential Stuffing, & Multi-Factor Defenses',
    category: 'OWASP Top 10',
    owaspMapping: 'A07:2021 - Identification and Authentication Failures',
    cweMapping: 'CWE-287, CWE-384, CWE-799',
    severity: 'Critical',
    shortDescription: 'Defects allowing attackers to compromise passwords, keys, or session tokens, or to exploit other implementation flaws to assume other users’ identities.',
    conceptTheory: [
      'Confirmation of a user’s identity, authentication, and session management are critical to protect against authentication-related attacks. When these mechanisms are weak, an attacker can impersonate authorized users or administrators.',
      'Common failures include: permitting automated credential stuffing (testing millions of breached username/password combos without rate limits), allowing weak passwords, session fixation (reusing a pre-login session ID after login), and insecure password reset flows.',
      'Multi-Factor Authentication (MFA) using FIDO2/WebAuthn or Time-based One-Time Passwords (TOTP) dramatically reduces account takeover risk.'
    ],
    attackMechanism: [
      'Credential Stuffing: Utilizing automated botnets to replay stolen credentials from third-party breaches against a login endpoint that lacks rate limiting or CAPTCHA.',
      'Session Hijacking: Stealing session tokens via XSS, network eavesdropping, or predictable session ID generation algorithms.',
      'Brute Force Attacks: Rapidly guessing sequential passwords or 4-digit PINs when no lockout thresholds are enforced.'
    ],
    realWorldScenario: 'An enterprise VPN portal allowed unlimited login attempts without account lockout or CAPTCHA. An attacker executed a low-and-slow password spraying attack across 10,000 corporate email accounts using "Spring2026!", compromising 34 employee accounts within hours.',
    remediationSteps: [
      'Enforce Multi-Factor Authentication (MFA) for all administrative and user logins.',
      'Implement strict rate limiting and account lockouts (or progressive delays) based on IP and username.',
      'Destroy existing session tokens upon login and generate a brand-new cryptographically random session identifier (prevents Session Fixation).',
      'Store session cookies with HttpOnly, Secure, and SameSite=Strict attributes.'
    ],
    codeSnippet: {
      language: 'typescript',
      vulnerableCode: `// VULNERABLE: No rate limiting, weak session cookie, session fixation
app.post('/api/login', async (req, res) => {
  const { user, pass } = req.body;
  const valid = await checkCreds(user, pass);
  if (!valid) return res.status(401).send('Bad credentials');
  
  // Vulnerable: Reuses existing session ID, cookie missing HttpOnly and Secure
  res.setHeader('Set-Cookie', \`session_id=\${req.cookies.temp_session}; Path=/\`);
  res.send('Logged in');
});`,
      secureCode: `// SECURE: Rate-limited login, session regeneration, hardened cookies
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                   // Maximum 5 failed attempts per IP
  message: { error: 'Too many login attempts. Please try again later.' }
});

app.post('/api/login', loginLimiter, async (req, res) => {
  const { user, pass } = req.body;
  const userRecord = await verifyCredentials(user, pass);
  if (!userRecord) return res.status(401).json({ error: 'Invalid username or password' });
  
  // Destroy old session & regenerate a new cryptographically random ID
  req.session.regenerate((err) => {
    req.session.userId = userRecord.id;
    res.cookie('auth_token', generateSecureToken(), {
      httpOnly: true, // Prevents JavaScript (XSS) from reading the cookie
      secure: true,   // Transmitted only over HTTPS
      sameSite: 'strict' // Defends against CSRF attacks
    });
    res.json({ success: true });
  });
});`,
      explanation: 'Rate limiting prevents credential stuffing, session regeneration stops session fixation, and httpOnly/secure cookie flags protect session tokens from theft.'
    },
    quiz: [
      {
        question: 'What is Session Fixation?',
        options: [
          'Fixing a broken database session table.',
          'An attack where an adversary forces a victim to use a known session identifier, so that once the victim logs in, the attacker can hijack the authenticated session.',
          'When a user session never expires.',
          'An error in CSS fixed positioning.'
        ],
        correctIndex: 1,
        explanation: 'Session Fixation occurs when an application retains the same session ID before and after authentication, allowing an attacker who pre-planted that ID to access the user account.'
      }
    ],
    simulationType: 'auth_failures'
  },
  {
    id: 'data-integrity-failures',
    number: 12,
    title: 'Software & Data Integrity Failures',
    subtitle: 'OWASP A08: Insecure Deserialization, CI/CD Pipeline Security, & Code Signing',
    category: 'OWASP Top 10',
    owaspMapping: 'A08:2021 - Software and Data Integrity Failures',
    cweMapping: 'CWE-502, CWE-494, CWE-829',
    severity: 'High',
    shortDescription: 'Focuses on making assumptions related to software updates, critical data, and CI/CD pipelines without verifying cryptographic integrity.',
    conceptTheory: [
      'Software and data integrity failures relate to code and infrastructure that does not protect against integrity violations. This includes pulling dependencies from untrusted repositories, unverified software updates, and insecure deserialization.',
      'Insecure Deserialization: When untrusted data is used to instantiate objects without validation. If an application deserializes untrusted binary, YAML, or serialized JSON objects, attackers can manipulate object properties or execute arbitrary code via gadget chains.',
      'CI/CD pipeline compromises (such as the SolarWinds attack) occur when malicious code is injected into build servers before signatures or release packages are generated.'
    ],
    attackMechanism: [
      'Java/Python Object Deserialization: Sending malicious serialized byte streams (e.g., Python pickle, Java ObjectInputStream) that execute system commands upon deserialization (__reduce__ method).',
      'Tampered Auto-Updates: Intercepting HTTP software updates (lacking digital signatures) via MITM and replacing the update binary with trojanized malware.',
      'Unsigned Webhooks: Processing external payment webhook notifications without verifying HMAC signatures, allowing attackers to forge "Payment Successful" events.'
    ],
    realWorldScenario: 'An enterprise payment gateway processed billing notifications via serialized Python objects stored in cookies. An attacker submitted a base64-encoded serialized Python pickle payload with an embedded OS command, obtaining a reverse root shell on the server.',
    remediationSteps: [
      'Do not accept serialized objects from untrusted sources; prefer pure, schema-validated JSON or Protocol Buffers.',
      'Verify digital signatures (PGP/GPG, Cosign) on all software downloads, container images, and packages.',
      'Verify HMAC signatures on incoming webhooks (e.g., Stripe-Signature, GitHub Webhooks) using a shared secret.',
      'Harden CI/CD build runners and require branch protection with multi-party code reviews.'
    ],
    codeSnippet: {
      language: 'python',
      vulnerableCode: `# VULNERABLE: Using Python pickle to deserialize untrusted user input
import pickle
import base64

def load_user_session(cookie_data):
    # DANGEROUS: pickle.loads() can execute arbitrary code during unpickling!
    raw_bytes = base64.b64decode(cookie_data)
    return pickle.loads(raw_bytes)  # Remote Code Execution vulnerability!`,
      secureCode: `# SECURE: Use standard, safe JSON with strict schema validation
import json
import hmac
import hashlib

SECRET_KEY = b'secure_production_hmac_secret_key_32bytes'

def load_user_session_secure(cookie_data, signature):
    # Verify HMAC signature first to ensure data was not tampered with
    expected_sig = hmac.new(SECRET_KEY, cookie_data.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected_sig, signature):
        raise ValueError("Invalid session signature - possible tampering!")
    
    # Safely parse data as pure JSON (cannot execute arbitrary code)
    return json.loads(cookie_data)`,
      explanation: 'Replacing arbitrary object deserialization with strict JSON parsing and HMAC signature verification prevents code execution payloads while ensuring message authenticity.'
    },
    quiz: [
      {
        question: 'Why is deserializing untrusted data with Python’s "pickle" or Java’s "ObjectInputStream" inherently dangerous?',
        options: [
          'Because serialized files take up excessive disk space.',
          'Because the deserialization process can invoke object constructors and gadget chains that execute arbitrary system commands before validation can occur.',
          'Because pickle cannot serialize integers.',
          'Because deserialization requires an active internet connection.'
        ],
        correctIndex: 1,
        explanation: 'Pickle and Java serialization allow objects to specify code that runs during reconstruction, providing adversaries with a direct vector for Remote Code Execution.'
      }
    ],
    simulationType: 'data_integrity'
  },
  {
    id: 'logging-monitoring-failures',
    number: 13,
    title: 'Security Logging & Monitoring Failures',
    subtitle: 'OWASP A09: Insufficient Auditing, Missing Incident Detection, & SIEM Integration',
    category: 'OWASP Top 10',
    owaspMapping: 'A09:2021 - Security Logging and Monitoring Failures',
    cweMapping: 'CWE-778, CWE-117',
    severity: 'Medium',
    shortDescription: 'Failures that prevent security teams from detecting, escalating, and responding to active breaches in progress, leading to prolonged dwell times.',
    conceptTheory: [
      'The average time to identify and contain a data breach (dwell time) exceeds 200 days. Without adequate logging and real-time monitoring, an attacker can maintain persistent access and exfiltrate databases undetected.',
      'Security Logging is not just debugging: it records auditable security events (login attempts, privilege escalations, password changes, high-value transactions, access control rejections).',
      'Log Injection (CWE-117) occurs when un-sanitized user input containing newline characters (\\r\\n) is written to log files, allowing attackers to forge fake log entries or blind SIEM parsers.'
    ],
    attackMechanism: [
      'Silent Brute Force: An attacker submits 500,000 login guesses. Because failed logins are never logged or counted, no alert is triggered.',
      'Log Forgery (Carriage Return Injection): Submitting usernames containing: "admin\\n[INFO] 2026-10-14 12:00:00 Admin logged in successfully", confounding security analysts.',
      'Log Tampering: If logs are stored locally on the compromised web server, an attacker with root privileges deletes /var/log/nginx/access.log to cover their tracks.'
    ],
    realWorldScenario: 'An attacker probed a health insurance portal for two months using automated SQL injection tools. Because the application did not log HTTP 500 errors or failed query exceptions, the security team was unaware of the breach until customers reported unauthorized record sales on the dark web.',
    remediationSteps: [
      'Log all authentication events, authorization failures, input validation errors, and high-value transactions with user IDs and timestamps.',
      'Stream logs in real-time to an append-only, centralized SIEM (Splunk, Elastic, Datadog) that attackers cannot alter from the web server.',
      'Sanitize all user inputs before logging to neutralize log injection (strip newlines \\r and \\n).',
      'Establish real-time threshold alerts for anomalies (e.g., >10 failed logins per user per minute).'
    ],
    codeSnippet: {
      language: 'typescript',
      vulnerableCode: `// VULNERABLE: Direct string interpolation into log; vulnerable to Log Injection
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  // If username is: "guest\\n2026-10-14 12:00:00 [AUDIT] User admin logged in"
  // it creates a forged log line!
  console.log(\`[\${new Date().toISOString()}] Failed login attempt for user: \${username}\`);
});`,
      secureCode: `// SECURE: Structured JSON logging with input sanitization & centralized transport
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.Console()] // Stream to SIEM collector
});

app.post('/api/login', (req, res) => {
  const sanitizedUser = String(req.body.username || '').replace(/[\\r\\n]/g, '').slice(0, 50);
  logger.warn({
    event: 'AUTHENTICATION_FAILURE',
    timestamp: new Date().toISOString(),
    ip: req.ip,
    username: sanitizedUser,
    userAgent: req.headers['user-agent']
  });
});`,
      explanation: 'Emitting structured JSON logs and sanitizing newline characters guarantees log integrity and enables automated SIEM parsing and alert triggering.'
    },
    quiz: [
      {
        question: 'What is Log Injection (CWE-117)?',
        options: [
          'Overfilling the hard drive until the server shuts down.',
          'Injecting newline characters (\\r\\n) and fake log entries into log streams to deceive administrators or disrupt SIEM parsers.',
          'Using SQL injection to delete the entire database.',
          'Writing logs exclusively in Python.'
        ],
        correctIndex: 1,
        explanation: 'If untrusted input is logged without sanitizing newlines, attackers can forge arbitrary log entries to confuse forensics investigations.'
      }
    ],
    simulationType: 'logging_monitoring'
  },
  {
    id: 'ssrf-attack',
    number: 14,
    title: 'SSRF Attack (Server-Side Request Forgery)',
    subtitle: 'OWASP A10: Cloud Metadata Theft, Internal Pivoting, & Safe Webhook Fetching',
    category: 'Advanced Web Vulnerabilities',
    owaspMapping: 'A10:2021 - Server-Side Request Forgery (SSRF)',
    cweMapping: 'CWE-918',
    severity: 'Critical',
    shortDescription: 'Vulnerabilities that allow an attacker to induce a server-side application to make HTTP requests to an arbitrary domain chosen by the attacker.',
    conceptTheory: [
      'Server-Side Request Forgery occurs when a web application fetches a remote resource (e.g. importing an avatar from a URL, generating a website screenshot, fetching a webhook) without validating the destination address.',
      'Because the outgoing request originates from the trusted server inside the internal network, it bypasses perimeter network firewalls and can access internal-only services.',
      'The most critical SSRF impact is targeting cloud instance metadata services (e.g., AWS/GCP/Azure link-local address http://169.254.169.254/) to steal IAM role credentials and cloud API keys.'
    ],
    attackMechanism: [
      'Cloud Metadata Query: Passing http://169.254.169.254/latest/meta-data/iam/security-credentials/admin-role to steal temporary AWS access tokens.',
      'Internal Network Scanning: Forcing the server to probe internal RFC1918 addresses (http://192.168.1.1, http://10.0.0.5:6379) to communicate with unauthenticated Redis or Elastic clusters.',
      'DNS Rebinding / Alternate IP Encodings: Bypassing weak blocklists using decimal IP format (http://2852039166 instead of 169.254.169.254) or domain names that resolve to 127.0.0.1.'
    ],
    realWorldScenario: 'The 2019 Capital One data breach compromised the personal information of over 100 million individuals. An SSRF flaw in a misconfigured open-source WAF allowed an attacker to query the AWS EC2 metadata endpoint (169.254.169.254), obtain the WAF’s IAM role credentials, and download all data stored in 700 S3 buckets.',
    remediationSteps: [
      'Enforce an Allowlist of permitted domain names and protocols (HTTPS only); never rely on blacklisting "169.254.169.254" or "localhost".',
      'Resolve the destination domain to an IP address and verify it is NOT in private or loopback ranges (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16) before connecting.',
      'Enforce AWS IMDSv2 (Instance Metadata Service Version 2) which requires a session token obtained via HTTP PUT, neutralizing simple SSRF GET attacks.',
      'Segment the web application on a dedicated egress VLAN with zero access to internal databases or metadata endpoints.'
    ],
    codeSnippet: {
      language: 'typescript',
      vulnerableCode: `// VULNERABLE: Blindly fetching arbitrary user-supplied URL
app.post('/api/fetch-avatar', async (req, res) => {
  const { imageUrl } = req.body;
  // Attacker inputs: http://169.254.169.254/latest/meta-data/
  const response = await fetch(imageUrl);
  const data = await response.text();
  res.send(data); // Returns AWS IAM credentials to attacker!
});`,
      secureCode: `// SECURE: Domain allowlist, IP resolution check, and link-local blocking
import dns from 'dns/promises';
import ipaddr from 'ipaddr.js';

app.post('/api/fetch-avatar', async (req, res) => {
  const { imageUrl } = req.body;
  const parsed = new URL(imageUrl);
  
  // 1. Only allow HTTPS
  if (parsed.protocol !== 'https:') return res.status(400).send('HTTPS required');
  
  // 2. Resolve IP and verify it is not private/reserved/loopback
  const { address } = await dns.lookup(parsed.hostname);
  const ip = ipaddr.parse(address);
  if (ip.range() !== 'unicast') {
    return res.status(403).send('Forbidden destination IP address');
  }
  
  // 3. Fetch with strict timeout and no automatic redirect following
  const response = await fetch(imageUrl, { redirect: 'error', signal: AbortSignal.timeout(3000) });
  res.type('image/png').send(await response.arrayBuffer());
});`,
      explanation: 'Resolving the hostname to an IP and checking against reserved ranges (RFC1918 and link-local) prevents internal network pivoting and cloud metadata exfiltration.'
    },
    quiz: [
      {
        question: 'Why is the link-local IP 169.254.169.254 a prime target during SSRF attacks?',
        options: [
          'It is the default IP address of all home Wi-Fi routers.',
          'It hosts the cloud Instance Metadata Service (IMDS) in AWS, Azure, and GCP, which often exposes IAM credentials and VM configurations.',
          'It is a special IP that shuts down the operating system.',
          'It bypasses SSL certificates automatically.'
        ],
        correctIndex: 1,
        explanation: 'Major cloud providers host instance metadata at 169.254.169.254. If an SSRF occurs, attackers query this endpoint to extract temporary IAM credentials and take over cloud resources.'
      }
    ],
    simulationType: 'ssrf_attack'
  },
  {
    id: 'csrf-attack',
    number: 15,
    title: 'CSRF Attack (Cross-Site Request Forgery)',
    subtitle: 'State-Changing Request Forgery, SameSite Cookies, & Synchronizer Tokens',
    category: 'Advanced Web Vulnerabilities',
    cweMapping: 'CWE-352',
    severity: 'High',
    shortDescription: 'Attacks that trick authenticated users into executing unwanted state-changing actions on a trusted web application without their knowledge or consent.',
    conceptTheory: [
      'Cross-Site Request Forgery (CSRF) exploits the ambient authority of web browsers: browsers automatically include credentials (session cookies, HTTP Basic Auth) with cross-origin requests.',
      'If a user visits a malicious website (evil.com) while logged into bank.com, evil.com can submit a hidden HTML form to bank.com/transfer. Because the browser automatically attaches bank.com cookies, the bank treats the transfer as legitimate.',
      'Modern defenses combine the SameSite cookie attribute (Strict or Lax) with unique, unpredictable Anti-CSRF Synchronizer Tokens.'
    ],
    attackMechanism: [
      'Hidden Form Submission: An attacker hosts a webpage with an invisible <form> that automatically submits on page load via JavaScript (document.forms[0].submit()).',
      'GET-based State Changes: Using an <img src="https://bank.com/transfer?amount=1000&to=attacker"> tag to trigger actions if the application erroneously accepts GET requests for mutations.',
      'Cross-Origin Fetch: Initiating cross-origin XMLHttpRequest or fetch() with credentials: "include" if CORS or SameSite cookies are misconfigured.'
    ],
    realWorldScenario: 'A home Wi-Fi router management panel allowed password changes via a simple GET request: /set_dns?primary=attacker_ip. An attacker embedded this URL in an image tag on a popular forum. Thousands of forum visitors had their home router DNS hijacked simply by loading the webpage.',
    remediationSteps: [
      'Configure all session cookies with SameSite=Strict or SameSite=Lax.',
      'Implement the Synchronizer Token Pattern (Anti-CSRF tokens): embed a cryptographically random token in HTML forms and verify it on state-changing requests (POST/PUT/DELETE).',
      'Verify standard HTTP request headers: check the Origin and Referer headers against expected domain origins.',
      'Require user re-authentication or password confirmation before executing critical actions (password change, fund transfer, email update).'
    ],
    codeSnippet: {
      language: 'html',
      vulnerableCode: `<!-- VULNERABLE: Attack page hosted on evil.com tricks victim's browser -->
<html>
  <body onload="document.forms[0].submit()">
    <form action="https://bank.example.com/api/transfer" method="POST">
      <input type="hidden" name="to_account" value="ATTACKER_9821" />
      <input type="hidden" name="amount" value="5000" />
    </form>
    <!-- Victim's browser automatically attaches session cookies to bank.example.com! -->
  </body>
</html>`,
      secureCode: `// SECURE: Server verifies Anti-CSRF Token & sets SameSite=Strict cookies
// 1. In Cookie config:
res.cookie('session_id', token, { httpOnly: true, secure: true, sameSite: 'strict' });

// 2. In Form generation: Include unique cryptographic token bound to session
<form action="/api/transfer" method="POST">
  <input type="hidden" name="_csrf" value="d9a1f7c8b2e4...unique_token" />
  <input type="text" name="amount" />
  <button type="submit">Transfer</button>
</form>

// 3. In Server Middleware: Validate token matches session
if (req.body._csrf !== req.session.csrfToken) {
  return res.status(403).json({ error: 'CSRF token mismatch or expired' });
}`,
      explanation: 'Because evil.com cannot read the anti-CSRF token due to the browser Same-Origin Policy, any forged request will fail verification on the server.'
    },
    quiz: [
      {
        question: 'How does the cookie attribute "SameSite=Strict" defend against CSRF attacks?',
        options: [
          'It encrypts cookie data with AES-256.',
          'It instructs the browser never to send the cookie in cross-site requests, meaning requests initiated from evil.com will arrive unauthenticated.',
          'It blocks all GET requests to the website.',
          'It expires the cookie after 60 seconds.'
        ],
        correctIndex: 1,
        explanation: 'SameSite=Strict prevents the browser from attaching the cookie whenever a request originates from a different origin domain, completely neutralizing cross-origin form forgery.'
      }
    ],
    simulationType: 'csrf_attack'
  },
  {
    id: 'file-upload-vulnerability',
    number: 16,
    title: 'File Upload Vulnerability',
    subtitle: 'Unrestricted File Upload, Web Shell Execution, & Storage Defenses',
    category: 'Advanced Web Vulnerabilities',
    cweMapping: 'CWE-434',
    severity: 'Critical',
    shortDescription: 'Risks arising when an application allows users to upload files without properly validating their name, extension, MIME type, or file content, leading to Remote Code Execution.',
    conceptTheory: [
      'Unrestricted File Upload is one of the most hazardous vulnerabilities. If an attacker uploads a server-executable script (e.g. .php, .jsp, .aspx) to a web-accessible directory and then requests it via their browser, the server executes the script, granting the attacker Remote Code Execution (RCE).',
      'Common validation mistakes include checking only client-side JavaScript, trusting the Content-Type header (which is controlled by the client), or using a flawed blacklist of extensions (.php blocked, but .phtml, .php5, or .php.jpg permitted).',
      'Defensive best practice requires storing uploaded files completely outside the public web root or in isolated cloud object storage (e.g., S3) with randomized filenames and strict content sniffing.'
    ],
    attackMechanism: [
      'Web Shell Upload: Uploading a malicious script (e.g. <?php system($_GET[\'cmd\']); ?>) disguised as an avatar, then accessing /uploads/avatar.php?cmd=id.',
      'Double Extension & Null Byte Bypasses: Bypassing naive regex with filenames like avatar.php.png or avatar.php%00.jpg.',
      'MIME Type / Magic Bytes Spoofing: Prepending GIF89a header bytes to a PHP web shell so file identification utilities classify it as an image.'
    ],
    realWorldScenario: 'A support ticketing portal allowed users to upload screenshots. The server saved uploads to /public/attachments/ with their original names and no execution restrictions. An attacker uploaded a webshell titled c99.php, accessed it via URL, and executed shell commands to compromise the backend database.',
    remediationSteps: [
      'Store files outside the public web server document root, or upload directly to dedicated cloud storage buckets (e.g., S3/GCS) configured with private ACLs.',
      'Generate a new random filename (UUIDv4) and replace the user-provided filename completely.',
      'Enforce an explicit Extension Allowlist (e.g., only .png, .jpg, .pdf) rather than a blacklist.',
      'Inspect magic bytes (file signature) using server-side libraries to verify actual content matches the extension.',
      'Serve uploaded files with Content-Disposition: attachment and X-Content-Type-Options: nosniff headers.'
    ],
    codeSnippet: {
      language: 'typescript',
      vulnerableCode: `// VULNERABLE: Direct upload to public root using original filename & trusting client MIME
app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
  // Trusting req.file.originalname allows an attacker to upload "shell.php"!
  const targetPath = path.join(__dirname, 'public/avatars', req.file.originalname);
  fs.renameSync(req.file.path, targetPath);
  res.json({ url: '/avatars/' + req.file.originalname });
});`,
      secureCode: `// SECURE: Allowlist validation, UUID renaming, and external storage directory
import { randomUUID } from 'crypto';
import fileType from 'file-type';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

app.post('/api/upload-avatar', upload.single('avatar'), async (req, res) => {
  // 1. Inspect actual binary magic bytes on disk
  const detected = await fileType.fromFile(req.file.path);
  if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
    await fs.promises.unlink(req.file.path);
    return res.status(400).json({ error: 'Only valid JPEG, PNG, and WebP images allowed' });
  }
  
  // 2. Generate a random UUID filename (discard original user-provided name)
  const safeFilename = \`\${randomUUID()}.\${detected.ext}\`;
  
  // 3. Store in non-executable storage directory outside web root
  const destination = path.join('/var/storage/uploads', safeFilename);
  await fs.promises.rename(req.file.path, destination);
  
  res.json({ fileId: safeFilename });
});`,
      explanation: 'Verifying file magic bytes on disk, stripping user filenames in favor of random UUIDs, and storing files in non-executable directories neutralizes web shell execution.'
    },
    quiz: [
      {
        question: 'What is the most effective architectural defense against web shell execution from uploaded files?',
        options: [
          'Checking the file extension using client-side JavaScript.',
          'Storing uploaded files outside the public web document root (or in private cloud object storage) and serving them through an application gateway with randomized filenames.',
          'Renaming all files to have the .txt extension.',
          'Restricting file size to under 2MB.'
        ],
        correctIndex: 1,
        explanation: 'If uploaded files are stored outside the web root or on isolated object storage where the web server does not execute scripts, an uploaded web shell cannot be executed by requesting its URL.'
      }
    ],
    simulationType: 'file_upload'
  },
  {
    id: 'bug-hunting-platforms',
    number: 17,
    title: 'Bug Hunting Platforms & Target Choosing',
    subtitle: 'HackerOne, Bugcrowd, Scope Analysis, & Responsible Disclosure',
    category: 'Bug Bounty & Methodology',
    severity: 'Informational',
    shortDescription: 'Navigating professional bug bounty ecosystems, reading Policy & Rules of Engagement, analyzing In-Scope vs Out-of-Scope assets, and writing professional vulnerability reports.',
    conceptTheory: [
      'Bug bounty platforms (such as HackerOne, Bugcrowd, Intigriti, and YesWeHack) act as trusted intermediaries connecting independent ethical security researchers with organizations that run vulnerability disclosure programs (VDP) and bug bounty programs.',
      'The golden rule of ethical bug hunting is adherence to Scope and Rules of Engagement (RoE). Testing assets outside the defined scope is strictly unauthorized and illegal.',
      'Target selection strategies differ between broad-scope public programs (thousands of subdomains, heavy competition, rewarding novel recon or obscure assets) and focused private invite-only programs (deeper business logic testing).'
    ],
    attackMechanism: [
      'Scope Parsing: Distinguishing between In-Scope assets (*.example.com, mobile apps) and explicit Out-of-Scope items (third-party payment gateways, marketing subdomains, physical office security, DDoS).',
      'Target Triaging: Prioritizing assets that have recently changed (new feature rollouts, API version increments like /v2/ or /v3/) where security regressions are most frequent.',
      'Professional Reporting: Formulating reports using the standard structure: Vulnerability Summary, CVSS Score, Steps to Reproduce (PoC), Business Impact, and Remediation Recommendation.'
    ],
    realWorldScenario: 'A security researcher read the policy of a fintech program on HackerOne. While payment endpoints were out-of-scope, the onboarding API (/api/v2/kyc) was in-scope. The researcher identified an IDOR vulnerability, filed a detailed report with reproduction steps, and received a $3,500 bounty with high praise from the triage team.',
    remediationSteps: [
      'Always read and re-read the program policy and scope before sending a single network packet.',
      'Respect rate limits and automated testing restrictions specified in the program rules.',
      'Never access, modify, or exfiltrate another user\'s private data; stop testing and report as soon as a proof-of-concept is validated.',
      'Provide clear, reproducible steps and actionable remediation advice in your vulnerability submission.'
    ],
    codeSnippet: {
      language: 'markdown',
      vulnerableCode: `# Poor Bug Report (Frequently closed as "Informative" or "Not Applicable"):
Subject: Bug found in your site
Hello, I found a bug in your website. When I type ' in search it errors.
Please pay me bounty to my PayPal.
Thanks!`,
      secureCode: `# Professional Vulnerability Report Template (HackerOne / Bugcrowd standard):
## 1. Vulnerability Title
[IDOR] Unauthorized User Data Disclosure via \`/api/v2/users/{id}/invoices\`

## 2. Severity & Asset
- **Severity**: High (CVSS 3.1: 7.5 - CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N)
- **Asset**: \`https://portal.target.com\` (In-Scope per Policy)

## 3. Vulnerability Summary
The endpoint \`/api/v2/users/{id}/invoices\` does not verify that the requesting user's session owns the requested user ID. Authenticated users can retrieve invoices belonging to other tenants.

## 4. Steps to Reproduce (Proof of Concept)
1. Log in with low-privileged account A (User ID: 1042).
2. Intercept request in Burp Suite: \`GET /api/v2/users/1042/invoices HTTP/1.1\`
3. Change parameter from \`1042\` to \`1041\` (User B's account).
4. Observe HTTP 200 OK containing User B's billing records and tax identifier.

## 5. Remediation Recommendation
Enforce server-side ownership checks:
\`WHERE invoice_id = :id AND user_id = :current_authenticated_user_id\``,
      explanation: 'A structured, professional report following industry conventions ensures rapid triage, proper credit, and clear communication with security engineering teams.'
    },
    quiz: [
      {
        question: 'What must a security researcher do first before beginning any bug bounty testing on a platform like HackerOne or Bugcrowd?',
        options: [
          'Launch a multi-threaded automated DDoS test against the main domain.',
          'Thoroughly read the program\'s Policy, Scope, and Rules of Engagement to verify which assets are authorized for testing.',
          'Download all database records to prove access.',
          'Post their findings on social media.'
        ],
        correctIndex: 1,
        explanation: 'Testing assets outside the authorized scope or violating the rules of engagement can result in program disqualification and legal liability.'
      }
    ],
    simulationType: 'bug_hunting_scope'
  }
];
