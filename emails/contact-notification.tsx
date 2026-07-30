import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactNotificationEmailProps {
  name: string;
  email: string;
  message: string;
}

export default function ContactNotificationEmail({
  name = "Jane Doe",
  email = "jane@example.com",
  message = "Hi, I'd like to get a quote for a new website.",
}: ContactNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>New contact form submission</Heading>
          <Section>
            <Text style={label}>Name</Text>
            <Text style={value}>{name}</Text>
            <Text style={label}>Email</Text>
            <Text style={value}>{email}</Text>
            <Text style={label}>Message</Text>
            <Text style={value}>{message}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            This message was sent from the contact form on your website.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f6f6",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "480px",
  borderRadius: "8px",
};

const heading = {
  fontSize: "20px",
  fontWeight: 600,
  marginBottom: "16px",
};

const label = {
  fontSize: "12px",
  color: "#666666",
  textTransform: "uppercase" as const,
  marginBottom: "0",
};

const value = {
  fontSize: "14px",
  color: "#111111",
  marginTop: "4px",
  marginBottom: "16px",
};

const hr = {
  borderColor: "#eaeaea",
  margin: "24px 0",
};

const footer = {
  fontSize: "12px",
  color: "#999999",
};
