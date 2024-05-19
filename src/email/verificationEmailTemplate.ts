export const otpMailTemplate = (
  fullName: string,
  otp: string
) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #eeeeee;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333333;
        }
        .content {
            margin: 20px 0;
            text-align: center;
        }
        .otp {
            font-size: 36px;
            letter-spacing: 5px;
            color: #333333;
            margin: 20px 0;
            background-color: #f4f4f4;
            padding: 10px;
            border-radius: 4px;
            display: inline-block;
        }
        .footer {
            text-align: center;
            padding: 10px 0;
            border-top: 1px solid #eeeeee;
            font-size: 14px;
            color: #aaaaaa;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your One-Time Password (OTP)</h1>
        </div>
        <div class="content">
            <p>Hello ${fullName.split(" ")[0]},</p>
            <p>Use the following OTP to complete your transaction:</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for the next 10 minutes. Please do not share this code with anyone.</p>
        </div>
        <div class="footer">
            <p>If you did not request this OTP, please ignore this email or contact support.</p>
            <p>&copy; 2024 Your Company Name</p>
        </div>
    </div>
</body>
</html>`;
