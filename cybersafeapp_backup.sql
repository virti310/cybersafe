--
-- PostgreSQL database dump
--

\restrict Orce1vfgVGMQETvMjUm5KwkYygAcCzjSxxtRoC7oM00dnYg690sYA5OyUaSVvoE

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: awareness; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.awareness (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image text
);


ALTER TABLE public.awareness OWNER TO postgres;

--
-- Name: awareness_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.awareness_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.awareness_id_seq OWNER TO postgres;

--
-- Name: awareness_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.awareness_id_seq OWNED BY public.awareness.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: emergency_contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emergency_contacts (
    id integer NOT NULL,
    team text NOT NULL,
    priority text NOT NULL,
    description text NOT NULL,
    availability text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    location text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.emergency_contacts OWNER TO postgres;

--
-- Name: emergency_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emergency_contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emergency_contacts_id_seq OWNER TO postgres;

--
-- Name: emergency_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emergency_contacts_id_seq OWNED BY public.emergency_contacts.id;


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faqs (
    id integer NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.faqs OWNER TO postgres;

--
-- Name: faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faqs_id_seq OWNER TO postgres;

--
-- Name: faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    type text DEFAULT 'info'::character varying,
    user_id integer NOT NULL,
    fcm_token text NOT NULL,
    sent_by integer,
    status text DEFAULT 'pending'::character varying,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT notifications_status_check CHECK ((status = ANY (ARRAY[('pending'::character varying)::text, ('sent'::character varying)::text, ('failed'::character varying)::text])))
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.policies (
    id integer NOT NULL,
    title text,
    content text
);


ALTER TABLE public.policies OWNER TO postgres;

--
-- Name: policies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.policies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.policies_id_seq OWNER TO postgres;

--
-- Name: policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.policies_id_seq OWNED BY public.policies.id;


--
-- Name: recovery_guides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recovery_guides (
    id integer NOT NULL,
    category_id integer,
    guide text NOT NULL,
    steps text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    title character varying(255),
    content text
);


ALTER TABLE public.recovery_guides OWNER TO postgres;

--
-- Name: recovery_guides_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recovery_guides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recovery_guides_id_seq OWNER TO postgres;

--
-- Name: recovery_guides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recovery_guides_id_seq OWNED BY public.recovery_guides.id;


--
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    id integer NOT NULL,
    incident_date text NOT NULL,
    incident_details text NOT NULL,
    incident_type text,
    is_financial_fraud boolean DEFAULT false,
    bank_name text,
    transaction_id text,
    transaction_date text,
    fraud_amount text,
    suspect_url text,
    suspect_mobile text,
    suspect_email text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer,
    status text DEFAULT 'Pending'::character varying,
    national_id_path text,
    evidence_path text,
    suspect_photo_path text
);


ALTER TABLE public.reports OWNER TO postgres;

--
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_id_seq OWNER TO postgres;

--
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password character(60) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    phone character varying(10),
    gender text,
    reset_otp text,
    otp_expiry timestamp without time zone,
    is_active integer DEFAULT 1,
    birthdate date,
    role character varying(50) DEFAULT 'user'::character varying,
    suspension_end_time timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: awareness id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.awareness ALTER COLUMN id SET DEFAULT nextval('public.awareness_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: emergency_contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_contacts ALTER COLUMN id SET DEFAULT nextval('public.emergency_contacts_id_seq'::regclass);


--
-- Name: faqs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: policies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies ALTER COLUMN id SET DEFAULT nextval('public.policies_id_seq'::regclass);


--
-- Name: recovery_guides id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recovery_guides ALTER COLUMN id SET DEFAULT nextval('public.recovery_guides_id_seq'::regclass);


--
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: awareness; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.awareness (id, title, content, created_at, updated_at, image) FROM stdin;
61	Phishing 101: Spot the Bait	Learn how to identify suspicious emails and links that try to steal your credentials.	2026-04-06 12:52:46.567468	2026-04-06 12:52:46.567468	https://images.unsplash.com/photo-1563206767-5b18f218e8de?fm=jpg&w=400&q=80
62	Password Strength Matters	Why "password123" is not enough and how to create complex, memorable passphrases.	2026-04-06 12:52:46.572814	2026-04-06 12:52:46.572814	https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?fm=jpg&w=400&q=80
63	Social Engineering Attacks	Understanding how attackers manipulate human psychology to gain unauthorized access.	2026-04-06 12:52:46.576314	2026-04-06 12:52:46.576314	https://images.unsplash.com/photo-1550751827-4bd374c3f58b?fm=jpg&w=400&q=80
64	To Click or Not to Click	Best practices for handling attachments and links from unknown sources.	2026-04-06 12:52:46.579997	2026-04-06 12:52:46.579997	https://images.unsplash.com/photo-1544197150-b99a580bb7a8?fm=jpg&w=400&q=80
65	Mobile Device Security	Securing your smartphones and tablets against theft and malware.	2026-04-06 12:52:46.583414	2026-04-06 12:52:46.583414	https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?fm=jpg&w=400&q=80
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, created_at) FROM stdin;
1	Financial Fraud	2026-01-30 13:14:02.381672
2	Social Media Hack	2026-01-30 13:14:02.386649
3	Device Compromise	2026-01-30 13:14:02.390388
4	Identity Theft	2026-01-30 13:14:02.391914
5	Online Harassment	2026-01-30 13:14:02.392851
8	Other	2026-02-02 16:19:21.383648
\.


--
-- Data for Name: emergency_contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emergency_contacts (id, team, priority, description, availability, phone, email, location, created_at, updated_at) FROM stdin;
80	National Cyber Crime Helpline	Cyber Fraud	For fraud, hacking, scams.	24/7	1930	help@cybercrime.gov.in	National	2026-04-11 17:35:25.085151	2026-04-11 17:35:25.085151
81	Financial Fraud Helpline	Cyber Fraud	Old cyber fraud helpline.	24/7	155260	fraud@cybercrime.gov.in	National	2026-04-11 17:35:25.088995	2026-04-11 17:35:25.088995
82	National Emergency Number	Police & Safety	Police, Fire, Ambulance.	24/7	112	emergency@112.gov.in	National	2026-04-11 17:35:25.09292	2026-04-11 17:35:25.09292
83	Police Helpline	Police & Safety	Direct police helpline.	24/7	100	police@gov.in	National	2026-04-11 17:35:25.096769	2026-04-11 17:35:25.096769
84	State Bank of India (SBI)	Banking	Block account/card.	24/7	1800 1234	care@sbi.co.in	National	2026-04-11 17:35:25.100758	2026-04-11 17:35:25.100758
85	HDFC Bank Support	Banking	Fraud support.	24/7	1800 1600	support@hdfc.com	National	2026-04-11 17:35:25.10406	2026-04-11 17:35:25.10406
86	ICICI Bank Support	Banking	Emergency banking help.	24/7	1800 1080	care@icicibank.com	National	2026-04-11 17:35:25.108211	2026-04-11 17:35:25.108211
87	Women Helpline	Citizen Help	Harassment, cyber abuse.	24/7	1091	womenhelp@gov.in	National	2026-04-11 17:35:25.111891	2026-04-11 17:35:25.111891
88	Child Helpline	Citizen Help	Child helpline.	24/7	1098	childline@gov.in	National	2026-04-11 17:35:25.115255	2026-04-11 17:35:25.115255
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faqs (id, question, answer, created_at) FROM stdin;
3	How do I reset my password?	Go to the profile page and select "Change Password". Follow the prompts to update your credentials.	2026-01-30 12:04:00.885283
4	Is my data encrypted?	Yes, all sensitive user data is encrypted both in transit and at rest using industry-standard protocols.	2026-01-30 12:04:00.887715
5	How do I report a security incident?	Use the "Report Incident" feature in the main menu to submit details about any suspicious activity.	2026-01-30 12:04:00.890842
6	Can I use this app offline?	Some features like viewing downloaded recovery guides work offline, but reporting requires an internet connection.	2026-01-30 12:04:00.892882
7	Who do I contact for urgent help?	Navigate to the "Emergency Contacts" page to find the appropriate team for your situation.	2026-01-30 12:04:00.895548
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, title, body, type, user_id, fcm_token, sent_by, status, metadata, created_at, updated_at) FROM stdin;
52	test	test123	BROADCAST	5	placeholder_token	\N	pending	\N	2026-02-02 18:05:48.416177	2026-02-02 18:05:48.416177
53	test	test123	BROADCAST	4	placeholder_token	\N	pending	\N	2026-02-02 18:05:48.455701	2026-02-02 18:05:48.455701
54	test	test123	BROADCAST	1	placeholder_token	\N	pending	\N	2026-02-02 18:05:48.455973	2026-02-02 18:05:48.455973
55	test	test123	BROADCAST	3	placeholder_token	\N	pending	\N	2026-02-02 18:05:48.456862	2026-02-02 18:05:48.456862
56	test	test123	BROADCAST	2	placeholder_token	\N	pending	\N	2026-02-02 18:05:48.460267	2026-02-02 18:05:48.460267
\.


