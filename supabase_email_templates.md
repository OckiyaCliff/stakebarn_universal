# StakeBarn Universal v2.0 - Branded Email Templates

This document contains premium, responsive, and branded HTML templates for your Supabase Auth emails. You can copy and paste these directly into your **Supabase Dashboard > Authentication > Email Templates**.

---

## Design System & Theme
- **Primary Color:** `#10B981` (StakeBarn Emerald Green)
- **Background Color:** `#0B0F19` (High-Security Dark Slate)
- **Card Background:** `#111827` (Deep Gray)
- **Text Color:** `#F3F4F6` (Cool White)
- **Muted Text:** `#9CA3AF` (Light Gray)

---

## 1. Confirm Signup (Confirm Email)
Paste this in the **Confirm signup** template in Supabase.

### Email Subject
`Welcome to StakeBarn - Confirm Your Email Address`

### HTML Message
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email - StakeBarn</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f3f4f6;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0b0f19;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #111827;
      border-radius: 16px;
      border: 1px solid #1f2937;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 40px 30px;
    }
    .welcome-badge {
      display: inline-block;
      background-color: rgba(16, 185, 129, 0.1);
      color: #10b981;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    h2 {
      margin-top: 0;
      color: #ffffff;
      font-size: 22px;
      font-weight: 700;
    }
    p {
      color: #9ca3af;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .features {
      background-color: #1f2937;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .feature-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .feature-item:last-child {
      margin-bottom: 0;
    }
    .feature-icon {
      color: #10b981;
      font-weight: bold;
      margin-right: 10px;
    }
    .feature-text {
      color: #e5e7eb;
      font-size: 14px;
    }
    .btn-container {
      text-align: center;
      margin: 35px 0;
    }
    .btn {
      background-color: #10b981;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 700;
      display: inline-block;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
      transition: all 0.2s ease;
    }
    .footer {
      background-color: #0b0f19;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #1f2937;
    }
    .footer p {
      font-size: 12px;
      margin-bottom: 8px;
    }
    .warning {
      color: #ef4444;
      font-size: 11px !important;
      margin-top: 15px;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>StakeBarn Universal</h1>
      </div>
      <div class="content">
        <div class="welcome-badge">Account Verification</div>
        <h2>Verify Your Email</h2>
        <p>Thank you for signing up to StakeBarn Universal! To start earning yields and staking Proof-of-Stake assets, please confirm your email address by clicking the secure button below:</p>
        
        <div class="btn-container">
          <a href="{{ .ConfirmationURL }}" class="btn">Confirm Email Address</a>
        </div>

        <div class="features">
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            <span class="feature-text"><strong>Multi-Asset Staking:</strong> Earn up to 20% APY on PoS assets like SOL, ETH, and ATOM.</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            <span class="feature-text"><strong>High-Yield Products:</strong> Diversify with secure stablecoin yields (USDT/USDC).</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            <span class="feature-text"><strong>Ultra Secure:</strong> Institutional-grade security architecture protecting your assets.</span>
          </div>
        </div>

        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; font-size: 13px; color: #10b981;">{{ .ConfirmationURL }}</p>
      </div>
      <div class="footer">
        <p>© 2026 StakeBarn Universal. All rights reserved.</p>
        <p>This is an automated security email. Please do not reply.</p>
        <p class="warning">🔒 SECURITY REMINDER: StakeBarn Universal will never ask for your private keys, seed phrases, or password via email.</p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## 2. Reset Password
Paste this in the **Reset password** template in Supabase.

### Email Subject
`StakeBarn - Reset Your Password`

### HTML Message
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - StakeBarn</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f3f4f6;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0b0f19;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #111827;
      border-radius: 16px;
      border: 1px solid #1f2937;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 40px 30px;
    }
    .alert-badge {
      display: inline-block;
      background-color: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    h2 {
      margin-top: 0;
      color: #ffffff;
      font-size: 22px;
      font-weight: 700;
    }
    p {
      color: #9ca3af;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .btn-container {
      text-align: center;
      margin: 35px 0;
    }
    .btn {
      background-color: #10b981;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 700;
      display: inline-block;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
      transition: all 0.2s ease;
    }
    .footer {
      background-color: #0b0f19;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #1f2937;
    }
    .footer p {
      font-size: 12px;
      margin-bottom: 8px;
    }
    .warning {
      color: #ef4444;
      font-size: 11px !important;
      margin-top: 15px;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>StakeBarn Universal</h1>
      </div>
      <div class="content">
        <div class="alert-badge">Security Action Required</div>
        <h2>Password Reset Request</h2>
        <p>We received a request to reset the password for your StakeBarn Universal account. If you made this request, please click the secure button below to set a new password:</p>
        
        <div class="btn-container">
          <a href="{{ .ConfirmationURL }}" class="btn">Reset Password</a>
        </div>

        <p>If you did not initiate this request, you can safely ignore this email. Your account remains completely secure.</p>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; font-size: 13px; color: #10b981;">{{ .ConfirmationURL }}</p>
      </div>
      <div class="footer">
        <p>© 2026 StakeBarn Universal. All rights reserved.</p>
        <p>This is an automated security email. Please do not reply.</p>
        <p class="warning">🔒 SECURITY REMINDER: StakeBarn Universal will never ask for your private keys, seed phrases, or password via email.</p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## 3. Magic Link (Passwordless Sign In)
Paste this in the **Magic Link** template in Supabase.

### Subject
`StakeBarn - Instant Sign In Link`

### HTML Message
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In - StakeBarn</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f3f4f6;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0b0f19;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #111827;
      border-radius: 16px;
      border: 1px solid #1f2937;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 40px 30px;
    }
    .welcome-badge {
      display: inline-block;
      background-color: rgba(16, 185, 129, 0.1);
      color: #10b981;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    h2 {
      margin-top: 0;
      color: #ffffff;
      font-size: 22px;
      font-weight: 700;
    }
    p {
      color: #9ca3af;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .btn-container {
      text-align: center;
      margin: 35px 0;
    }
    .btn {
      background-color: #10b981;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 700;
      display: inline-block;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
      transition: all 0.2s ease;
    }
    .footer {
      background-color: #0b0f19;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #1f2937;
    }
    .footer p {
      font-size: 12px;
      margin-bottom: 8px;
    }
    .warning {
      color: #ef4444;
      font-size: 11px !important;
      margin-top: 15px;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>StakeBarn Universal</h1>
      </div>
      <div class="content">
        <div class="welcome-badge">One-Click Login</div>
        <h2>Sign In to Your Account</h2>
        <p>Click the secure button below to log in directly to your StakeBarn Universal dashboard. This link is only valid for 15 minutes and can only be used once.</p>
        
        <div class="btn-container">
          <a href="{{ .ConfirmationURL }}" class="btn">Sign In to Dashboard</a>
        </div>

        <p>If you did not request this link, you can safely ignore this email.</p>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; font-size: 13px; color: #10b981;">{{ .ConfirmationURL }}</p>
      </div>
      <div class="footer">
        <p>© 2026 StakeBarn Universal. All rights reserved.</p>
        <p>This is an automated security email. Please do not reply.</p>
        <p class="warning">🔒 SECURITY REMINDER: StakeBarn Universal will never ask for your private keys, seed phrases, or password via email.</p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## 4. Change Email Address
Paste this in the **Change email address** template in Supabase.

### Subject
`StakeBarn - Confirm New Email Address`

### HTML Message
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Email Change - StakeBarn</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f3f4f6;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0b0f19;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #111827;
      border-radius: 16px;
      border: 1px solid #1f2937;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 40px 30px;
    }
    .welcome-badge {
      display: inline-block;
      background-color: rgba(16, 185, 129, 0.1);
      color: #10b981;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    h2 {
      margin-top: 0;
      color: #ffffff;
      font-size: 22px;
      font-weight: 700;
    }
    p {
      color: #9ca3af;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .btn-container {
      text-align: center;
      margin: 35px 0;
    }
    .btn {
      background-color: #10b981;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 700;
      display: inline-block;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
      transition: all 0.2s ease;
    }
    .footer {
      background-color: #0b0f19;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #1f2937;
    }
    .footer p {
      font-size: 12px;
      margin-bottom: 8px;
    }
    .warning {
      color: #ef4444;
      font-size: 11px !important;
      margin-top: 15px;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>StakeBarn Universal</h1>
      </div>
      <div class="content">
        <div class="welcome-badge">Email Update</div>
        <h2>Confirm Your New Email Address</h2>
        <p>You requested a change of your email address for your StakeBarn Universal account. Please click the button below to confirm and verify this change:</p>
        
        <div class="btn-container">
          <a href="{{ .ConfirmationURL }}" class="btn">Confirm Email Change</a>
        </div>

        <p>If you did not request this change, please contact StakeBarn support immediately to secure your account.</p>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; font-size: 13px; color: #10b981;">{{ .ConfirmationURL }}</p>
      </div>
      <div class="footer">
        <p>© 2026 StakeBarn Universal. All rights reserved.</p>
        <p>This is an automated security email. Please do not reply.</p>
        <p class="warning">🔒 SECURITY REMINDER: StakeBarn Universal will never ask for your private keys, seed phrases, or password via email.</p>
      </div>
    </div>
  </div>
</body>
</html>
```
