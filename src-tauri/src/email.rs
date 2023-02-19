extern crate imap;

pub struct ConnectionDetails {
    name: String,
    email: String,
    password: String,
    imap_server: String,
    imap_port: u16,
    smtp_server: String,
    smtp_port: u16,
}

pub async fn connect(account_id: i32) -> ConnectionDetails {
    let conn = sqlx::SqliteConnection::connect("sqlite::memory:").await?;
    let account = sqlx::query!("SELECT * FROM accounts WHERE id = $1", account_id)
        .fetch_one()
        .await
        .unwrap();

    ConnectionDetails {
        name: account.name,
        email: account.email,
        password: account.password,
        imap_server: account.imap_server,
        imap_port: account.imap_port,
        smtp_server: account.smtp_server,
        smtp_port: account.smtp_port,
    }
}

pub fn get_emails(details: ConnectionDetails) -> imap::error::Result<Option<String>> {
    let domain = details.imap_server;
    let client = imap::ClientBuilder::new(&host, port).rustls()?;

    // the client we have here is unauthenticated.
    // to do anything useful with the e-mails, we need to log in
    let mut imap_session = client.login(&user, &password).map_err(|e| e.0)?;

    let mut imap_session = client
        .login(details.email, details.password)
        .map_err(|e| e.0)?;

    // we want to fetch the first email in the INBOX mailbox
    imap_session.select("INBOX")?;

    // fetch message number 1 in this mailbox, along with its RFC822 field.
    // RFC 822 dictates the format of the body of e-mails
    let messages = imap_session.fetch("1", "RFC822")?;
    let message = if let Some(m) = messages.iter().next() {
        m
    } else {
        return Ok(None);
    };

    // extract the message's body
    let body = message.body().expect("message did not have a body!");
    let body = std::str::from_utf8(body)
        .expect("message was not valid utf-8")
        .to_string();

    // be nice to the server and log out
    imap_session.logout()?;

    Ok(Some(body))
}
