const Documentation = `  <body style="font-family: Arial, sans-serif; margin: 20px; line-height: 1.6;">
<h1 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">Project Documentation</h1>

<div style="margin-bottom: 40px;">
    <h2 style="color: #333;">Overview</h2>
    <p>This project is a user management and transaction system built with Node.js, Express, and MongoDB. It includes functionalities for user registration, login, password reset, and transferring funds between user accounts.</p>
</div>

<div style="margin-bottom: 40px;">
    <b>ENDPOINT_URL: https://backend-youthrive-wallet-management.onrender.com</b>
</div>

<div style="margin-bottom: 40px;">
    <h2 style="color: #333;">API Endpoints</h2>

    <div style="background-color: #e8e8e8; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #333;">POST /api/register</h3>
        <p>Register a new user.</p>
<pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">
<code style="font-size: 0.8rem;">
METHOD: POST
URL: /api/register

{
"firstName": "John",
"lastName": "Doe",
"email": "john.doe@example.com",
"password": "Password123!",
"phoneNumber": 0812345678,
"address": "Lagos, Nigeria"
}
</code>
</pre>
    </div>

    <div style="background-color: #e8e8e8; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #333;">GET /api/verify-user</h3>
        <p>Verify a user's email.</p>
<pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">
<code style="font-size: 0.8rem;">
METHOD: GET
URL: /api/verify-user

{
"token": "YOUR_VERIFICATION_TOKEN_HERE"
}
</code>
</pre>
    </div>

    <div style="background-color: #e8e8e8; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #333;">POST /api/login</h3>
        <p>Login a user.</p>
<pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">
<code style="font-size: 0.8rem;">
METHOD: POST
URL: /api/login

{
"email": "john.doe@example.com",
"password": "Password123!"
}
</code>
</pre>
    </div>

    <div style="background-color: #e8e8e8; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #333;">POST /api/logout</h3>
        <p>Logout a user.</p>
<pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">
<code style="font-size: 0.8rem;">
METHOD: POST
URL: /api/logout

{}
</code>
</pre>
    </div>

    <div style="background-color: #e8e8e8; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #333;">POST /api/forgotPassword</h3>
        <p>Request a password reset link.</p>
<pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">
<code style="font-size: 0.8rem;">
METHOD: POST
URL: /api/forgotPassword

{
"email": "john.doe@example.com"
}
</code>
</pre>
    </div>

    <div style="background-color: #e8e8e8; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #333;">POST /api/resetPassword?token=YOUR_TOKEN_HERE</h3>
        <p>Reset the user's password.</p>
<pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">
<code style="font-size: 0.8rem;">
METHOD: POST
URL: /api/resetPassword?token=YOUR_TOKEN_HERE

{
"password": "NewPassword123!"
}
</code>
</pre>
    </div>
</div>
</body>`;

module.exports = Documentation;
