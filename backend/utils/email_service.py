import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app
import threading

def send_async_email(app, msg):
    with app.app_context():
        try:
            server = smtplib.SMTP(app.config['MAIL_SERVER'], app.config['MAIL_PORT'])
            server.starttls()
            server.login(app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD'])
            server.send_message(msg)
            server.quit()
            print("Email sent successfully!")
        except Exception as e:
            print(f"Failed to send email: {e}")

def send_health_report(to_email, user_name, prediction_data):
    """
    Sends a formatted HTML email with the health report.
    """
    msg = MIMEMultipart("alternative")
    msg['Subject'] = "MediPredict AI - Your Health Prediction Report"
    msg['From'] = current_app.config['MAIL_DEFAULT_SENDER'] or current_app.config['MAIL_USERNAME']
    msg['To'] = to_email

    disease = prediction_data.get('disease', 'Unknown')
    confidence = prediction_data.get('confidence', 0)
    precautions = "".join([f"<li>{p}</li>" for p in prediction_data.get('precautions', [])])
    exercises = "".join([f"<li>{e}</li>" for e in prediction_data.get('exercises', [])])
    tips = "".join([f"<li>{t}</li>" for t in prediction_data.get('tips', [])])

    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #F7FAFC; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #2F80ED; text-align: center;">MediPredict AI Health Report</h2>
            <p>Hello <strong>{user_name}</strong>,</p>
            <p>Based on the symptoms you provided, here is your health prediction report:</p>
            
            <div style="background-color: #EBF8FF; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #2B6CB0; margin-top: 0;">Predicted Condition: <span style="color: #2c5282;">{disease}</span></h3>
                <p style="margin-bottom: 0;"><strong>Confidence Score:</strong> {confidence}%</p>
            </div>

            <h4 style="color: #2D3748; border-bottom: 2px solid #E2E8F0; padding-bottom: 5px;">Recommended Precautions</h4>
            <ul style="color: #4A5568;">
                {precautions}
            </ul>

            <h4 style="color: #2D3748; border-bottom: 2px solid #E2E8F0; padding-bottom: 5px;">Suggested Exercises</h4>
            <ul style="color: #4A5568;">
                {exercises}
            </ul>

            <h4 style="color: #27AE60; border-bottom: 2px solid #E2E8F0; padding-bottom: 5px;">Daily Health Tips</h4>
            <ul style="color: #4A5568;">
                {tips}
            </ul>

            <p style="color: #718096; font-size: 0.9em; margin-top: 30px; text-align: center;">
                <em>Disclaimer: This is an AI-generated report and should not replace professional medical advice. Please consult a doctor for a proper diagnosis.</em>
            </p>
        </div>
    </body>
    </html>
    """

    part = MIMEText(html_content, 'html')
    msg.attach(part)

    # Use threading to send email asynchronously so it doesn't block the API response
    app = current_app._get_current_object()
    Thread = threading.Thread(target=send_async_email, args=(app, msg))
    Thread.start()
