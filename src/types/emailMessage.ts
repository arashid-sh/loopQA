export interface EmailMessage {
  id?: string;
  subject?: string;
  body?: string;
  links?: Links[];
  code?: Code[];
}

interface Links {
  href?: string;
  text?: string;
}

interface Code {
  value?: string;
}
