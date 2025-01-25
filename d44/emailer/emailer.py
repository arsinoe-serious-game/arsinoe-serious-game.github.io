import os
import smtplib, ssl
def send_email(recipients, msg):

    if isinstance(recipients,str):
        recipients = [recipients]

    # Create a secure SSL context
    context = ssl.create_default_context()

    smtp_server = "smtp.gmail.com"
    port = 587  # For starttls

    try:
        #https://realpython.com/python-send-email/

        server = smtplib.SMTP(smtp_server,port)
        server.ehlo() # Can be omitted
        server.starttls(context=context) # Secure the connection
        server.ehlo() # Can be omitted
        server.login(os.environ['SENDER_EMAIL'], os.environ['PASSWORD'])
        
        # Send email here
        server.sendmail(os.environ['SENDER_EMAIL'], recipients, msg.encode('utf-8'))
    except Exception as e:
        # Print any error messages to stdout
        print(e)
    finally:
        if server.sock and server.sock._closed == False:
            server.quit()


send_email('g.lewis2@exeter.ac.uk', 'This is also a test')