/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const Email = require('email-templates');

const { ENV, MAILTRAP_USER, MAILTRAP_PASSWORD, SEND_EMAIL } = process.env;

const COMMON_EMAIL = 'noreply@tradingvg.com';
const COMMON_EMAIL_NAME = 'TradingVG';

const transport =
	ENV !== 'production'
		? {
				host: 'smtp.mailtrap.io',
				port: 2525,
				auth: {
					user: MAILTRAP_USER,
					pass: MAILTRAP_PASSWORD
				}
		  }
		: null;

/* 
else... 
SES: new aws.SES({
	apiVersion: '2010-12-01',
	region: process.env.AWS_SES_REGION
}) 
*/

const transporter = nodemailer.createTransport(transport);

const localesPath = `${__dirname}/locales/`;
const emailLangs = fs
	.readdirSync(localesPath, { withFileTypes: true })
	.filter(dir => dir.isDirectory())
	.reduce((langs, dir) => {
		const lang = dir.name;
		langs[lang] = fs
			.readdirSync(localesPath + lang + '/')
			.filter(file => file.split('.')[1] === 'json')
			.reduce((acc, file) => {
				const f = path.parse(file).name;
				acc[f] = require(`${localesPath}${lang}/${f}.json`);
				return acc;
			}, {});
		return langs;
	}, {});

module.exports.getEmailText = (lang, email) => emailLangs[lang][email];

const emailTemplate = new Email({
	views: {
		root: path.resolve(__dirname, './templates'),
		options: {
			extension: 'ejs'
		}
	},
	message: {
		attachments: [
			{
				filename: 'meblabs.png',
				path: path.resolve(__dirname, './img/logo.png'),
				cid: 'logo@meblabs.com'
			}
		]
	},
	send: true,
	transport: transporter
});

module.exports.sendMail = (msg, locals, template = 'common') => {
	const message = { ...msg };

	msg.subject = locals.subject;

	if (msg.from === undefined) {
		message.from = `"${COMMON_EMAIL_NAME}" <${COMMON_EMAIL}>`;
	}

	if (msg.attachments) {
		message.attachments = [...msg.attachments, ...emailTemplate.config.message.attachments];
	}

	if (ENV !== 'test') {
		if (SEND_EMAIL === '1')
			return emailTemplate.send({
				template,
				message,
				locals
			});

		return Promise.resolve(console.log('[EMAIL]', msg, locals));
	}
	return Promise.resolve();
};

module.exports.checkEmail = () => {
	if (SEND_EMAIL === '1')
		transporter.verify((error, success) => {
			if (error) {
				console.log('[NODEMAILER] ERROR: ', error);
			} else {
				console.log('[NODEMAILER] Server is ready to take our messages!');
			}
		});
};
