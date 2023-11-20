import { Resend } from 'resend';

const resend = new Resend('re_DgNVekbB_6atKyyq2GRJC997b6z6GqUg6');

resend.emails.send({
  from: 'admin@human-initiative.org',
  to: 'fabismillah0@gmail.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
});