--
-- Data for Name: policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.policies (id, title, content) FROM stdin;
11	Privacy Policy: Data Collection	Section 1.1: We collect basic user information for account management purposes only.
12	Privacy Policy: Data Usage	Section 1.2: Your data is never sold to third parties and is used solely for improving service delivery.
13	Privacy Policy: Cookie Policy	Section 1.3: We use cookies to enhance user experience and analyze site traffic.
14	Privacy Policy: User Rights	Section 1.4: You have the right to request access to, correction of, or deletion of your personal data.
15	Privacy Policy: Third Party Sharing	Section 1.5: Data may be shared with trusted partners only when necessary for providing our services.
\.


--
-- Data for Name: recovery_guides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recovery_guides (id, category_id, guide, steps, created_at, title, content) FROM stdin;
8	1	1. Change your password immediately.\n2. Enable Two-Factor Authentication (2FA).\n3. Revoke access to suspicious third-party apps.\n4. Check for unauthorized posts and messages.\n5. Contact support if you cannot access your account.	\N	2026-02-02 17:25:41.83249	Hacked Social Media Account	1. Change your password immediately.\n2. Enable Two-Factor Authentication (2FA).\n3. Revoke access to suspicious third-party apps.\n4. Check for unauthorized posts and messages.\n5. Contact support if you cannot access your account.
9	2	1. Disconnect your device from the internet.\n2. Scan your device for malware.\n3. Change passwords for sensitive accounts.\n4. Do not provide any personal information if requested.\n5. Mark the email as spam/phishing.	\N	2026-02-02 17:25:41.839443	Phishing Email Clicked	1. Disconnect your device from the internet.\n2. Scan your device for malware.\n3. Change passwords for sensitive accounts.\n4. Do not provide any personal information if requested.\n5. Mark the email as spam/phishing.
10	3	1. Isolate the infected device immediately.\n2. Do NOT pay the ransom.\n3. Restore data from a secure backup.\n4. Consult with a cybersecurity professional.\n5. Report the incident to authorities.	\N	2026-02-02 17:25:41.840362	Ransomware Attack	1. Isolate the infected device immediately.\n2. Do NOT pay the ransom.\n3. Restore data from a secure backup.\n4. Consult with a cybersecurity professional.\n5. Report the incident to authorities.
11	4	1. Contact your bank immediately to freeze accounts.\n2. Review transaction history for unauthorized charges.\n3. File a police report.\n4. Update your banking PINs and passwords.\n5. Monitor your credit report.	\N	2026-02-02 17:25:41.842375	Bank Fraud Detected	1. Contact your bank immediately to freeze accounts.\n2. Review transaction history for unauthorized charges.\n3. File a police report.\n4. Update your banking PINs and passwords.\n5. Monitor your credit report.
12	5	1. Place a fraud alert on your credit reports.\n2. Free your credit.\n3. Report identity theft to the government (e.g., FTC in USA).\n4. Contact institutions where fraud occurred.\n5. Update all account passwords.	\N	2026-02-02 17:25:41.842894	Identity Theft	1. Place a fraud alert on your credit reports.\n2. Free your credit.\n3. Report identity theft to the government (e.g., FTC in USA).\n4. Contact institutions where fraud occurred.\n5. Update all account passwords.
13	8	1. Use 'Find My Device' features to lock or wipe data remotely.\n2. Change passwords for accounts accessed on the device.\n3. Report the loss to your mobile carrier.\n4. Monitor accounts for suspicious activity.\n5. File a police report if stolen.	\N	2026-02-02 17:25:41.843435	Lost or Stolen Device	1. Use 'Find My Device' features to lock or wipe data remotely.\n2. Change passwords for accounts accessed on the device.\n3. Report the loss to your mobile carrier.\n4. Monitor accounts for suspicious activity.\n5. File a police report if stolen.
14	1	1. Contact your payment provider to dispute the charge.\n2. Report the website to consumer protection agencies.\n3. Keep records of all communication.\n4. Monitor your financial statements.\n5. Be cautious of similar offers in the future.	\N	2026-02-02 17:25:41.844211	Online Shopping Scam	1. Contact your payment provider to dispute the charge.\n2. Report the website to consumer protection agencies.\n3. Keep records of all communication.\n4. Monitor your financial statements.\n5. Be cautious of similar offers in the future.
15	2	1. Hang up immediately.\n2. Do NOT give remote access to your computer.\n3. If you gave access, disconnect and scan for malware.\n4. Contact your bank if you paid them.\n5. Report the number.	\N	2026-02-02 17:25:41.845596	Fake Tech Support Call	1. Hang up immediately.\n2. Do NOT give remote access to your computer.\n3. If you gave access, disconnect and scan for malware.\n4. Contact your bank if you paid them.\n5. Report the number.
16	3	1. Verify the breach is real (check official sources).\n2. Change passwords for the affected account.\n3. Use a password manager to ensure unique passwords.\n4. Enable 2FA where possible.\n5. Monitor for secondary phishing attempts.	\N	2026-02-02 17:25:41.846552	Data Breach Notification	1. Verify the breach is real (check official sources).\n2. Change passwords for the affected account.\n3. Use a password manager to ensure unique passwords.\n4. Enable 2FA where possible.\n5. Monitor for secondary phishing attempts.
17	4	1. Contact your mobile carrier immediately.\n2. Secure your email account associated with the number.\n3. Remove SMS 2FA from critical accounts (use app-based auth).\n4. Check bank accounts for unauthorized transfers.\n5. Set up a PIN with your carrier.	\N	2026-02-02 17:25:41.847376	Sim Swapping	1. Contact your mobile carrier immediately.\n2. Secure your email account associated with the number.\n3. Remove SMS 2FA from critical accounts (use app-based auth).\n4. Check bank accounts for unauthorized transfers.\n5. Set up a PIN with your carrier.
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reports (id, incident_date, incident_details, incident_type, is_financial_fraud, bank_name, transaction_id, transaction_date, fraud_amount, suspect_url, suspect_mobile, suspect_email, created_at, user_id, status, national_id_path, evidence_path, suspect_photo_path) FROM stdin;
11	2026-03-26	My social media account was hacked after I clicked a suspicious link. They changed my password and started messaging my contacts.	Social Media Hacking	f	\N	\N	\N	\N	http://suspicious-login-update-account.com/social-media-hack	\N	\N	2026-03-26 21:17:50.335042	8	Pending	\N	\N	\N
12	2026-03-26	I was offered a remote data entry job but they asked me to pay an upfront fee for training materials using this link.	Job Scam	f	\N	\N	\N	\N	http://work-from-home-global-recruitment.com/pay-fee	\N	\N	2026-03-26 21:38:19.808089	8	Pending	\N	\N	\N
13	2026-03-26	My computer got infected with ransomware after I downloaded what I thought was a software update from this website.	Malware	f	\N	\N	\N	\N	http://fast-software-driver-updater.net/download	\N	\N	2026-03-26 21:38:19.812795	8	Pending	\N	\N	\N
14	2026-03-26	I tried to buy electronics from an online store, but after transferring the money, the seller disappeared and the website went down.	Financial Fraud	f	\N	\N	\N	\N	http://cheap-electronics-megastore-wholesale.com	\N	\N	2026-03-26 21:38:19.813948	8	Pending	\N	\N	\N
15	2026-03-26	I received an urgent email claiming to be from my bank saying my account was locked. The link led to a fake login page.	Phishing	f	\N	\N	\N	\N	http://secure-login-verify-account-update.com/banking	\N	\N	2026-03-26 21:38:19.815805	8	Pending	\N	\N	\N
16	26/03/2026 22:12	My Facebook account was compromised after I received a fake security alert message. I clicked the link and entered my login details, after which I lost access to my account. Suspicious posts and messages were later sent from my account without my knowledge.	Social Media Hack	f	\N	\N	\N	\N	http://facebook-account-warning.net/secure		, 	2026-03-26 22:19:19.466407	5	Pending	\N	\N	\N
17	06-04-2026 11:42	A user installed cracked software from an untrusted website, which secretly installed malware on their device. The malware stole sensitive data like passwords, leading to unauthorized account access and financial loss.	Device Compromise	f	\N	\N	\N	\N	https://learn.microsoft.com/en-us/security/ransomware/dart-ransomware-case-study?utm_source=chatgpt.com		, 	2026-04-06 11:43:58.548266	5	Pending	\N	\N	\N
18	06-04-2026 12:12	A student received continuous abusive messages and threats from an unknown Instagram account after rejecting a friend request.\nThe attacker used fake profiles and sent harmful links to scare and harass the victim.	Online Harassment	f	\N	\N	\N	\N	http://fake-instagram-help-support.xyz/login		, 	2026-04-06 13:00:49.819636	10	Pending	\N	\N	\N
19	10/04/2026 13:15	A user downloaded a free movie from an unknown website, after which unwanted pop-up ads and apps started appearing on their device. The device performance slowed down, indicating possible malware installation.	Other	f	\N	\N	\N	\N	https://free-movie-download-hd.xyz/install		, 	2026-04-10 13:16:30.146238	10	Pending	\N	\N	\N
20	13/04/2026 10:43	My Instagram account was compromised after I clicked on a suspicious phishing link that appeared to be from Instagram. The link redirected me to a fake login page where my credentials were stolen. Unauthorized access was gained, and my account details were changed without my permission.	Social Media Hack	f	\N	\N	\N	\N	https://instagram-security-login.xyz		, 	2026-04-13 10:43:49.054556	10	Pending	\N	\N	\N
21	13/04/2026	My Instagram account was compromised after I clicked on a suspicious phishing link that appeared to be from Instagram. The link redirected me to a fake login page where my credentials were stolen. Unauthorized access was gained, and my account details were changed without my permission.	Social Media Hack	f	\N	\N	\N	\N	https://instagram-security-login.xyz		, 	2026-04-13 11:00:04.15671	10	Pending	\N	\N	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, created_at, phone, gender, reset_otp, otp_expiry, is_active, birthdate, role, suspension_end_time) FROM stdin;
8	Test Verify User	verify_1770814402550@example.com	$2b$10$IUxSEjlZzGLorarLoUMSWez//LGZ.pq..8LpUiu5546PGcc7HRSYm	2026-02-11 18:23:22.977679	1234567890	Male	360733	2026-02-11 18:33:23.141	1	\N	user	\N
4	OTP Test User	otp_test_1768563593691@example.com	$2b$10$6eRp3ZKwReE8hbgA1v3m..STeDbob5doD1cNDSDdHehYMe7qSyGj6	2026-01-16 17:09:53.8634	1234567890	Female	\N	\N	1	1998-01-23	user	\N
2	Test Verify User	verify_1768562876723@example.com	$2b$10$XSJIpnOxmPIdy.aelN7AIuNLz6zRTFuEvXRYqhqxyRYdNU.cVmbg6	2026-01-16 16:57:56.850585	1234567890	Male	\N	\N	1	1977-12-01	user	\N
7	amit	mehtavalisha@gmail.com	$2b$10$rb72fSC/Hq0O95PP06aVeuACq9R6XiSbWEuzFLyz6LHDGhUBooBPG	2026-02-03 12:45:47.717111	9376222323	Male	\N	\N	1	1986-03-10	user	\N
5	System Admin	admin@cybersafe.com	$2b$10$5YC6uSDO.nw/nzKy41h6me.WYzBG7SMW7aEPCA5U8c/EzWVp228N6	2026-01-19 16:42:16.40227	0000000000	Other	\N	\N	1	1980-06-17	admin	\N
1	testadmin	test@admin.com	hashedpassword                                              	2026-01-10 22:05:59.363106	\N	\N	\N	\N	1	1978-11-19	admin	\N
6	pujan	pujumehta231@gmail.com	$2b$10$sxfsFj5VsDig0t25z0k4u.g3IHnnRp1ovBrWFZqntHJCG3I3FnINm	2026-02-03 12:36:11.073332	8469507171	Male	\N	\N	1	1975-09-18	user	\N
9	Test Verify User	verify_1770814438862@example.com	$2b$10$pzHD74b9mQH89winOGEJh.d1VhL3FJBEhdbrwURq/Nd05D9miGS1G	2026-02-11 18:23:59.315926	1234567890	Male	267405	2026-02-11 18:33:59.514	1	\N	user	\N
10	Aangi Shah	aangihshah@gmail.com	$2b$10$vTQNfz8lWLj8cLxn/Tfx4.UepDi9wuOo4E2YhxZ.hDQIAIj7e0Fi.	2026-03-25 19:57:16.344925	8780286866	Female	\N	\N	1	2004-09-04	user	\N
3	virti	mehtavirtiiieee@gmail.com	$2b$10$6AFu2nJ/610g84Eb4utuBu/IZxcdaAIHsknQiFA6a1AXqwVCu50iK	2026-01-16 16:59:35.965475	6352807079	Female	\N	\N	1	1981-02-06	user	\N
\.


--
-- Name: awareness_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.awareness_id_seq', 45, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 8, true);


--
-- Name: emergency_contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emergency_contacts_id_seq', 41, true);


--
-- Name: faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faqs_id_seq', 7, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 56, true);


--
-- Name: policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.policies_id_seq', 15, true);


--
-- Name: recovery_guides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recovery_guides_id_seq', 17, true);


--
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reports_id_seq', 21, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- Name: awareness awareness_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.awareness
    ADD CONSTRAINT awareness_pkey PRIMARY KEY (id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: emergency_contacts emergency_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_contacts
    ADD CONSTRAINT emergency_contacts_pkey PRIMARY KEY (id);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: policies policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT policies_pkey PRIMARY KEY (id);


--
-- Name: recovery_guides recovery_guides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recovery_guides
    ADD CONSTRAINT recovery_guides_pkey PRIMARY KEY (id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_sent_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_sent_by_fkey FOREIGN KEY (sent_by) REFERENCES public.users(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: recovery_guides recovery_guides_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recovery_guides
    ADD CONSTRAINT recovery_guides_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict Orce1vfgVGMQETvMjUm5KwkYygAcCzjSxxtRoC7oM00dnYg690sYA5OyUaSVvoE

